function addCardToGrid(grid, file) {
  const card = document.createElement("a");
  card.className = "file-card";
  card.href = file.fileURL;
  card.target = "_blank";
  card.rel = "noopener";

  // Enable drag-to-new-tab
  card.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/uri-list", card.href);
    e.dataTransfer.setData("text/plain", card.href);
  });

  // Click handling
  card.addEventListener("click", (e) => {
    const lower = file.fileName.toLowerCase();

    if (lower.endsWith(".pdf")) {
      e.preventDefault();
      openPDFViewer(card.href);
      return;
    }

    if (lower.endsWith(".stl")) {
      e.preventDefault();
      openSTLViewer(card.href);
      return;
    }
    // all other files fall through and open normally
  });

  // Thumbnail
  const thumbnail = document.createElement("img");
  thumbnail.src = file.thumbnail || getThumbnailForFile(file.fileName);
  thumbnail.className = "file-thumbnail";
  thumbnail.alt = "File thumbnail";
  card.appendChild(thumbnail);

  // Filename
  const fileNameEl = document.createElement("p");
  fileNameEl.textContent = file.fileName;
  card.appendChild(fileNameEl);

  // Description
  if (file.description) {
    const descEl = document.createElement("p");
    descEl.className = "file-description";
    descEl.textContent = file.description;
    card.appendChild(descEl);
  }

  grid.appendChild(card);
}

function openPDFViewer(url) {
  const viewer = document.getElementById("file-viewer");
  const content = document.getElementById("file-viewer-content");

  if (!viewer || !content) return;

  content.innerHTML = `<iframe src="${url}"></iframe>`;
  viewer.classList.add("active");
  document.body.style.overflow = "hidden";
}

function openSTLViewer(url) {
  const viewer = document.getElementById("file-viewer");
  const content = document.getElementById("file-viewer-content");

  if (!viewer || !content || !window.THREE) return;

  content.innerHTML = "";
  viewer.classList.add("active");
  document.body.style.overflow = "hidden";

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);

  const camera = new THREE.PerspectiveCamera(
    60,
    content.clientWidth / content.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 100);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(content.clientWidth, content.clientHeight);
  content.appendChild(renderer.domElement);

  window.addEventListener("resize", () => {
    camera.aspect = content.clientWidth / content.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(content.clientWidth, content.clientHeight);
  });

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const light = new THREE.DirectionalLight(0xffffff, 0.8);
  light.position.set(1, 1, 1);
  scene.add(light);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const loader = new THREE.STLLoader();
  loader.load(url, (geometry) => {
    geometry.center();
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
    );
    scene.add(mesh);
  });

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
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
  const viewer = document.getElementById("file-viewer");
  const closeBtn = document.getElementById("file-viewer-close");

  if (!viewer || !closeBtn) return;

  closeBtn.addEventListener("click", () => {
    viewer.classList.remove("active");
    document.body.style.overflow = "";
    document.getElementById("file-viewer-content").innerHTML = "";
  });

  viewer.addEventListener("click", (e) => {
    if (e.target === viewer) closeBtn.click();
  });
});

