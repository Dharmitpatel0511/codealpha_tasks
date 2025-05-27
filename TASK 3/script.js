// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector(".hamburger")
    const navLinks = document.querySelector(".nav-links")
  
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navLinks.classList.toggle("active")
    })
  
    // Close mobile menu when clicking on a nav link
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active")
        navLinks.classList.remove("active")
      })
    })
  
    // Sticky Header
    const header = document.querySelector("header")
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.style.padding = "15px 0"
        header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)"
      } else {
        header.style.padding = "20px 0"
        header.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)"
      }
    })
  
    // Project Filtering
    const filterBtns = document.querySelectorAll(".filter-btn")
    const projectCards = document.querySelectorAll(".project-card")
  
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Remove active class from all buttons
        filterBtns.forEach((btn) => btn.classList.remove("active"))
        // Add active class to clicked button
        this.classList.add("active")
  
        const filter = this.getAttribute("data-filter")
  
        projectCards.forEach((card) => {
          if (filter === "all" || card.getAttribute("data-category") === filter) {
            card.style.display = "block"
            setTimeout(() => {
              card.style.opacity = "1"
              card.style.transform = "scale(1)"
            }, 100)
          } else {
            card.style.opacity = "0"
            card.style.transform = "scale(0.8)"
            setTimeout(() => {
              card.style.display = "none"
            }, 300)
          }
        })
      })
    })
  
    // Animate skill bars on scroll
    const skillSection = document.querySelector(".skills")
    const skillLevels = document.querySelectorAll(".skill-level")
  
    // Initial state - set width to 0
    skillLevels.forEach((level) => {
      level.style.width = "0"
    })
  
    // Function to check if element is in viewport
    function isInViewport(element) {
      const rect = element.getBoundingClientRect()
      return rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.bottom >= 0
    }
  
    // Function to animate skill bars
    function animateSkillBars() {
      if (isInViewport(skillSection)) {
        skillLevels.forEach((level) => {
          const width = level.style.width
          if (width === "0px" || width === "0%") {
            // Get the width from inline style
            const targetWidth = level.getAttribute("style").split("width:")[1].split("%")[0].trim()
            level.style.width = targetWidth + "%"
          }
        })
        // Remove event listener once animation is triggered
        window.removeEventListener("scroll", animateSkillBars)
      }
    }
  
    // Add scroll event listener
    window.addEventListener("scroll", animateSkillBars)
    // Check on initial load
    animateSkillBars()
  
    // Form Validation
    const contactForm = document.getElementById("contact-form")
  
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        // Simple validation
        const name = document.getElementById("name").value
        const email = document.getElementById("email").value
        const subject = document.getElementById("subject").value
        const message = document.getElementById("message").value
  
        if (!name || !email || !subject || !message) {
          alert("Please fill in all fields")
          return
        }
  
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          alert("Please enter a valid email address")
          return
        }
  
        // If validation passes, you would normally send the form data to a server
        // For this example, we'll just show a success message
        alert("Thank you for your message! I will get back to you soon.")
        contactForm.reset()
      })
    }
  
    // Resume button click event
    const resumeBtn = document.getElementById("resume-btn")
    if (resumeBtn) {
      resumeBtn.addEventListener("click", (e) => {
        e.preventDefault()
        alert("Resume download functionality would be implemented here.")
      })
    }
  
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
  
        const targetId = this.getAttribute("href")
        if (targetId === "#") return
  
        const targetElement = document.querySelector(targetId)
        if (targetElement) {
          const headerHeight = document.querySelector("header").offsetHeight
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight
  
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          })
        }
      })
    })
  })
  