// https://stackoverflow.com/questions/61237355/how-to-save-my-input-values-to-text-file-with-reactjs/61238960#61238960
export function homeOutputFile (mst) {
  // mst -> masterStates
  const element = document.createElement('a')

  var out
  var i, st
  for (i = 0; i < mst.length; i++) {
    st = mst[i]
    out = { ...out, [st.sections[i]]: st.output }
  }

  const file = new Blob([JSON.stringify(out, null, '\t')], { type: 'application/json' })
  element.href = URL.createObjectURL(file)
  element.download = 'Artifact.json'
  document.body.appendChild(element) // Required for this to work in FireFox
  element.click()
}
