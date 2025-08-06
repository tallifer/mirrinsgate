let scenes = {};
let currentConversation = [];
let currentLine = 0;
let typingTimeout = null;

const sceneImg = document.getElementById("scene");
const hotspotContainer = document.getElementById("hotspots");

const dialogueBox = document.getElementById("dialogueBox");
const dialogueText = document.getElementById("dialogueText");
const closeDialogue = document.getElementById("closeDialogue");

// Load scenes from JSON
async function loadScenes() {
  const response = await fetch("data/scenes.json");
  scenes = await response.json();
  console.log("Scenes loaded:", scenes);
  loadScene("street");
}

// Load a scene and setup hotspots
function loadScene(name) {
  const scene = scenes[name];
  if (!scene) return;

  sceneImg.src = scene.image;

  // Clear old hotspots
  hotspotContainer.innerHTML = "";

  // Add new hotspots
  scene.hotspots.forEach(h => {
    const div = document.createElement("div");
    div.className = "hotspot";
    div.dataset.label = h.label;
    div.style.left = h.x + "px";
    div.style.top = h.y + "px";
    div.style.width = h.w + "px";
    div.style.height = h.h + "px";
    div.onclick = () => loadScene(h.target);
    hotspotContainer.appendChild(div);
  });

  // Start conversation if exists
  if (scene.conversation && scene.conversation.length > 0) {
    startConversation(scene.conversation);
  } else {
    hideDialogue();
  }
}

// Typing effect with auto-advance after 2 seconds
function typeText(text, speed = 20, callback = null) {
  dialogueText.textContent = "";
  let index = 0;

  function typeNext() {
    if (index < text.length) {
      dialogueText.textContent += text.charAt(index++);
      typingTimeout = setTimeout(typeNext, speed);
    } else if (callback) {
      typingTimeout = setTimeout(callback, 2000); // auto-advance
    }
  }

  typeNext();
}

// Conversation handling
function startConversation(lines) {
  currentConversation = lines;
  currentLine = 0;
  dialogueBox.classList.remove("hidden");
  typeNextLine();
}

function typeNextLine() {
  clearTimeout(typingTimeout);

  if (currentLine >= currentConversation.length) {
    hideDialogue();
    return;
  }

  const line = currentConversation[currentLine++];
  typeText(line, 20, typeNextLine);
}

function hideDialogue() {
  dialogueBox.classList.add("hidden");
  dialogueText.textContent = "";
  clearTimeout(typingTimeout);
}

// Click to advance dialogue manually
dialogueBox.addEventListener("click", () => {
  typeNextLine();
});

// Close dialogue manually
closeDialogue.addEventListener("click", (event) => {
  event.stopPropagation();
  hideDialogue();
});

// Initialize
window.addEventListener("DOMContentLoaded", loadScenes);
