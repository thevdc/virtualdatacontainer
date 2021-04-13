import { homeRequiredRecursive } from './homeRequiredRecursive'

export function homeCheckRequired (masterStates) {
  var statePointer, infoPointer
  var propName, content
  var sectionProps, infoSectionProps
  var isArrayFlag, pathFirst, tempList
  var sectionName
  var theList = []
  var sectionList
  var i, j
  var entries

  for (i = 0; i < masterStates.length; i++) {
    sectionList = []
    sectionProps = masterStates[i].output
    infoSectionProps = masterStates[i].info
    sectionName = masterStates[i].sections[i]

    entries = Object.entries(sectionProps)
    for (j = 0; j < entries.length; j++) {
      propName = entries[j][0]
      content = entries[j][1]
      statePointer = content
      infoPointer = infoSectionProps[propName]

      if (masterStates[i].arraySection) {
        isArrayFlag = false
        infoPointer = masterStates[i].info
        pathFirst = Number.parseInt(propName)
      } else {
        isArrayFlag = masterStates[i].info_Arrays.includes(propName)
        if (infoPointer._current_case !== undefined) {
          infoPointer = infoPointer.casesInfo[infoPointer._current_case]
        }
        pathFirst = propName
      }
      tempList = homeRequiredRecursive(statePointer, infoPointer, isArrayFlag, [pathFirst])
      if (tempList.length !== 0) {
        sectionList = [...sectionList, tempList]
      }
    }
    if (sectionList.length !== 0) {
      theList = [...theList, '\n*********' + sectionName + '********\n', sectionList]
    }
  }
  return theList
}
