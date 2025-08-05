// Scenes and hotspots with optional conversations
const scenes = {
  street: {
    image: "images/street.png",
    hotspots: [
      { x: 120, y: 100, w: 50, h: 50, target: "helgensHut", label: "Helgen's Hut" },
      { x: 490, y: 200, w: 150, h: 100, target: "tavern", label: "Mirin's Gate Tavern" }
    ]
  },
  helgensHut: {
    image:  "images/HelgensHut.png",
    hotspots: [
      { x: 100, y: 0, w: 150, h: 500, target: "street", label: "Back to town" }
    ],
    conversation: [
      "Ah… a visitor. Few seek the Wild Man now.",
      "I was once a soldier of Mirin’s Gate, hunting beasts in the deep woods… until the woods claimed me instead.",
      "The druids taught me the Balance, the old ways. I walked as one of them, until darkness crept into the grove.",
      "I fled as it withered. I returned here… older, but not as old as I should be.",
      "Now I heal, I guide, I watch. They call me Greenfather… the Last Leaf.",
      "The forest still whispers to me. Something stirs there again… and when it calls, I will answer."
    ]
  },
  tavern: {
    image: "images/Tavern.png",
    hotspots: [
      { x: 700, y: 500, w: 80, h: 80, target: "street", label: "Back to street" }
    ],
    conversation: [
      "The tavern is lively tonight."
    ]
  }
};

const sceneImg = document.getElementById("scene");
const hotspotContainer = document.getElementById("hotspots");

// Dialogue elements
const dialogueBox = document.getElementById("dialogueBox");
const dialogueText = document.getElementById("dialogueText");
const closeDialogue = document.getElementById("closeDialogue");

let typingTimeout = null;
let currentConversation = [];
let currentLine = 0;

// Load a scene and setup hotspots
function loadScene(name) {
  const scene = scenes[name];
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
      typingTimeout = setTimeout(callback, 2000); // auto-advance after 2 seconds
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
  typeText(line, 20, typeNextLine); // callback auto-advances
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
loadScene("street");
