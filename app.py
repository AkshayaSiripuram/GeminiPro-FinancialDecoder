from fastapi import FastAPI, UploadFile, File
import pandas as pd
import pdfplumber
import google.generativeai as genai
import io
import pytesseract
import cv2
import numpy as np
import os
from dotenv import load_dotenv

app = FastAPI()

# ✅ Load environment variables from .env file
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise Exception("API Key not found. Set GOOGLE_API_KEY in .env file or terminal.")

# ✅ Configure Gemini API
genai.configure(api_key=api_key)

@app.get("/")
def home():
    return {"message": "Gemini Pro Financial Decoder is running"}

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure folder exists

# 1️⃣ Extract Data from PDFs
def extract_text_from_pdf(file_path):
    try:
        with pdfplumber.open(file_path) as pdf:
            text = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])
        return text
    except Exception as e:
        return f"Error processing PDF: {str(e)}"

# 2️⃣ Extract Data from Scanned Reports (OCR)
def extract_text_from_image(image_file):
    try:
        image = cv2.imdecode(np.frombuffer(image_file.read(), np.uint8), cv2.IMREAD_COLOR)
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        return f"Error processing image: {str(e)}"

# 3️⃣ Upload & Process File
@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_extension = file.filename.split(".")[-1].lower()
        file_path = os.path.join(UPLOAD_FOLDER, "uploaded_file." + file_extension)

        # ✅ Save the uploaded file
        with open(file_path, "wb") as f:
            f.write(await file.read())

        text = ""
        if file_extension == "pdf":
            text = extract_text_from_pdf(file_path)
        elif file_extension in ["jpg", "png"]:
            text = extract_text_from_image(file)
        elif file_extension == "csv":
            df = pd.read_csv(file_path, encoding="utf-8")  # ✅ Read CSV properly
            text = df.to_string()
        elif file_extension == "xlsx":
            df = pd.read_excel(file_path, engine="openpyxl")  # ✅ Read Excel with openpyxl
            text = df.to_string()
        else:
            return {"error": "Unsupported file format"}

        return {"message": "File uploaded successfully", "file_type": file_extension, "extracted_text": text[:500]}

    except Exception as e:
        return {"error": f"File upload failed: {str(e)}"}


# 4️⃣ AI Summarization with Retry Mechanism
def generate_summary(text, retries=1):
    try:
        prompt = f"Summarize the following financial data:\n{text}"

        model_name = "gemini-1.5-flash"  # ✅ Use Flash model for lower API usage
        model = genai.GenerativeModel(model_name)
        
        response = model.generate_content(prompt)
        
        if hasattr(response, 'text'):
            return response.text
        else:
            return "No response from AI"

    except Exception as e:
        if "Resource has been exhausted" in str(e) and retries > 0:
            return generate_summary(text, retries - 1)  # ✅ Retry once if quota issue occurs
        return f"AI summarization error: {str(e)}"


@app.post("/summarize/")
async def summarize_report():
    # ✅ Check for both CSV and Excel files
    csv_path = os.path.join(UPLOAD_FOLDER, "uploaded_file.csv")
    xlsx_path = os.path.join(UPLOAD_FOLDER, "uploaded_file.xlsx")

    if os.path.exists(csv_path):
        file_path = csv_path
    elif os.path.exists(xlsx_path):
        file_path = xlsx_path
    else:
        return {"error": "No uploaded file found. Please upload a file first."}

    try:
        # ✅ Load file based on extension
        df = pd.read_csv(file_path, encoding="utf-8") if file_path.endswith(".csv") else pd.read_excel(file_path, engine="openpyxl")

        if df.empty:
            return {"error": "Uploaded file is empty or not in expected format."}

        summary = generate_summary(df.to_string())
        return {"summary": summary}

    except Exception as e:
        return {"error": f"Error during summarization: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
