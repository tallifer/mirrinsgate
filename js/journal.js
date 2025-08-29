document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
  });
  
  async function fetchMarkdown(post) {
    if (post.markdownFile) {
      try {
        const res = await fetch(post.markdownFile);
        if (!res.ok) throw new Error(`Failed to fetch ${post.markdownFile}`);
        return await res.text();
      } catch (err) {
        console.error(err);
        return "*Failed to load content.*";
      }
    }
    return post.markdown || "*No content available*";
  }
  
  async function loadPosts() {
    try {
      const response = await fetch('data/journal/posts.json');
      const posts = await response.json();
  
      const imagesToPreload = posts.map(post => post.image).filter(Boolean);
      preloadImages(imagesToPreload);
  
      buildPosts(posts);
      buildNavigation(posts);
      setupMobileMenu();
  
    } catch (err) {
      console.error('Failed to load or build journal:', err);
      document.getElementById('posts-container').innerHTML = '<p>Error loading journal entries.</p>';
    }
  }
  
  function buildPosts(posts) {
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) return;
  
    // Create and append all post containers first to maintain order
    posts.forEach((post, index) => {
      const postElement = document.createElement('div');
      postElement.className = 'post';
      postElement.id = `post-${index}`;
      postElement.innerHTML = `<h2>${post.title}</h2><div class="post-content-wrapper"><p>Loading...</p></div>`;
      postsContainer.appendChild(postElement);
    });
  
    // Fetch and fill content asynchronously
    posts.forEach(async (post, index) => {
      const markdownText = await fetchMarkdown(post);
      const postElement = document.getElementById(`post-${index}`);
      const contentWrapper = postElement.querySelector('.post-content-wrapper');
  
      let contentHTML = '';
      if (post.image) {
        contentHTML += `<img src="${post.image}" alt="${post.title}">`;
      }
      contentHTML += marked.parse(markdownText);
      contentWrapper.innerHTML = contentHTML;
    });
  }
  
  function buildNavigation(posts) {
      const sidebarNav = document.getElementById('sidebar-nav-content');
      const mobileNav = document.getElementById('mobile-nav-content');
      
      // Group posts by chapter
      const chapters = posts.reduce((acc, post) => {
          const { chapter } = post;
          if (!acc[chapter]) {
              acc[chapter] = [];
          }
          acc[chapter].push(post);
          return acc;
      }, {});
  
      // Get an ordered list of chapters
      const orderedChapters = Object.keys(chapters);
  
      const navHTML = orderedChapters.map(chapter => {
          const postLinks = chapters[chapter].map(post => {
              const postIndex = posts.indexOf(post);
              return `<li><a href="#post-${postIndex}" class="post-link">${post.title}</a></li>`;
          }).join('');
  
          return `
              <div>
                  <div class="chapter-toggle">${chapter}</div>
                  <ul class="post-list">${postLinks}</ul>
              </div>
          `;
      }).join('');
  
      sidebarNav.innerHTML = navHTML;
      mobileNav.innerHTML = navHTML;
  
      // Add event listeners to all toggles (both sidebar and mobile)
      document.querySelectorAll('.chapter-toggle').forEach(toggle => {
          toggle.addEventListener('click', () => {
              toggle.classList.toggle('open');
              const postList = toggle.nextElementSibling;
              if (postList) {
                  postList.classList.toggle('open');
              }
          });
      });
  }
  
  function setupMobileMenu() {
      const overlay = document.getElementById('mobile-nav-overlay');
      const openButton = document.getElementById('mobileMenuButton');
      const closeButton = document.getElementById('close-nav-button');
  
      // Use event delegation for the open button as it's loaded dynamically
      document.body.addEventListener('click', (event) => {
          if (event.target.closest('#mobileMenuButton')) {
              overlay.classList.add('visible');
          }
      });
      
      if (closeButton) {
          closeButton.addEventListener('click', () => {
              overlay.classList.remove('visible');
          });
      }
  
      // Close menu when a post link is clicked
      overlay.addEventListener('click', (event) => {
          if (event.target.classList.contains('post-link')) {
              overlay.classList.remove('visible');
          }
      });
  }
  
  
  function preloadImages(images) {
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }
  