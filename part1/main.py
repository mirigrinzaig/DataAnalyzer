import pandas as pd
import os


frequency = {}

def open_file():
    data = pd.read_excel('../logs.txt.xlsx')

    for index, row in data.head(10).iterrows():
        errors = str(row[0])
        if "Error:" in errors:
            error_value = errors.split("Error:")[1].strip()
            print(error_value)
            if error_value in frequency:
                frequency[error_value] += 1
            else:
                frequency[error_value] = 1

print(os.listdir('../'))
#open_file()
#print(frequency)

#top_errors = err_log.process_excel_in_chunks('logs.txt.xlsx', chunk_size=1000, top_n=5)

#for code, count in top_errors:
 #   print(f"{code}: {count}")
