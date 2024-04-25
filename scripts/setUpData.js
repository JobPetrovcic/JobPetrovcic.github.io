var numberOfNodes = dataNodes.length
var shownNodes = []

// create dataLinks for d3 to use
var dataLinks = []
// same structure as neighbours only with references to links
var linksReferences = []
for (let u = 0; u < numberOfNodes; ++u) {
  linksReferences.push([])
}

for (let u = 0; u < numberOfNodes; ++u) {
  for (let v of neighbours[u]) {
    dataLinks.push({
      source: dataNodes[u],
      target: dataNodes[v],
      offset: (gapBetweenLevels / 2) * Math.random(),
      id: dataNodes[u].id.toString() + '->' + dataNodes[v].id.toString()
    })

    // create a list of references to edges
    linksReferences[u].push(dataLinks[dataLinks.length - 1])
  }
}

// establish attributes
for (let i = 0; i < numberOfNodes; ++i) {
  dataNodes[i].internalIndegree = 0
  dataNodes[i].numberOfExpandedParents = 0
  dataNodes[i].children = []

  dataNodes[i].shown = false
  dataNodes[i].expanded = false
  dataNodes[i].visited = false
}

// calculate indegrees
for (let u = 0; u < numberOfNodes; ++u) {
  for (let v of neighbours[u]) {
    dataNodes[v].internalIndegree += 1
  }
}

// find roots i. e. nodes without indegrees
roots = []
for (let i = 0; i < numberOfNodes; ++i)
  if (dataNodes[i].internalIndegree == 0) {
    roots.push(i)
  }
