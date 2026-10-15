document.addEventListener("DOMContentLoaded", function () {

  const currentYear = document.getElementById("current-year");
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  const navbar = document.querySelector(".navbar-container");
  const backToTop = document.getElementById("back-to-top");

  if (navbar || backToTop) {
    const updateScrollControls = () => {
      if (navbar) {
        navbar.classList.toggle("navbar-scroll", window.scrollY > 50);
      }
      if (backToTop) {
        backToTop.hidden = window.scrollY <= 400;
      }
    };

    window.addEventListener("scroll", updateScrollControls, { passive: true });
    updateScrollControls();
  }

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo(0, 0);
    });
  }

  const revealTargets = document.querySelectorAll(
    ".services-container h2, .services-container > ul, .kpi-section h2, .about-content, .founder-card, .pricing-heading, .plan-comparison-wrap, .payment-options, .faq-heading, .faq-list, .contact-container h2, #leadForm"
  );

  if (revealTargets.length > 0) {
    document.body.classList.add("scroll-motion-enabled");
    revealTargets.forEach((element) => {
      element.classList.add("scroll-reveal");
    });

    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      }, { threshold: 0.12 });

      revealTargets.forEach((element) => {
        revealObserver.observe(element);
      });
    } else {
      revealTargets.forEach((element) => {
        element.classList.add("is-visible");
      });
    }
  }

  const serviceCards = document.querySelectorAll(".service-card");
  const servicesList = document.querySelector(".services-container > ul");

  if (serviceCards.length > 0 && servicesList) {
    document.body.classList.add("services-motion-enabled");
    const serviceRevealFrames = new WeakMap();
    const revenueFrames = new WeakMap();
    const sequenceTimers = new Set();

    const animateRevenue = (card) => {
      const value = card.querySelector(".revenue-value");
      const target = Number(value.dataset.target);

      if (!Number.isFinite(target) || target < 0) {
        console.error("Valor inválido para a simulação de receita.", value);
        return;
      }

      const duration = 1600;
      let startTime;

      const updateRevenue = (timestamp) => {
        if (startTime === undefined) {
          startTime = timestamp;
        }

        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const amount = Math.round(target * easedProgress);
        value.textContent = `R$ ${amount.toLocaleString("pt-BR")}`;

        if (progress < 1) {
          revenueFrames.set(value, requestAnimationFrame(updateRevenue));
        } else {
          revenueFrames.delete(value);
        }
      };

      revenueFrames.set(value, requestAnimationFrame(updateRevenue));
    };

    const resetService = (card) => {
      card.classList.remove("is-visible", "is-hit", "is-complete");
      const value = card.querySelector(".revenue-value");

      if (card.classList.contains("revenue-card")) {
        value.textContent = "R$ 0";
        const previousFrame = revenueFrames.get(value);
        if (previousFrame) {
          cancelAnimationFrame(previousFrame);
          revenueFrames.delete(value);
        }
      }

      const previousReveal = serviceRevealFrames.get(card);
      if (previousReveal) {
        cancelAnimationFrame(previousReveal);
        serviceRevealFrames.delete(card);
      }
    };

    const revealService = (card) => {
      serviceRevealFrames.set(card, requestAnimationFrame(() => {
        card.classList.add("is-visible", "is-hit", "is-complete");
        if (card.classList.contains("revenue-card")) {
          animateRevenue(card);
        }
        serviceRevealFrames.delete(card);
      }));
    };

    const startServiceSequence = () => {
      if (servicesList.classList.contains("sequence-active")) {
        return;
      }

      servicesList.classList.add("sequence-active");
      serviceCards.forEach(resetService);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        serviceCards.forEach((card) => {
          card.classList.add("is-visible", "is-complete");
          const value = card.querySelector(".revenue-value");
          if (value) {
            const target = Number(value.dataset.target);
            if (!Number.isFinite(target) || target < 0) {
              console.error("Valor inválido para a simulação de receita.", value);
              return;
            }
            value.textContent = `R$ ${target.toLocaleString("pt-BR")}`;
          }
        });
        return;
      }

      serviceCards.forEach((card, index) => {
        const timer = window.setTimeout(() => {
          sequenceTimers.delete(timer);
          revealService(card);
        }, index * 1050);
        sequenceTimers.add(timer);
      });
    };

    const stopServiceSequence = () => {
      servicesList.classList.remove("sequence-active");
      sequenceTimers.forEach(clearTimeout);
      sequenceTimers.clear();
      serviceCards.forEach(resetService);
    };

    if ("IntersectionObserver" in window) {
      const serviceSequenceObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startServiceSequence();
            return;
          }
          stopServiceSequence();
        });
      }, { threshold: 0.15 });

      serviceSequenceObserver.observe(servicesList);
    } else {
      startServiceSequence();
    }
  }

  const kpis = document.querySelectorAll(".kpi-number");

  if (kpis.length > 0) {
    document.body.classList.add("motion-enabled");
    const kpiFrames = new WeakMap();
    const kpiRevealFrames = new WeakMap();

    const animateKpi = (kpi) => {
      const target = Number(kpi.dataset.target);

      if (!Number.isFinite(target) || target < 0) {
        console.error("Valor inválido para o indicador de performance.", kpi);
        return;
      }

      const duration = 2200;
      let startTime;

      const update = (timestamp) => {
        if (startTime === undefined) {
          startTime = timestamp;
        }

        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easedProgress = progress * progress * (3 - 2 * progress);
        const current = Math.round(target * easedProgress);

        kpi.textContent = current.toLocaleString("pt-BR");

        if (progress < 1) {
          kpiFrames.set(kpi, requestAnimationFrame(update));
        } else {
          kpiFrames.delete(kpi);
        }
      };

      kpiFrames.set(kpi, requestAnimationFrame(update));
    };

    const kpiCards = document.querySelectorAll(".kpi-card");
    const startKpiAnimation = (card) => {
      const kpi = card.querySelector(".kpi-number");
      card.classList.remove("is-visible");
      kpi.textContent = "0";

      const previousFrame = kpiFrames.get(kpi);
      if (previousFrame) {
        cancelAnimationFrame(previousFrame);
      }

      const previousReveal = kpiRevealFrames.get(card);
      if (previousReveal) {
        cancelAnimationFrame(previousReveal);
      }

      kpiRevealFrames.set(card, requestAnimationFrame(() => {
        card.classList.add("is-visible");
        animateKpi(kpi);
        kpiRevealFrames.delete(card);
      }));
    };

    if ("IntersectionObserver" in window) {
      const kpiObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const card = entry.target;

          if (entry.isIntersecting) {
            startKpiAnimation(card);
            return;
          }

          card.classList.remove("is-visible");
          const kpi = card.querySelector(".kpi-number");
          const animationFrame = kpiFrames.get(kpi);
          if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            kpiFrames.delete(kpi);
          }
          kpi.textContent = "0";

          const revealFrame = kpiRevealFrames.get(card);
          if (revealFrame) {
            cancelAnimationFrame(revealFrame);
            kpiRevealFrames.delete(card);
          }
        });
      }, { threshold: 0.15 });

      kpiCards.forEach((card) => {
        kpiObserver.observe(card);
      });
    } else {
      kpiCards.forEach((card) => {
        startKpiAnimation(card);
      });
    }
  }

  const form = document.getElementById("leadForm");
  const formMessage = document.getElementById("form-message");

  function showFormMessage(message, isError = false) {
    if (!formMessage) {
      alert(message);
      return;
    }

    formMessage.textContent = message;
    formMessage.style.display = "block";
    formMessage.style.background = isError ? "#fee2e2" : "#dcfce7";
    formMessage.style.color = isError ? "#991b1b" : "#166534";
    formMessage.style.border = isError ? "1px solid #fecaca" : "1px solid #bbf7d0";
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const nome = document.getElementById("nome");
      const email = document.getElementById("email");

      if (!nome || !email) {
        alert("Campos obrigatórios não encontrados no formulário.");
        return;
      }

      const nomeValue = nome.value.trim();
      const emailValue = email.value.trim();

      if (!nomeValue || !emailValue) {
        showFormMessage("Por favor, preencha seu nome e e-mail.", true);
        if (!nomeValue) {
          nome.focus();
        } else {
          email.focus();
        }
        return;
      }

      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

      if (!emailValido) {
        showFormMessage("Informe um e-mail válido.", true);
        email.focus();
        return;
      }

      showFormMessage(`Lead ${nomeValue} cadastrado com sucesso!`);
      form.reset();
    });
  }
});