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
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
    return "images/image-icon.webp"; // or whatever your actual path is
  } else if (["pdf"].includes(ext)) {
    return "images/pdf-icon.webp";
  } else if (["zip", "rar"].includes(ext)) {
    return "images/archive_icon.webp";
  } else {
    return "images/file-icon.webp";
  }
}


  // Clicking the Add File button triggers the hidden file input
  addBtn.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", (event) => {
  const files = event.target.files;
  for (const file of files) {
    const card = document.createElement("div");
    card.className = "file-card";

    // Create thumbnail
    const thumbnail = document.createElement("img");
    thumbnail.src = getThumbnailForFile(file.name);
    thumbnail.alt = "File thumbnail";
    thumbnail.className = "file-thumbnail";
    card.appendChild(thumbnail);

    // Add filename
    const fileName = document.createElement("p");
    fileName.textContent = file.name;
    card.appendChild(fileName);

    // Ask for description
    const description = prompt("Enter a description (max 1000 characters):", "");
    if (description) {
      const descEl = document.createElement("p");
      descEl.textContent = description.substring(0, 1000);
      card.appendChild(descEl);
    }

    grid.appendChild(card);
  }
});


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
