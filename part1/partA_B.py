import pandas as pd
import os
from collections import defaultdict

# read file
def read_time_series(filepath):
    if filepath.endswith('.parquet'):
        return pd.read_parquet(filepath)
    elif filepath.endswith('.csv'):
        return pd.read_csv(filepath)
    else:
        raise ValueError("Only .csv or .parquet files are supported.")

# calculate
def process_time_series(filepath, output_path='final_hourly.csv', daily_folder='daily_outputs'):
    print("Loading data...")
    df = read_time_series(filepath)


    df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')
    df['value'] = pd.to_numeric(df['value'], errors='coerce')
    df = df.dropna(subset=['timestamp', 'value']).drop_duplicates()

    # פיצול לפי יום
    df['date'] = df['timestamp'].dt.date
    df['hour'] = df['timestamp'].dt.floor('h')
    os.makedirs(daily_folder, exist_ok=True)

    all_results = []

    for date, group in df.groupby('date'):
        hourly_avg = group.groupby('hour')['value'].mean().reset_index()
        hourly_avg.columns = ['timestamp', 'average']
        all_results.append(hourly_avg)

        # save daily file
        file_path = os.path.join(daily_folder, f"{date}_hourly.csv")
        hourly_avg.to_csv(file_path, index=False)
        print(f"Saved: {file_path}")

    # קובץ סופי
    final_df = pd.concat(all_results).sort_values('timestamp')
    final_df.to_csv(output_path, index=False)
    print(f"Final hourly averages saved to: {output_path}")

# --- תמיכה בנתונים זורמים (streaming) ---
def process_stream_record(record, hourly_sums):
    try:
        timestamp = pd.to_datetime(record['timestamp'], errors='coerce')
        value = float(record['value'])
        if pd.isna(timestamp): return
    except: return

    hour_key = timestamp.replace(minute=0, second=0, microsecond=0)
    hourly_sums[hour_key]['sum'] += value
    hourly_sums[hour_key]['count'] += 1

def get_current_hourly_averages(hourly_sums):
    return {
        hour: round(data['sum'] / data['count'], 2)
        for hour, data in hourly_sums.items() if data['count'] > 0
    }


# execute


process_time_series("time_series.csv")  # time_series.parquet

# הרצה עם נתונים זורמים (streaming)
incoming_stream = [
    {"timestamp": "2025-06-10 06:10:00", "value": 15.3},
    {"timestamp": "2025-06-10 06:55:00", "value": 5.3},
    {"timestamp": "2025-06-10 07:34:00", "value": 12.6},
    {"timestamp": "2025-06-10 07:49:00", "value": 3.2}
]

hourly_sums = defaultdict(lambda: {'sum': 0.0, 'count': 0})
for record in incoming_stream:
    process_stream_record(record, hourly_sums)

print("\nStreaming hourly averages:")
for hour, avg in get_current_hourly_averages(hourly_sums).items():
    print(f"{hour} → {avg}")
