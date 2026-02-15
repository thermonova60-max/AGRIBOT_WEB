/**
 * Agri-Bot - Enhanced Main JavaScript
 * Core functionality, Auth System & Utilities
 */

// DOM Ready Handler
document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initNavbar();
  initSmoothScroll();
  initAnimations();
  initAccordions();
  initAuthSystem();
  initTooltips();
  initParallax();
});

/**
 * Page Loader
 */
function initPageLoader() {
  const loader = document.querySelector('.page-loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 500);
    });
  }
}

/**
 * Mobile Navigation Toggle
 */
function initNavbar() {
  const toggle = document.querySelector('.navbar__toggle');
  const menu = document.querySelector('.navbar__menu');
  const navbar = document.querySelector('.navbar');
  
  // Mobile menu toggle
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      menu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const links = menu.querySelectorAll('.navbar__link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        menu.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        toggle.classList.remove('active');
        menu.classList.remove('active');
      }
    });
  }

  // Highlight active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.navbar__link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });
  
  // Navbar scroll effect
  if (navbar) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    });
  }
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - navbarHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Scroll Animations (Fade In)
 */
function initAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in');
  
  if (fadeElements.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  fadeElements.forEach(el => observer.observe(el));
  
  // Counter animation for stats
  const statNumbers = document.querySelectorAll('.stats__number');
  if (statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(el => statsObserver.observe(el));
  }
}

/**
 * Animate Counter
 */
function animateCounter(element) {
  const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
  const suffix = element.textContent.replace(/[0-9,]/g, '');
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current).toLocaleString() + suffix;
  }, 16);
}

/**
 * Parallax Effect
 */
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  if (parallaxElements.length === 0) return;
  
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.5;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  });
}

/**
 * Accordion Component
 */
function initAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion__header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion__content');
      const isActive = item.classList.contains('active');
      
      // Close all accordions in the same group
      const accordion = item.closest('.accordion');
      if (accordion) {
        accordion.querySelectorAll('.accordion__item').forEach(i => {
          i.classList.remove('active');
          const c = i.querySelector('.accordion__content');
          if (c) c.style.maxHeight = null;
        });
      }
      
      // Open clicked accordion if it wasn't already open
      if (!isActive) {
        item.classList.add('active');
        if (content) {
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      }
    });
  });
}

/**
 * Tooltips
 */
function initTooltips() {
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  
  tooltipElements.forEach(el => {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = el.dataset.tooltip;
    el.appendChild(tooltip);
    
    el.addEventListener('mouseenter', () => {
      tooltip.classList.add('active');
    });
    
    el.addEventListener('mouseleave', () => {
      tooltip.classList.remove('active');
    });
  });
}

/**
 * Authentication System
 */
function initAuthSystem() {
  // Create auth modal HTML if it doesn't exist
  if (!document.getElementById('authModal')) {
    createAuthModal();
  }
  
  const authModal = document.getElementById('authModal');
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const closeBtn = document.querySelector('.auth-modal__close');
  const authTabs = document.querySelectorAll('.auth-modal__tab');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  
  // Open modal handlers
  if (loginBtn) {
    loginBtn.addEventListener('click', () => openAuthModal('login'));
  }
  
  if (signupBtn) {
    signupBtn.addEventListener('click', () => openAuthModal('signup'));
  }
  
  // Close modal
  if (closeBtn) {
    closeBtn.addEventListener('click', closeAuthModal);
  }
  
  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) {
        closeAuthModal();
      }
    });
  }
  
  // Tab switching
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetForm = tab.dataset.tab;
      switchAuthTab(targetForm);
    });
  });
  
  // Form submissions
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }
  
  // Check for existing session
  checkAuthStatus();
  
  // Keyboard shortcut to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && authModal?.classList.contains('active')) {
      closeAuthModal();
    }
  });
}

function createAuthModal() {
  const modal = document.createElement('div');
  modal.id = 'authModal';
  modal.className = 'auth-modal';
  modal.innerHTML = `
    <div class="auth-modal__content">
      <button class="auth-modal__close" aria-label="Close modal">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <div class="auth-modal__header">
        <div class="auth-modal__logo">🌱</div>
        <h2>Welcome to Agri-Bot</h2>
        <p>Sign in to access personalized features</p>
      </div>
      
      <div class="auth-modal__body">
        <div class="auth-modal__tabs">
          <button class="auth-modal__tab active" data-tab="login">Login</button>
          <button class="auth-modal__tab" data-tab="signup">Sign Up</button>
        </div>
        
        <!-- Login Form -->
        <form id="loginForm" class="auth-form active">
          <div class="auth-form__group">
            <label class="auth-form__label" for="loginEmail">Email Address</label>
            <input type="email" id="loginEmail" class="auth-form__input" placeholder="your@email.com" required>
          </div>
          
          <div class="auth-form__group">
            <label class="auth-form__label" for="loginPassword">Password</label>
            <input type="password" id="loginPassword" class="auth-form__input" placeholder="Enter your password" required>
          </div>
          
          <div class="auth-form__checkbox">
            <input type="checkbox" id="rememberMe">
            <label for="rememberMe">Remember me</label>
          </div>
          
          <div class="auth-form__forgot">
            <a href="#">Forgot password?</a>
          </div>
          
          <button type="submit" class="btn btn-primary auth-form__submit">
            Sign In
          </button>
          
          <div class="auth-form__divider">or continue with</div>
          
          <div class="auth-form__social">
            <button type="button" class="auth-form__social-btn" onclick="socialLogin('google')">
              <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button type="button" class="auth-form__social-btn" onclick="socialLogin('facebook')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
          </div>
        </form>
        
        <!-- Signup Form -->
        <form id="signupForm" class="auth-form">
          <div class="auth-form__group">
            <label class="auth-form__label" for="signupName">Full Name</label>
            <input type="text" id="signupName" class="auth-form__input" placeholder="Enter your name" required>
          </div>
          
          <div class="auth-form__group">
            <label class="auth-form__label" for="signupEmail">Email Address</label>
            <input type="email" id="signupEmail" class="auth-form__input" placeholder="your@email.com" required>
          </div>
          
          <div class="auth-form__group">
            <label class="auth-form__label" for="signupPhone">Phone Number</label>
            <input type="tel" id="signupPhone" class="auth-form__input" placeholder="+91 98765 43210">
          </div>
          
          <div class="auth-form__group">
            <label class="auth-form__label" for="signupPassword">Password</label>
            <input type="password" id="signupPassword" class="auth-form__input" placeholder="Create a strong password" required minlength="6">
          </div>
          
          <div class="auth-form__checkbox">
            <input type="checkbox" id="agreeTerms" required>
            <label for="agreeTerms">I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></label>
          </div>
          
          <button type="submit" class="btn btn-primary auth-form__submit">
            Create Account
          </button>
          
          <div class="auth-form__divider">or sign up with</div>
          
          <div class="auth-form__social">
            <button type="button" class="auth-form__social-btn" onclick="socialLogin('google')">
              <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button type="button" class="auth-form__social-btn" onclick="socialLogin('facebook')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  // Reinitialize event listeners after creating modal
  const closeBtn = modal.querySelector('.auth-modal__close');
  const authTabs = modal.querySelectorAll('.auth-modal__tab');
  const loginForm = modal.querySelector('#loginForm');
  const signupForm = modal.querySelector('#signupForm');
  
  closeBtn.addEventListener('click', closeAuthModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeAuthModal();
  });
  
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => switchAuthTab(tab.dataset.tab));
  });
  
  loginForm.addEventListener('submit', handleLogin);
  signupForm.addEventListener('submit', handleSignup);
}

function openAuthModal(tab = 'login') {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    switchAuthTab(tab);
  }
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function switchAuthTab(targetForm) {
  const tabs = document.querySelectorAll('.auth-modal__tab');
  const forms = document.querySelectorAll('.auth-form');
  
  tabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === targetForm);
  });
  
  forms.forEach(form => {
    const formId = form.id.replace('Form', '').toLowerCase();
    form.classList.toggle('active', formId === targetForm);
  });
}

function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const rememberMe = document.getElementById('rememberMe').checked;
  
  // Simulate login (replace with actual API call)
  const users = Storage.get('agribot_users') || [];
  const user = users.find(u => u.email === email);
  
  if (user && user.password === password) {
    // Successful login
    const sessionData = {
      id: user.id,
      name: user.name,
      email: user.email,
      loggedIn: true
    };
    
    if (rememberMe) {
      Storage.set('agribot_session', sessionData);
    } else {
      sessionStorage.setItem('agribot_session', JSON.stringify(sessionData));
    }
    
    showToast('Welcome back, ' + user.name + '! 🌱', 'success');
    closeAuthModal();
    updateUIForLoggedInUser(sessionData);
  } else {
    showToast('Invalid email or password. Please try again.', 'error');
  }
}

function handleSignup(e) {
  e.preventDefault();
  
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const phone = document.getElementById('signupPhone').value;
  const password = document.getElementById('signupPassword').value;
  
  // Get existing users or create new array
  const users = Storage.get('agribot_users') || [];
  
  // Check if email already exists
  if (users.find(u => u.email === email)) {
    showToast('An account with this email already exists.', 'error');
    return;
  }
  
  // Create new user
  const newUser = {
    id: Date.now(),
    name,
    email,
    phone,
    password, // In production, this should be hashed
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  Storage.set('agribot_users', users);
  
  // Auto login after signup
  const sessionData = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    loggedIn: true
  };
  
  Storage.set('agribot_session', sessionData);
  Storage.set('agribot_user', name); // For chatbot personalization
  
  showToast('Account created successfully! Welcome to Agri-Bot! 🌾', 'success');
  closeAuthModal();
  updateUIForLoggedInUser(sessionData);
}

function socialLogin(provider) {
  // Simulated social login (replace with actual OAuth implementation)
  showToast(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login coming soon!`, 'warning');
}

function checkAuthStatus() {
  const session = Storage.get('agribot_session') || 
                  JSON.parse(sessionStorage.getItem('agribot_session') || 'null');
  
  if (session && session.loggedIn) {
    updateUIForLoggedInUser(session);
  }
}

function updateUIForLoggedInUser(user) {
  const authBtns = document.querySelector('.navbar__auth-btns');
  const userDropdown = document.querySelector('.user-dropdown');
  
  // Hide login/signup buttons
  if (authBtns) {
    authBtns.style.display = 'none';
  }
  
  // Show user dropdown or create it
  if (userDropdown) {
    const avatar = userDropdown.querySelector('.navbar__user-avatar');
    const nameEl = userDropdown.querySelector('.navbar__user-name');
    
    if (avatar) avatar.textContent = user.name.charAt(0).toUpperCase();
    if (nameEl) nameEl.textContent = user.name.split(' ')[0];
  } else {
    createUserDropdown(user);
  }
  
  // Update chatbot with user name
  if (window.agriChatbot) {
    window.agriChatbot.userName = user.name;
  }
}

function createUserDropdown(user) {
  const navActions = document.querySelector('.navbar__actions');
  if (!navActions) return;
  
  const dropdown = document.createElement('div');
  dropdown.className = 'user-dropdown';
  dropdown.innerHTML = `
      <div class="navbar__user-avatar">${user.name.charAt(0).toUpperCase()}</div>
      <span class="navbar__user-name">${user.name.split(' ')[0]}</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6,9 12,15 18,9"></polyline>
      </svg>
      
    <div class="user-dropdown__menu">
      <div class="user-dropdown__item" data-action="profile">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        My Profile
      </div>
      <div class="user-dropdown__item" data-action="courses">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
        My Courses
      </div>
      <div class="user-dropdown__item" data-action="orders">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        Orders
      </div>
      <div class="user-dropdown__item" data-action="settings">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
        Settings
      </div>
      <div class="user-dropdown__divider"></div>
      <div class="user-dropdown__item user-dropdown__logout" data-action="logout">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16,17 21,12 16,7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        Logout
      </div>
    </div>
  `;
  
  // Hide auth buttons
  const authBtns = navActions.querySelector('.navbar__auth-btns');
  if (authBtns) authBtns.style.display = 'none';
  
  navActions.appendChild(dropdown);
  
  // Initialize dropdown functionality
  initUserDropdownEvents(dropdown, user);
}

function initUserDropdownEvents(dropdown, user) {
  const menu = dropdown.querySelector('.user-dropdown__menu');
  
  // Toggle dropdown on click
  dropdown.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('active');
  });
  
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });
  
  // Handle menu item clicks
  dropdown.querySelectorAll('.user-dropdown__item').forEach(item => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      dropdown.classList.remove('active');
      
      switch (action) {
        case 'profile':
          openProfileModal(user);
          break;
        case 'courses':
          openCoursesModal(user);
          break;
        case 'orders':
          openOrdersModal(user);
          break;
        case 'settings':
          openSettingsModal(user);
          break;
        case 'logout':
          handleLogout(new Event('click'));
          break;
      }
    });
  });
}

// ============================================
// PROFILE MODAL
// ============================================
function openProfileModal(user) {
  const session = Storage.get('agribot_session') || user;
  const userData = Storage.get('agribot_user_data') || {};
  
  const modal = createDynamicModal('profileModal', 'My Profile', `
    <div class="profile-modal">
      <div class="profile-modal__header">
        <div class="profile-modal__avatar">${session.name.charAt(0).toUpperCase()}</div>
        <div class="profile-modal__info">
          <h3>${session.name}</h3>
          <p>${session.email}</p>
          <span class="profile-modal__badge">🌾 Farmer Member</span>
        </div>
      </div>
      
      <form id="profileForm" class="profile-modal__form">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" name="name" value="${session.name}" class="form-input">
        </div>
        <div class="form-group">
          <label>Email Address</label>
          <input type="email" name="email" value="${session.email}" class="form-input" disabled>
        </div>
        <div class="form-group">
          <label>Phone Number</label>
          <input type="tel" name="phone" value="${userData.phone || ''}" placeholder="+91 9876543210" class="form-input">
        </div>
        <div class="form-group">
          <label>Location</label>
          <input type="text" name="location" value="${userData.location || ''}" placeholder="City, State" class="form-input">
        </div>
        <div class="form-group">
          <label>Bio</label>
          <textarea name="bio" placeholder="Tell us about your farm..." class="form-input form-textarea" rows="3">${userData.bio || ''}</textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </div>
      </form>
    </div>
  `);

  document.getElementById('profileForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Update session name
    const newName = formData.get('name');
    const session = Storage.get('agribot_session');
    if (session) {
      session.name = newName;
      Storage.set('agribot_session', session);
    }
    
    // Update user data
    Storage.set('agribot_user_data', {
      phone: formData.get('phone'),
      location: formData.get('location'),
      bio: formData.get('bio')
    });
    
    // Update UI
    const avatarEl = document.querySelector('.navbar__user-avatar');
    const nameEl = document.querySelector('.navbar__user-name');
    if (avatarEl) avatarEl.textContent = newName.charAt(0).toUpperCase();
    if (nameEl) nameEl.textContent = newName.split(' ')[0];
    
    closeDynamicModal(modal);
    showToast('Profile updated successfully!', 'success');
  });
}

// ============================================
// MY COURSES MODAL
// ============================================
function openCoursesModal(user) {
  const enrolledCourses = Storage.get('agribot_enrolled_courses') || [];
  
  const coursesHTML = enrolledCourses.length > 0 ? enrolledCourses.map(course => `
    <div class="enrolled-course">
      <div class="enrolled-course__icon">📚</div>
      <div class="enrolled-course__info">
        <h4>${course.title}</h4>
        <p>Enrolled: ${new Date(course.enrolledDate).toLocaleDateString()}</p>
        <div class="enrolled-course__progress">
          <div class="progress-bar">
            <div class="progress-bar__fill" style="width: ${course.progress || 0}%"></div>
          </div>
          <span>${course.progress || 0}% Complete</span>
        </div>
      </div>
      <a href="education.html" class="btn btn-sm btn-primary">Continue</a>
    </div>
  `).join('') : `
    <div class="empty-state">
      <div class="empty-state__icon">📖</div>
      <h4>No courses enrolled yet</h4>
      <p>Start learning today to improve your farming skills!</p>
      <a href="education.html" class="btn btn-primary">Browse Courses</a>
    </div>
  `;

  createDynamicModal('coursesModal', 'My Courses', `
    <div class="courses-modal">
      <div class="courses-modal__stats">
        <div class="stat-card">
          <span class="stat-card__value">${enrolledCourses.length}</span>
          <span class="stat-card__label">Enrolled</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__value">${enrolledCourses.filter(c => c.progress === 100).length}</span>
          <span class="stat-card__label">Completed</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__value">${enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length}</span>
          <span class="stat-card__label">In Progress</span>
        </div>
      </div>
      <div class="courses-modal__list">
        ${coursesHTML}
      </div>
    </div>
  `);
}

// ============================================
// ORDERS MODAL
// ============================================
function openOrdersModal(user) {
  const orders = Storage.get('agribot_orders') || [];
  
  const statusColors = {
    'Processing': 'warning',
    'Shipped': 'info',
    'Delivered': 'success',
    'Cancelled': 'error'
  };

  const ordersHTML = orders.length > 0 ? orders.map(order => `
    <div class="order-item">
      <div class="order-item__header">
        <span class="order-item__id">Order #${order.id}</span>
        <span class="order-item__status order-item__status--${statusColors[order.status] || 'info'}">${order.status}</span>
      </div>
      <div class="order-item__details">
        <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
        <p><strong>Items:</strong> ${order.items?.length || 0} products</p>
        <p><strong>Total:</strong> ₹${order.total?.toLocaleString() || 0}</p>
      </div>
      <div class="order-item__actions">
        <button class="btn btn-sm btn-outline" onclick="viewOrderDetails(${order.id})">View Details</button>
      </div>
    </div>
  `).join('') : `
    <div class="empty-state">
      <div class="empty-state__icon">🛒</div>
      <h4>No orders yet</h4>
      <p>Browse our marketplace for quality agricultural products!</p>
      <a href="marketplace.html" class="btn btn-primary">Visit Marketplace</a>
    </div>
  `;

  createDynamicModal('ordersModal', 'My Orders', `
    <div class="orders-modal">
      <div class="orders-modal__summary">
        <p>Total Orders: <strong>${orders.length}</strong></p>
      </div>
      <div class="orders-modal__list">
        ${ordersHTML}
      </div>
    </div>
  `);
}

function viewOrderDetails(orderId) {
  const orders = Storage.get('agribot_orders') || [];
  const order = orders.find(o => o.id === orderId);
  if (!order) return;
  showToast(`Order #${orderId} - Status: ${order.status}`, 'info');
}

// ============================================
// SETTINGS MODAL
// ============================================
function openSettingsModal(user) {
  const settings = Storage.get('agribot_settings') || {
    notifications: true,
    newsletter: true,
    darkMode: true
  };

  const modal = createDynamicModal('settingsModal', 'Settings', `
    <div class="settings-modal">
      <div class="settings-section">
        <h4>Notifications</h4>
        <div class="settings-option">
          <div class="settings-option__info">
            <span>Push Notifications</span>
            <p>Receive updates about your orders and courses</p>
          </div>
          <label class="toggle">
            <input type="checkbox" name="notifications" ${settings.notifications ? 'checked' : ''}>
            <span class="toggle__slider"></span>
          </label>
        </div>
        <div class="settings-option">
          <div class="settings-option__info">
            <span>Newsletter</span>
            <p>Get farming tips and special offers via email</p>
          </div>
          <label class="toggle">
            <input type="checkbox" name="newsletter" ${settings.newsletter ? 'checked' : ''}>
            <span class="toggle__slider"></span>
          </label>
        </div>
      </div>
      
      <div class="settings-section">
        <h4>Appearance</h4>
        <div class="settings-option">
          <div class="settings-option__info">
            <span>Dark Mode</span>
            <p>Use dark theme for better viewing</p>
          </div>
          <label class="toggle">
            <input type="checkbox" name="darkMode" ${settings.darkMode !== false ? 'checked' : ''}>
            <span class="toggle__slider"></span>
          </label>
        </div>
      </div>

      <div class="settings-section">
        <h4>Account</h4>
        <div class="settings-actions">
          <button class="btn btn-outline" onclick="exportUserData()">Export My Data</button>
          <button class="btn btn-danger" onclick="confirmDeleteAccount()">Delete Account</button>
        </div>
      </div>
    </div>
  `);

  // Handle toggle changes
  modal.querySelectorAll('.toggle input').forEach(input => {
    input.addEventListener('change', () => {
      const currentSettings = Storage.get('agribot_settings') || {};
      currentSettings[input.name] = input.checked;
      Storage.set('agribot_settings', currentSettings);
      showToast('Settings updated', 'success');
    });
  });
}

function exportUserData() {
  const data = {
    session: Storage.get('agribot_session'),
    userData: Storage.get('agribot_user_data'),
    courses: Storage.get('agribot_enrolled_courses'),
    orders: Storage.get('agribot_orders'),
    settings: Storage.get('agribot_settings')
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'agribot-user-data.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Data exported successfully!', 'success');
}

function confirmDeleteAccount() {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    Storage.remove('agribot_session');
    Storage.remove('agribot_user_data');
    Storage.remove('agribot_enrolled_courses');
    Storage.remove('agribot_orders');
    Storage.remove('agribot_settings');
    Storage.remove('agribot_users');
    sessionStorage.clear();
    showToast('Account deleted successfully', 'info');
    setTimeout(() => window.location.reload(), 1000);
  }
}

// Make functions global
window.viewOrderDetails = viewOrderDetails;
window.exportUserData = exportUserData;
window.confirmDeleteAccount = confirmDeleteAccount;

// ============================================
// DYNAMIC MODAL UTILITY
// ============================================
function createDynamicModal(id, title, content) {
  // Remove existing modal with same id
  document.getElementById(id)?.remove();

  const modal = document.createElement('div');
  modal.id = id;
  modal.className = 'dynamic-modal active';
  modal.innerHTML = `
    <div class="dynamic-modal__overlay"></div>
    <div class="dynamic-modal__container">
      <div class="dynamic-modal__header">
        <h3>${title}</h3>
        <button class="dynamic-modal__close">&times;</button>
      </div>
      <div class="dynamic-modal__content">
        ${content}
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  // Close handlers
  const closeBtn = modal.querySelector('.dynamic-modal__close');
  const overlay = modal.querySelector('.dynamic-modal__overlay');

  closeBtn.addEventListener('click', () => closeDynamicModal(modal));
  overlay.addEventListener('click', () => closeDynamicModal(modal));
  
  // Escape key
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeDynamicModal(modal);
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);

  return modal;
}

function closeDynamicModal(modal) {
  if (typeof modal === 'string') {
    modal = document.getElementById(modal);
  }
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
      if (!document.querySelector('.dynamic-modal.active')) {
        document.body.style.overflow = '';
      }
    }, 300);
  }
}

function handleLogout(e) {
  e.preventDefault();
  
  Storage.remove('agribot_session');
  sessionStorage.removeItem('agribot_session');
  
  showToast('You have been logged out. See you soon! 👋', 'success');
  
  // Reload page to reset UI
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

/**
 * Toast Notification System
 */
function showToast(message, type = 'success') {
  // Remove existing toasts
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠'
  };
  
  toast.innerHTML = `
    <span class="toast__icon">${icons[type] || icons.success}</span>
    <span class="toast__message">${message}</span>
  `;
  
  document.body.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Make showToast globally available
window.showToast = showToast;
window.openAuthModal = openAuthModal;
window.handleLogout = handleLogout;
window.socialLogin = socialLogin;

/**
 * Form Validation Utility
 */
function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
  
  inputs.forEach(input => {
    const value = input.value.trim();
    const parent = input.closest('.form-group, .auth-form__group');
    
    // Remove previous error state
    input.classList.remove('error');
    const existingError = parent?.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    if (!value) {
      isValid = false;
      input.classList.add('error');
      if (parent) {
        const errorMsg = document.createElement('span');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'This field is required';
        parent.appendChild(errorMsg);
      }
    }
    
    // Email validation
    if (input.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        input.classList.add('error');
        if (parent) {
          const errorMsg = document.createElement('span');
          errorMsg.className = 'error-message';
          errorMsg.textContent = 'Please enter a valid email';
          parent.appendChild(errorMsg);
        }
      }
    }
  });
  
  return isValid;
}

/**
 * Show Form Message
 */
function showFormMessage(form, message, type = 'success') {
  // Remove existing message
  const existingMsg = form.querySelector('.form-message');
  if (existingMsg) existingMsg.remove();
  
  const msgEl = document.createElement('div');
  msgEl.className = `form-message ${type}`;
  msgEl.textContent = message;
  
  form.insertBefore(msgEl, form.firstChild);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    msgEl.remove();
  }, 5000);
}

/**
 * Local Storage Helpers
 */
const Storage = {
  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return null;
    }
  },
  
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Error writing to localStorage:', e);
      return false;
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Error removing from localStorage:', e);
      return false;
    }
  }
};

/**
 * Fetch JSON Data
 */
async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    console.error('Error fetching JSON:', e);
    return null;
  }
}

/**
 * Debounce Function
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Format Currency
 */
function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Storage,
    fetchJSON,
    debounce,
    formatCurrency,
    validateForm,
    showFormMessage,
    showToast
  };
}
