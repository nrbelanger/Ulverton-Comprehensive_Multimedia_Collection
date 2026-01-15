function addCardToGrid(grid, file) {
  const card = document.createElement("a");
  card.className = "file-card";
  card.href = file.fileURL;
  card.target = "_blank";
  card.rel = "noopener";

  // Enable proper drag-to-tab
  card.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/uri-list", card.href);
    e.dataTransfer.setData("text/plain", card.href);
  });

  // CLICK HANDLING
card.addEventListener("click", (e) => {
  if (file.fileName.toLowerCase().endsWith(".pdf")) {
    e.preventDefault();

    const viewer = document.getElementById("fileViewer");
    const frame = document.getElementById("fileViewerFrame");

    frame.src = card.href;
    viewer.classList.add("active");
    document.body.style.overflow = "hidden";
  }
});


  // Thumbnail
  const thumbnail = document.createElement("img");
  thumbnail.src = file.thumbnail || getThumbnailForFile(file.fileName);
  thumbnail.alt = "File thumbnail";
  thumbnail.className = "file-thumbnail";
  card.appendChild(thumbnail);

  // Filename
  const fileNameEl = document.createElement("p");
  fileNameEl.textContent = file.fileName;
  card.appendChild(fileNameEl);

  // Description (if exists)
  if (file.description) {
    const descEl = document.createElement("p");
    descEl.className = "file-description";
    descEl.textContent = file.description;
    card.appendChild(descEl);
  }

  grid.appendChild(card);
}

document.addEventListener("DOMContentLoaded", () => {

  // Select all "Add File" buttons
  const addFileButtons = document.querySelectorAll(".add-file-btn");
  
  // === Load default content for History page ===
  if (window.defaultHistoryFiles && Array.isArray(window.defaultHistoryFiles)) {

    const historyGrid = document.querySelector("#historyGrid");

    if (historyGrid) {
      window.defaultHistoryFiles.forEach(item => addCardToGrid(historyGrid, item));
    }
  }

    // === Load default content for Manuals page ===
  if (window.defaultManualFiles && Array.isArray(window.defaultManualFiles)) {

    const manualGrid = document.querySelector("#manualGrid");

    if (manualGrid) {
      window.defaultManualFiles.forEach(item => addCardToGrid(manualGrid, item));
    }
  }
  addFileButtons.forEach(button => {
    // Each button should have data attributes pointing to its input and grid
    const fileInput = document.querySelector(button.dataset.input);
    const grid = document.querySelector(button.dataset.grid);

    if (!fileInput || !grid) return;

    // Clicking the button triggers the file input
    button.addEventListener("click", () => fileInput.click());

    // Handle file selection
    fileInput.addEventListener("change", event => {
      const files = event.target.files;

for (const file of files) {
  const fileObj = {
    fileName: file.name,
    fileURL: URL.createObjectURL(file),
    description: prompt("Enter a description (max 1000 characters):", ""),
    thumbnail: getThumbnailForFile(file.name)
  };

  addCardToGrid(grid, fileObj);
}
      fileInput.value = ""; // reset input
    });
  });

});

// Helper function for thumbnails
function getThumbnailForFile(filename) {
  const ext = filename.split('.').pop().toLowerCase();

  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
    return "../images/png-icon.webp";
  } else if (["pdf"].includes(ext)) {
    return "../images/pdf-icon.webp";
  } else if (["zip", "rar"].includes(ext)) {
    return "../images/archive-icon.webp";
  } else {
    return "../images/file-icon.webp";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const viewer = document.getElementById("fileViewer");
  const frame = document.getElementById("fileViewerFrame");
  const closeBtn = document.getElementById("fileViewerClose");

  if (!viewer || !frame || !closeBtn) return;

  // Close viewer
  closeBtn.addEventListener("click", () => {
    viewer.classList.remove("active");
    frame.src = "";
    document.body.style.overflow = "";
  });

  // Click outside content closes viewer
  viewer.addEventListener("click", (e) => {
    if (e.target === viewer) closeBtn.click();
  });

});
