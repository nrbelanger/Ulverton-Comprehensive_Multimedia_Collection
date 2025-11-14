// History Section
document.addEventListener("DOMContentLoaded", () => {

  const addBtn = document.getElementById("addHistoryFile");
  const fileInput = document.getElementById("historyFileInput");
  const grid = document.getElementById("historyGrid");

  if (!addBtn || !fileInput || !grid) return;

  addBtn.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (event) => {
    const files = event.target.files;

    for (const file of files) {

      const card = document.createElement("div");
      card.className = "file-card";

      // Thumbnail
      const thumbnail = document.createElement("img");
      thumbnail.src = getThumbnailForFile(file.name);
      thumbnail.alt = "File thumbnail";
      thumbnail.className = "file-thumbnail";
      card.appendChild(thumbnail);

      // Filename
      const fileName = document.createElement("p");
      fileName.textContent = file.name;
      card.appendChild(fileName);

      // Description
      const description = prompt("Enter a description (max 1000 characters):", "");
      if (description) {
        const descEl = document.createElement("p");
        descEl.className = "file-description";
        descEl.textContent = description.substring(0, 1000);
        card.appendChild(descEl);
      }

      grid.appendChild(card);
    }

    fileInput.value = "";
  });

});


// Parts Section
document.addEventListener("DOMContentLoaded", () => {

  const addBtn = document.getElementById("addPartsFile");
  const fileInput = document.getElementById("partsFileInput");
  const grid = document.getElementById("partsGrid");

  if (!addBtn || !fileInput || !grid) return;

  addBtn.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (event) => {
    const files = event.target.files;

    for (const file of files) {

      const card = document.createElement("div");
      card.className = "file-card";

      // Thumbnail
      const thumbnail = document.createElement("img");
      thumbnail.src = getThumbnailForFile(file.name);
      thumbnail.alt = "File thumbnail";
      thumbnail.className = "file-thumbnail";
      card.appendChild(thumbnail);

      // Filename
      const fileName = document.createElement("p");
      fileName.textContent = file.name;
      card.appendChild(fileName);

      // Description
      const description = prompt("Enter a description (max 1000 characters):", "");
      if (description) {
        const descEl = document.createElement("p");
        descEl.className = "file-description";
        descEl.textContent = description.substring(0, 1000);
        card.appendChild(descEl);
      }

      grid.appendChild(card);
    }

    fileInput.value = "";
  });

});

// CAD and Simulations section
document.addEventListener("DOMContentLoaded", () => {

  const addBtn = document.getElementById("addCadSimFile");
  const fileInput = document.getElementById("cadSimFileInput");
  const grid = document.getElementById("cadSimGrid");

  if (!addBtn || !fileInput || !grid) return;

  addBtn.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (event) => {
    const files = event.target.files;

    for (const file of files) {

      const card = document.createElement("div");
      card.className = "file-card";

      // Thumbnail
      const thumbnail = document.createElement("img");
      thumbnail.src = getThumbnailForFile(file.name);
      thumbnail.alt = "File thumbnail";
      thumbnail.className = "file-thumbnail";
      card.appendChild(thumbnail);

      // Filename
      const fileName = document.createElement("p");
      fileName.textContent = file.name;
      card.appendChild(fileName);

      // Description
      const description = prompt("Enter a description (max 1000 characters):", "");
      if (description) {
        const descEl = document.createElement("p");
        descEl.className = "file-description";
        descEl.textContent = description.substring(0, 1000);
        card.appendChild(descEl);
      }

      grid.appendChild(card);
    }

    fileInput.value = "";
  });

});

    // Reset file input so same file can be added again
    fileInput.value = "";
  });
});

// Manuals Section
document.addEventListener("DOMContentLoaded", () => {

  const addBtn = document.getElementById("addManualFile");
  const fileInput = document.getElementById("manualFileInput");
  const grid = document.getElementById("manualGrid");

  if (!addBtn || !fileInput || !grid) return;

  addBtn.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (event) => {
    const files = event.target.files;

    for (const file of files) {

      const card = document.createElement("div");
      card.className = "file-card";

      // Thumbnail
      const thumbnail = document.createElement("img");
      thumbnail.src = getThumbnailForFile(file.name);
      thumbnail.alt = "File thumbnail";
      thumbnail.className = "file-thumbnail";
      card.appendChild(thumbnail);

      // Filename
      const fileName = document.createElement("p");
      fileName.textContent = file.name;
      card.appendChild(fileName);

      // Description
      const description = prompt("Enter a description (max 1000 characters):", "");
      if (description) {
        const descEl = document.createElement("p");
        descEl.className = "file-description";
        descEl.textContent = description.substring(0, 1000);
        card.appendChild(descEl);
      }

      grid.appendChild(card);
    }

    fileInput.value = "";
  });

});

  // Helper function to pick thumbnail based on file type
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

