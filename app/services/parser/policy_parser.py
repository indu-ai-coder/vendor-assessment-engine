import fitz  # PyMuPDF

def parse_policy(file):
    """
    Extract text from uploaded PDF.
    Later replace with LlamaParse without changing rest of system.
    """

    pdf_bytes = file.read()
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")

    text = ""
    for page in doc:
        text += page.get_text()

    return text.lower()