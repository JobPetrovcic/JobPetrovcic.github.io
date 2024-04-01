var updatePositions
var visitedNodes
var unshowed

function unshow (u) {
  if (
    dataNodes[u].numberOfExpandedParents == 0 &&
    dataNodes[u].internalIndegree > 0
  ) {
    if (!dataNodes[u].shown) return
    dataNodes[u].shown = false
    unshowed.push(u)

    contract(u)
  }
}

function contract (u) {
  if (!dataNodes[u].expanded || neighbours[u].length == 0) return
  dataNodes[u].expanded = false

  updatePositions.push(u)

  // TODO pazi vrstni red
  for (let e = 0; e < neighbours[u].length; ++e) {
    let v = neighbours[u][e]
    // update numberOfExpandedParents
    dataNodes[v].numberOfExpandedParents -= 1
  }
  for (let e = 0; e < neighbours[u].length; ++e) {
    let v = neighbours[u][e]
    // potentially unshow neighbours
    unshow(v)
  }
}

function collapse (u, r) {
  updatePositions = []
  contract(u)

  // TODO
}

function expand (u) {
  updatePositions = []

  // check if it is already expanded
  if (dataNodes[u].expanded || neighbours[u].length == 0) return []
  dataNodes[u].expanded = true

  dataNodes[u].children = []

  for (let e = 0; e < neighbours[u].length; ++e) {
    // show neighbour and update numberOfExpandedParents
    let v = neighbours[u][e]

    if (!dataNodes[v].shown) {
      dataNodes[u].children.push(v)
      dataNodes[v].depth = dataNodes[u].depth + 1

      updatePositions.push(v)

      // set intial position to parent; this will be the spawn position
      dataNodes[v].x = dataNodes[u].x
      dataNodes[v].y = dataNodes[u].y

      //TODO
    }

    dataNodes[v].shown = true
    dataNodes[v].numberOfExpandedParents += 1
  }
}

function postProcess () {
  for (let v of updatePositions) {
    if (!dataNodes[v].visited) {
      dataNodes[v].shown = false
      unshowed.push(v)
    }
  }
  for (let v of visitedNodes) {
    dataNodes[v].visited = false
  }
}
