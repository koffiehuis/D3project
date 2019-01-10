import pandas as pd
import json
import csv


def load_csv():
    with open("all_energy_statistics.csv", "r", newline="") as csvfile:
        data = []
        for row in csv.reader(csvfile, delimiter=","):
            if len(row) >= 4:
                if ("Total Electricity" and "Main activity" in row[1]
                    and row[6] == "total_electricity"):
                    row = row[:-1]
                    row[0] = row[0][0:5]
                    data.append(row)

        headers = ['Country or Area', 'Commodity - Transaction', 'Year', 'Unit',
                   'Quantity', 'Quantity Footnotes']

        df = pd.DataFrame.from_records(data, columns=headers)

        del df["Unit"]
        del df["Quantity Footnotes"]

    return df

def create_categories(df):
    cat_dict = {"Combustion": "From combustible fuels â€“ Main activity",
                        "Geothermal": "Geothermal â€“ Main activity",
                        "Hydro": "Hydro â€“ Main activity",
                        "Nuclear": "Nuclear â€“ Main activity",
                        "Other": "From other sources â€“ Main activity",
                        "Solar": "Solar â€“ Main activity",
                        "Wind": "Wind â€“ Main activity"}

    df = df.loc[df["Commodity - Transaction"].isin(list(cat_dict.values()))]
    cat_tags = []
    for i in df["Commodity - Transaction"].tolist():
        cat_tags.append(list(cat_dict.keys())[list(cat_dict.values()).index(i)])

    df["categoryTag"] = cat_tags

    del df["Commodity - Transaction"]

    return df

def add_id(df):
    with open("country_region.csv", "r", newline="") as csvfile:
        country_dict = {}
        for row in  csv.reader(csvfile, delimiter=","):
            country_dict[row[8][0:5]] = [row[3], row[10]]

    region_list = []
    iso_list = []

    for name in df["Country or Area"].tolist():
        try:
            region_list.append(country_dict[name][0])
            iso_list.append(country_dict[name][1])
        except:
            region_list.append(None)
            iso_list.append(None)
    df["Region"] = region_list
    df["ISO"] = iso_list

    del df["Country or Area"]

    return df

def write_json(df):
    json = df.to_json(orient = "records")
    with open("json.json", "w") as file:
        file.write(json)

if __name__ == '__main__':
    df = load_csv()
    df_cat = create_categories(df)
    df_cat_id = add_id(df_cat)
    write_json(df_cat_id)
