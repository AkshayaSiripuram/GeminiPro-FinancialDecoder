import pdfplumber
import pandas as pd

pdf_path = "backend/uploads/your_pdf_file.pdf"  # Change this to your uploaded PDF

with pdfplumber.open(pdf_path) as pdf:
    tables = []
    for page in pdf.pages:
        extracted_table = page.extract_table()
        if extracted_table:
            tables.extend(extracted_table)  # ✅ Extract tables from each page

    if not tables:
        print("❌ No tabular data found in the PDF.")
    else:
        df = pd.DataFrame(tables)
        df.columns = df.iloc[0]  # ✅ Set first row as column headers
        df = df[1:].reset_index(drop=True)  # ✅ Remove first row from data

        print("✅ Extracted DataFrame:")
        print(df.head())
