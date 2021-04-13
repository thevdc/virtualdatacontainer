// Sourse: https://jsfiddle.net/2wAzx/13/
export const writeTab = (e, ref) => {
  if (e.key === 'Tab') { // tab was pressed
    // prevent moving to the next field
    e.preventDefault()
    // get caret position/selection
    var val = ref.value
    var start = ref.selectionStart
    var end = ref.selectionEnd

    // set textarea value to: text before caret + tab + text after caret
    ref.value = val.substring(0, start) + '\t' + val.substring(end)

    // put caret at right position again
    ref.selectionStart = ref.selectionEnd = start + 1

    // prevent the focus lose
    return false
  }
}
