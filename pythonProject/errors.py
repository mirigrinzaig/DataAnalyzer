import pandas as pd
from collections import Counter
import os

def process_file_in_chunks(filepath, chunk_size=1000, top_n=5):
    frequency = Counter()  # מילון שיספור שכיחויות של קודי שגיאה

    # קריאת הקובץ בחתיכות (צ'אנקים) של chunk_size שורות כל פעם
    for chunk in pd.read_excel(filepath, chunksize=chunk_size):
        for _, row in chunk.iterrows():
            text = str(row[0])  # אפשר גם להשתמש בשם העמודה: row["Log"] למשל
            if "Error:" in text:
                # חילוץ הטקסט שמופיע אחרי "Error:"
                error_code = text.split("Error:")[1].strip()
                frequency[error_code] += 1  # העלאה של המונה עבור הקוד הזה

    # החזרת רשימה של top_n הקודים הכי נפוצים עם הכמות
    return frequency.most_common(top_n)

# ---------- קריאה לפונקציה ----------

filepath = '../logs.txt.xlsx'  # הנתיב לקובץ שלך
print("קבצים בתיקייה:", os.listdir('../'))

top_errors = process_file_in_chunks(filepath, chunk_size=1000, top_n=5)

# הדפסת התוצאה
print("קודי השגיאה הנפוצים ביותר:")
for code, count in top_errors:
    print(f"{code}: {count} פעמים")
