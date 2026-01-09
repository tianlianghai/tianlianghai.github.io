// Blog System
const BLOG_CONFIG = {
    SUPABASE_URL: 'https://nleaipaprfwasggupjiv.supabase.co',
    SUPABASE_ANON_KEY: 'sb_publishable_Szkx42x9ynwWv14IGWEUCg_fNJTb1_L',
    ADMIN_EMAIL: 'tianlianghai@foxmail.com'
};

const supabaseClient = window.supabase && !BLOG_CONFIG.SUPABASE_URL.includes('YOUR_')
    ? window.supabase.createClient(BLOG_CONFIG.SUPABASE_URL, BLOG_CONFIG.SUPABASE_ANON_KEY)
    : null;

class BlogManager {
    constructor() {
        this.blogs = [];
        this.currentBlog = null;
        this.isAdmin = false;
        this.user = null;
        this.supabase = supabaseClient;
        this.useLocalStorage = !this.supabase;
        this.init();
    }

    async init() {
        await this.loadBlogs();
        this.setupEventListeners();
        this.renderBlogList();
        await this.checkAdminStatus();
        this.setupAuthListener();
        this.openSidebarByDefault();
    }

    async checkAdminStatus() {
        if (this.useLocalStorage) {
            const adminToken = localStorage.getItem('blogAdminToken');
            this.isAdmin = adminToken === 'tianlianghai-blog-admin-2026';
            return;
        }

        const { data, error } = await this.supabase.auth.getUser();
        if (error) {
            console.log('Supabase auth error:', error);
        }
        this.user = data?.user || null;
        this.isAdmin = !!this.user && this.user.email === BLOG_CONFIG.ADMIN_EMAIL;
    }

    setupAuthListener() {
        if (this.useLocalStorage) return;
        this.supabase.auth.onAuthStateChange((_event, session) => {
            this.user = session?.user || null;
            this.isAdmin = !!this.user && this.user.email === BLOG_CONFIG.ADMIN_EMAIL;
            this.updateAdminUi();
        });
    }

    updateAdminUi() {
        const editBtn = document.getElementById('editBlogBtn');
        const deleteBtn = document.getElementById('deleteBlogBtn');
        if (editBtn && deleteBtn) {
            if (this.isAdmin) {
                editBtn.style.display = 'inline-flex';
                deleteBtn.style.display = 'inline-flex';
            } else {
                editBtn.style.display = 'none';
                deleteBtn.style.display = 'none';
            }
        }
    }

    setupEventListeners() {
        // Sidebar toggle
        const toggleBtn = document.getElementById('blogSidebarToggle');
        const sidebar = document.getElementById('blogSidebar');
        const closeBtn = document.getElementById('blogSidebarClose');
        const mainContent = document.getElementById('mainContent');

        toggleBtn.addEventListener('click', () => {
            sidebar.classList.add('active');
            mainContent.classList.add('shifted');
        });

        closeBtn.addEventListener('click', () => {
            sidebar.classList.remove('active');
            mainContent.classList.remove('shifted');
        });

        // New blog button
        const newBlogBtn = document.getElementById('newBlogBtn');
        if (newBlogBtn) {
            newBlogBtn.addEventListener('click', () => {
                if (this.isAdmin) {
                    this.showBlogModal();
                } else {
                    this.showAdminLogin();
                }
            });
        }

        // Blog home button
        const blogHomeBtn = document.getElementById('blogHomeBtn');
        if (blogHomeBtn) {
            blogHomeBtn.addEventListener('click', () => {
                this.showBlogHome();
            });
        }

        // Modal controls
        const modal = document.getElementById('blogModal');
        const modalClose = document.getElementById('modalClose');
        const cancelBtn = document.getElementById('cancelBtn');
        const blogForm = document.getElementById('blogForm');

        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        cancelBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        blogForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveBlog();
        });

        // Blog content display controls
        const backToHome = document.getElementById('backToHome');
        const editBlogBtn = document.getElementById('editBlogBtn');
        const deleteBlogBtn = document.getElementById('deleteBlogBtn');

        if (backToHome) {
            backToHome.addEventListener('click', () => {
                this.hideBlogContent();
            });
        }

        if (editBlogBtn) {
            editBlogBtn.addEventListener('click', () => {
                this.editCurrentBlog();
            });
        }

        if (deleteBlogBtn) {
            deleteBlogBtn.addEventListener('click', () => {
                this.deleteCurrentBlog();
            });
        }

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    async loadBlogs() {
        if (this.useLocalStorage) {
            const storedBlogs = localStorage.getItem('blogs');
            if (storedBlogs) {
                this.blogs = JSON.parse(storedBlogs);
            } else {
                await this.loadInitialBlogs();
            }
            return;
        }

        const { data, error } = await this.supabase
            .from('blogs')
            .select('*');

        if (error) {
            console.log('Error loading blogs:', error);
            return;
        }

        this.blogs = (data || []).map(blog => ({
            ...blog,
            tags: Array.isArray(blog.tags) ? blog.tags : []
        }));
    }

    async loadInitialBlogs() {
        // For static GitHub Pages, we'll hardcode the initial blogs
        // In a real implementation, you might use GitHub API or generate this dynamically
        this.blogs = [
            {
                id: '2026-01-10-welcome-to-my-blog',
                title: 'My First Blog Post',
                date: '2026-01-10',
                content: '# Welcome to My Blog\n\nThis is my first blog post on my GitHub Pages site. I\'m excited to share my thoughts and experiences about computer vision, deep learning, and technology.\n\n## Why I Started This Blog\n\nI wanted to create a space where I could:\n- Share my research findings\n- Document my learning journey\n- Connect with other researchers and developers\n- Showcase my projects and achievements\n\n## What to Expect\n\nIn this blog, you\'ll find posts about:\n- Computer vision research\n- Deep learning tutorials\n- Project updates\n- Industry insights\n\nStay tuned for more content!',
                tags: ['introduction', 'blog', 'computer-vision'],
                author: 'Tian Lianghai'
            },
            {
                id: '2026-01-08-understanding-optical-flow',
                title: 'Understanding Optical Flow in Computer Vision',
                date: '2026-01-08',
                content: '# Understanding Optical Flow in Computer Vision\n\nOptical flow is one of the fundamental concepts in computer vision that deals with the motion of objects between consecutive frames in a video sequence.\n\n## What is Optical Flow?\n\nOptical flow is the pattern of apparent motion of objects between two consecutive frames caused by the movement of object or camera. It\'s a 2D vector field where each vector is a displacement vector showing the movement of points from first frame to second.\n\n## Applications\n\n- **Video Compression**: Motion estimation for efficient encoding\n- **Object Tracking**: Following objects across frames\n- **Autonomous Driving**: Understanding motion patterns\n- **Medical Imaging**: Analyzing blood flow and organ movement\n\n## Key Algorithms\n\n### Lucas-Kanade Method\n- Assumes constant flow within a small neighborhood\n- Works well for small displacements\n- Computationally efficient\n\n### Horn-Schunck Method\n- Global optimization approach\n- Adds smoothness constraint\n- Handles larger displacements better\n\n## Recent Advances\n\nWith the advent of deep learning, optical flow estimation has seen significant improvements:\n\n- **FlowNet**: First end-to-end deep learning approach\n- **PWC-Net**: Pyramid warping and cost volume\n- **RAFT**: Recurrent all-pairs field transforms\n- **FlowDiffuser**: My recent work using diffusion models\n\n## Challenges\n\n1. **Occlusions**: Handling areas that become visible or hidden\n2. **Large Displacements**: Tracking fast-moving objects\n3. **Textureless Regions**: Estimating flow in uniform areas\n4. **Real-time Requirements**: Balancing accuracy and speed\n\n## Future Directions\n\nThe field is moving towards:\n- Self-supervised learning approaches\n- Real-time performance on edge devices\n- Integration with 3D reconstruction\n- Multi-modal optical flow\n\nOptical flow continues to be an active area of research with many exciting developments on the horizon.',
                tags: ['optical-flow', 'computer-vision', 'research', 'deep-learning'],
                author: 'Tian Lianghai'
            }
        ];
        this.saveBlogs();
    }

    saveBlogs() {
        if (this.useLocalStorage) {
            localStorage.setItem('blogs', JSON.stringify(this.blogs));
        }
    }

    renderBlogList() {
        const blogList = document.getElementById('blogList');
        if (!blogList) return;

        // Sort blogs by date (newest first)
        const sortedBlogs = [...this.blogs].sort((a, b) => new Date(b.date) - new Date(a.date));

        blogList.innerHTML = sortedBlogs.map(blog => `
            <div class="blog-item" data-blog-id="${blog.id}">
                <div class="blog-item-title">${blog.title}</div>
                <div class="blog-item-date">${this.formatDate(blog.date)}</div>
                <div class="blog-item-tags">
                    ${blog.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `).join('');

        // Add click listeners to blog items
        blogList.querySelectorAll('.blog-item').forEach(item => {
            item.addEventListener('click', () => {
                const blogId = item.dataset.blogId;
                this.viewBlog(blogId);
            });
        });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    viewBlog(blogId) {
        const blog = this.blogs.find(b => b.id === blogId);
        if (!blog) return;

        this.currentBlog = blog;
        this.displayBlogContent(blog);
    }

    displayBlogContent(blog) {
        const blogContentDisplay = document.getElementById('blogContentDisplay');
        const blogArticle = document.getElementById('blogArticle');
        const editBtn = document.getElementById('editBlogBtn');
        const deleteBtn = document.getElementById('deleteBlogBtn');

        if (!blogContentDisplay || !blogArticle) return;

        // Convert markdown to HTML
        const htmlContent = marked.parse(blog.content);

        blogArticle.innerHTML = `
            <h1>${blog.title}</h1>
            <div class="blog-meta">
                <p><strong>By:</strong> ${blog.author}</p>
                <p><strong>Date:</strong> ${this.formatDate(blog.date)}</p>
                <div class="blog-tags">
                    ${blog.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="blog-content">
                ${htmlContent}
            </div>
        `;

        this.updateAdminUi();

        blogContentDisplay.style.display = 'block';
    }

    hideBlogContent() {
        const blogContentDisplay = document.getElementById('blogContentDisplay');
        if (blogContentDisplay) {
            blogContentDisplay.style.display = 'none';
        }
        this.currentBlog = null;
    }

    showBlogHome() {
        this.hideBlogContent();
        // Close sidebar and show main content
        const sidebar = document.getElementById('blogSidebar');
        const mainContent = document.getElementById('mainContent');
        if (sidebar) sidebar.classList.remove('active');
        if (mainContent) mainContent.classList.remove('shifted');
    }

    openSidebarByDefault() {
        const sidebar = document.getElementById('blogSidebar');
        const mainContent = document.getElementById('mainContent');
        if (sidebar) sidebar.classList.add('active');
        if (mainContent) mainContent.classList.add('shifted');
    }

    showBlogModal(blog = null) {
        const modal = document.getElementById('blogModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('blogForm');

        if (!modal || !form) return;

        if (blog) {
            // Edit mode
            modalTitle.textContent = 'Edit Blog Post';
            document.getElementById('blogTitle').value = blog.title;
            document.getElementById('blogDate').value = blog.date;
            document.getElementById('blogTags').value = blog.tags.join(', ');
            document.getElementById('blogContent').value = blog.content;
            form.dataset.editId = blog.id;
        } else {
            // Create mode
            modalTitle.textContent = 'Create New Blog Post';
            form.reset();
            document.getElementById('blogDate').value = new Date().toISOString().split('T')[0];
            delete form.dataset.editId;
        }

        modal.classList.add('active');
    }

    async saveBlog() {
        const form = document.getElementById('blogForm');
        const editId = form.dataset.editId;

        if (!this.isAdmin) {
            alert('Please sign in to create or edit blog posts.');
            return;
        }

        const title = document.getElementById('blogTitle').value;
        const date = document.getElementById('blogDate').value;
        const tags = document.getElementById('blogTags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag);
        const content = document.getElementById('blogContent').value;

        if (editId) {
            // Update existing blog
            if (this.useLocalStorage) {
                const blogIndex = this.blogs.findIndex(b => b.id === editId);
                if (blogIndex !== -1) {
                    this.blogs[blogIndex] = {
                        ...this.blogs[blogIndex],
                        title,
                        date,
                        tags,
                        content
                    };
                }
            } else {
                const { data, error } = await this.supabase
                    .from('blogs')
                    .update({
                        title,
                        date,
                        tags,
                        content
                    })
                    .eq('id', editId)
                    .select()
                    .single();

                if (error) {
                    alert('Failed to update blog post.');
                    console.log('Supabase update error:', error);
                    return;
                }

                const blogIndex = this.blogs.findIndex(b => b.id === editId);
                if (blogIndex !== -1) {
                    this.blogs[blogIndex] = {
                        ...this.blogs[blogIndex],
                        ...data
                    };
                }
            }
        } else {
            // Create new blog
            const id = `${date}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`;
            const newBlog = {
                id,
                title,
                date,
                tags,
                content,
                author: 'Tian Lianghai'
            };
            if (this.useLocalStorage) {
                this.blogs.push(newBlog);
            } else {
                const { data, error } = await this.supabase
                    .from('blogs')
                    .insert(newBlog)
                    .select()
                    .single();

                if (error) {
                    alert('Failed to create blog post.');
                    console.log('Supabase insert error:', error);
                    return;
                }
                this.blogs.push(data);
            }
        }

        this.saveBlogs();
        this.renderBlogList();
        
        // Close modal
        document.getElementById('blogModal').classList.remove('active');

        // If we were editing a blog, refresh the display
        if (editId && this.currentBlog && this.currentBlog.id === editId) {
            const updatedBlog = this.blogs.find(b => b.id === editId);
            this.displayBlogContent(updatedBlog);
        }
    }

    editCurrentBlog() {
        if (this.currentBlog) {
            this.showBlogModal(this.currentBlog);
        }
    }

    async deleteCurrentBlog() {
        if (!this.currentBlog) return;
        if (!this.isAdmin) {
            alert('Please sign in to delete blog posts.');
            return;
        }

        if (confirm(`Are you sure you want to delete "${this.currentBlog.title}"?`)) {
            if (this.useLocalStorage) {
                const blogIndex = this.blogs.findIndex(b => b.id === this.currentBlog.id);
                if (blogIndex !== -1) {
                    this.blogs.splice(blogIndex, 1);
                    this.saveBlogs();
                    this.renderBlogList();
                    this.hideBlogContent();
                }
            } else {
                const { error } = await this.supabase
                    .from('blogs')
                    .delete()
                    .eq('id', this.currentBlog.id);

                if (error) {
                    alert('Failed to delete blog post.');
                    console.log('Supabase delete error:', error);
                    return;
                }

                this.blogs = this.blogs.filter(b => b.id !== this.currentBlog.id);
                this.renderBlogList();
                this.hideBlogContent();
            }
        }
    }

    async showAdminLogin() {
        if (this.useLocalStorage) {
            const password = prompt('Enter admin password to create blog posts:');
            if (password === 'tianlianghai2026') {
                this.isAdmin = true;
                localStorage.setItem('blogAdminToken', 'tianlianghai-blog-admin-2026');
                this.showBlogModal();
            } else if (password !== null) {
                alert('Incorrect password. Only the site owner can create blog posts.');
            }
            return;
        }

        const email = prompt('Enter your admin email:');
        if (!email) return;
        const password = prompt('Enter your admin password:');
        if (!password) return;

        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            alert('Sign-in failed. Check your email and password.');
            console.log('Supabase sign-in error:', error);
            return;
        }

        this.user = data?.user || null;
        this.isAdmin = !!this.user && this.user.email === BLOG_CONFIG.ADMIN_EMAIL;
        if (!this.isAdmin) {
            alert('Signed in, but this user is not allowed to post.');
            return;
        }
        this.showBlogModal();
    }
}

// Initialize blog system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize blog system
    window.blogManager = new BlogManager();

    // Add smooth scrolling to all links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections for animation
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Add hover effects for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add typing effect for the name
    const nameElement = document.querySelector('.name');
    if (nameElement) {
        const originalText = nameElement.textContent;
        nameElement.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                nameElement.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }

    // Add skill icons animation
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('animate-skill');
    });

    // Add social links hover effect
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.1)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add scroll-based header effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Add skill progress animation
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => {
        const items = category.querySelectorAll('.skill-item');
        items.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.style.animation = 'slideInUp 0.6s ease forwards';
        });
    });

    // Add contact form validation (if form exists)
    const contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add form validation logic here
            alert('Thank you for your message! I will get back to you soon.');
        });
    }

    // Add dark mode toggle (optional)
    const darkModeToggle = document.createElement('button');
    darkModeToggle.innerHTML = '🌙';
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 1.2rem;
        cursor: pointer;
        z-index: 1000;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(darkModeToggle);
    
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        this.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });

    // Add scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
        cursor: pointer;
        z-index: 1000;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        opacity: 0;
        transform: translateY(100px);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.transform = 'translateY(0)';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.transform = 'translateY(100px)';
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        
        .animate-skill {
            animation: slideInUp 0.6s ease forwards;
        }
        
        .dark-mode {
            background: #1a202c !important;
            color: #f7fafc !important;
        }
        
        .dark-mode .container {
            background: #2d3748 !important;
            color: #f7fafc !important;
        }
        
        .dark-mode .section-title {
            color: #f7fafc !important;
        }
        
        .dark-mode .skill-category,
        .dark-mode .project-card,
        .dark-mode .publication-item {
            background: #4a5568 !important;
            border-color: #2d3748 !important;
        }
        
        .loaded {
            animation: fadeIn 0.5s ease;
        }
    `;
    document.head.appendChild(style);
});

// Add GitHub API integration for dynamic stats
async function loadGitHubStats() {
    try {
        const response = await fetch('https://api.github.com/users/tianlianghai');
        const userData = await response.json();
        
        // Update profile with GitHub stats if needed
        console.log('GitHub user data:', userData);
        
    } catch (error) {
        console.log('Error loading GitHub stats:', error);
    }
}

// Load GitHub stats when page loads
document.addEventListener('DOMContentLoaded', loadGitHubStats);
