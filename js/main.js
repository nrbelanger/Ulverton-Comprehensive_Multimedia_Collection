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
});

  const img = document.createElement("img");
  img.className = "file-thumbnail";
  img.src = file.thumbnail || getThumbnailForFile(file.fileName);
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

/* ===============================
   PAGE INIT
================================ */

document.addEventListener("DOMContentLoaded", () => {

  // Default files
  if (window.defaultHistoryFiles) {
    const grid = document.getElementById("historyGrid");
    if (grid) window.defaultHistoryFiles.forEach(f => addCardToGrid(grid, f));
  }

  if (window.defaultManualFiles) {
    const grid = document.getElementById("manualGrid");
    if (grid) window.defaultManualFiles.forEach(f => addCardToGrid(grid, f));
  }

  // Upload buttons
  document.querySelectorAll(".add-file-btn").forEach(btn => {
    const input = document.querySelector(btn.dataset.input);
    const grid = document.querySelector(btn.dataset.grid);
    if (!input || !grid) return;

    btn.addEventListener("click", () => input.click());

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

  // Viewer close
  const viewer = document.getElementById("file-viewer");
  const close = document.getElementById("file-viewer-close");
  const body = document.getElementById("viewer-body");

  if (viewer && close && body) {
    close.addEventListener("click", () => {
      viewer.classList.remove("active");
      body.innerHTML = "";
      document.body.style.overflow = "";
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
  if (["zip","rar"].includes(ext)) return "../images/archive-icon.webp";
  return "../images/file-icon.webp";
}
