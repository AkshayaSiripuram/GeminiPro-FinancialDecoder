from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
import pandas as pd
import matplotlib.pyplot as plt
import io
import base64
import pdfplumber
import google.generativeai as genai
import pytesseract
import cv2
import numpy as np
import os
import glob
import plotly.express as px
from dotenv import load_dotenv
import pdfplumber
import pytesseract
from pdf2image import convert_from_path


# ✅ Initialize FastAPI App (Only One Instance)
app = FastAPI()

# ✅ Fix CORS issues for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Load API Key from .env
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise Exception("API Key not found. Set GOOGLE_API_KEY in .env file or terminal.")
genai.configure(api_key=api_key)

@app.get("/")
def home():
    return {"message": "Gemini Pro Financial Decoder is running"}

# ✅ Define Upload Folder
UPLOAD_FOLDER = "backend/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure folder exists

# 1️⃣ *Extract Data from PDFs*
def extract_text_from_pdf(file_path):
    try:
        with pdfplumber.open(file_path) as pdf:
            text = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])
        return text if text else "No readable text found in PDF."
    except Exception as e:
        return f"Error processing PDF: {str(e)}"


# 2️⃣ *Extract Data from Scanned Images (OCR)*
def extract_text_from_image(image_file):
    try:
        image = cv2.imdecode(np.frombuffer(image_file.read(), np.uint8), cv2.IMREAD_COLOR)
        text = pytesseract.image_to_string(image)
        return text if text else "No readable text found in image."
    except Exception as e:
        return f"Error processing image: {str(e)}"

# 3️⃣ *Upload & Process File*
@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_extension = file.filename.split(".")[-1].lower()
        file_path = os.path.join(UPLOAD_FOLDER, "uploaded_file." + file_extension)

        # ✅ Delete old files before saving a new one
        for old_file in glob.glob(os.path.join(UPLOAD_FOLDER, "uploaded_file.*")):
            os.remove(old_file)

        # ✅ Save the new file
        with open(file_path, "wb") as f:
            f.write(await file.read())

        text = ""
        if file_extension == "pdf":
            text = extract_text_from_pdf(file_path)
        elif file_extension in ["jpg", "png"]:
            text = extract_text_from_image(file)
        elif file_extension == "csv":
            df = pd.read_csv(file_path, encoding="utf-8")
            text = df.head(10).to_string()
        elif file_extension == "xlsx":
            df = pd.read_excel(file_path, engine="openpyxl")
            text = df.head(10).to_string()
        else:
            return {"error": "Unsupported file format"}

        return {"message": "File uploaded successfully", "file_type": file_extension, "extracted_text": text[:500]}

    except Exception as e:
        return {"error": f"File upload failed: {str(e)}"}

# 4️⃣ *AI Summarization with Gemini AI*
def generate_summary(text, retries=1):
    try:
        prompt = f"""Here is a financial report extracted from a document:
        
        {text}
        
        Please summarize this report, highlighting:
        - Key financial metrics
        - Revenue growth trends
        - Potential risks and investment opportunities."""

        model_name = "gemini-1.5-flash"
        model = genai.GenerativeModel(model_name)
        
        response = model.generate_content(prompt)
        
        if hasattr(response, 'text'):
            return response.text
        else:
            return "No response from AI"

    except Exception as e:
        if "Resource has been exhausted" in str(e) and retries > 0:
            return generate_summary(text, retries - 1)
        return f"AI summarization error: {str(e)}"

# 5️⃣ *Summarize Uploaded File*
@app.post("/summarize/")
async def summarize_report():
    files = glob.glob(os.path.join(UPLOAD_FOLDER, "uploaded_file.*"))
    
    if not files:
        return {"error": "No uploaded file found. Please upload a file first."}

    latest_file = max(files, key=os.path.getctime)
    file_extension = latest_file.split(".")[-1].lower()

    if file_extension == "pdf":
        text_data = extract_text_from_pdf(latest_file)
    elif file_extension == "csv":
        df = pd.read_csv(latest_file, encoding="utf-8")
        text_data = df.head(10).to_string()
    elif file_extension == "xlsx":
        df = pd.read_excel(latest_file, engine="openpyxl")
        text_data = df.head(10).to_string()
    else:
        return {"error": "Unsupported file format"}

    try:
        summary = generate_summary(text_data)
        return {"summary": summary}

    except Exception as e:
        return {"error": f"Error during summarization: {str(e)}"}

from fastapi.responses import JSONResponse

# @app.post("/visualize/")
# async def visualize_data():
#     files = glob.glob(os.path.join(UPLOAD_FOLDER, "uploaded_file.*"))

#     if not files:
#         return JSONResponse(content={"error": "No uploaded file found. Please upload a file first."}, status_code=400)

#     latest_file = max(files, key=os.path.getctime)
#     file_extension = latest_file.split(".")[-1].lower()

#     if file_extension == "csv":
#         df = pd.read_csv(latest_file, encoding="utf-8")
#     elif file_extension == "xlsx":
#         df = pd.read_excel(latest_file, engine="openpyxl")
#     elif file_extension == "pdf":
#         # ✅ Try to extract tables first
#         with pdfplumber.open(latest_file) as pdf:
#             tables = []
#             for page in pdf.pages:
#                 extracted_table = page.extract_table()
#                 if extracted_table:
#                     tables.extend(extracted_table)

#             if tables:
#                 df = pd.DataFrame(tables)
#                 df.columns = df.iloc[0]  # ✅ Set first row as headers
#                 df = df[1:].reset_index(drop=True)
#             else:
#                 # ✅ If no tables, use OCR to extract text and summarize
#                 extracted_text = extract_text_from_pdf(latest_file)
#                 return JSONResponse(content={"graph": extracted_text})  # ✅ Send text instead of chart

#     else:
#         return JSONResponse(content={"error": "Visualization supports only CSV, Excel, and PDF files."}, status_code=400)

#     # Ensure at least two numerical columns exist
#     num_cols = df.select_dtypes(include=["number"]).columns.tolist()
#     if len(num_cols) < 2:
#         return JSONResponse(content={"error": "Not enough numerical data for visualization."}, status_code=400)

#     # ✅ Generate a scatter plot using Plotly
#     fig = px.scatter(df, x=num_cols[0], y=num_cols[1], title="📊 PDF Extracted Financial Data")

#     return JSONResponse(content={"graph": fig.to_json()})  # ✅ SeSend JSON data
@app.post("/visualize/")
async def visualize_data():
    files = glob.glob(os.path.join(UPLOAD_FOLDER, "uploaded_file.*"))

    if not files:
        return JSONResponse(content={"error": "No uploaded file found. Please upload a file first."}, status_code=400)

    latest_file = max(files, key=os.path.getctime)
    file_extension = latest_file.split(".")[-1].lower()

    if file_extension == "csv":
        df = pd.read_csv(latest_file, encoding="utf-8")
    elif file_extension == "xlsx":
        df = pd.read_excel(latest_file, engine="openpyxl")
    else:
        return JSONResponse(content={"error": "Visualization supports only CSV and Excel files."}, status_code=400)

    # Ensure at least two numerical columns exist for visualization
    num_cols = df.select_dtypes(include=["number"]).columns.tolist()
    if len(num_cols) < 2:
        return JSONResponse(content={"error": "Not enough numerical data for visualization."}, status_code=400)

    # ✅ Generate a scatter plot using Plotly
    fig = px.scatter(df, x=num_cols[0], y=num_cols[1], title="Scatter Plot of Financial Data")

    # ✅ Convert Plotly figure to JSON
    fig_json = fig.to_json()

    return JSONResponse(content={"graph": fig_json})  # ✅ Se

# ✅ Run FastAPI Server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
