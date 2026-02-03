const ADMIN_KEY = "ulverton_is_admin";
const ADMIN_PASSWORD = "ulverton1"; // This is the Password
let activeCard = null;
let activeFile = null;

function isAdmin() {
  return sessionStorage.getItem(ADMIN_KEY) === "true";
}

function requireAdmin() {
  const pwd = prompt("Admin password:");
  if (pwd === ADMIN_PASSWORD) {
    sessionStorage.setItem(ADMIN_KEY, "true");
    alert("Admin mode enabled");
    location.reload();
  } else {
    alert("Incorrect password");
  }
}

function isImageFile(name) {
  return ["jpg","jpeg","png","gif","webp"].includes(
    name.split(".").pop().toLowerCase()
  );
}

/* ===============================
   FILE CARD CREATION
================================ */

function addCardToGrid(grid, file) {
  if (!grid || !file) return;

  const card = document.createElement("a");
  card.className = "file-card";
  card.href = file.fileURL;
  card.target = "_blank";
  card.rel = "noopener";

  card.addEventListener("click", (e) => {
  e.preventDefault();
  activeCard = card;
  activeFile = file;
const lower = file.fileName.toLowerCase();

if (lower.endsWith(".pdf")) {
  e.preventDefault();
  openPDFViewer(file.fileURL);
  return;
}

if (lower.endsWith(".stl")) {
  e.preventDefault();
  openSTLViewer(file.fileURL);
  return;
}

if (
  lower.endsWith(".jpg") ||
  lower.endsWith(".jpeg") ||
  lower.endsWith(".png") ||
  lower.endsWith(".gif") ||
  lower.endsWith(".webp")
) {
  e.preventDefault();
  openImageViewer(file.fileURL);
  return;
}
if (
  lower.endsWith(".mp4") ||
  lower.endsWith(".mov")
) {
  e.preventDefault();
  openVideoViewer(file.fileURL);
  return;
}

});

  const img = document.createElement("img");
img.className = "file-thumbnail";

// Images → use file directly
if (isImageFile(file.fileName)) {
  img.src = file.fileURL;
}

// Everything else → icon
else {
  img.src = getThumbnailForFile(file.fileName);
}

card.appendChild(img);

  const title = document.createElement("p");
  title.textContent = file.fileName;
  card.appendChild(title);

  if (file.description) {
    const desc = document.createElement("p");
    desc.className = "file-description";
    desc.textContent = file.description;
    card.appendChild(desc);
  }

  grid.appendChild(card);
}

/* ===============================
   VIEWER CONTROLS
================================ */
function openFileByType(file) {
  const lower = file.fileName.toLowerCase();

  if (lower.endsWith(".pdf")) openPDFViewer(file.fileURL);
  else if (lower.endsWith(".stl")) openSTLViewer(file.fileURL);
  else if ([".jpg",".jpeg",".png",".gif",".webp"].some(e => lower.endsWith(e)))
    openImageViewer(file.fileURL);
  else if ([".mp4",".mov"].some(e => lower.endsWith(e)))
    openVideoViewer(file.fileURL);
}

function openPDFViewer(url) {
  const viewer = document.getElementById("file-viewer");
  const body = document.getElementById("viewer-body");
  if (!viewer || !body) return;

  body.innerHTML = `<iframe src="${url}" loading="lazy"></iframe>`;
  viewer.classList.add("active");
  document.body.style.overflow = "hidden";
}

function openSTLViewer(url) {
  const viewer = document.getElementById("file-viewer");
  const body = document.getElementById("viewer-body");
  if (!viewer || !body) return;

  body.innerHTML = "";
  viewer.classList.add("active");
  document.body.style.overflow = "hidden";

  requestAnimationFrame(() => initSTL(body, url));
}

/* ===============================
   STL VIEWER (NO CORB)
================================ */

function initSTL(container, url) {
  if (!window.THREE || !THREE.STLLoader || !THREE.OrbitControls) {
    console.error("Three.js loaders not available");
    return;
  }

  const width = container.clientWidth || 600;
  const height = container.clientHeight || 400;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);

  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 5000);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));

  const light = new THREE.DirectionalLight(0xffffff, 0.9);
  light.position.set(1, 1, 1);
  scene.add(light);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const loader = new THREE.STLLoader();

  loader.load(
    url,
    (geometry) => {
      geometry.center();
      geometry.computeBoundingBox();

      const size = geometry.boundingBox
        .getSize(new THREE.Vector3())
        .length();

      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({
          color: 0xaaaaaa,
          metalness: 0.15,
          roughness: 0.65
        })
      );

      scene.add(mesh);

      camera.position.set(0, 0, size * 1.5);
      controls.target.set(0, 0, 0);
      camera.lookAt(0, 0, 0);
    },
    undefined,
    (err) => console.error("STL load error:", err)
  );

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}

function openImageViewer(url) {
  const viewer = document.getElementById("file-viewer");
  const body = document.getElementById("viewer-body");
  if (!viewer || !body) return;

  body.innerHTML = `
    <img
      src="${url}"
      alt="Image preview"
      style="
        width: 100%;
        height: 100%;
        object-fit: contain;
        background: #000;
      "
    />
  `;

  viewer.classList.add("active");
  document.body.style.overflow = "hidden";
}
function openVideoViewer(url) {
  const viewer = document.getElementById("file-viewer");
  const body = document.getElementById("viewer-body");
  if (!viewer || !body) return;

  body.innerHTML = `
    <video
      controls
      autoplay
      style="
        width: 100%;
        height: 100%;
        background: #000;
        object-fit: contain;
      "
    >
      <source src="${url}">
      Your browser does not support this video format.
    </video>
  `;

  viewer.classList.add("active");
  document.body.style.overflow = "hidden";
}

/* ===============================
   PAGE INIT
================================ */

document.addEventListener("DOMContentLoaded", () => {
const adminBtn = document.getElementById("admin-login-btn");
if (adminBtn) {
  adminBtn.addEventListener("click", () => {
    requireAdmin();
  });
}

  // Enable admin mode styling
  if (isAdmin()) {
    document.body.classList.add("admin-mode");
  }

  // Load default files
  if (window.defaultHistoryFiles) {
    const grid = document.getElementById("historyGrid");
    if (grid) window.defaultHistoryFiles.forEach(f => addCardToGrid(grid, f));
  }

  if (window.defaultManualFiles) {
    const grid = document.getElementById("manualGrid");
    if (grid) window.defaultManualFiles.forEach(f => addCardToGrid(grid, f));
  }

  // Upload buttons (ADMIN ONLY)
  document.querySelectorAll(".add-file-btn").forEach(btn => {
    const input = document.querySelector(btn.dataset.input);
    const grid = document.querySelector(btn.dataset.grid);
    if (!input || !grid) return;

    btn.addEventListener("click", () => {
      if (!isAdmin()) {
        alert("Admin access required");
        return;
      }
      input.click();
    });

    input.addEventListener("change", () => {
      [...input.files].forEach(file => {
        addCardToGrid(grid, {
          fileName: file.name,
          fileURL: URL.createObjectURL(file),
          thumbnail: getThumbnailForFile(file.name),
          description: prompt("Enter a description:", "")
        });
      });
      input.value = "";
    });
  });

  document.getElementById("viewer-edit")?.addEventListener("click", () => {
  if (!isAdmin() || !activeCard || !activeFile) return;

  const input = document.createElement("input");
  input.type = "file";

  input.onchange = () => {
    const file = input.files[0];
    if (!file) return;

    const newURL = URL.createObjectURL(file);

    // Update file object
    activeFile.fileName = file.name;
    activeFile.fileURL = newURL;
    activeFile.thumbnail = getThumbnailForFile(file.name);

    // Update card UI
    activeCard.querySelector("img").src = activeFile.thumbnail;
    activeCard.querySelector("p:not(.file-description)").textContent =
    activeFile.fileName;
    // Reopen viewer with new file
    document.getElementById("viewer-body").innerHTML = "";
    openFileByType(activeFile);

    alert("File replaced successfully");
  };

  input.click();
});

  document.getElementById("viewer-delete")?.addEventListener("click", () => {
  if (!isAdmin() || !activeCard) return;

  if (!confirm("Delete this file permanently?")) return;

  // Remove card
  activeCard.remove();

  // Close viewer
  document.getElementById("file-viewer-close").click();

  activeCard = null;
  activeFile = null;
});

  // Viewer close
  const viewer = document.getElementById("file-viewer");
  const close = document.getElementById("file-viewer-close");
  const body = document.getElementById("viewer-body");

  if (viewer && close && body) {
close.addEventListener("click", () => {
  viewer.classList.remove("active");
  body.innerHTML = "";
  document.body.style.overflow = "";
  activeCard = null;
  activeFile = null;
});
    viewer.addEventListener("click", e => {
      if (e.target === viewer) close.click();
    });
  }
});

/* ===============================
   THUMBNAILS
================================ */

function getThumbnailForFile(name) {
  const ext = name.split(".").pop().toLowerCase();

  if (ext === "pdf") return "../images/pdf-icon.webp";
  if (["jpg","jpeg","png","gif","webp"].includes(ext)) return "../images/png-icon.webp";
  if (["mp4","mov"].includes(ext)) return "../images/video-icon.webp";
  if (["zip","rar"].includes(ext)) return "../images/archive-icon.webp";

  return "../images/file-icon.webp";
}
