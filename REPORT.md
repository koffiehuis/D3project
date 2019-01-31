# Description
<img src="docs/project_page.png" align="right" height="200" >This project shows the change in sources of electricity production. It does so, by showing changes in sources per country (worldmap), per region (line-chart), in relationship to eachother (pie-chart) and over time (line-chart).  
Three settings are used to specify which data is shown:
* Country: by clicking a country on the worldmap.
* Year:  by using the year-slider.
* Energy-source: by using either the dropdown-menu or clicking on the pie-chart.

# Design
There are six situations where functions are called:
* The window loads
* The window-size is adjusted
* Dropdown menu is used
* Year-slider is used
* A slice of the pie-chart is clicked (same effect as dropdown-menu)
* A country of the worldmap is clicked

These actions are represented in the flowchart below.
![alt_text](docs/flowchart_REPORT.png)

## High-level functions
### Initialisation functions:
* initializeMapContainer()
  * Initializes worldmap svg and country-paths (via json)
  * Calls loadDataMap()
* initializePieContainer()
  * Initialized pie-chart svg
  * Calls loadDataPie()
* initializeLine1Container()
  * Initializes container for linechart showing values for different categories for one country over time
  * Calls loadDataLine1()
* initializeLine2Container()
  * Initializes container for linechart showing values for differen regions for one category over time
  * Calls loadDataLine2()
* initializeSlider()
  * Initializes range input element
* categoryOptions()
  * Sets options for dropdown-menu

### Update functions:
* loadDataMap()
  * Loads specific values (based of categoryOption and yearOption)
  * Add color, tooltip, legend
  * Adds on-click funtion to change countryOption
* loadDataPie()
  * Loads specific values (based of yearOption and countryOption)
  * Add color, tooltip, labels and transition
  * Adds on-click function to change categoryOption
* loadDataLine1()
  * Loads specific values (based of countryOption)
  * Adds color, lines, tooltips and transition
* loadDataLine2()
  * Loads specific values (based of categoryOption)
  * Adds color, lines, tooltips and transition
 
 ### Helper functions:
 * 
# Challenges


# Decisions

