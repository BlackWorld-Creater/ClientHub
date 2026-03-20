/* ========================================
   Main JavaScript
======================================== */

// Preloader - Enhanced Best Version with Progress Counter
document.addEventListener("DOMContentLoaded", function () {
  const preloader = document.querySelector(".preloader");
  const percentageEl = document.getElementById("preloader-percentage");
  let progress = 0;

  // Simulate loading progress
  const loadingInterval = setInterval(function () {
    progress += Math.random() * 15;
    if (progress > 100) progress = 100;
    if (percentageEl) {
      percentageEl.textContent = Math.floor(progress) + "%";
    }
    if (progress >= 100) {
      clearInterval(loadingInterval);
    }
  }, 200);

  // Hide preloader after animations complete
  window.addEventListener("load", function () {
    // Wait for CSS animations to complete (4.5 seconds)
    setTimeout(function () {
      // Add exit animation to preloader
      preloader.classList.add("exit");

      // Hide preloader after exit animation
      setTimeout(function () {
        preloader.style.display = "none";
      }, 1000);
    }, 4500);
  });
});

// Mobile Navigation
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

if (hamburger) {
  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", function () {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Navbar scroll effect
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", function () {
  if (navbar) {
    navbar.style.boxShadow =
      window.scrollY > 50
        ? "0 5px 20px rgba(0,0,0,0.1)"
        : "0 2px 10px rgba(0,0,0,0.05)";
  }
});

// Initialize AOS
window.addEventListener("load", function () {
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      easing: "ease-in-out",
    });
  }
});

// Typed text effect
const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");

if (typedTextSpan && cursorSpan) {
  const textArray = [
    "A Community Builder.",
    "A Visionary Thinker.",
    "A Partner in Growth.",
  ];
  const typingDelay = 100;
  const erasingDelay = 60;
  const newTextDelay = 1500;
  let textArrayIndex = 0;
  let charIndex = 0;

  function type() {
    if (charIndex < textArray[textArrayIndex].length) {
      typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingDelay);
    } else {
      setTimeout(erase, newTextDelay);
    }
  }

  function erase() {
    if (charIndex > 0) {
      typedTextSpan.textContent = textArray[textArrayIndex].substring(
        0,
        charIndex - 1,
      );
      charIndex--;
      setTimeout(erase, erasingDelay);
    } else {
      textArrayIndex = (textArrayIndex + 1) % textArray.length;
      setTimeout(type, typingDelay);
    }
  }

  setTimeout(type, newTextDelay);
}

// Hero scroll button
const heroScroll = document.querySelector(".hero-scroll");
if (heroScroll) {
  heroScroll.addEventListener("click", function () {
    const storySection = document.querySelector("#story");
    if (storySection) storySection.scrollIntoView({ behavior: "smooth" });
  });
}

// Active navlink on scroll
const sections = document.querySelectorAll("section[id]");

function highlightNavOnScroll() {
  const scrollY = window.pageYOffset;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 150;
    const sectionId = section.getAttribute("id");
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (navLink) {
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document
          .querySelectorAll(".nav-link")
          .forEach((link) => link.classList.remove("active"));
        navLink.classList.add("active");
      }
    }
  });

  if (scrollY < 100) {
    document
      .querySelectorAll(".nav-link")
      .forEach((link) => link.classList.remove("active"));
    const homeLink = document.querySelector('.nav-link[href="#home"]');
    if (homeLink) homeLink.classList.add("active");
  }
}

window.addEventListener("scroll", highlightNavOnScroll);
document.addEventListener("DOMContentLoaded", highlightNavOnScroll);

// Services Carousel Functionality
const servicesCarousel = document.querySelector('.services-carousel');
const carouselPrev = document.querySelector('.carousel-prev');
const carouselNext = document.querySelector('.carousel-next');
const indicators = document.querySelectorAll('.indicator');

if (servicesCarousel) {
  const cardWidth = 320 + 24; // card width + gap
  const visibleCards = Math.floor(servicesCarousel.clientWidth / cardWidth) || 1;
  let currentIndex = 0;
  
  // Navigation buttons
  if (carouselPrev) {
    carouselPrev.addEventListener('click', () => {
      currentIndex = Math.max(currentIndex - 1, 0);
      scrollToIndex(currentIndex);
      updateIndicators();
    });
  }
  
  if (carouselNext) {
    carouselNext.addEventListener('click', () => {
      const maxIndex = Math.max(0, servicesCarousel.children.length - visibleCards);
      currentIndex = Math.min(currentIndex + 1, maxIndex);
      scrollToIndex(currentIndex);
      updateIndicators();
    });
  }
  
  // Scroll to specific index
  function scrollToIndex(index) {
    servicesCarousel.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    });
  }
  
  // Update indicators
  function updateIndicators() {
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === currentIndex);
    });
  }
  
  // Indicator clicks
  indicators.forEach((indicator, i) => {
    indicator.addEventListener('click', () => {
      currentIndex = i;
      scrollToIndex(currentIndex);
      updateIndicators();
    });
  });
  
  // Update indicators on scroll
  servicesCarousel.addEventListener('scroll', () => {
    const newIndex = Math.round(servicesCarousel.scrollLeft / cardWidth);
    if (newIndex !== currentIndex) {
      currentIndex = newIndex;
      updateIndicators();
    }
  });
}
