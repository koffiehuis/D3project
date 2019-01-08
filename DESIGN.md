# Design doc
### Credentials:
* Mark van Malestein
* 10807640
* markmalestein@gmail.com

## Datasource:
The dataset from [this site](https://www.kaggle.com/unitednations/international-energy-statistics) will be used. This dataset is, however, very large, so preprocessing is needed. I plan to do the preprocessing in python. I'm going to exclude the data that is interesting for my project and form 5 different categories based on the [UN guidlines](data/Energy-Questionnaire-Guidelines.pdf) for these statistics. When preprocessing is done each row will consist of the following data:
* Year
* Country
* Category
* Amount
* Region ID
* Tooltip information

[!alt_text](data/sketchnew.jpg)

## Transformations:
The selections to be made will be as following:
* Coal, peat and oil shale
* Oil
* Natural gas, manufactured gas and recovered gas
* Electricity and heat
* Biofuels and waste

For preprocessing the following steps will need to be taken:
* Using pandas: group each country in a dataframe and sort years for each sort
* Add sources within each group, such as wind, solar, nuclear, hydro, etc for the electricity group (following given guidelines). Filter missing data
* Save 5 categories in JSON format
* Add a column with region ID for figure 4
* Add a column with amounts of subcategories (wind, solar, nuclear, etc.), this will be useful for the piechart tooltip.

## Methods:
### Preprocessing methods:
### Initialization of page:
### Updating the pages:

## APIs and D3 plugins:
