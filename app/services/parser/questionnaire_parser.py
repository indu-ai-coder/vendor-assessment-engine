import csv

def parse_questionnaire(file):
    """
    Reads CSV file and converts into list of dicts.
    This stays simple for now (script phase).
    """

    responses = []

    # file is file-like object from FastAPI
    decoded = file.read().decode("utf-8").splitlines()

    reader = csv.DictReader(decoded)

    for row in reader:
        responses.append({
            "question_id": row.get("question_id"),
            "question": row.get("question"),
            "answer": row.get("answer"),
            "details": row.get("details", "")
        })

    return responses