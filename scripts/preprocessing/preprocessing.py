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
                    # row[0] = row[0][0:5]
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

    # deu = df.loc[df['Country or Area'] == "Germa"]
    # print(deu)

    # print(df.loc[df['ISO'] == "DEU"])

    del df["Commodity - Transaction"]

    return df

def add_id(df):
    with open("country_region.csv", "r", newline="") as csvfile:
        country_dict = {}
        for row in  csv.reader(csvfile, delimiter=","):
            if row[10]:
                if not (row[10][0].isdigit()):
                    iso_field = row[10]
                else:
                    continue

            country_dict[row[8]] = [row[3], iso_field]

    region_list = []
    iso_list = []

    hardcode = {"Korea, Dem.Ppl's.Rep.":  "Democratic People's Republic of Korea",
                'T.F.Yug.Rep. Macedonia': "The former Yugoslav Republic of Macedonia",
                "CÃ´te d'Ivoire": "Côte d’Ivoire",
                'St. Helena and Depend.': "Saint Helena",
                'Venezuela (Bolivar. Rep.)': "Venezuela (Bolivarian Republic of)",
                'St. Lucia': "Saint Lucia",
                'Korea, Republic of': "Republic of Korea",
                'St. Pierre-Miquelon': "Saint Pierre and Miquelon",
                'Yemen, Dem. (former)': "Yemen",
                'Swaziland': "Eswatini",
                'United Kingdom': "United Kingdom of Great Britain and Northern Ireland",
                'Central African Rep.': "Central African Republic",
                "Lao People's Dem. Rep.": "Lao People's Democratic Republic",
                'Falkland Is. (Malvinas)': "Falkland Islands (Malvinas)",
                'Faeroe Islands': "Faroe Islands",
                'St. Vincent-Grenadines': "Saint Vincent and the Grenadines",
                'Dem. Rep. of the Congo': "Democratic Republic of the Congo",
                'United States': "United States of America",
                'Iran (Islamic Rep. of)': "Iran (Islamic Republic of)",
                'United States Virgin Is.': "United States Virgin Islands",
                'Micronesia (Fed. States of)': "Micronesia (Federated States of)",
                'United Rep. of Tanzania': "United Republic of Tanzania",
                'Bolivia (Plur. State of)': "Bolivia (Plurinational State of)",
                'St. Kitts-Nevis': "Saint Kitts and Nevis"}

    for name in df["Country or Area"].tolist():
        if name in hardcode:
            name = hardcode[name]
            print(name)
        try:
            region_list.append(country_dict[name][0])
            iso_list.append(country_dict[name][1])
        except:
            region_list.append(None)
            iso_list.append(None)
    df["Region"] = region_list
    df["ISO"] = iso_list

    # print(df.loc[df['ISO'] == "DEU"])
    energy_file = set()
    country_file = set()
    iso_file = set()
    fout_file = set()
    for index, row in df.iterrows():
        # mand.update(i)
        energy_file.add(row["Country or Area"],)
        iso_file.add(row["ISO"],)
        if not row["ISO"]:
            fout_file.add(row["Country or Area"],)

    print(fout_file)
    print(len(fout_file))

    print(f"energy: {len(energy_file)}")
    print(f"country: {len(country_dict)}")
    print(f"iso: {len(iso_file)}")

    print(country_dict)

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
