// js/journal.js
document.addEventListener('DOMContentLoaded', () => {
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

    async function loadPosts() {
        try {
            const response = await fetch('data/journal/posts.json');
            const posts = await response.json();
            const postsContainer = document.getElementById('posts');
            const postList = document.getElementById('postList');

            for (let index = 0; index < posts.length; index++) {
                const post = posts[index];
                const markdownText = await fetchMarkdown(post);

                const div = document.createElement('div');
                div.className = 'post';
                div.id = `post-${index}`;

                let content = `<h2>${post.title}</h2>`;
                if (post.image) {
                    content += `<img src="${post.image}" alt="${post.title}">`;
                }
                content += `<div>${marked.parse(markdownText)}</div>`;
                div.innerHTML = content;
                postsContainer.appendChild(div);

                const li = document.createElement('li');
                li.innerHTML = `<a href="#post-${index}">${index + 1}. ${post.title}</a>`;
                postList.appendChild(li);
            }
        } catch (err) {
            console.error('Failed to load posts:', err);
        }
    }

    loadPosts();
});