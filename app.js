document.querySelector("#year").textContent = new Date().getFullYear();
const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector("#navigation");
function closeMenu() {
  menu.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-label", "Open navigation");
  nav.classList.remove("is-open");
}
menu.addEventListener("click", () => {
  const opened = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(opened));
  menu.setAttribute(
    "aria-label",
    opened ? "Close navigation" : "Open navigation",
  );
  nav.classList.toggle("is-open", opened);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("is-open")) {
    closeMenu();
    menu.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".header-inner")) closeMenu();
});
nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

const form = document.querySelector("#cohort-form");
if (form) {
  document.querySelectorAll("[data-area], [data-specimen]").forEach((link) => {
    link.addEventListener("click", () => {
      if (link.dataset.area)
        form.elements.area.value = decodeURIComponent(link.dataset.area);
      if (link.dataset.specimen) {
        const selection =
          {
            ffpe: ["FFPE Tissue Blocks"],
            biofluids: ["Matched Serum", "Matched Plasma"],
            pbmcs: ["PBMCs"],
          }[link.dataset.specimen] || [];
        form.querySelectorAll('[name="specimens"]').forEach((input) => {
          input.checked = selection.includes(input.value);
        });
        if (link.dataset.specimen === "custom" && !form.elements.criteria.value)
          form.elements.criteria.value = "Custom prospective cohort: ";
      }
    });
  });
  for (const input of form.querySelectorAll("input[required]")) {
    input.addEventListener("input", () =>
      input.setCustomValidity(
        input.value.trim() ? "" : "Please complete this field.",
      ),
    );
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    for (const input of form.querySelectorAll("input[required]"))
      input.setCustomValidity(
        input.value.trim() ? "" : "Please complete this field.",
      );
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const summary = [
      "BHAVA BIOSCIENCES — COHORT FEASIBILITY REQUEST",
      "Prepared locally. This request has NOT been submitted.",
      "",
      `Name: ${values.get("firstName").trim()} ${values.get("lastName").trim()}`,
      `Work email: ${values.get("email").trim()}`,
      `Institution: ${values.get("company").trim()}`,
      `Therapeutic area: ${values.get("area") || "Not specified"}`,
      `Specimen matrix: ${values.getAll("specimens").join(", ") || "Not specified"}`,
      `Target cohort size: ${values.get("cohortSize") || "Not specified"}`,
      "",
      "Key study criteria:",
      values.get("criteria").trim() || "Not specified",
    ].join("\n");
    const url = URL.createObjectURL(
      new Blob([summary], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "bhava-cohort-request.txt";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    const result = document.querySelector("#form-result");
    result.hidden = false;
    result.textContent =
      "Your request summary is ready. Check your downloads for bhava-cohort-request.txt. This request has not been sent to Bhava Biosciences.";
  });
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      document.querySelectorAll("[data-nav]").forEach((link) => {
        if (link.dataset.nav === entry.target.id)
          link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }
  },
  { rootMargin: "-15% 0px -65% 0px" },
);
document
  .querySelectorAll(".page-section")
  .forEach((section) => sectionObserver.observe(section));
