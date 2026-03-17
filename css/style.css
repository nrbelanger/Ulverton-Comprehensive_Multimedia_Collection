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
   TOAST NOTIFICATION
================================ */

function showToast(message) {
  let toast = document.getElementById("uc-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "uc-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.remove("toast-hide");
  toast.classList.add("toast-show");
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => {
    toast.classList.remove("toast-show");
    toast.classList.add("toast-hide");
  }, 2800);
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

  // Download — visible to all users (top-left)
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

  // Edit — admin only (top-right)
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

  // Delete — admin only (bottom-left)
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

  // Move — admin only (bottom-right)
  const moveBtn = document.createElement("button");
  moveBtn.className = "card-btn admin-only";
  moveBtn.title = "Move card";
  moveBtn.textContent = "✥";
  moveBtn.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAdmin()) return;
    const isAlreadyDragging = card.classList.contains("drag-ready");
    document.querySelectorAll(".file-card.drag-ready").forEach(c => {
      c.classList.remove("drag-ready");
      c.draggable = false;
    });
    if (!isAlreadyDragging) {
      card.classList.add("drag-ready");
      card.draggable = true;
      card.focus();
    }
  });
  btnGroup.appendChild(moveBtn);

  // Open — centre button, visible to all users
  const openBtn = document.createElement("button");
  openBtn.className = "card-btn card-btn-open";
  openBtn.title = "Open file";
  openBtn.textContent = "👁️";
  openBtn.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
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
    showToast("File type not supported");
  });
  btnGroup.appendChild(openBtn);

  card.appendChild(btnGroup);

  // --- Drag and drop handlers ---
  card.addEventListener("dragstart", e => {
    if (!card.classList.contains("drag-ready")) { e.preventDefault(); return; }
    e.dataTransfer.effectAllowed = "move";
    card.classList.add("dragging");
    setTimeout(() => card.classList.add("drag-ghost"), 0);
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("dragging", "drag-ghost", "drag-ready");
    card.draggable = false;
    document.querySelectorAll(".file-card.drag-over").forEach(c => c.classList.remove("drag-over"));
  });

  card.addEventListener("dragover", e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const dragging = document.querySelector(".file-card.dragging");
    if (!dragging || dragging === card) return;
    card.classList.add("drag-over");
  });

  card.addEventListener("dragleave", () => {
    card.classList.remove("drag-over");
  });

  card.addEventListener("drop", e => {
    e.preventDefault();
    card.classList.remove("drag-over");
    const dragging = document.querySelector(".file-card.dragging");
    if (!dragging || dragging === card) return;
    const grid = card.parentNode;
    const cards = [...grid.querySelectorAll(".file-card")];
    const fromIndex = cards.indexOf(dragging);
    const toIndex = cards.indexOf(card);
    if (fromIndex < toIndex) {
      grid.insertBefore(dragging, card.nextSibling);
    } else {
      grid.insertBefore(dragging, card);
    }
  });

  // --- Touch support ---
  // First tap: reveal buttons only (suppress the click that follows)
  // Second tap on card background: open viewer
  let touchActivated = false;
  let suppressNextClick = false;

  card.addEventListener("touchstart", e => {
    if (e.target.closest(".card-btn")) return;
    if (!touchActivated) {
      e.preventDefault();
      suppressNextClick = true;
      touchActivated = true;
      card.classList.add("touch-active");
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

  // --- Click handler: desktop click or second touch tap ---
  card.addEventListener("click", e => {
    e.preventDefault();
    if (suppressNextClick) {
      suppressNextClick = false;
      return;
    }
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
    // Unsupported type — do nothing
  });

  // --- Thumbnail ---
  const img = document.createElement("img");
  img.className = "file-thumbnail";
  const lower = file.fileName.toLowerCase();

  if (isImageFile(file.fileName)) {
    img.src = file.fileURL;
    card.appendChild(img);
  } else if (lower.endsWith(".stl")) {
    // Wrap in a div so we can show a spinner while generating
    const thumbWrap = document.createElement("div");
    thumbWrap.className = "thumb-wrap thumb-loading";
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    thumbWrap.appendChild(img);
    card.appendChild(thumbWrap);
    requestAnimationFrame(() => generateSTLThumbnail(file.fileURL, img, thumbWrap));
  } else if (lower.endsWith(".mp4") || lower.endsWith(".mov")) {
    const thumbWrap = document.createElement("div");
    thumbWrap.className = "thumb-wrap thumb-loading";
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    thumbWrap.appendChild(img);
    card.appendChild(thumbWrap);
    requestAnimationFrame(() => generateVideoThumbnail(file.fileURL, img, thumbWrap));
  } else {
    img.src = getThumbnailForFile(file.fileName);
    card.appendChild(img);
  }

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

      // Isometric-style angle: elevated and rotated 45° for depth
      camera.position.set(size * 1.1, size * 0.9, size * 1.1);
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

/* ===============================
   STL THUMBNAIL GENERATOR
================================ */

function generateSTLThumbnail(url, imgElement, wrapper) {
  if (!window.THREE || !THREE.STLLoader) return;

  // Offscreen canvas — small size is fine for a thumbnail
  const W = 400, H = 260;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setSize(W, H);
  renderer.setPixelRatio(1);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a2e);

  const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 5000);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
  keyLight.position.set(1, 1.5, 1);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0x8888ff, 0.3);
  fillLight.position.set(-1, -0.5, -1);
  scene.add(fillLight);

  const loader = new THREE.STLLoader();
  loader.load(
    url,
    geometry => {
      geometry.center();
      geometry.computeBoundingBox();
      const size = geometry.boundingBox.getSize(new THREE.Vector3()).length();

      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({
          color: 0x88aacc,
          metalness: 0.2,
          roughness: 0.55
        })
      );
      scene.add(mesh);

      // Isometric angle matching the viewer
      camera.position.set(size * 1.1, size * 0.9, size * 1.1);
      camera.lookAt(0, 0, 0);

      // Render a single frame and capture it
      renderer.render(scene, camera);
      const dataURL = canvas.toDataURL("image/png");
      imgElement.src = dataURL;
      if (wrapper) wrapper.classList.remove("thumb-loading");

      // Clean up
      renderer.dispose();
      geometry.dispose();
    },
    undefined,
    err => {
      console.warn("STL thumbnail failed:", err);
      imgElement.src = "../images/stl-icon.webp";
      if (wrapper) wrapper.classList.remove("thumb-loading");
      renderer.dispose();
    }
  );
}

/* ===============================
   VIDEO THUMBNAIL GENERATOR
================================ */

function generateVideoThumbnail(url, imgElement, wrapper) {
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "metadata";

  let done = false;

  const onError = () => {
    if (done) return; // ignore errors after successful capture
    console.warn("Video thumbnail failed to load:", url);
    imgElement.src = "../images/mp4-icon.webp";
    if (wrapper) wrapper.classList.remove("thumb-loading");
  };

  video.addEventListener("loadedmetadata", () => {
    video.currentTime = Math.min(Math.max(video.duration * 0.1, 1), video.duration - 0.1);
  });

  video.addEventListener("seeked", () => {
    if (done) return; // guard against double-fire
    done = true;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 260;
      const ctx = canvas.getContext("2d");

      const vRatio = video.videoWidth / video.videoHeight;
      const cRatio = canvas.width / canvas.height;
      let drawW, drawH, drawX, drawY;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (vRatio > cRatio) {
        drawW = canvas.width;
        drawH = canvas.width / vRatio;
        drawX = 0;
        drawY = (canvas.height - drawH) / 2;
      } else {
        drawH = canvas.height;
        drawW = canvas.height * vRatio;
        drawX = (canvas.width - drawW) / 2;
        drawY = 0;
      }

      ctx.drawImage(video, drawX, drawY, drawW, drawH);

      // Play button overlay
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 10, canvas.height / 2 - 14);
      ctx.lineTo(canvas.width / 2 + 18, canvas.height / 2);
      ctx.lineTo(canvas.width / 2 - 10, canvas.height / 2 + 14);
      ctx.closePath();
      ctx.fill();

      const dataURL = canvas.toDataURL("image/jpeg", 0.85);
      imgElement.src = dataURL;
    } catch (err) {
      console.warn("Video thumbnail canvas capture failed:", err);
      imgElement.src = "../images/mp4-icon.webp";
    }

    if (wrapper) wrapper.classList.remove("thumb-loading");

    // Clear src AFTER marking done — prevents the error handler from firing
    video.removeEventListener("error", onError);
    video.src = "";
  });

  video.addEventListener("error", onError);

  video.src = url;
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

  // === Tablet layout ===
  const TABLET_BP_MIN = 768;
  const TABLET_BP_MAX = 1199;
  function applyTabletLayout() {
    if (window.innerWidth >= TABLET_BP_MIN && window.innerWidth <= TABLET_BP_MAX) {
      document.body.classList.add("tablet-layout");
    } else {
      document.body.classList.remove("tablet-layout");
    }
  }
  applyTabletLayout();
  window.addEventListener("resize", applyTabletLayout);
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
