function saveOldPositions () {
  for (let u of shownNodes) {
    dataNodes[u].x0 = dataNodes[u].x
    dataNodes[u].y0 = dataNodes[u].y
  }
}

// from an array of nodes remove the unshown ones and duplicates
function cleanedShownNodes (array) {
  let cleanedArray = []
  for (let v of array) {
    if (dataNodes[v].shown) {
      cleanedArray.push(v)
    }
  }
  cleanedArray = [...new Set(cleanedArray)]
  return cleanedArray
}

function getCleanedChildren (array) {
  for (let v of array) {
    dataNodes[v].children = cleanedShownNodes(dataNodes[v].children)
  }
}

function arrangeTree () {
  let currentRootPosition = 0
  for (let r of roots) {
    // show current root
    showNode(r)

    // remove duplicates and unshown
    getCleanedChildren(shownNodes)

    // get the tree structure
    let treemap = d3.tree().nodeSize([nodeSize + minimumGapInLevel, nodeSize + minimumGapInLevel]) // TODO there is probably a better way to do this

    let root = d3.hierarchy(dataNodes[r], function (d) {
      // getter for children
      let refChildren = []
      for (let v of d.children) {
        refChildren.push(dataNodes[v])
      }
      return refChildren
    })
    // compute the positions
    treeData = treemap(root)

    // set new positions
    for (let v of treeData) {
      v.data.x = v.x + currentRootPosition
      v.data.y = v.depth * gapBetweenLevels
      v.data.visited = true
    }
    currentRootPosition += minimumGapInLevel + nodeSize
  }

  // shownNodes might contain DUPLICATES
  // remove nodes which are no longer connected to a root
  for (let v of shownNodes) {
    if (!dataNodes[v].visited) {
      unshowNode(v);
    }
  }

  for (let v of shownNodes) {
    dataNodes[v].visited = false
  }
  
  for (let u = 0; u < numberOfNodes; ++u) {
    // TODO remove this after testing
    if (dataNodes[u].visited) debugger;
  }

  shownNodes = cleanedShownNodes(shownNodes)
}
