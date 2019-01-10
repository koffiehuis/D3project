# Energy sources Visualized
##### Credentials
* Mark van Malestein
* 10807640
* markmalestein@gmail.com

### Problem
Nowadays, as the effects of climate changes become more and more visible, renewable energy is becoming an increasingly important source of energy. But how big is the contribution of renewable energy when compared to our total energy supply? Are 'outdated' energy sources such as oil and coal decreasing? In which countries are the most rapid changes being made?

### Solution
To answer questions like these and provide a clear picture on the current changes, we will apply different visualisation tools. These tools will be linked to provide an interactive page to work with and help answer all your questions concerning changes in energy source management.

![alt text](data/sketchnew.jpg)

## Prerequisites
### Datasource:
* This dataset from [the united nations](https://www.kaggle.com/unitednations/international-energy-statistics) which consists of data for many different energy sources for each country and per year. 

### Transformation:
* The data will need to be grouped in regions for figure 4.
* Categories will need to be altered. Categories which are too small or irrelevant will be put in an "other" category.
* Also, a lot of preprocessing will need to be done, since the file would otherwise be too big.

### Libraries:
* [Datamaps](http://datamaps.github.io/) will be needed for the worldmaps.
* [D3js](https://d3js.org/) will be needed for the correlation plots and linecharts.

### Similar:
* The worldmaps with slider will be similar to [this](https://data.worldbank.org/indicator/SP.POP.TOTL?view=map) worldmap.
* Linking a piechart to a map, and showing values in a transparent manner. Like [this](https://demos.datalabsagency.com/d3/acc-map/).


### Hardest parts:
* Making the different charts co-interactive. So clicking a country on the worldmap will determine which data is being shown in the linecharts and piechart.
* Trimming down this huge dataset.
* Making well-informed decisions when grouping the data in energy categories and regions.
* Preprocessing the data in such a way that my page will load fast.

