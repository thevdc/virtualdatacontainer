export function homeRequiredRecursive (st, info, isArrayFlag, path) {
  var listItem
  var i
  var emptyList = []
  var theCase
  if (!isArrayFlag) {
    Object.entries(st).map(([name, content], index) => {
      try {
        switch (info[name].type) {
          case 'string':
            if (content === '' && info[name].req) {
              listItem = makeListItem(name, path)
              emptyList = [...emptyList, listItem]
            }
            break

          case 'object':
            // for object element
            if (info[name].props !== undefined) {
              listItem = homeRequiredRecursive(st[name], info[name].props, false, [...path, name])
              if (listItem.length !== 0) {
                emptyList = [...emptyList, listItem]
              }
            }
            // for object field
            else {
              if (JSON.stringify(content) === '{}' && info[name].req) {
                listItem = makeListItem(name, path)
                emptyList = [...emptyList, listItem]
              }
            }
            break

          case 'object_oneOf':
            theCase = (info[name].casesNOA > 0
              ? findTheCase(path, info[name].casesArrayItems)
              : info[name]._current_case)
            listItem = homeRequiredRecursive(st[name], info[name].casesInfo[theCase], false, [...path, name])
            if (listItem.length !== 0) {
              emptyList = [...emptyList, listItem]
            }
            break

          case 'array':
            // checking only arrays with object items,
            // there is no need to check arrays with simple fields
            if (typeof info[name].items_template === 'object') {
              listItem = homeRequiredRecursive(st[name], info[name].items, true, [...path, name])
              if (listItem.length !== 0) {
                emptyList = [...emptyList, listItem]
              }
            }

            break

          case 'array_oneOf':
            theCase = (info[name].casesNOA > 0
              ? findTheCase(path, info[name].casesArrayItems)
              : info[name]._current_case)

            listItem = homeRequiredRecursive(st[name], info[name].casesInfo[theCase], true, [...path, name])
            if (listItem.length !== 0) {
              emptyList = [...emptyList, listItem]
            }
            break

          default:
            break
        }
      } catch (err) {
        // console.log('Found Error: ' + err)
      }
      return null // necessary for the map fuction
    })
  } else {
    for (i = 0; i < st.length; i++) {
      // breaking if array has simple fields
      if (typeof st[i] !== 'object') { break }
      listItem = homeRequiredRecursive(st[i], info, false, [...path, i])
      if (listItem.length !== 0) {
        emptyList = [...emptyList, listItem]
      }
    }
  }
  return emptyList
}

function makeListItem (name, path) {
  var i; var listItem = ''
  for (i = 0; i < path.length; i++) {
    const newStr = (typeof path[i] === 'number' ? '[' + path[i] + ']' : path[i])
    listItem = listItem + newStr + '/'
  }
  return (listItem + name)
}

function findTheCase (path, casesArrayItems, limit) {
  var i; var pointer = casesArrayItems
  var trueLimit = (limit !== undefined ? limit : path.length)
  for (i = 0; i < trueLimit; i++) {
    if (typeof path[i] === 'number') {
      pointer = pointer[path[i]]
    }
    if (pointer === undefined) {
      return 0
    }
  }
  return pointer
}
