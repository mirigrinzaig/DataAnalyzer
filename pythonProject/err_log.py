import pandas as pd
from collections import Counter

def process_excel_in_chunks(filepath, chunk_size=1000, top_n=5):
    frequency = Counter()

    # קודם נטען את הקובץ כדי לדעת כמה שורות יש בו
    total_rows = pd.read_excel(filepath).shape[0]

    # נעבור בקטעים
    for start in range(0, total_rows, chunk_size):
        chunk = pd.read_excel(filepath, skiprows=start, nrows=chunk_size, header=None)

        for _, row in chunk.iterrows():
            text = str(row[0])
            if "Error:" in text:
                error_code = text.split("Error:")[1].strip()
                frequency[error_code] += 1
                print(error_code)

    return frequency.most_common(top_n)
