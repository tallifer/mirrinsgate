// js/journal.js
document.addEventListener('DOMContentLoaded', () => {

    // Simple image preloader
    function preloadImages(urls, callback) {
        let loadedCount = 0;
        const totalImages = urls.length;
        if (totalImages === 0) {
            callback();
            return;
        }
        urls.forEach(url => {
            const img = new Image();
            img.src = url;
            img.onload = img.onerror = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    callback();
                }
            };
        });
    }

    async function fetchMarkdown(post) {
        if (post.markdown) {
            return Array.isArray(post.markdown) ?
                post.markdown.join("\n\n") :
                post.markdown;
        }
        if (post.markdownFile) {
            const res = await fetch(post.markdownFile);
            if (!res.ok) throw new Error(`Failed to fetch ${post.markdownFile}`);
            return await res.text();
        }
        return "*No content available*";
    }

    async function loadJournal() {
        try {
            const response = await fetch('data/journal/posts.json');
            const posts = await response.json();

            // 1. Preload all images before doing anything else
            const imageUrls = posts.map(p => p.image).filter(Boolean);
            preloadImages(imageUrls, () => {
                // 2. Once images are loaded, build the page
                buildPage(posts);
            });

        } catch (err) {
            console.error('Failed to load journal posts:', err);
            document.getElementById('content').innerHTML = '<p>Could not load journal entries.</p>';
        }
    }

    function buildPage(posts) {
        const postsContainer = document.getElementById('posts');
        const sidebarList = document.getElementById('sidebarList');
        postsContainer.innerHTML = ''; // Clear existing
        sidebarList.innerHTML = ''; // Clear existing

        const chapters = {};

        // Group posts by chapter
        posts.forEach((post, index) => {
            const chapterName = post.chapter || "Uncategorized";
            if (!chapters[chapterName]) {
                chapters[chapterName] = [];
            }
            chapters[chapterName].push({ ...post, originalIndex: index });
        });

        // Build sidebar and content
        for (const chapterName in chapters) {
            // Create sidebar elements
            const chapterContainer = document.createElement('li');
            const chapterTitle = document.createElement('h3');
            chapterTitle.className = 'chapter-toggle';
            chapterTitle.textContent = chapterName;
            const postList = document.createElement('ul');
            postList.className = 'post-list';

            chapterContainer.appendChild(chapterTitle);
            chapterContainer.appendChild(postList);
            sidebarList.appendChild(chapterContainer);

            // Add posts for this chapter
            chapters[chapterName].forEach(post => {
                const postID = `post-${post.originalIndex}`;

                // Create sidebar link
                const li = document.createElement('li');
                li.innerHTML = `<a href="#${postID}">${post.title}</a>`;
                postList.appendChild(li);

                // Create main content post
                const div = document.createElement('div');
                div.className = 'post';
                div.id = postID;
                fetchMarkdown(post).then(markdownText => {
                    let content = `<h2>${post.title}</h2>`;
                    if (post.image) {
                        content += `<img src="${post.image}" alt="${post.title}">`;
                    }
                    content += `<div>${marked.parse(markdownText)}</div>`;
                    div.innerHTML = content;
                    postsContainer.appendChild(div);
                });
            });

            // Add toggle functionality
            chapterTitle.addEventListener('click', () => {
                chapterContainer.classList.toggle('open');
            });
        }
    }

    loadJournal();
});
