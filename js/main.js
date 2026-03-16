const ADMIN_KEY = "ulverton_is_admin";
const ADMIN_PASSWORD = "ulverton1"; // This is the Password
let activeCard = null;
let activeFile = null;
console.time("Page launch time");
console.time("Full page load");

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

  // --- Hover/tap button group ---
  const btnGroup = document.createElement("div");
  btnGroup.className = "card-btn-group";

  // Download — visible to all users
  const dlBtn = document.createElement("button");
  dlBtn.className = "card-btn";
  dlBtn.title = "Download";
  dlBtn.textContent = "💾";
  dlBtn.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    const a = document.createElement("a");
    a.href = file.fileURL;
    a.download = file.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
  btnGroup.appendChild(dlBtn);

  // Edit — admin only
  const editBtn = document.createElement("button");
  editBtn.className = "card-btn admin-only";
  editBtn.title = "Replace file";
  editBtn.textContent = "✏️";
  editBtn.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = () => {
      const newFile = input.files[0];
      if (!newFile) return;
      const newURL = URL.createObjectURL(newFile);
      file.fileName = newFile.name;
      file.fileURL = newURL;
      file.thumbnail = getThumbnailForFile(newFile.name);
      card.querySelector("img.file-thumbnail").src = isImageFile(newFile.name)
        ? newURL
        : file.thumbnail;
      card.querySelector("p:not(.file-description)").textContent = file.fileName;
      alert("File replaced successfully");
    };
    input.click();
  });
  btnGroup.appendChild(editBtn);

  // Delete — admin only
  const delBtn = document.createElement("button");
  delBtn.className = "card-btn admin-only";
  delBtn.title = "Delete file";
  delBtn.textContent = "🗑️";
  delBtn.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this file permanently?")) return;
    card.remove();
  });
  btnGroup.appendChild(delBtn);

  card.appendChild(btnGroup);

  // --- Touch support: first tap reveals buttons, second tap on a button acts ---
  let touchActivated = false;
  card.addEventListener("touchstart", e => {
    if (!touchActivated) {
      e.preventDefault();
      touchActivated = true;
      card.classList.add("touch-active");
      // Dismiss when tapping anywhere else
      const dismiss = ev => {
        if (!card.contains(ev.target)) {
          touchActivated = false;
          card.classList.remove("touch-active");
          document.removeEventListener("touchstart", dismiss);
        }
      };
      document.addEventListener("touchstart", dismiss);
    }
  }, { passive: false });

  // --- Click handler: open viewer for supported types, ignore for unsupported ---
  card.addEventListener("click", e => {
    e.preventDefault();
    activeCard = card;
    activeFile = file;
    const lower = file.fileName.toLowerCase();

    if (lower.endsWith(".pdf"))   { openPDFViewer(file.fileURL);   return; }
    if (lower.endsWith(".stl"))   { openSTLViewer(file.fileURL);   return; }
    if ([".jpg",".jpeg",".png",".gif",".webp"].some(ext => lower.endsWith(ext))) {
      openImageViewer(file.fileURL); return;
    }
    if ([".mp4",".mov"].some(ext => lower.endsWith(ext))) {
      openVideoViewer(file.fileURL); return;
    }
    // Unsupported type — do nothing (touch users use the download button)
  });

  // --- Thumbnail ---
  const img = document.createElement("img");
  img.className = "file-thumbnail";
  img.src = isImageFile(file.fileName) ? file.fileURL : getThumbnailForFile(file.fileName);
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
  console.log("Opening STL:", url);
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
  geometry => {
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
  error => {
    console.error("STL load error:", error, url);
  }
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
  console.timeEnd("Page launch time");
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

  if (window.defaultPartsFiles) {
    const grid = document.getElementById("partsGrid");
    if (grid) window.defaultPartsFiles.forEach(f => addCardToGrid(grid, f));
  }

  if (window.defaultCadSimFiles) {
    const grid = document.getElementById("cadSimGrid");
    if (grid) window.defaultCadSimFiles.forEach(f => addCardToGrid(grid, f));
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
window.addEventListener("load", () => {
  console.timeEnd("Full page load");
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
  if (["mp4","mov"].includes(ext)) return "../images/mp4-icon.webp";
  if (["zip","rar"].includes(ext)) return "../images/archive-icon.webp";
  if (["stl","obj"].includes(ext)) return "../images/stl-icon.webp";

  return "../images/file-icon.webp";
}
