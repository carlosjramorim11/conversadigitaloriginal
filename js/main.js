(() => {
  "use strict";

  const projects = Array.isArray(window.portfolioProjects) ? window.portfolioProjects : [];
  // Personalize these destinations with your own contact and social profiles.
  const profileLinks = {
    whatsapp: "https://wa.me/?text=Oi%2C%20Carlos!%20Quero%20conversar%20sobre%20um%20projeto.",
    instagram: "https://www.instagram.com/_conversadigital",
    linkedin: "https://www.linkedin.com/in/conversadigital"
  };
  const grid = document.querySelector("#project-grid");
  const filters = [...document.querySelectorAll("[data-filter]")];
  const dialog = document.querySelector("#project-dialog");
  const frame = document.querySelector("#project-frame");
  const preview = document.querySelector("#preview-container");
  const closeButton = document.querySelector(".dialog-close");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const categoryNames = {
    institucional: "Site institucional",
    landing: "Landing page",
    experimental: "Experimental"
  };

  function makeTag(label) {
    const tag = document.createElement("span");
    tag.className = "project-tag";
    tag.textContent = label;
    return tag;
  }

  function createProjectCard(project, index) {
    const article = document.createElement("article");
    article.className = "project-card";
    article.dataset.category = project.category;
    article.style.animationDelay = `${Math.min(index * 70, 210)}ms`;

    const previewButton = document.createElement("button");
    previewButton.className = "project-preview";
    previewButton.type = "button";
    previewButton.setAttribute("aria-label", `Visualizar projeto: ${project.name}`);
    previewButton.addEventListener("click", () => openProject(project));

    const image = document.createElement("img");
    image.src = project.image;
    image.alt = `Capa do projeto ${project.name}`;
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => {
      image.hidden = true;
      previewButton.classList.add("image-unavailable");
    }, { once: true });
    previewButton.append(image);

    if (project.sample) {
      const sampleLabel = document.createElement("span");
      sampleLabel.className = "sample-label";
      sampleLabel.textContent = "DEMONSTRAÇÃO EDITÁVEL";
      previewButton.append(sampleLabel);
    }

    const openIcon = document.createElement("span");
    openIcon.className = "preview-open";
    openIcon.setAttribute("aria-hidden", "true");
    openIcon.textContent = "↗";
    previewButton.append(openIcon);

    const meta = document.createElement("div");
    meta.className = "project-meta";
    const details = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = project.name;
    const description = document.createElement("p");
    description.className = "project-description";
    description.textContent = project.description;
    details.append(title, description);
    const category = document.createElement("span");
    category.className = "project-category";
    category.textContent = categoryNames[project.category] || project.category;
    meta.append(details, category);

    const tags = document.createElement("div");
    tags.className = "project-tags";
    (project.technologies || []).forEach((technology) => tags.append(makeTag(technology)));
    article.append(previewButton, meta, tags);
    return article;
  }

  function renderProjects(filter = "todos") {
    const visibleProjects = projects.filter((project) => filter === "todos" || project.category === filter);
    grid.replaceChildren();

    if (!visibleProjects.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "Nenhum projeto nesta categoria por enquanto.";
      grid.append(empty);
      return;
    }

    visibleProjects.forEach((project, index) => grid.append(createProjectCard(project, index)));
  }

  document.querySelectorAll("[data-filter-count]").forEach((counter) => {
    const category = counter.dataset.filterCount;
    const total = category === "todos"
      ? projects.length
      : projects.filter((project) => project.category === category).length;
    counter.textContent = String(total);
  });

  function openProject(project) {
    document.querySelector("#dialog-title").textContent = project.name;
    document.querySelector("#dialog-description").textContent = project.description;
    document.querySelector("#dialog-category").textContent = categoryNames[project.category] || project.category;
    document.querySelector("#dialog-technologies").replaceChildren(
      ...(project.technologies || []).map(makeTag)
    );

    const openLink = document.querySelector("#dialog-open-link");
    openLink.href = project.url;
    const githubLink = document.querySelector("#dialog-github-link");
    githubLink.classList.toggle("is-hidden", !project.github);
    if (project.github) githubLink.href = project.github;

    preview.classList.toggle("is-disabled", project.embed === false);
    frame.src = project.embed === false ? "about:blank" : project.url;
    if (project.embed === false) {
      preview.setAttribute("aria-label", "Pré-visualização indisponível para este projeto.");
      const message = document.createElement("p");
      message.textContent = "Este site não permite visualização incorporada. Abra-o em uma nova aba para continuar.";
      preview.prepend(message);
    } else {
      preview.removeAttribute("aria-label");
    }
    dialog.showModal();
    closeButton.focus();
  }

  function closeDialog() {
    if (dialog.open) dialog.close();
  }

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      filters.forEach((filterButton) => {
        const active = filterButton === button;
        filterButton.classList.toggle("is-active", active);
        filterButton.setAttribute("aria-pressed", String(active));
      });
      renderProjects(button.dataset.filter);
    });
  });

  closeButton.addEventListener("click", closeDialog);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener("close", () => {
    frame.src = "about:blank";
    preview.classList.remove("is-disabled");
    preview.querySelector("p:not(.preview-fallback)")?.remove();
  });

  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primary-nav");
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    menuToggle.setAttribute("aria-label", expanded ? "Abrir menu" : "Fechar menu");
    nav.classList.toggle("is-open", !expanded);
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
    }
  });

  const header = document.querySelector(".site-header");
  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  const revealItems = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  }

  document.querySelector("#current-year").textContent = String(new Date().getFullYear());
  document.querySelector("[data-contact-whatsapp]").href = profileLinks.whatsapp;
  document.querySelector('[data-social="instagram"]').href = profileLinks.instagram;
  document.querySelector('[data-social="linkedin"]').href = profileLinks.linkedin;
  renderProjects();
})();
