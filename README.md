# Welcome traveler to Mirrin's Gate!

This document will get you up to speed on how the project is organised and how you can start adding your own content.

## Directory Structure
The project is organized to keep things clean and predictable. Here’s a map of the key areas:

/mirrins-gate/
|
|-- assets/             # All visual and audio assets
|   |-- css/            # Stylesheets (site appearance)
|   |-- images/         # Game images (backgrounds, scenes, icons)
|   `-- audio/          # Music and sound effects (not yet used)
|
|-- data/               # All game content lives here
|   |-- journal/        # Everything for the journal page
|   |   |-- images/     # Images for journal entries
|   |   |-- posts/      # The text content (.md files) for entries
|   |   `-- posts.json  # The list of all journal entries
|   |
|   `-- scenes.json     # Defines all scenes in the town
|
|-- js/                 # JavaScript files that make the game run
|   |-- main.js         # Core logic for the town scene
|   |-- journal.js      # Logic for the journal page
|   |-- world-map.js.   # Logic for the map (panning, zoom etc.)
|   `-- loader.js       # Used to hide image pop in
|
|-- *.html              # The main pages of the site (index.html, town.html, etc.)
`-- Readme.md           # This file!


## How to Add a New Journal Entry
Adding a new journal entry is a three-step process that involves adding the image, writing the content, and listing it in the main journal file.

### Step 1: Add the Journal Image
Place the image for your journal entry into the data/journal/images/ folder. (e.g., data/journal/images/AncientAmulet.webp).

### Step 2: Write the Journal Content
Create a new Markdown file (.md) inside the data/journal/posts/ folder. The name should be simple and descriptive (e.g., AncientAmulet.md).

Write your journal entry in this file using Markdown for formatting (e.g., # for titles, * for italics).

### Step 3: Add the Entry to posts.json
Open the data/journal/posts.json file. This is an array that lists all the journal entries.

Add a new object to the array for your new entry. This object needs three things:

"title": The title of your journal entry.

"image": The path to the image you added in Step 1.

"markdownFile": The path to the .md file you created in Step 2.

Example:

```json
// In data/journal/posts.json

[
  {
    "title": "The Journey Begins",
    "image": "data/journal/images/TheJourneyBegins.webp",
    "markdownFile": "data/journal/posts/TheJourneyBegins.md"
  },
  // ... other entries ...

  // Our NEW journal entry
  {
    "title": "The Ancient Amulet",
    "image": "data/journal/images/AncientAmulet.webp",
    "markdownFile": "data/journal/posts/AncientAmulet.md"
  }
]

The journal page will automatically pick up the new entry and display it.

## How to Add a New Scene to the Town
Adding a new explorable area to the town (like a shop, a house, or a hidden alley) is a two-step process.

### Step 1: Add the Scene's Image
Get the image you want to use for the new scene. Make sure it's a .webp file for better performance.

Place the image inside the assets/images/ folder. For example, let's say you add assets/images/AlchemistsShop.webp.

### Step 2: Define the Scene in data/scenes.json
Now, open the data/scenes.json file. This is where the magic happens. You'll add a new entry for your scene.

Create the Scene Definition: Add a new key-value pair to the JSON object. The key is a unique name for your scene (e.g., "alchemistShop"), and the value is an object containing the scene's details.

Link the Image: Set the "image" property to the path of the image you added in Step 1.

(Optional) Add Dialogue: If you want text to appear when the player enters, add a "conversation" array with the lines of dialogue.

Add Hotspots: To allow the player to move, you need hotspots. The most important one is a "back" hotspot to return to the previous scene. A hotspot needs coordinates (x, y), dimensions (w, h), a label that shows on hover, and a "target" that matches the key of the scene it links to.

Example:

Let's say we want to add an Alchemist's Shop that you can enter from the main street.

```json
// In data/scenes.json

{
  "street": {
    "image": "assets/images/street.webp",
    "hotspots": [
      { "x": 100, "y": 250, "w": 150, "h": 200, "label": "Enter Tavern", "target": "tavern" },
      { "x": 650, "y": 280, "w": 120, "h": 180, "label": "Visit Helgen's Hut", "target": "helgensHut" },
      // Add a new hotspot on the street to link to our new shop
      { "x": 400, "y": 300, "w": 100, "h": 150, "label": "Enter Alchemist's Shop", "target": "alchemistShop" }
    ]
  },
  "tavern": { "...": "..." },
  "helgensHut": { "...": "..." },

  // Our NEW scene definition
  "alchemistShop": {
    "image": "assets/images/AlchemistsShop.webp",
    "conversation": [
      "The air is thick with the smell of strange herbs.",
      "Glass vials bubble on a nearby table."
    ],
    "hotspots": [
      { "x": 10, "y": 10, "w": 100, "h": 580, "label": "Back to Street", "target": "street" }
    ]
  }
}

That's it! The game will automatically handle the rest.

That's all you need to know to start expanding the world. Have fun creating!