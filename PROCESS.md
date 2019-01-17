# Day 1
Proposal: I had to write a new proposal. Due to time I decided not to try to find a subject which was relevant to my bachelor's. I found a dataset with energy statistics, and quite a large one at that. This is what I will be using for this project.


# Day 2
Design doc: This day I made a design for my page. I decided to divide the methodological design in 3 categories; Preprocessing, Initializing and Updating. I also came up with a layout for the 4 charts I'm going to implement (worldmap, pie, 2xLinechart).

# Day 3
Prototype: Made a working navbar and included a dropdown selection tag in the navbar. This dropdown will be used to choose the category of engery source shown in the world map. Furthermore, I divided the charts page into SVG (in html).

# Day 4
Prototype: Implemented the SVG elements in D3 instead of html, made sure the location and size of SVGs is dependent of windowsize. Also implemented a slider (this one is not linked to anything yet). Also, I finished the preprocessing script.

# Day 5
??? Proceed with the prototype: Took a long time to implement the slider. Also made sure the select-tag values aren't hardcoded and the selected value can be easily accessed. 

TODO:
* Make slider pretty
* Start working with data and implement the charts
* Check whether more information from dataset can be used. It may be a little bit too boring as it is.
* Add "total" option for years, would be usefull to compare countries, i think.

# Day 6
Alpha version: Made filterData(), which returns the data in a usefull format for each figure. Furthermore, implemented a basic piechart. Started with implementing datamaps, but not successfully.

# Day 7
Alpha version: Trying to fix preprocessing, a lot of data is lost when applying ISO country codes. Also started with line charts.

# Day 8
Alpha version: Finishing up the line charts and made a start with the worldmap. Was kinda difficult since I implemented the previous one (for dataprocessing) using d3.v3.

# Day 9
Alpha version: Linking all charts to the select tag and to the year-slider. Having some trouble with the worldmap. it shows the worng countries. Cant seem to find out why.
