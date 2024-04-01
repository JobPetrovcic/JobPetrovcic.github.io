const maxChildrenInALevel = 5

const width = 1000
const height = 800

const nodeRadius = 7
const nodeSize = 2 * nodeRadius
const tooltipLineDistance = 1.5 // distance between lines in the tooltip in units em
const tooltipInitialOffset = 2 // initial offset between the tooltip and node name in units em

const timeHoveredToTooltip = 1000 // milisecond for which a user must hover over the node to display the node's tooltip

const tooltipBoxDistFromNodeX = 7 // the distance from the node and the tooltip box in pixels in the x direction
const tooltipBoxDistFromNodeY = 9 // the distance from the node and the tooltip box in pixels in the x direction
const tooltipWidth = 250 // tooltip width in pixels

const nodeProperties = {
  name: 'name',
  betweenness: 'betweenness',
  current_flow_betweenness: 'current flow betweenness',
  degree: 'degree',
  in_degree: 'indegree',
  out_degree: 'outdegree',
  n_cycles: 'n-cycles',
  eigen_centrality: 'eigen-centrality',
  label: 'label',
  pagerank: 'pagerank'
}

const colourPalette = {
  green: '#1b9e77',
  orange: '#d95f02',
  blue: '#7570b3',
  pink: '#e7298a',
  green: '#66a61e',
  yellow: '#e6ab02',
  brown: '#a6761d',
  black: '#666666',
  red: '#d62728'
}

const numbersRegexp = new RegExp(/\d+(\.\d+)?/, 'g')
// finds all numbers matching the expression and transforms them to numbers
const getFloatsFromString = string =>
  string.match(numbersRegexp).map(parseFloat)

const translateZoomDuration = 150
const duration = 650
const minimumGapInLevel = 10
const gapBetweenLevels = 220