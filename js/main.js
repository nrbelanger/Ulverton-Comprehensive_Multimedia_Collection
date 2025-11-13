function getThumbnailForFile(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return 'images/png-icon.webp';
    case 'pdf':
      return 'images/pdf-icon.webp';
    case 'doc':
    case 'docx':
      return 'images/docx-icon.webp';
    case 'zip':
    case 'rar':
      return 'images/zip-icon.webp';
    case 'stl':
    case 'obj':
    case 'step':
      return 'images/stl-icon.webp';
    case 'mp4':
      return 'images/mp4-icon.webp'
    default:
      return 'images/file-icon.webp';
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addHistoryFile");
  const fileInput = document.getElementById("historyFileInput");
  const grid = document.getElementById("historyGrid");

  // Helper function to pick thumbnail based on file type
  function getThumbnailForFile(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return 'images/icons/image-icon.webp';
      case 'pdf':
        return 'images/icons/pdf-icon.png';
      case 'doc':
      case 'docx':
        return 'images/icons/doc-icon.png';
      case 'zip':
      case 'rar':
        return 'images/icons/zip-icon.png';
      case 'stl':
      case 'obj':
      case 'step':
        return 'images/icons/cad-icon.png';
      default:
        return 'images/icons/generic-icon.png';
    }
  }

  // Clicking the Add File button triggers the hidden file input
  addBtn.addEventListener("click", () => {
    fileInput.click();
  });

  // When files are selected, create cards
  fileInput.addEventListener("change", (event) => {
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Prompt for description
      const description = prompt("Enter a description (max 1000 chars):", "");

      // Create card
      const card = document.createElement("div");
      card.className = "file-card";
      card.style.backgroundImage = `url(${getThumbnailForFile(file.name)})`;

      // Overlay for filename + description
      const overlay = document.createElement("div");
      overlay.className = "file-overlay";

      const fileName = document.createElement("p");
      fileName.textContent = file.name;
      overlay.appendChild(fileName);

      const desc = document.createElement("p");
      desc.className = "file-description";
      desc.textContent = description || '';
      overlay.appendChild(desc);

      card.appendChild(overlay);
      grid.appendChild(card);
    }

    // Reset file input so same file can be uploaded again if needed
    fileInput.value = "";
  });
});

// Parts Add Files with description
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addPartsFile");
  const fileInput = document.getElementById("partsFileInput");
  const grid = document.getElementById("partsGrid");

  addBtn.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Prompt for description
      const description = prompt("Enter a short description (max 1000 characters):") || "";
      const trimmedDescription = description.substring(0, 1000); // enforce character limit

      // Create a container for the file card
      const card = document.createElement("div");
      card.className = "file-card";

      // Create the clickable file link
      const link = document.createElement("a");
      link.className = "file-item";
      link.href = URL.createObjectURL(file);
      link.target = "_blank";
      link.textContent = file.name;

      // Create the description element
      const desc = document.createElement("p");
      desc.className = "file-description";
      desc.textContent = trimmedDescription;

      // Add everything to the card
      card.appendChild(link);
      card.appendChild(desc);
      grid.appendChild(card);
    }

    // Reset file input so same file can be added again
    fileInput.value = "";
  });
});


// Simulations & CAD Add Files with description
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addCadSimFile");
  const fileInput = document.getElementById("cadSimFileInput");
  const grid = document.getElementById("cadSimGrid");

  addBtn.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Prompt for description
      const description = prompt("Enter a short description (max 1000 characters):") || "";
      const trimmedDescription = description.substring(0, 1000); // enforce character limit

      // Create a container for the file card
      const card = document.createElement("div");
      card.className = "file-card";

      // Create the clickable file link
      const link = document.createElement("a");
      link.className = "file-item";
      link.href = URL.createObjectURL(file);
      link.target = "_blank";
      link.textContent = file.name;

      // Create the description element
      const desc = document.createElement("p");
      desc.className = "file-description";
      desc.textContent = trimmedDescription;

      // Add everything to the card
      card.appendChild(link);
      card.appendChild(desc);
      grid.appendChild(card);
    }

    // Reset file input so same file can be added again
    fileInput.value = "";
  });
});


// Manuals Add Files with description
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addManualFile");
  const fileInput = document.getElementById("manualFileInput");
  const grid = document.getElementById("manualGrid");

  addBtn.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Prompt for description
      const description = prompt("Enter a short description (max 1000 characters):") || "";
      const trimmedDescription = description.substring(0, 1000); // enforce character limit

      // Create a container for the file card
      const card = document.createElement("div");
      card.className = "file-card";

      // Create the clickable file link
      const link = document.createElement("a");
      link.className = "file-item";
      link.href = URL.createObjectURL(file);
      link.target = "_blank";
      link.textContent = file.name;

      // Create the description element
      const desc = document.createElement("p");
      desc.className = "file-description";
      desc.textContent = trimmedDescription;

      // Add everything to the card
      card.appendChild(link);
      card.appendChild(desc);
      grid.appendChild(card);
    }

    // Reset file input so same file can be added again
    fileInput.value = "";
  });
});
