// History Add Files with description
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
