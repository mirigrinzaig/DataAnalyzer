import pandas as pd
from collections import Counter
import os

def convert_excel_to_csv_if_needed(xlsx_path, csv_path):
    """אם הקובץ CSV לא קיים – המרה חד-פעמית מ-Excel ל-CSV"""
    if not os.path.exists(csv_path):
        print("הקובץ CSV לא נמצא – מתבצעת המרה מ-Excel...")
        df = pd.read_excel(xlsx_path)
        df.to_csv(csv_path, index=False)
        print("ההמרה הושלמה.")
    else:
        print("הקובץ CSV כבר קיים – אין צורך בהמרה.")

def process_file_in_chunks(filepath, chunk_size=1000, top_n=5):
    """מעבד את הקובץ בחתיכות, סופר קודי שגיאה ומחזיר את הנפוצים ביותר"""
    frequency = Counter()

    # קריאה בצ'אנקים (קטעים)
    for chunk in pd.read_csv(filepath, chunksize=chunk_size):
        for _, row in chunk.iterrows():
            text = str(row.iloc[0])
            if "Error:" in text:
                error_code = text.split("Error:")[1].strip()
                frequency[error_code] += 1

    return frequency.most_common(top_n)


# ---------------- הפעלת הקוד ----------------

xlsx_file = '../logs.txt.xlsx'
csv_file = '../logs.txt.csv'

print("📁 קבצים בתיקייה:", os.listdir('../'))

# המרה חד-פעמית (אם צריך)
convert_excel_to_csv_if_needed(xlsx_file, csv_file)

# עיבוד הקובץ בחתיכות וספירת שגיאות
top_errors = process_file_in_chunks(csv_file, chunk_size=1000, top_n=5)

# הצגת התוצאה
print("Most common error codes:")
for code, count in top_errors:
    print(f"{code}: הופיע {count} פעמים")
