// ========================================
// turui Photography — Interactive Scripts
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  // Year in footer
  document.getElementById("year").textContent = new Date().getFullYear();

  // Language switching
  const langBtns = document.querySelectorAll(".lang-btn");
  let currentLang = "zh";

  function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

    document.querySelectorAll("[data-zh]").forEach((el) => {
      const text = el.getAttribute(`data-${lang}`);
      if (text !== null) {
        el.textContent = text;
      }
    });

    langBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });
  }

  langBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      setLanguage(btn.dataset.lang);
    });
  });

  // Mobile menu
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    document.body.style.overflow = mobileMenu.classList.contains("active") ? "hidden" : "";
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  // ========== Series Covers Logic ==========
  // Photos for each series (selected from the album, original quality)
  const seriesData = {
    portrait: {
      titleZh: "孩子特写",
      titleEn: "Portrait",
      photos: [
        "photo_001.jpg", "photo_002.jpg", "photo_003.jpg", "photo_010.jpg",
        "photo_016.jpg", "photo_026.jpg", "photo_027.jpg", "photo_028.jpg"
      ]
    },
    play: {
      titleZh: "奔跑玩耍",
      titleEn: "Play",
      photos: [
        "photo_030.jpg", "photo_031.jpg", "photo_040.jpg", "photo_055.jpg",
        "photo_056.jpg", "photo_057.jpg"
      ]
    },
    water: {
      titleZh: "水边河边",
      titleEn: "Water",
      photos: [
        "photo_086.jpg", "photo_120.jpg", "photo_121.jpg", "photo_122.jpg"
      ]
    },
    mountain: {
      titleZh: "山与田野",
      titleEn: "Mountain",
      photos: [
        "photo_066.jpg", "photo_150.jpg", "photo_151.jpg", "photo_152.jpg", "photo_153.jpg"
      ]
    },
    weather: {
      titleZh: "雾雨雪",
      titleEn: "Weather",
      photos: [
        "photo_080.jpg", "photo_081.jpg", "photo_100.jpg", "photo_101.jpg"
      ]
    },
    park: {
      titleZh: "公园植物",
      titleEn: "Park",
      photos: [
        "photo_070.jpg", "photo_071.jpg", "photo_072.jpg"
      ]
    },
    daily: {
      titleZh: "日常瞬间",
      titleEn: "Daily",
      photos: [
        "photo_020.jpg", "photo_131.jpg", "photo_132.jpg", "photo_040.jpg"
      ]
    }
  };

  const coversEl = document.getElementById("series-covers");
  const detailEl = document.getElementById("series-detail");
  const detailTitle = document.getElementById("series-detail-title");
  const seriesPhotos = document.getElementById("series-photos");
  const backBtn = document.getElementById("series-back");

  // Lightbox elements
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");

  let currentPhotos = []; // current series photo list
  let currentIndex = 0;

  function openLightbox(index) {
    if (!currentPhotos.length) return;
    currentIndex = index;
    lightboxImg.src = "images/" + currentPhotos[currentIndex];
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
    lightboxImg.src = "";
  }

  function showPrev() {
    if (!currentPhotos.length) return;
    currentIndex = (currentIndex - 1 + currentPhotos.length) % currentPhotos.length;
    lightboxImg.src = "images/" + currentPhotos[currentIndex];
  }

  function showNext() {
    if (!currentPhotos.length) return;
    currentIndex = (currentIndex + 1) % currentPhotos.length;
    lightboxImg.src = "images/" + currentPhotos[currentIndex];
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", showPrev);
  lightboxNext.addEventListener("click", showNext);

  // Click background to close
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard support
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "ArrowRight") showNext();
  });

  // Click cover → open series
  document.querySelectorAll(".series-cover").forEach((cover) => {
    cover.addEventListener("click", () => {
      const seriesKey = cover.dataset.series;
      const data = seriesData[seriesKey];
      if (!data) return;

      currentPhotos = data.photos;

      // Hide covers, show detail
      coversEl.classList.add("hidden");
      detailEl.classList.remove("hidden");

      // Title
      detailTitle.textContent = currentLang === "zh" ? data.titleZh : data.titleEn;

      // Build photos
      seriesPhotos.innerHTML = data.photos
        .map(
          (src, i) => `
        <div class="portfolio-item" data-index="${i}">
          <div class="portfolio-img">
            <img src="images/${src}" alt="" loading="lazy" />
          </div>
        </div>
      `
        )
        .join("");

      // Click photo → open lightbox
      seriesPhotos.querySelectorAll(".portfolio-item").forEach((item) => {
        item.addEventListener("click", () => {
          const idx = parseInt(item.dataset.index, 10);
          openLightbox(idx);
        });
      });

      // Scroll to portfolio
      document.getElementById("portfolio").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Back to covers
  backBtn.addEventListener("click", () => {
    detailEl.classList.add("hidden");
    coversEl.classList.remove("hidden");
    seriesPhotos.innerHTML = "";
    currentPhotos = [];
  });

  // Smooth header background on scroll
  const header = document.querySelector(".header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
      header.style.background = "rgba(247, 245, 242, 0.92)";
      header.style.backdropFilter = "blur(8px)";
    } else {
      header.style.background = "linear-gradient(to bottom, var(--bg) 60%, transparent)";
      header.style.backdropFilter = "none";
    }
  });

  // Form submission (placeholder)
  const form = document.querySelector(".contact-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector(".submit-btn");
    const originalText = btn.textContent;
    btn.textContent = currentLang === "zh" ? "已发送" : "Sent";
    btn.style.pointerEvents = "none";
    btn.style.opacity = "0.6";

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.pointerEvents = "";
      btn.style.opacity = "";
      form.reset();
    }, 2000);
  });
});
