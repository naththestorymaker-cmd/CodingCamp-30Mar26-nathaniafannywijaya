// State
// Transaction shape: { id: string, name: string, amount: number, category: "Food"|"Transport"|"Fun", date: string }
const state = {
  transactions: [],
  chart: null,
  sortOrder: "default"
};

// Storage
function saveToStorage(transactions) {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function loadFromStorage() {
  try {
    return JSON.parse(localStorage.getItem("transactions") || "[]");
  } catch (e) {
    const warning = document.getElementById("storage-warning");
    if (warning) warning.hidden = false;
    return [];
  }
}

function addTransaction(tx) {
  state.transactions.push(tx);
  saveToStorage(state.transactions);
  renderAll();
}

function deleteTransaction(id) {
  state.transactions = state.transactions.filter(function (tx) { return tx.id !== id; });
  saveToStorage(state.transactions);
  renderAll();
}

function renderList() {
  const list = document.getElementById("transaction-list");
  list.innerHTML = "";

  // Sort a copy — never mutate state.transactions
  var sorted = state.transactions.slice();
  if (state.sortOrder === "amount-asc") {
    sorted.sort(function (a, b) { return a.amount - b.amount; });
  } else if (state.sortOrder === "amount-desc") {
    sorted.sort(function (a, b) { return b.amount - a.amount; });
  } else if (state.sortOrder === "category-asc") {
    sorted.sort(function (a, b) { return a.category.localeCompare(b.category); });
  }
  // "default" keeps insertion order

  sorted.forEach(function (tx) {
    const li = document.createElement("li");

    const nameSpan = document.createElement("span");
    nameSpan.className = "tx-name";
    nameSpan.textContent = tx.name;

    const amountSpan = document.createElement("span");
    amountSpan.className = "tx-amount";
    amountSpan.textContent = "$" + tx.amount.toFixed(2);

    const badge = document.createElement("span");
    badge.className = "badge badge-" + tx.category;
    badge.textContent = tx.category;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.setAttribute("aria-label", "Delete " + tx.name);
    deleteBtn.textContent = "✕";
    deleteBtn.addEventListener("click", function () {
      deleteTransaction(tx.id);
    });

    li.appendChild(nameSpan);
    li.appendChild(amountSpan);
    li.appendChild(badge);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

function renderBalance() {
  const sum = state.transactions.reduce(function (acc, tx) {
    return acc + tx.amount;
  }, 0);
  const balanceEl = document.getElementById("balance");
  if (balanceEl) balanceEl.textContent = "$" + sum.toFixed(2);
}

function renderChart() {
  const canvas = document.getElementById("expense-chart");
  const placeholder = document.getElementById("chart-placeholder");

  if (state.transactions.length === 0) {
    if (state.chart) {
      state.chart.destroy();
      state.chart = null;
    }
    if (canvas) canvas.hidden = true;
    if (placeholder) placeholder.hidden = false;
    return;
  }

  if (placeholder) placeholder.hidden = true;
  if (canvas) canvas.hidden = false;

  if (!window.Chart) return;

  const totals = { Food: 0, Transport: 0, Fun: 0 };
  state.transactions.forEach(function (tx) {
    if (totals[tx.category] !== undefined) {
      totals[tx.category] += tx.amount;
    }
  });

  const data = {
    labels: ["Food", "Transport", "Fun"],
    datasets: [{
      data: [totals.Food, totals.Transport, totals.Fun],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
    }]
  };

  if (state.chart) {
    state.chart.data = data;
    state.chart.update();
  } else {
    state.chart = new window.Chart(canvas, {
      type: "pie",
      data: data
    });
  }
}

function renderMonthlySummary() {
  const section = document.getElementById("monthly-summary");
  if (!section) return;

  // Clear previous content except the h2
  const h2 = section.querySelector("h2");
  section.innerHTML = "";
  if (h2) section.appendChild(h2);

  if (state.transactions.length === 0) {
    const empty = document.createElement("p");
    empty.className = "summary-empty";
    empty.textContent = "No transactions yet. Add one to see the monthly summary.";
    section.appendChild(empty);
    return;
  }

  // Group by YYYY-MM
  var groups = {};
  state.transactions.forEach(function (tx) {
    var isoStr;
    if (tx.date) {
      isoStr = tx.date;
    } else {
      var ts = parseInt(tx.id);
      isoStr = isNaN(ts) ? null : new Date(ts).toISOString();
    }

    var key;
    if (!isoStr) {
      key = "unknown";
    } else {
      var d = new Date(isoStr);
      if (isNaN(d.getTime())) {
        key = "unknown";
      } else {
        var yyyy = d.getFullYear();
        var mm = String(d.getMonth() + 1).padStart(2, "0");
        key = yyyy + "-" + mm;
      }
    }

    if (!groups[key]) {
      groups[key] = { total: 0, Food: 0, Transport: 0, Fun: 0 };
    }
    groups[key].total += tx.amount;
    if (groups[key][tx.category] !== undefined) {
      groups[key][tx.category] += tx.amount;
    }
  });

  // Sort keys descending (most recent first), "unknown" goes last
  var keys = Object.keys(groups).sort(function (a, b) {
    if (a === "unknown") return 1;
    if (b === "unknown") return -1;
    return b.localeCompare(a);
  });

  var monthNames = ["January","February","March","April","May","June",
                    "July","August","September","October","November","December"];

  keys.forEach(function (key) {
    var g = groups[key];
    var label;
    if (key === "unknown") {
      label = "Unknown";
    } else {
      var parts = key.split("-");
      var yr = parseInt(parts[0]);
      var mo = parseInt(parts[1]) - 1;
      label = monthNames[mo] + " " + yr;
    }

    var group = document.createElement("div");
    group.className = "month-group";

    var header = document.createElement("div");
    header.className = "month-header";

    var h3 = document.createElement("h3");
    h3.textContent = label;

    var totalSpan = document.createElement("span");
    totalSpan.className = "month-total";
    totalSpan.textContent = "$" + g.total.toFixed(2);

    header.appendChild(h3);
    header.appendChild(totalSpan);

    var cats = document.createElement("div");
    cats.className = "month-categories";

    ["Food", "Transport", "Fun"].forEach(function (cat) {
      if (g[cat] > 0) {
        var row = document.createElement("div");
        row.className = "month-category-row";
        var catLabel = document.createElement("span");
        catLabel.textContent = cat;
        var catAmt = document.createElement("span");
        catAmt.textContent = "$" + g[cat].toFixed(2);
        row.appendChild(catLabel);
        row.appendChild(catAmt);
        cats.appendChild(row);
      }
    });

    group.appendChild(header);
    group.appendChild(cats);
    section.appendChild(group);
  });
}

function renderAll() {
  renderList();
  renderBalance();
  renderChart();
  renderMonthlySummary();
}

// Initialization
document.addEventListener("DOMContentLoaded", function () {
  // Theme init (before loading transactions)
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.dataset.theme = savedTheme;
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";
    themeToggle.addEventListener("click", function () {
      const current = document.body.dataset.theme;
      const next = current === "dark" ? "light" : "dark";
      document.body.dataset.theme = next;
      localStorage.setItem("theme", next);
      themeToggle.textContent = next === "dark" ? "☀️" : "🌙";
    });
  }

  state.transactions = loadFromStorage();
  renderAll();

  const form = document.getElementById("expense-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("item-name").value.trim();
      const amount = document.getElementById("amount").value;
      const categoryInput = document.querySelector('input[name="category"]:checked');
      const category = categoryInput ? categoryInput.value : "";
      const errorEl = document.getElementById("form-error");

      if (!name || !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0 || !category) {
        if (errorEl) errorEl.textContent = "Please fill in all fields with a valid name, positive amount, and category.";
        return;
      }

      if (errorEl) errorEl.textContent = "";
      addTransaction({
        id: Date.now().toString(),
        name: name,
        amount: parseFloat(amount),
        category: category,
        date: new Date().toISOString()
      });
      form.reset();
    });
  }

  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", function (e) {
      state.sortOrder = e.target.value;
      renderAll();
    });
  }

  const dismissBtn = document.getElementById("dismiss-warning");
  if (dismissBtn) {
    dismissBtn.addEventListener("click", function () {
      const warning = document.getElementById("storage-warning");
      if (warning) warning.hidden = true;
    });
  }
});
