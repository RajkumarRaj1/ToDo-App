document.addEventListener("DOMContentLoaded", () => {
  const totalIncomeElem = document.getElementById("total-income");
  const totalExpenseElem = document.getElementById("total-expense");
  const netBalanceElem = document.getElementById("net-balance");
  const entriesElem = document.getElementById("entries");
  const addBtn = document.getElementById("add-btn");
  const resetBtn = document.getElementById("reset-btn");
  let entries = JSON.parse(localStorage.getItem("entries")) || [];

  function updateSummary() {
    const totalIncome = entries
      .filter((entry) => entry.type === "income")
      .reduce((sum, entry) => sum + entry.amount, 0);
    const totalExpense = entries
      .filter((entry) => entry.type === "expense")
      .reduce((sum, entry) => sum + entry.amount, 0);
    const netBalance = totalIncome - totalExpense;

    totalIncomeElem.textContent = totalIncome;
    totalExpenseElem.textContent = totalExpense;
    netBalanceElem.textContent = netBalance;
  }

  function renderEntries(filter = "all") {
    entriesElem.innerHTML = "";
    const filteredEntries =
      filter === "all"
        ? entries
        : entries.filter((entry) => entry.type === filter);
    filteredEntries.forEach((entry, index) => {
      const entryElem = document.createElement("li");
      entryElem.innerHTML = `
                    <span>${entry.description}</span>
                    <span>${entry.amount}</span>
                    <button onclick="editEntry(${index})">Edit</button>
                    <button onclick="deleteEntry(${index})">Delete</button>
                `;
      entriesElem.appendChild(entryElem);
    });
  }

  function saveEntries() {
    localStorage.setItem("entries", JSON.stringify(entries));
  }

  addBtn.addEventListener("click", () => {
    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const type = amount <= 0 ? "income" : "expense";

    if (description && !isNaN(amount)) {
      entries.push({ description, amount, type });
      saveEntries();
      updateSummary();
      renderEntries();
    }
  });

  resetBtn.addEventListener("click", () => {
    document.getElementById("description").value = "";
    document.getElementById("amount").value = "";
  });

  document.querySelectorAll('input[name="filter"]').forEach((radio) => {
    radio.addEventListener("change", (event) => {
      renderEntries(event.target.value);
    });
  });

  window.editEntry = (index) => {
    const entry = entries[index];
    document.getElementById("description").value = entry.description;
    document.getElementById("amount").value = entry.amount;
    deleteEntry(index);
  };

  window.deleteEntry = (index) => {
    entries.splice(index, 1);
    saveEntries();
    updateSummary();
    renderEntries();
  };

  updateSummary();
  renderEntries();
});
