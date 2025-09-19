// codespace.js
let currentType = null;

export async function initCodespace(type, templateURL) {
  currentType = type;

  const codespace = document.getElementById("codespace");
  codespace.style.display = "block";
  document.getElementById("codespace-title").textContent = type.toUpperCase() + " Codespace";

  const res = await fetch(templateURL);
  const text = await res.text();
  document.getElementById("editor").value = text;

  if (!document.getElementById("runButton")) {
    const runBtn = document.createElement("button");
    runBtn.id = "runButton";
    runBtn.textContent = "Run";
    runBtn.onclick = runCode;
    codespace.appendChild(runBtn);

    const outputFrame = document.createElement("iframe");
    outputFrame.id = "outputFrame";
    outputFrame.style.width = "100%";
    outputFrame.style.height = "300px";
    outputFrame.style.border = "1px solid #444";
    outputFrame.sandbox = "allow-scripts allow-same-origin";
    codespace.appendChild(outputFrame);
  }
}

async function runCode() {
  const code = document.getElementById("editor").value;
  const outputFrame = document.getElementById("outputFrame");

  if (currentType === "html") {
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    outputFrame.src = url;
  } 
  else if (currentType === "js") {
    const wrapped = `
      <script>
        try {
          console.clear();
          console.log = (msg)=>parent.postMessage({type:'jslog', msg}, '*');
          ${code}
        } catch(e) { parent.postMessage({type:'jslog', msg:e.toString()}, '*'); }
      </script>
    `;
    const blob = new Blob([wrapped], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    outputFrame.src = url;
  }
  else if (currentType === "python") {
    outputFrame.srcdoc = `<pre>Python runner not connected yet.\n${code}</pre>`;
  }
}

window.addEventListener('message', (e)=>{
  if (e.data.type === 'jslog') {
    console.log("JS Output:", e.data.msg);
  }
});
