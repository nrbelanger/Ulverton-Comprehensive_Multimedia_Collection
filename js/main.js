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
      const fileItem = document.createElement("div");
      fileItem.className = "file-item";
      fileItem.textContent = files[i].name; // Display file name
      grid.appendChild(fileItem);
    }
    fileInput.value = ""; // Reset input so same file can be added again
  });
});
