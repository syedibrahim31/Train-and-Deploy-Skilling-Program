const STORAGE_KEY = "statements";
let statements = [];
let editId = null;
/* ---------------- INIT ---------------- */
function loadData() {
    const data = localStorage.getItem(STORAGE_KEY);
    statements = data ? JSON.parse(data) : [];
}
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statements));
}
/* ---------------- VALIDATION ---------------- */
function isValidAmount(credit, debit) {
    if (credit < 0 || debit < 0) {
        alert("Negative values are not allowed.");
        return false;
    }
    if (credit > 0 && debit > 0) {
        alert("Only one of Credit or Debit can have value.");
        return false;
    }
    return true;
}
/* ---------------- ADD ---------------- */
function addStatement() {
    const date = document.getElementById("date").value;
    const header = document.getElementById("header").value;
    const credit = Number(document.getElementById("credit").value) || 0;
    const debit = Number(document.getElementById("debit").value) || 0;
    if (!date || !header) {
        alert("Date and Header required");
        return;
    }
    if (!isValidAmount(credit, debit)) return;
    const newItem = {
        id: Date.now(),
        date,
        header,
        credit,
        debit
    };
    statements.push(newItem);
    saveData();
    clearAddForm();
    render();
}
function clearAddForm() {
    document.getElementById("date").value = "";
    document.getElementById("header").value = "";
    document.getElementById("credit").value = "";
    document.getElementById("debit").value = "";
}
/* ---------------- REMOVE ---------------- */
function removeStatement(id) {
    statements = statements.filter(s => s.id !== id);
    saveData();
    render();
}
/* ---------------- EDIT ---------------- */
function setEdit(id) {
    editId = id;
    render();
}
function cancelEdit() {
    editId = null;
    render();
}
function saveEdit(id) {
    const date = document.getElementById(`date-${id}`).value;
    const header = document.getElementById(`header-${id}`).value;
    const credit = Number(document.getElementById(`credit-${id}`).value) || 0;
    const debit = Number(document.getElementById(`debit-${id}`).value) || 0;
    if (!isValidAmount(credit, debit)) return;
    statements = statements.map(s =>
        s.id === id ? { ...s, date, header, credit, debit } : s
    );
    editId = null;
    saveData();
    render();
}
/* ---------------- RENDER ---------------- */
function render() {
    const container = document.getElementById("statementList");
    container.innerHTML = "";
    let totalCredit = 0;
    let totalDebit = 0;
    statements.forEach((s, index) => {
        totalCredit += s.credit;
        totalDebit += s.debit;
        const row = document.createElement("div");
        row.className = "row align-items-center py-2 border-bottom";
        if (editId === s.id) {
            row.innerHTML = `
<div class="col-1">${index + 1}</div>
<div class="col-2">
<input type="date" id="date-${s.id}" value="${s.date}" class="form-control form-control-sm"/>
</div>
<div class="col-3">
<input type="text" id="header-${s.id}" value="${s.header}" class="form-control form-control-sm"/>
</div>
<div class="col-2">
<input type="number" min="0" id="credit-${s.id}" value="${s.credit}" class="form-control form-control-sm"/>
</div>
<div class="col-2">
<input type="number" min="0" id="debit-${s.id}" value="${s.debit}" class="form-control form-control-sm"/>
</div>
<div class="col-2">
<div class="row-6">
<button class="btn btn-success btn-sm me-1" onclick="saveEdit(${s.id})">SAVE</button>
<button class="btn btn-secondary btn-sm" onclick="cancelEdit()">CANCEL</button>
</div>
</div>

     `;
        } else {
            row.innerHTML = `
<div class="col-1">${index + 1}</div>
<div class="col-2">${s.date}</div>
<div class="col-3">${s.header}</div>
<div class="col-2">${s.credit || ""}</div>
<div class="col-2">${s.debit || ""}</div>
<div class="col-2">
<button class="btn btn-primary btn-sm me-1" onclick="setEdit(${s.id})">EDIT</button>
<button class="btn btn-danger btn-sm" onclick="removeStatement(${s.id})">REMOVE</button>
</div>
     `;
        }
        container.appendChild(row);
    });
    /* ----- TOTAL ROW ----- */
    const totalRow = document.createElement("div");
    totalRow.className = "row fw-bold border-top pt-3";
    totalRow.innerHTML = `
<div class="col-6 text-end">Totals:</div>
<div class="col-2">${totalCredit}</div>
<div class="col-2">${totalDebit}</div>
<div class="col-2"></div>
 `;
    container.appendChild(totalRow);
    /* ----- BALANCE ROW ----- */
    const balanceRow = document.createElement("div");
    balanceRow.className = "row fw-bold";
    balanceRow.innerHTML = `
<div class="col-6 text-end">Balance:</div>
<div class="col-6">${totalCredit - totalDebit}</div>
<div class="col-2"></div>
 `;
    container.appendChild(balanceRow);
}
/* ---------------- START ---------------- */
document.getElementById("addBtn")
    .addEventListener("click", addStatement);
loadData();
render();