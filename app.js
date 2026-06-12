const gifts = [
  { name: "Neona", role: "Town resident", likes: ["Quartz"], note: "Reported by PC Gamer; still needs an independent in-game check.", status: "needs-check" },
  { name: "Pastelle", role: "Ranching mentor", likes: ["Data needed"], note: "Help verify Pastelle's loved and liked gifts.", status: "needs-check" },
  { name: "Solana", role: "Childhood friend", likes: ["Data needed"], note: "Help verify Solana's loved and liked gifts.", status: "needs-check" },
  { name: "Gust", role: "Visiting character", likes: ["Data needed"], note: "Collaboration character. Gift data needs verification.", status: "needs-check" },
  { name: "Ginger", role: "Visiting character", likes: ["Data needed"], note: "Collaboration character. Gift data needs verification.", status: "needs-check" },
  { name: "Fang", role: "Visiting character", likes: ["Data needed"], note: "Collaboration character. Gift data needs verification.", status: "needs-check" }
];

const recipes = {
  "Glass Pane": { output: 1, ingredients: { Sand: 3 } },
  "Wood Plank": { output: 1, ingredients: { Wood: 2 } },
  "Stone Tile": { output: 1, ingredients: { Stone: 3 } },
  "Simple Patio": { output: 1, ingredients: { "Wood Plank": 8, "Stone Tile": 4, "Glass Pane": 2 } }
};

const database = {
  fish: [
    { name: "Fish records needed", season: "All seasons", place: "Submit a discovery", status: "Unverified" }
  ],
  crop: [
    { name: "Crop records needed", season: "All seasons", place: "Submit a discovery", status: "Unverified" }
  ]
};

const tasks = [
  "Craft your first hatchet",
  "Craft your first pickaxe",
  "Meet the ranching mentor",
  "Start the island train quest",
  "Label your storage chests",
  "Rent a mount",
  "Visit Moonlit Forest",
  "Submit one verified discovery"
];

const giftResults = document.querySelector("#giftResults");
const giftSearch = document.querySelector("#giftSearch");
const giftFilter = document.querySelector("#giftFilter");
const recipeSelect = document.querySelector("#recipeSelect");
const recipeQuantity = document.querySelector("#recipeQuantity");
const materialResults = document.querySelector("#materialResults");
const recipeSummary = document.querySelector("#recipeSummary");
const checklistItems = document.querySelector("#checklistItems");
const checkCount = document.querySelector("#checkCount");

function renderGifts() {
  const term = giftSearch.value.trim().toLowerCase();
  const filter = giftFilter.value;
  const matches = gifts.filter(gift => {
    const searchable = `${gift.name} ${gift.role} ${gift.likes.join(" ")}`.toLowerCase();
    return searchable.includes(term) && (filter === "all" || gift.status === filter);
  });
  giftResults.innerHTML = matches.length ? matches.map(gift => `
    <article class="gift-card">
      <div class="gift-card-top">
        <span class="avatar">${gift.name.slice(0, 1)}</span>
        <span class="verification ${gift.status === "verified" ? "" : "unverified"}">${gift.status === "verified" ? "Verified" : "Needs check"}</span>
      </div>
      <h3>${gift.name}</h3>
      <p>${gift.role}</p>
      <div>${gift.likes.map(item => `<span class="tag">${item}</span>`).join("")}</div>
      <p style="margin-top:12px">${gift.note}</p>
    </article>`).join("") : `<p class="empty">No matching gift records yet. Try a broader search.</p>`;
}

function expandRecipe(item, quantity, totals = {}) {
  const recipe = recipes[item];
  if (!recipe) {
    totals[item] = (totals[item] || 0) + quantity;
    return totals;
  }
  const batches = Math.ceil(quantity / recipe.output);
  Object.entries(recipe.ingredients).forEach(([ingredient, amount]) => expandRecipe(ingredient, amount * batches, totals));
  return totals;
}

function renderRecipe() {
  const item = recipeSelect.value;
  const quantity = Math.max(1, Number(recipeQuantity.value) || 1);
  const totals = expandRecipe(item, quantity);
  materialResults.innerHTML = Object.entries(totals).map(([name, amount]) => `<div class="material-row"><span>${name}</span><strong>${amount}</strong></div>`).join("");
  recipeSummary.textContent = `Preview recipe data: make ${quantity} × ${item}. Material quantities must be checked in-game before publication.`;
}

let activeCategory = "fish";
let activeFilter = "All";
function renderDatabase() {
  const filters = ["All", ...new Set(database[activeCategory].map(item => item.season))];
  document.querySelector("#filterChips").innerHTML = filters.map(filter => `<button class="chip ${filter === activeFilter ? "active" : ""}" data-filter="${filter}" type="button">${filter}</button>`).join("");
  const rows = database[activeCategory].filter(item => activeFilter === "All" || item.season === activeFilter);
  document.querySelector("#databaseResults").innerHTML = rows.map(item => `
    <div class="database-row"><strong>${item.name}</strong><span>${item.season}</span><span>${item.place}</span><span>${item.status}</span></div>`).join("");
  document.querySelectorAll(".chip").forEach(button => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    renderDatabase();
  }));
}

function savedTasks() {
  return JSON.parse(localStorage.getItem("island-ledger-tasks") || "[]");
}
function renderChecklist() {
  const saved = savedTasks();
  checklistItems.innerHTML = tasks.map((task, index) => `
    <label class="check-item ${saved.includes(index) ? "done" : ""}">
      <input type="checkbox" data-task="${index}" ${saved.includes(index) ? "checked" : ""}>
      <span>${task}</span>
    </label>`).join("");
  checkCount.textContent = saved.length;
  checklistItems.querySelectorAll("input").forEach(input => input.addEventListener("change", () => {
    const next = new Set(savedTasks());
    input.checked ? next.add(Number(input.dataset.task)) : next.delete(Number(input.dataset.task));
    localStorage.setItem("island-ledger-tasks", JSON.stringify([...next]));
    renderChecklist();
  }));
}

giftSearch.addEventListener("input", renderGifts);
giftFilter.addEventListener("change", renderGifts);
recipeQuantity.addEventListener("input", renderRecipe);
recipeSelect.addEventListener("change", renderRecipe);
document.querySelector("#dayRange").addEventListener("input", event => document.querySelector("#dayNumber").textContent = event.target.value);
document.querySelector("#themeButton").addEventListener("click", event => {
  document.body.classList.toggle("dark");
  event.target.textContent = document.body.classList.contains("dark") ? "Day" : "Night";
});
document.querySelector("#resetChecklist").addEventListener("click", () => {
  localStorage.removeItem("island-ledger-tasks");
  renderChecklist();
});
document.querySelector("#copyMaterials").addEventListener("click", async event => {
  const list = [...materialResults.querySelectorAll(".material-row")].map(row => `${row.children[0].textContent}: ${row.children[1].textContent}`).join("\n");
  await navigator.clipboard.writeText(list);
  event.target.textContent = "Copied";
  setTimeout(() => event.target.textContent = "Copy shopping list", 1200);
});
document.querySelectorAll(".tab").forEach(tab => tab.addEventListener("click", () => {
  document.querySelectorAll(".tab").forEach(item => item.classList.remove("active"));
  tab.classList.add("active");
  activeCategory = tab.dataset.category;
  activeFilter = "All";
  renderDatabase();
}));

recipeSelect.innerHTML = Object.keys(recipes).map(item => `<option>${item}</option>`).join("");
document.querySelector("#verifiedCount").textContent = gifts.filter(gift => gift.status === "verified").length;
renderGifts();
renderRecipe();
renderDatabase();
renderChecklist();
