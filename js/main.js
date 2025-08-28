// js/main.js
let scenes = {};
let currentConversation = [];
let currentLine = 0;
let typingTimeout = null;

const sceneImg = document.getElementById("scene");
const hotspotContainer = document.getElementById("hotspots");

const dialogueBox = document.getElementById("dialogueBox");
const dialogueText = document.getElementById("dialogueText");
const closeDialogue = document.getElementById("closeDialogue");

async function loadScenes() {
  const response = await fetch("data/scenes.json");
  scenes = await response.json();
  console.log("Scenes loaded:", scenes);
  loadScene("street");
}

function loadScene(name) {
  const scene = scenes[name];
  if (!scene) return;

  const fadeOverlay = document.getElementById('fadeOverlay');
  const loadingScreen = document.getElementById('loadingScreen');

  fadeOverlay.style.opacity = '1';
  loadingScreen.style.display = 'flex';

  setTimeout(() => {
    const img = new Image();
    img.src = scene.image;
    img.onload = () => {
      sceneImg.src = scene.image;

      hotspotContainer.innerHTML = "";
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

      setTimeout(() => {
        fadeOverlay.style.opacity = '0';
        loadingScreen.style.display = 'none';

        if (scene.conversation) {
          startConversation(scene.conversation);
        } else {
          hideDialogue();
        }
      }, 100);
    };
  }, 100);
}

function typeText(text, speed = 40, callback = null) {
  dialogueText.textContent = "";
  let index = 0;

  function typeNext() {
    if (index < text.length) {
      dialogueText.textContent += text.charAt(index++);
      typingTimeout = setTimeout(typeNext, speed);
    } else if (callback) {
      typingTimeout = setTimeout(callback, 2000);
    }
  }
  typeNext();
}

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
  typeText(line, 40, typeNextLine);
}

function hideDialogue() {
  dialogueBox.classList.add("hidden");
  dialogueText.textContent = "";
  clearTimeout(typingTimeout);
}

if (dialogueBox) {
    dialogueBox.addEventListener("click", () => {
      typeNextLine();
    });
}

if (closeDialogue) {
    closeDialogue.addEventListener("click", (event) => {
      event.stopPropagation();
      hideDialogue();
    });
}

window.addEventListener("DOMContentLoaded", loadScenes);
