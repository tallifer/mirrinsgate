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

            const imageUrls = posts.map(p => p.image).filter(Boolean);
            preloadImages(imageUrls, () => {
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
        postsContainer.innerHTML = '';
        sidebarList.innerHTML = '';

        const chapters = {};

        const chapterOrder = [...new Set(posts.map(p => p.chapter || "Uncategorized"))];

        posts.forEach((post, index) => {
            const chapterName = post.chapter || "Uncategorized";
            if (!chapters[chapterName]) {
                chapters[chapterName] = [];
            }
            chapters[chapterName].push({ ...post, originalIndex: index });
        });

        chapterOrder.forEach(chapterName => {
            
            const chapterContainer = document.createElement('li');
            chapterContainer.className = 'chapter-container';
            const chapterTitle = document.createElement('h3');
            chapterTitle.className = 'chapter-toggle';
            chapterTitle.textContent = chapterName;
            const postList = document.createElement('ul');
            postList.className = 'post-list';

            chapterContainer.appendChild(chapterTitle);
            chapterContainer.appendChild(postList);
            sidebarList.appendChild(chapterContainer);

            chapters[chapterName].forEach(post => {
                const postID = `post-${post.originalIndex}`;

                const li = document.createElement('li');
                li.innerHTML = `<a href="#${postID}">${post.title}</a>`;
                postList.appendChild(li);

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

            chapterTitle.addEventListener('click', () => {
                chapterContainer.classList.toggle('open');
            });
        });
    }

    loadJournal();
});
