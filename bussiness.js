/* ==========================================================
   Nairobi Local Business Directory - script.js
   One file for all pages. Each function first checks that the
   elements it needs exist, so it is safe to load everywhere.
   Load it at the bottom of <head> with:  <script src="script.js" defer></script>
   ========================================================== */


/* ---------- 1. HIGHLIGHT THE CURRENT PAGE IN THE NAV ---------- */
function highlightCurrentPage() {
  // "/folder/businesses.html" -> "businesses.html" ("" becomes index.html)
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll("nav a").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.setAttribute("aria-current", "page");   // your CSS already styles this
    }
  });
}


/* ---------- 2. SEARCH + CATEGORY FILTER (businesses.html) ---------- */
function setupDirectoryFilter() {
  const searchInput    = document.querySelector("#search");
  const categorySelect = document.querySelector("#category-filter");
  const resultCount    = document.querySelector("#result-count");
  const noResults      = document.querySelector("#no-results");
  const rows           = document.querySelectorAll("tbody tr");

  // Not on the directory page? Stop quietly.
  if (!searchInput || !categorySelect || rows.length === 0) return;

  // Build the category dropdown from the table itself, so when you add
  // a new business with a new category, the dropdown updates by itself.
  const categories = new Set();
  rows.forEach((row) => categories.add(row.cells[1].textContent.trim()));

  [...categories].sort().forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });

  function applyFilters() {
    const query    = searchInput.value.trim().toLowerCase();
    const selected = categorySelect.value;
    let visibleCount = 0;

    rows.forEach((row) => {
      const rowText     = row.textContent.toLowerCase();
      const rowCategory = row.cells[1].textContent.trim();

      const matchesSearch   = rowText.includes(query);
      const matchesCategory = selected === "all" || rowCategory === selected;
      const isVisible       = matchesSearch && matchesCategory;

      row.hidden = !isVisible;            // the `hidden` attribute hides the row
      if (isVisible) visibleCount++;
    });

    if (resultCount) {
      resultCount.textContent = `Showing ${visibleCount} of ${rows.length} businesses`;
    }
    if (noResults) {
      noResults.hidden = visibleCount > 0;
    }
  }

  // Re-run the filter every time the person types or changes the dropdown
  searchInput.addEventListener("input", applyFilters);
  categorySelect.addEventListener("change", applyFilters);

  applyFilters();   // set the initial count
}


/* ---------- 3. SIGN-UP FORM (signup.html) ---------- */
function setupSignupForm() {
  const form        = document.querySelector("#signup-form");
  if (!form) return;

  const password    = document.querySelector("#password");
  const confirm     = document.querySelector("#confirm");
  const showToggle  = document.querySelector("#show-password");
  const message     = document.querySelector("#form-message");

  // 3a. Make sure both passwords match.
  // setCustomValidity("text") marks the field invalid and shows that text
  // in the browser's own error bubble. Setting it to "" clears the error.
  function checkPasswordsMatch() {
    const mismatch = confirm.value !== "" && password.value !== confirm.value;
    confirm.setCustomValidity(mismatch ? "Passwords do not match." : "");
  }

  password.addEventListener("input", checkPasswordsMatch);
  confirm.addEventListener("input", checkPasswordsMatch);

  // 3b. "Show password" checkbox
  if (showToggle) {
    showToggle.addEventListener("change", () => {
      const type = showToggle.checked ? "text" : "password";
      password.type = type;
      confirm.type  = type;
    });
  }

  // 3c. Handle the submit. This event only fires if the browser's own
  // validation (required, minlength, email format...) has already passed.
  form.addEventListener("submit", (event) => {
    event.preventDefault();   // stop the page reloading; there is no server yet

    const name = document.querySelector("#fullname").value.trim();

    if (message) {
      message.textContent =
        `Thanks, ${name}! Your details look valid. ` +
        `(No server yet, so no account was really created.)`;
      message.hidden = false;
    }

    form.reset();
  });

  // IMPORTANT: never save passwords in localStorage, cookies or a file.
  // Real accounts need a backend that stores a hashed password.
}


/* ---------- 4. START EVERYTHING ---------- */
highlightCurrentPage();
setupDirectoryFilter();
setupSignupForm();