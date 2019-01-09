import pandas as pd
import json
import csv


def load_csv():
    with open("all_energy_statistics.csv", "r", newline="") as csvfile:
        data = []
        tags = set()
        for row in csv.reader(csvfile, delimiter=","):
            if "Total Electricity" and "Main activity" in row[1]:
                data.append(row)
                tags.add(row[1])
        headers = data.pop(0)

        df = pd.DataFrame.from_records(data, columns=headers)

    print(len(tags))
#     return df
#
# def create_categories(df):


if __name__ == '__main__':
    df = load_csv()
    # df_cat = create_categories(df)
    # df_cat_id = add_id(df_cat)
    # write_json(df_cat_id)
