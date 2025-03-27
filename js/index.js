document.addEventListener("DOMContentLoaded", function () {
  const dropdown = document.querySelector(".dropdown");
  const button = dropdown.querySelector(".button-component");
  const menu = dropdown.querySelector(".dropdown-menu");
  const caret = dropdown.querySelector(".caret-icon");

  button.addEventListener("click", function (event) {
    event.stopPropagation(); // Prevent click from bubbling up
    const isOpen = menu.style.display === "block";
    menu.style.display = isOpen ? "none" : "block";
    caret.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
  });

  document.addEventListener("click", function () {
    menu.style.display = "none";
    caret.style.transform = "rotate(0deg)";
  });

  menu.addEventListener("click", function (event) {
    event.stopPropagation(); // Prevent click from bubbling up
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // How It Works Section Carousel
  const howItWorksCarousel = document.querySelector(".carousel-content");
  const howItWorksPrevButton = document.querySelector(".carousel-button.left");
  const howItWorksNextButton = document.querySelector(".carousel-button.right");
  const howItWorksCards = document.querySelectorAll(
    ".carousel-content .points-card"
  );
  let howItWorksIndex = 0;

  function updateHowItWorksCarousel() {
    if (window.innerWidth < 1024) {
      // Center the card by calculating the appropriate translate value
      const offset = (window.innerWidth - howItWorksCards[0].clientWidth) / 2;
      howItWorksCarousel.style.transform = `translateX(calc(-${
        howItWorksIndex * 100
      }% + ${offset}px))`;
    } else {
      // Reset transform for desktop
      howItWorksCarousel.style.transform = "translateX(0)";
    }
  }

  howItWorksNextButton.addEventListener("click", function () {
    howItWorksIndex = (howItWorksIndex + 1) % howItWorksCards.length; // Loop back
    updateHowItWorksCarousel();
  });

  howItWorksPrevButton.addEventListener("click", function () {
    howItWorksIndex =
      (howItWorksIndex - 1 + howItWorksCards.length) % howItWorksCards.length; // Loop back
    updateHowItWorksCarousel();
  });

  window.addEventListener("resize", updateHowItWorksCarousel);
  updateHowItWorksCarousel();
	
  // ------------- Hero Banner Random Change ------------

const banners = [
    { class: 'banner1'},
    { class: 'banner2'},
    { class: 'banner3'}
];

const randomBanner = banners[Math.floor(Math.random() * banners.length)];

const heroSection = document.getElementById('hero');
heroSection.classList.add(randomBanner.class);

  // ------------------- Banner Carousel -------------------

  const bannerCarousel = document.querySelector(".carousel-banner");
  const indicators = document.querySelectorAll(".indicator");
  let bannerIndex = 0;
  const bannerSlides = document.querySelectorAll(".carousel-banner-item");

  function updateBannerCarousel() {
    bannerCarousel.style.transform = `translateX(-${bannerIndex * 100}%)`;
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === bannerIndex);
    });
  }

  function nextBannerSlide() {
    bannerIndex = (bannerIndex + 1) % bannerSlides.length;
    updateBannerCarousel();
  }

  // Auto-slide every 3 seconds
  setInterval(nextBannerSlide, 3000);

  // Click event for indicators
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", function () {
      bannerIndex = index;
      updateBannerCarousel();
    });
  });

  // ------------------- Opinion Button Toggle -------------------
  const button = document.querySelector(".opinion-button");
  if (button) {
    const secondaryTextSection = document.querySelector(
      ".secondary-text-section"
    );
    const icon = button.querySelector("svg");
    let isExpanded = false;

    function checkScreenSize() {
      if (window.innerWidth >= 1024) {
        // Ensure text stays visible on desktop
        secondaryTextSection.classList.add("visible");
        button.style.display = "none"; // Hide button
      } else {
        // If resized to mobile and was previously expanded, keep it expanded
        if (isExpanded) {
          secondaryTextSection.classList.add("visible");
        } else {
          secondaryTextSection.classList.remove("visible");
        }
        button.style.display = "flex"; // Show button on smaller screens
      }
    }

    button.addEventListener("click", function () {
      isExpanded = !isExpanded;
      secondaryTextSection.classList.toggle("visible", isExpanded);
      button.querySelector("span").textContent = isExpanded
        ? "Minder lezen"
        : "Meer lezen";
      icon.style.transform = isExpanded ? "rotate(180deg)" : "rotate(0deg)";
    });

    window.addEventListener("resize", checkScreenSize);
    checkScreenSize();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const dropdown = document.querySelector(".dropdown");
  const button = dropdown.querySelector(".button-component");
  const hiddenText = button.querySelector(".hidden-text");
  const flagImg = button.querySelector(".flag");
  const dropdownMenu = dropdown.querySelector(".dropdown-menu");

  // Define language content mapping
  const languages = {
    Nederlands: {
      flag: "https://flagcdn.com/nl.svg",
      text: "Nederlands",
      login: "Inloggen",
    },
    Vlaanderen: {
      flag: "https://flagcdn.com/be.svg",
      text: "Vlaanderen",
      login: "Aanmelden",
    },
    Wallonië: {
      flag: "https://flagcdn.com/be.svg",
      text: "Wallonië",
      login: "Se connecter",
    },
  };

  dropdownMenu.addEventListener("click", function (event) {
    const item = event.target.closest(".dropdown-item");
    if (!item) return; // Ignore clicks outside items

    const selectedText = item.textContent.trim();
    if (!languages[selectedText]) return;

    // Get current displayed values
    const currentText = hiddenText.textContent;
    const currentFlagSrc = flagImg.src;

    // Swap button values
    hiddenText.textContent = languages[selectedText].text;
    flagImg.src = languages[selectedText].flag;
    flagImg.alt = `${selectedText} flag`;
    document.querySelector(".login-button").textContent =
      languages[selectedText].login;

    // Replace selected item in dropdown
    item.innerHTML = `${currentText} <img src="${currentFlagSrc}" alt="${currentText} flag" class="flag-small" />`;
  });
});

