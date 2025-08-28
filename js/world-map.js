// js/world-map.js
document.addEventListener('DOMContentLoaded', () => {
    const map = document.getElementById('worldMap');
    const container = document.getElementById('mapContainer');

    if (!map || !container) return;

    let scale = 1;
    let posX = 0;
    let posY = 0;
    let dragging = false;
    let startX, startY;

    function updateTransform() {
        map.style.transform = `translate(calc(-50% + ${posX}px), calc(-50% + ${posY}px)) scale(${scale})`;
    }

    function clampPosition() {
        const rect = container.getBoundingClientRect();
        const mapWidth = map.offsetWidth * scale;
        const mapHeight = map.offsetHeight * scale;

        const maxX = (mapWidth - rect.width) / 2;
        const maxY = (mapHeight - rect.height) / 2;

        posX = Math.max(-maxX, Math.min(maxX, posX));
        posY = Math.max(-maxY, Math.min(maxY, posY));
    }

    container.addEventListener('wheel', e => {
        e.preventDefault();
        const zoomIntensity = 0.1;
        const oldScale = scale;
        scale = e.deltaY < 0 ? Math.min(scale + zoomIntensity, 3) : Math.max(scale - zoomIntensity, 1);

        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const worldX = (mouseX - rect.width / 2 - posX) / oldScale;
        const worldY = (mouseY - rect.height / 2 - posY) / oldScale;

        posX = mouseX - rect.width / 2 - worldX * scale;
        posY = mouseY - rect.height / 2 - worldY * scale;

        clampPosition();
        updateTransform();
    });

    container.addEventListener('mousedown', e => {
        dragging = true;
        startX = e.clientX - posX;
        startY = e.clientY - posY;
        container.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', e => {
        if (!dragging) return;
        posX = e.clientX - startX;
        posY = e.clientY - startY;
        clampPosition();
        updateTransform();
    });

    window.addEventListener('mouseup', () => {
        dragging = false;
        container.style.cursor = 'grab';
    });

    container.addEventListener('dblclick', () => {
        scale = 1;
        posX = 0;
        posY = 0;
        updateTransform();
    });

    updateTransform();
});
