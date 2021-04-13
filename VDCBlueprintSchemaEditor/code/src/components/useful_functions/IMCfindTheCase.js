export function IMCfindTheCase (path, casesArrayItems) {
  var pointer = casesArrayItems
  var i
  for (i = 0; i < path.length; i++) {
    if (typeof path[i] === 'number') {
      pointer = pointer[path[i]]
    }
    if (pointer === undefined) {
      return 0
    }
  }
  return pointer
}
