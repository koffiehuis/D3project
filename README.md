# http://koffiehuis.github.io/D3project
# Electricity sources Visualized
##### Credentials
* Mark van Malestein
* 10807640
* markmalestein@gmail.com

### Problem
Nowadays, as the effects of climate changes become more and more visible, renewable energy is becoming an increasingly important source of energy. But how big is the contribution of renewable sources to our electricity supply when compared to our traditional sources? Are 'outdated' energy sources such as oil and coal decreasing? In which countries are the most rapid changes being made?!

### Solution
To answer questions like these and provide a clear picture on the current changes, we have applied different visualisation tools. These tools are linked to provide an interactive page to work with and help answer all your questions concerning changes in electricity source management.

![alt_text](docs/project_page.png =200px)
![alt_text](docs/project_page_small.png =50px)

## Prerequisites
### Datasource:
* This dataset from [the united nations](https://www.kaggle.com/unitednations/international-energy-statistics) which consists of data for many different energy sources for each country and per year. 
* [This](https://github.com/jdamiani27/Data-Visualization-and-D3/blob/master/lesson4/world_countries.json) dataset is used for the worldmap.
* Finally a dataset from the [united nations](data/country_region.csv) is used to add the ISO and region codes to our data. ([link](https://unstats.un.org/unsd/methodology/m49/overview/) to source)

### Transformation:
* The data will is grouped in regions for figure 4.
* Categories are altered. Categories which are too small or irrelevant will be put in an "other" category.
* Also, during preprocessing only usefull information is extracted.
* Furthermore, some countrynames are hardcoded in preprocessing.py, due to discrepancies between the 2 UN datasets.

### Libraries:
* [Datamaps](http://datamaps.github.io/) for the worldmaps.
* [D3js](https://d3js.org/) for almost everything.
* [Bootstrap](https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css) for nice resizing of the page.
* [d3-tip](https://cdnjs.cloudflare.com/ajax/libs/d3-tip/0.7.1/d3-tip.min.js) for the hover-over tooltips.
* [d3-legend](https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.25.6/d3-legend.min.js) for the worldmap-legend.
* [colorbrewer](https://github.com/axismaps/colorbrewer/blob/master/colorbrewer_schemes.js) for the color-gradient.
* [lodash](https://cdn.jsdelivr.net/lodash/4.17.2/lodash.min.js) for easy grouping of objects by value.

### Copyright statement
This project is shared as a public domain release.

