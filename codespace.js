let editor;

export async function initCodespace(type, templateURL) {
  // Show the codespace container
  document.getElementById("codespace").style.display = "block";
  document.getElementById("codespace-title").textContent = type.toUpperCase() + " Codespace";

  // Load template content
  const res = await fetch(templateURL);
  const text = await res.text();

  // If using CodeMirror/Monaco, init here. Otherwise just a textarea:
  const textarea = document.getElementById("editor");
  textarea.value = text;

  // If you later want a code editor library:
  // editor = CodeMirror.fromTextArea(textarea, { lineNumbers: true, mode: "python" });
}
