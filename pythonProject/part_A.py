import pandas as pd
from collections import Counter
import os
import win32com.client


# function to convert to CSV for more efficient:
def convert_excel_to_csv(xlsx_path, csv_path):
    # If CSV file doesn't exist – conversion
    # Try to convert using win32com; otherwise, use pandas
    if not os.path.exists(csv_path):
        print("csv file not found. starting conversion")
        try:
            excel_app = win32com.client.Dispatch("Excel.Application")
            excel_app.DisplayAlerts = False
            wb = excel_app.Workbooks.Open(Filename=os.path.abspath(xlsx_path), ReadOnly=1)
            wb.SaveAs(Filename=os.path.abspath(csv_path), FileFormat=6)
            wb.Close(False)
            excel_app.Application.Quit()
            print("conversion completed (via win32com)")
        except Exception as e:
            print(f"conversion error with win32: {e} \n now- trying with pandas.")
            try:
                df = pd.read_excel(xlsx_path, usecols=[0], header=None)
                df.to_csv(csv_path, index=False, header=False)
                print("conversion completed (via pandas fallback)")
            except Exception as e_pd:
                print(f"pandas conversion failed: {e_pd}.")
                return False
    else:
        print("csv file already exist")
    return True


# function to read chunks and count the appears of every error type
def read_chunks_return_common_error(filepath, chunk_size=100000, top_n=5):
    frequency = Counter()

    for chunk in pd.read_csv(filepath, chunksize=chunk_size, header=None, usecols=[0], dtype=str):
        text_column = chunk.iloc[:, 0]

        # read only error lines:
        error_mask = text_column.str.contains("Error:", na=False)
        error_rows_text = text_column[error_mask]

        if not error_rows_text.empty:
            error_codes = error_rows_text.apply(lambda x: x.split("Error:", 1)[1].strip() if "Error:" in x else None)
            error_codes = error_codes.dropna()
            frequency.update(error_codes)

    return frequency.most_common(top_n)


# main:
xlsx_file = '../logs.txt.xlsx'
csv_file = '../logs.txt.csv'

# convert to csv and read file:
# if convert_excel_to_csv(xlsx_file, csv_file):
#     top_errors = read_chunks_return_common_error(csv_file, chunk_size=500000, top_n=6)
#
#     print("\nMost common error codes:")
#     if top_errors:
#         for code, count in top_errors:
#             print(f"{code}: appear {count} times")
#     else:
#         print("No error codes found in the file.")
convert_excel_to_csv('../time_series.xlsx', '../time_series.csv')

