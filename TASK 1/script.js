// Get all gallery items
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const caption = document.getElementById('caption');
const closeBtn = document.querySelector('.close');
const downloadBtn = document.getElementById('download-btn');

// Add fullscreen button to lightbox
let fullscreenBtn = document.getElementById('fullscreen-btn');
if (!fullscreenBtn) {
    fullscreenBtn = document.createElement('a');
    fullscreenBtn.id = 'fullscreen-btn';
    fullscreenBtn.className = 'fullscreen-btn';
    fullscreenBtn.title = 'Fullscreen';
    fullscreenBtn.innerHTML = '⛶';
    lightbox.querySelector('.lightbox-content').appendChild(fullscreenBtn);
}

// Array to store all image sources, alt texts, titles, descriptions
const images = [];
let currentImageIndex = 0;

// Load likes from localStorage
let likes = JSON.parse(localStorage.getItem('galleryLikes') || '[]');
if (!Array.isArray(likes) || likes.length !== galleryItems.length) {
    likes = Array(galleryItems.length).fill(0);
}

// Populate the images array and set up like counts
galleryItems.forEach((item, idx) => {
    const img = item.querySelector('img');
    images.push({
        src: img.src,
        alt: img.alt,
        title: item.getAttribute('data-title') || '',
        description: item.getAttribute('data-description') || ''
    });
    // Set like count
    const likeCount = item.querySelector('.like-count');
    likeCount.textContent = likes[idx] || 0;
    // Set like button state
    const likeBtn = item.querySelector('.like-btn');
    if (localStorage.getItem('galleryLiked_' + idx) === '1') {
        likeBtn.classList.add('liked');
    }
    // Like button event
    likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (likeBtn.classList.contains('liked')) {
            likeBtn.classList.remove('liked');
            likes[idx] = Math.max(0, likes[idx] - 1);
            localStorage.setItem('galleryLiked_' + idx, '0');
        } else {
            likeBtn.classList.add('liked');
            likes[idx] = (likes[idx] || 0) + 1;
            localStorage.setItem('galleryLiked_' + idx, '1');
        }
        likeCount.textContent = likes[idx];
        localStorage.setItem('galleryLikes', JSON.stringify(likes));
    });
});

// Open lightbox when clicking on a gallery item
galleryItems.forEach(item => {
    item.addEventListener('click', function(e) {
        // Prevent like button click from opening lightbox
        if (e.target.classList.contains('like-btn')) return;
        currentImageIndex = parseInt(this.getAttribute('data-index'));
        showImage(currentImageIndex);
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
    });
});

// Close lightbox when clicking on the close button
closeBtn.addEventListener('click', closeLightbox);

// Close lightbox when clicking outside the image
lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Function to close the lightbox
function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
    exitFullscreen();
}

// Function to show image in lightbox
function showImage(index) {
    if (index < 0) {
        currentImageIndex = images.length - 1;
    } else if (index >= images.length) {
        currentImageIndex = 0;
    } else {
        currentImageIndex = index;
    }
    const imgData = images[currentImageIndex];
    lightboxImg.src = imgData.src;
    lightboxImg.alt = imgData.alt;
    // Show title and description in caption
    caption.innerHTML = `<strong>${imgData.title}</strong><br><span>${imgData.description}</span>`;
    // Set download button
    downloadBtn.href = imgData.src;
    downloadBtn.setAttribute('download', imgData.title ? imgData.title.replace(/\s+/g, '_') + '.jpg' : 'image.jpg');
}

// Function to change image (next/previous)
function changeImage(step) {
    showImage(currentImageIndex + step);
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (lightbox.style.display === 'block') {
        if (e.key === 'ArrowLeft') {
            changeImage(-1);
        } else if (e.key === 'ArrowRight') {
            changeImage(1);
        } else if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'f' || e.key === 'F') {
            toggleFullscreen();
        }
    }
});

// Download button
if (downloadBtn) {
    downloadBtn.addEventListener('click', function(e) {
        // Let browser handle download
        e.stopPropagation();
    });
}

// Fullscreen button
fullscreenBtn.addEventListener('click', function(e) {
    e.preventDefault();
    toggleFullscreen();
});

function toggleFullscreen() {
    const elem = lightbox.querySelector('.lightbox-content');
    if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {
        exitFullscreen();
    }
}
function exitFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else if (document.webkitFullscreenElement) {
        document.webkitExitFullscreen();
    } else if (document.msFullscreenElement) {
        document.msExitFullscreen();
    }
}

// Preload images for smoother experience
window.addEventListener('load', function() {
    images.forEach(image => {
        const img = new Image();
        img.src = image.src;
    });
});

// Show title/description in overlay on hover
const overlays = document.querySelectorAll('.img-overlay');
galleryItems.forEach((item, idx) => {
    const overlay = item.querySelector('.img-overlay');
    overlay.innerHTML = `<div style='text-align:center;'><strong>${images[idx].title}</strong><br><span style='font-size:0.9rem;'>${images[idx].description}</span><br>🔍</div>`;
});
