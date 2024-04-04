var shownNodes = []
var unshowed = []

function unshowNode (v) {
  if(!dataNodes[v].shown) return
  dataNodes[v].shown = false
  unshowed.push(v)
  collapse(v);
}

function showNode (v) {
  if(dataNodes[v].shown) return
  dataNodes[v].shown = true
  shownNodes.push(v)
}

function collapse (u) {
  if (!dataNodes[u].expanded) return

  dataNodes[u].expanded = false
  dataNodes[u].children = [];

  // order of bodies of for loops matters
  for (let e = 0; e < neighbours[u].length; ++e) {
    let v = neighbours[u][e]
    // update numberOfExpandedParents
    dataNodes[v].numberOfExpandedParents -= 1
  }
  for (let e = 0; e < neighbours[u].length; ++e) {
    let v = neighbours[u][e]

    if (
      dataNodes[v].numberOfExpandedParents == 0 &&
      dataNodes[v].internalIndegree > 0
    ) {
      unshowNode(v)
    }
  }
}

function expand (u) {
  // check if it is already expanded
  if (dataNodes[u].expanded) return

  dataNodes[u].expanded = true

  dataNodes[u].children = []

  for (let e = 0; e < neighbours[u].length; ++e) {
    // show neighbour and update numberOfExpandedParents
    let v = neighbours[u][e]

    dataNodes[v].numberOfExpandedParents += 1

    if (!dataNodes[v].shown) {
      showNode(v)

      dataNodes[u].children.push(v)

      // set intial position to parent; this will be the spawn position; once the positions are updated, this will be saved as old
      dataNodes[v].x = dataNodes[u].x
      dataNodes[v].y = dataNodes[u].y
    }
  }
}
