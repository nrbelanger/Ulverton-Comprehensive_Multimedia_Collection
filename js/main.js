document.addEventListener("DOMContentLoaded", () => {

  // Select all "Add File" buttons
  const addFileButtons = document.querySelectorAll(".add-file-btn");

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
        const card = document.createElement("div");
        card.className = "file-card";
        card.style.cursor = "pointer";

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
        let descEl;
        if (description) {
          descEl = document.createElement("p");
          descEl.className = "file-description";
          descEl.textContent = description.substring(0, 1000);
          card.appendChild(descEl);
        }

        // Temporary URL for file
        const fileURL = URL.createObjectURL(file);

        // Make card clickable
        const openFile = (e) => {
          e.stopPropagation();
          window.open(fileURL, "_blank");
        };

        [card, thumbnail, fileName].forEach(el => el.addEventListener("click", openFile));
        if (descEl) descEl.addEventListener("click", openFile);

        grid.appendChild(card);
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
