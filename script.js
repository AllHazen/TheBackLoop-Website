const CONFIG = {
    texts: [
        "Wishing u all the best ...", 
        "Panjang umur, tapi sabarnya pendek ...", 
        "Umur nambah, tingginya enggak ..."
    ],
    buttonTexts: ["Tap Again!", "Last Time!", "I'm Sure it Last :D"],
    typingSpeed: 80,
    deletingSpeed: 40,
    delayBetween: 1500
};

// Inisialisasi variabel
let textIndex = 0;
let charIndex = 0;
let swiperInstance = null;
let buttonClickCount = 0;
let backgroundRotation = 0 ; 
const ROTATION_AMOUNT =20; 

const prevBtn = document.querySelector('.swiper-button-prev');
const nextBtn = document.querySelector('.swiper-button-next');

// funngsi untuk memutar background 
// fungsi untuk memutar dan menggeser background dengan animasi lambat
function rotateBackground(direction) {
    backgroundRotation += (direction * ROTATION_AMOUNT);
    gsap.to('.page-background img', {
        rotation: backgroundRotation,
        x: 0 , // animasi slide ke kanan/kiri
        duration: 1.5, // diperlambat
        ease: "power2.inOut"
    });
}

// Elemen DOM
const elements = {
    typewriter: document.getElementById('typewriter'),
    tapButton: document.getElementById('tap-button'),
    textHeader: document.getElementById('textHeader'),
    nameContainer: document.getElementById('name'),
    swiperWrapper: document.getElementById('swiperWrapper'),
    clickSound: document.getElementById('clickSound'),
    transitionOverlay: document.querySelector('.transition-overlay')
};

// Fungsi Typewriter
function typeText() {
    if (charIndex < CONFIG.texts[textIndex].length) {
        elements.typewriter.textContent += CONFIG.texts[textIndex][charIndex];
        charIndex++;
        setTimeout(typeText, CONFIG.typingSpeed);
    } else {
        setTimeout(deleteText, CONFIG.delayBetween);
    }
}

function deleteText() {
    if (charIndex > 0) {
        elements.typewriter.textContent = CONFIG.texts[textIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(deleteText, CONFIG.deletingSpeed);
    } else {
        textIndex = (textIndex + 1) % CONFIG.texts.length;
        setTimeout(typeText, CONFIG.typingSpeed);
    }
}

// Fungsi untuk memisahkan teks menjadi span
function splitText(element) {
    const text = element.textContent;
    element.textContent = "";
    text.split("").forEach(char => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.display = "inline-block";
        span.style.opacity = 0;
        span.style.transform = "translateY(20px)";
        element.appendChild(span);
    });
}

// Setup animasi teks
// Setup animasi teks
function setupTextAnimation() {
    const birthdayText = document.querySelector("#name h2.text-medium");
    const nameText = document.querySelector("#name h1.my-header");
    
    if (birthdayText && nameText) {
        splitText(birthdayText);
        splitText(nameText);

        const timeline = gsap.timeline({ paused: true });
        timeline.to("#name h2.text-medium span", {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            duration: 0.5,
            stagger: 0.03
        })
        .to("#name h1.my-header span", {
            opacity: 1,
            y: 0,
            ease: "back.out(1.5)",
            duration: 0.6,
            stagger: 0.05
        }, "-=0.2")
        .call(() => {
            typeText();
        });
        
        return timeline;
    }
    return null;
}

// Inisialisasi Swiper - VERSI DIPERBAIKI
function initializeSwiper() {
    if (swiperInstance && swiperInstance.destroy) {
        swiperInstance.destroy(true, true);
    }
    const totalSlides = document.querySelectorAll('.mySwiper .swiper-slide').length;
    
        swiperInstance = new Swiper(".mySwiper", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        spaceBetween: 20,
        loop: true,
        loopedSlides: totalSlides,
        preloadImages: true,
        updateOnImagesReady: true,
        speed: 1200, // Lebih cepat
        initialSlide: Math.floor(Math.random() * 7) + 1 , 
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 1.5,
            slideShadows: false,
            scale: 1.5 // Scale normal
        },

        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            320: {
                spaceBetween: 10,
                coverflowEffect: {
                    depth: 50,
                    modifier: 1,
                    scale: 0.8
                }
            },
            768: {
                spaceBetween: 15,
                coverflowEffect: {
                    depth: 80,
                    modifier: 1.2,
                    scale: 0.82
                }
            },
            1024: {
                spaceBetween: 20,
                coverflowEffect: {
                    depth: 100,
                    modifier: 1.5,
                    scale: 0.85
                }
            },
        }, 
        on: {
            init : function() {
                this.slideTo(Math.floor(totalSlides / 2), 0);
            }, 
            slideNextTransitionStart : function() {
                rotateBackground(1) ; 
            },
            slidePrevTransitionStart : function() {
                rotateBackground(-1) ; 
            }
        }
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            rotateBackground(-1);
        }) ; 
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            rotateBackground(1);
        }) ; 
    }
    
    return swiperInstance;
}

// Animasi transisi antara halaman
// Animasi transisi antara halaman
function playTransitionAnimation(callback) {
    // Tampilkan overlay transisi
    gsap.set(elements.transitionOverlay, { display: "block", opacity: 0 });
    gsap.to(elements.transitionOverlay, { opacity: 1, duration: 0.5 });

    const bg = document.querySelector('.page-background');
    const bgImg = bg ? bg.querySelector('img') : null;
    
    // Animasi zoom out untuk konten utama
    gsap.to("main > *", {
        opacity: 0,
        scale: 1.5,
        duration: 0.8,
        ease: "power2.inOut",
        stagger: 0.05,
        onComplete: function() {
            // Sembunyikan elemen yang tidak diperlukan
            elements.tapButton.style.display = "none";
            elements.textHeader.style.display = "none";
            
            if (bg && bgImg) {
                bg.classList.remove('d-none');
            
                // posisi awal (gambar di bawah)
                gsap.set(bgImg, { y: 200, opacity: 0 });
            
                // animasi naik ke atas
                gsap.to(bgImg, {
                    y: 0, 
                    opacity: 1,
                    duration: 1.5,
                    ease: "power3.out"
                });
            }

            // Jalankan callback (menampilkan konten baru)
            if (callback) callback();
            
            // Animasi zoom in untuk konten baru - DIOPTIMALKAN
            setTimeout(function() {
                elements.nameContainer.classList.remove("d-none");
                elements.swiperWrapper.classList.remove("d-none");
                
                // Set posisi awal untuk teks (di atas layar)
                gsap.set(elements.nameContainer, { y: -100, opacity: 0 });
                                
                // Timeline untuk animasi masuk konten baru - DIOPTIMALKAN
                const tl = gsap.timeline({
                    onComplete: () => {
                        // Sembunyikan overlay transisi
                        gsap.to(elements.transitionOverlay, { 
                            opacity: 0, 
                            duration: 1.5, 
                            onComplete: () => {
                                elements.transitionOverlay.style.display = "none";
                            }
                        });
                    }
                });

                // ANIMASI TEKS: Turun dari atas seperti background - BARU
                tl.fromTo(elements.nameContainer, 
                    { 
                        opacity: 0, 
                        y: -100, // Start dari atas layar
                    }, 
                    { 
                        opacity: 1, 
                        y: 60, // Turun ke posisi normal
                        duration: 1.5, // Durasi sama seperti background
                        ease: "power3.out" // Easing sama seperti background
                    }
                );

                // Munculkan slider wrapper - DIOPTIMALKAN
                tl.fromTo(elements.swiperWrapper, 
                    { 
                        opacity: 0, 
                        y: 100, // Jarak lebih pendek
                        scale: 0.9 // Scale lebih kecil
                    }, 
                    { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1, 
                        duration: 1, // Durasi lebih pendek
                        ease: "power2.out" // Easing lebih smooth
                    }, 
                    "-=0.6" // Mulai sedikit setelah animasi teks
                );

            }, 300);
        }
    });
}

function createConfetti() {
    const container = document.querySelector('.confetti-container');
    const colors = ['#E74C3C', '#F39C12', '#F1C40F', '#2ECC71', '#3498DB', '#9B59B6'];
    if (!container) return ; 
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = (Math.random() * 10 + 5) + 'px';
        confetti.style.height = (Math.random() * 10 + 5) + 'px';
        confetti.style.animationDelay = (Math.random() * 5) + 's';
        confetti.style.animationDuration = (Math.random() * 3 + 3) + 's';
        container.appendChild(confetti);
  }
} 

function createParticles() {
    const container = document.createElement('div');
    container.className = 'particles';
    document.body.appendChild(container);
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.width = (Math.random() * 20 + 5) + 'px';
        particle.style.height = particle.style.width;
        particle.style.animation = `particleFloat ${(Math.random() * 10 + 10)}s infinite ease-in-out`;
        particle.style.animationDelay = (Math.random() * 5) + 's';
        container.appendChild(particle);
    }
}

function startEffects() {
  createParticles();
  createConfetti();
}

// Handle klik tombol// Handle klik tombol
function handleButtonClick(timeline) {
    if (buttonClickCount < CONFIG.buttonTexts.length) {
        elements.tapButton.textContent = CONFIG.buttonTexts[buttonClickCount];
        buttonClickCount++;
    } else {
        // Gunakan animasi transisi sebelum menampilkan konten baru
        playTransitionAnimation(function() {
            // Inisialisasi Swiper setelah transisi - DIOPTIMALKAN
            setTimeout(() => {
                const bg = document.querySelector('.page-background');
                const bgImg = bg ? bg.querySelector('img') : null;
                if (bg && bgImg) {
                    bg.classList.remove('d-none');
                }
                
                // Pastikan semua elemen terlihat sebelum inisialisasi
                elements.nameContainer.classList.remove("d-none");
                elements.swiperWrapper.classList.remove("d-none");
                
                // Set posisi awal untuk teks (di atas layar)
                gsap.set(elements.nameContainer, { y: -100, opacity: 0 });
                startEffects();
                
                // Inisialisasi Swiper dengan timeout untuk memastikan DOM sudah siap
                setTimeout(() => {
                    initializeSwiper();
                    
                    // Pastikan tombol navigasi terlihat
                    setTimeout(() => {
                        if (prevBtn) prevBtn.style.display = 'flex';
                        if (nextBtn) nextBtn.style.display = 'flex';
                        if (swiperInstance) {
                            swiperInstance.update();
                            // Paksa update ulang setelah delay kecil
                            setTimeout(() => {
                                swiperInstance.update();
                            }, 200); // Waktu lebih pendek
                        }
                    }, 30); 
                }, 100); 
                
                setTimeout(() => {
                    if (timeline) {
                        timeline.play();
                    }
                }, 500); 
                
            }, 10);
            
            if (elements.clickSound) {
                elements.clickSound.currentTime = 0;
                elements.clickSound.play().catch(e => console.log("Audio play failed:", e));
            }
        });
    }
}
// Inisialisasi  DOM 
document.addEventListener('DOMContentLoaded', () => {
    const textTimeline = setupTextAnimation();
        
    if (elements.tapButton) {
        elements.tapButton.addEventListener('click', () => {
            handleButtonClick(textTimeline);
        });
    }

});
