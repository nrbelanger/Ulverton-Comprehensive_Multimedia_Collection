// History Add Files
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addHistoryFile");
  const fileInput = document.getElementById("historyFileInput");
  const grid = document.getElementById("historyGrid");

  addBtn.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Create a clickable link instead of div
      const link = document.createElement("a");
      link.className = "file-item";
      link.href = URL.createObjectURL(file); // temporary URL to open file
      link.target = "_blank"; // open in new tab
      link.textContent = file.name;

      grid.appendChild(link);
    }
    fileInput.value = ""; // Reset input so same file can be added again
  });
});
