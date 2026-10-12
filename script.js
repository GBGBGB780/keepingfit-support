(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNavigation = document.querySelector(".mobile-nav");

  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  const setMenuOpen = (open, restoreFocus = false) => {
    if (!menuToggle || !mobileNavigation) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
    mobileNavigation.hidden = !open;
    document.body.classList.toggle("menu-open", open);
    if (restoreFocus) menuToggle.focus();
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
  menuToggle?.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  mobileNavigation?.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
  });

  document.addEventListener("click", (event) => {
    if (
      menuToggle?.getAttribute("aria-expanded") === "true" &&
      !header?.contains(event.target)
    ) {
      setMenuOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false, true);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1120) setMenuOpen(false);
  });

  const revealItems = [...document.querySelectorAll(".reveal")];

  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    revealItems.forEach((item) => revealObserver.observe(item));
    requestAnimationFrame(() => {
      document.querySelectorAll(".hero .reveal").forEach((item) => item.classList.add("is-visible"));
    });
  }

  const counters = [...document.querySelectorAll("[data-counter]")];

  const animateCounter = (element) => {
    const target = Number(element.dataset.counter);
    if (!Number.isFinite(target) || reducedMotion.matches) {
      element.textContent = String(target);
      return;
    }

    const start = performance.now();
    const duration = 900;

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.5 },
    );
    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }

  const heroProduct = document.querySelector(".hero-product");
  const heroPhone = document.querySelector(".hero-phone");
  const heroWatch = document.querySelector(".hero-watch");

  if (heroProduct && heroPhone && heroWatch && !reducedMotion.matches) {
    heroProduct.addEventListener("pointermove", (event) => {
      if (window.innerWidth < 900) return;
      const rect = heroProduct.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      heroPhone.style.transform = `rotateY(${-8 + x * 5}deg) rotateX(${-y * 3}deg) rotateZ(-3deg) translate3d(${x * 5}px, ${y * 5}px, 0)`;
      heroWatch.style.transform = `rotateY(${7 + x * 7}deg) rotateX(${-y * 5}deg) rotateZ(4deg) translate3d(${x * -7}px, ${y * -7}px, 0)`;
    });

    heroProduct.addEventListener("pointerleave", () => {
      heroPhone.style.removeProperty("transform");
      heroWatch.style.removeProperty("transform");
    });
  }

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  const canvas = document.querySelector(".energy-canvas");
  if (!canvas || reducedMotion.matches || !document.body.classList.contains("landing-page")) return;

  const context = canvas.getContext("2d");
  let particles = [];
  let animationFrame = 0;

  const resizeCanvas = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.min(52, Math.max(24, Math.floor(window.innerWidth / 28)));
    particles = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: index % 8 === 0 ? 1.2 : 0.65,
      speed: 0.08 + Math.random() * 0.12,
      drift: (Math.random() - 0.5) * 0.08,
      alpha: 0.12 + Math.random() * 0.24,
    }));
  };

  const draw = () => {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((particle, index) => {
      particle.y -= particle.speed;
      particle.x += particle.drift;

      if (particle.y < -4) {
        particle.y = window.innerHeight + 4;
        particle.x = Math.random() * window.innerWidth;
      }

      context.beginPath();
      context.fillStyle = `rgba(92, 240, 161, ${particle.alpha})`;
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();

      if (index % 6 === 0) {
        const next = particles[(index + 1) % particles.length];
        const distance = Math.hypot(particle.x - next.x, particle.y - next.y);
        if (distance < 130) {
          context.beginPath();
          context.strokeStyle = `rgba(92, 240, 161, ${0.06 * (1 - distance / 130)})`;
          context.lineWidth = 0.5;
          context.moveTo(particle.x, particle.y);
          context.lineTo(next.x, next.y);
          context.stroke();
        }
      }
    });

    animationFrame = requestAnimationFrame(draw);
  };

  resizeCanvas();
  draw();
  window.addEventListener("resize", resizeCanvas, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrame);
    } else {
      draw();
    }
  });
})();
