function getAncestor (v, depthOfAddedChild, defaultValueAncestor) {
  let candidate = dataNodes[v].ancestor
  if (dataNodes[candidate].depth == depthOfAddedChild) return candidate
  else return defaultValueAncestor
}

function executeShifts (u) {
  if (dataNodes[u].children.length != dataNodes[u].change.length);

  for (let i = dataNodes[u].children.length - 2; i >= 0; --i) {
    // prefix sum the changes
    dataNodes[u].change[i] += dataNodes[u].change[i + 1]
    dataNodes[u].shift[i] += dataNodes[u].shift[i + 1]
  }
  for (let i = dataNodes[u].children.length - 2; i >= 0; --i) {
    // add up the changes
    dataNodes[u].change[i] += dataNodes[u].change[i + 1]
  }
  for (let i = dataNodes[u].children.length - 1; i >= 0; --i) {
    // sum it up with the shifts
    dataNodes[u].shift[i] += dataNodes[u].change[i]
  }
}

function resolveConflict (u, leftChild, rightChild, dShift) {
  let numberOfBetweenChildren =
    dataNodes[rightChild].childNumber - dataNodes[leftChild].childNumber
  if (dataNodes[rightChild].childNumber <= 0) throw 1
  dataNodes[u].shift[dataNodes[u].children.length - 1] += dShift
  if (dataNodes[leftChild].childNumber > 0) {
    dataNodes[u].change[dataNodes[leftChild].childNumber - 1] +=
      dShift / numberOfBetweenChildren
  }

  dataNodes[u].change[dataNodes[rightChild].childNumber - 1] -=
    dShift / numberOfBetweenChildren
}

var currentShift

function checkConflict (u, ch) {
  let leftContour = dataNodes[u].leftThread
  let rightContour = dataNodes[u].rightThread
  let leftContourChild = (rightContourChild = ch)

  if(dataNodes[rightContour].modifier != 0) throw 1
  let rightContourPosition = dataNodes[rightContour].modifier + dataNodes[rightContour].temporaryShift;
  if(dataNodes[leftContourChild].modifier != 0) throw 2
  let leftContourChildPosition = dataNodes[leftContourChild].modifier + currentShift
  while (true) {
    if (
      leftContourChildPosition - rightContourPosition <
      nodeSize + minimumGapInLevel
    ) {
      // there is a conflict: the nodes overlap or (even worse) the supposed right one is the left
      let dShift =
        nodeSize +
        minimumGapInLevel -
        leftContourChildPosition +
        rightContourPosition

      currentShift += dShift
      leftContourChildPosition += dShift
      resolveConflict(
        u,
        getAncestor(
          rightContour,
          dataNodes[ch].depth,
          dataNodes[u].defaultAncestor
        ),
        ch,
        dShift
      )
    }

    if (!dataNodes[rightContour].rightThread) {
      // the current contour is smaller
      dataNodes[leftContour].leftThread = dataNodes[leftContourChild].leftThread
      dataNodes[u].defaultAncestor = ch

      let goThroughContour = ch
      while (goThroughContour) {
        dataNodes[goThroughContour].ancestor = ch
        goThroughContour = dataNodes[goThroughContour].rightThread
      }

      break
    } else if (!dataNodes[leftContourChild].leftThread) {
      // the current contour is larger
      dataNodes[rightContourChild].rightThread =
        dataNodes[rightContour].rightThread
      dataNodes[u].defaultAncestor = ch
      break
    } else {
      leftContour = dataNodes[leftContour].leftThread
      rightContour = dataNodes[rightContour].rightThread
      rightContourPosition += dataNodes[rightContour].modifier

      leftContourChild = dataNodes[leftContourChild].leftThread
      leftContourChildPosition += dataNodes[leftContourChild].modifier
      rightContourChild = dataNodes[rightContourChild].rightThread
    }
  }

  dataNodes[u].rightThread = ch // change right contour of current node u to the right contour of added child
}

// the actual position is the sum of all modifiers from the root of the tree to the node (including the modifier of the node itself)
function setUpPositions (u) {
  if (dataNodes[u].shown == false) throw 1

  dataNodes[u].modifier = 0
  dataNodes[u].ancestor = u

  // make sure all the children are shown
  let shownChildren = []
  for (let v of dataNodes[u].children)
    if (dataNodes[v].shown) {
      shownChildren.push(v)
    }
  dataNodes[u].children = shownChildren

  dataNodes[u].shift = new Array(dataNodes[u].children.length).fill(0)
  dataNodes[u].change = new Array(dataNodes[u].children.length).fill(0)

  for (let v of dataNodes[u].children) {
    setUpPositions(v)
  }

  currentShift = 0;
  let childrenCounter = 0
  for (let v of dataNodes[u].children) {
    dataNodes[v].childNumber = childrenCounter++

    if (childrenCounter == 1) {
      dataNodes[u].leftThread = v
      dataNodes[u].rightThread = v

      dataNodes[u].defaultAncestor = v

      dataNodes[v].temporaryShift = currentShift
    } else {
      checkConflict(u, v)
      dataNodes[v].temporaryShift = currentShift
    }
  }

  // is leaf
  if (childrenCounter == 0) {
    dataNodes[u].leftThread = dataNodes[u].rightThread = null
  } else {
    executeShifts(u) // calculate the prefix sums and calculate how much we actually shifted the children during the above process
    for (let i = 0; i < dataNodes[u].children.length; ++i) {
      let v = dataNodes[u].children[i]
      dataNodes[v].modifier += dataNodes[u].shift[i]
    }

    // at this points all the children are in the desired position between themselves
    // finally we shift them so that the parent u (whose position and modifiers are still 0 when considering it as a root) is in the middle of the children
    centeringShift =
      dataNodes[u].shift[dataNodes[u].shift.length - 1] - dataNodes[u].shift[0]
    centeringShift /= 2 // in the middle

    for (let v of dataNodes[u].children) {
      dataNodes[v].modifier -= centeringShift //subtract so that all the children are shifted left
    }
  }
}

function calculatePositions (u, sumOfModifiers) {
  if (!dataNodes[u].shown) throw 'should be shown'
  // save old position for transitions
  dataNodes[u].x0 = dataNodes[u].x
  dataNodes[u].y0 = dataNodes[u].y
  dataNodes[u].visited = true
  visitedNodes.push(u)

  // calculate new position according to modifiers
  sumOfModifiers += dataNodes[u].modifier
  dataNodes[u].x = sumOfModifiers
  dataNodes[u].y = dataNodes[u].depth * gapBetweenLevels

  for (let v of dataNodes[u].children)
    if (dataNodes[v].shown) {
      calculatePositions(v, sumOfModifiers)
    }
}

function arrangeTree () {
  visitedNodes = []
  for (let r of roots)
    if (dataNodes[r].shown) {
      dataNodes[r].depth = 0
      setUpPositions(r)
    }

  let currentRootPosition = 0 // TODO cleanup this
  for (let r of roots) {
    currentRootPosition += minimumGapInLevel + nodeSize
    calculatePositions(r, currentRootPosition)
  }
}
