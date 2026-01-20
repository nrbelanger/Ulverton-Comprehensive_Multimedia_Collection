/* ===============================
   FILE CARD CREATION
================================ */

function addCardToGrid(grid, file) {
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
    }

    if (lower.endsWith(".stl")) {
      e.preventDefault();
      openSTLViewer(file.fileURL);
    }
  });

  const thumbnail = document.createElement("img");
  thumbnail.src = file.thumbnail || getThumbnailForFile(file.fileName);
  thumbnail.className = "file-thumbnail";
  card.appendChild(thumbnail);

  const name = document.createElement("p");
  name.textContent = file.fileName;
  card.appendChild(name);

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
  body.innerHTML = `<iframe src="${url}"></iframe>`;
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

  // WAIT until viewer is visible
  requestAnimationFrame(() => initSTL(body, url));
}

/* ===============================
   STL VIEWER (THREE.JS)
================================ */

function initSTL(container, url) {
  const width = container.clientWidth;
  const height = container.clientHeight;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);

  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 5000);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
  dirLight.position.set(1, 1, 1);
  scene.add(dirLight);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const loader = new THREE.STLLoader();

fetch(url)
  .then(res => res.arrayBuffer())
  .then(buffer => {
    const geometry = loader.parse(buffer);

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
  })
  .catch(err => console.error("STL fetch error:", err));

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}

/* ===============================
   PAGE INIT
================================ */

document.addEventListener("DOMContentLoaded", () => {

   // Load Default Files
if (window.defaultHistoryFiles) {
  const grid = document.getElementById("historyGrid");
  if (grid) {
    window.defaultHistoryFiles.forEach(f => addCardToGrid(grid, f));
  }
}

if (window.defaultManualFiles) {
  const grid = document.getElementById("manualGrid");
  if (grid) {
    window.defaultManualFiles.forEach(f => addCardToGrid(grid, f));
  }
}


  // Upload handling
document.querySelectorAll(".add-file-btn").forEach(btn => {
  const inputSelector = btn.dataset.input;
  const gridSelector = btn.dataset.grid;

  if (!inputSelector || !gridSelector) return;

  const input = document.querySelector(inputSelector);
  const grid = document.querySelector(gridSelector);

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


  // Close viewer
  const viewer = document.getElementById("file-viewer");
  const close = document.getElementById("file-viewer-close");
  const body = document.getElementById("viewer-body");

  close.addEventListener("click", () => {
    viewer.classList.remove("active");
    body.innerHTML = "";
    document.body.style.overflow = "";
  });

  viewer.addEventListener("click", e => {
    if (e.target === viewer) close.click();
  });
});

/* ===============================
   THUMBNAILS
================================ */

function getThumbnailForFile(name) {
  const ext = name.split(".").pop().toLowerCase();

  if (["pdf"].includes(ext)) return "../images/pdf-icon.webp";
  if (["jpg","jpeg","png","gif","webp"].includes(ext)) return "../images/png-icon.webp";
  if (["zip","rar"].includes(ext)) return "../images/archive-icon.webp";

  return "../images/file-icon.webp";
}
