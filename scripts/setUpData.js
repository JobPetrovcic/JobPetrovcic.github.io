var numberOfNodes = dataNodes.length

// create dataLinks for d3 to use
dataLinks = []
for (let u = 0; u < numberOfNodes; ++u) {
  for (let v of neighbours[u]) {
    dataLinks.push({
      source: dataNodes[u],
      target: dataNodes[v],
      offset: (gapBetweenLevels / 2) * Math.random(),
      id: dataNodes[u].id.toString() + '->' + dataNodes[v].id.toString()
    })
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
    dataNodes[i].shown = true
    dataNodes[i].depth = 0
  }
