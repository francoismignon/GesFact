document.addEventListener("DOMContentLoaded", function () {
    // --- Recherche de clients (global) ---
    const searchCustomer = document.querySelector('#searchCustomer');
    const selectCustomer = document.querySelector('#selectCustomer');

    // --- Gestion des lignes de facture ---
    const tbody = document.querySelector('#invoice-details tbody');
    const addLineBtn = document.querySelector('#add-line-btn');

    // On récupère le template HTML pour une nouvelle ligne
    const templateHTML = document.querySelector('#invoice-line-template').innerHTML;

    // Compteur pour générer des IDs uniques pour les inputs de recherche
    let uniqueCounter = document.querySelectorAll('#invoice-details tbody tr').length;

    // --- Attacher les événements aux lignes existantes ---
    const allRows = document.querySelectorAll('#invoice-details tbody tr');
    allRows.forEach((row, index) => {
        // Pour les lignes qui n'ont pas d'ID sur l'input de recherche, on en assigne un
        const searchInput = row.querySelector('input[id^="searchItem"]');
        if (!searchInput.id || searchInput.id === 'searchItem') {
            searchInput.id = "searchItem-" + index;
        }
        addListener(row);
        recalc(); // Met à jour le résumé dès le chargement
    });

    // --- Ajout d'une nouvelle ligne ---
    addLineBtn.addEventListener("click", () => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = templateHTML;
        // Incrémenter le compteur pour l'ID unique
        uniqueCounter++;
        // Remplacer l'ID temporaire par un ID unique
        const searchInput = newRow.querySelector('#searchItem-temp');
        if (searchInput) {
            searchInput.id = "searchItem-" + uniqueCounter;
        }
        tbody.appendChild(newRow);
        updateLineNumbers();
        addListener(newRow);
        recalc();
    });

    // --- Recherche de clients ---
    searchCustomer.addEventListener('input', function () {
        const search = this.value.toLowerCase().trim();
        // Sécurisation de la chaîne de recherche pour le regex
        const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(safeSearch);
        let found = false;
        for (let i = 0; i < selectCustomer.options.length; i++) {
            if (regex.test(selectCustomer.options[i].text.toLowerCase())) {
                selectCustomer.options[i].selected = true;
                found = true;
                break;
            }
        }
        if (!found) {
            let lastOption = selectCustomer.options.length;
            selectCustomer.options[lastOption - 1].selected = true;
        }
    });

    // --- Calcul des totaux par ligne ---
    function recalc() {
        const rows = document.querySelectorAll('#invoice-details tbody tr');
        let summary = {};
        rows.forEach(row => {
            const itemSelect = row.querySelector('select[name="selectItem[]"]');
            const option = itemSelect.options[itemSelect.selectedIndex];
            const price = parseFloat(option.getAttribute("price"));
            const vat = parseFloat(option.getAttribute("vat"));
            const qtyInput = row.querySelector('input[name="qty[]"]');
            const discountInput = row.querySelector('input[name="discount[]"]');
            const qty = parseFloat(qtyInput.value);
            const discount = parseFloat(discountInput.value);
            const totalLine = price * qty * (1 - discount / 100);
            const totalElem = row.querySelector(".line-total");
            totalElem.textContent = totalLine.toFixed(2);
            if (!summary[vat]) {
                summary[vat] = 0;
            }
            summary[vat] += totalLine;
        });
        const summaryTableBody = document.querySelector('#summary-table tbody');
        summaryTableBody.innerHTML = '';
        let totalHTVA = 0;
        let totalTVA = 0;
        for (const tvaRate in summary) {
            const base = summary[tvaRate];
            const tvaAmount = base * (parseFloat(tvaRate) / 100);
            totalHTVA += base;
            totalTVA += tvaAmount;
            const row = document.createElement('tr');
            row.innerHTML = `<td>${tvaRate} %</td><td>${base.toFixed(2)}</td><td>${tvaAmount.toFixed(2)}</td>`;
            summaryTableBody.appendChild(row);
        }
        document.getElementById('total-htva').textContent = totalHTVA.toFixed(2);
        document.getElementById('total-tva').textContent = totalTVA.toFixed(2);
        document.getElementById('total-ttc').textContent = (totalHTVA + totalTVA).toFixed(2);
    }

    // --- Ajout des écouteurs d'événements sur une ligne ---
    function addListener(row) {
        // Changement de l'article dans le select
        const itemSelect = row.querySelector('select[name="selectItem[]"]');
        itemSelect.addEventListener("change", recalc);

        // Pour l'input quantité
        const qtyInput = row.querySelector('input[name="qty[]"]');
        qtyInput.addEventListener("input", recalc);

        // Pour l'input discount
        const discountInput = row.querySelector('input[name="discount[]"]');
        discountInput.addEventListener("input", recalc);

        // --- Recherche d'article par ligne ---
        // Utilisation d'un sélecteur qui récupère l'input dont l'id commence par "searchItem"
        const rowSearch = row.querySelector('input[id^="searchItem"]');
        rowSearch.addEventListener('input', function () {
            const search = this.value.toLowerCase().trim();
            const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(safeSearch);
            let found = false;
            for (let i = 0; i < itemSelect.options.length; i++) {
                if (regex.test(itemSelect.options[i].text.toLowerCase())) {
                    itemSelect.options[i].selected = true;
                    found = true;
                    break;
                }
            }
            if (!found) {
                let lastOption = itemSelect.options.length;
                itemSelect.options[lastOption - 1].selected = true;
            }
            recalc(); // Met à jour le résumé après modification via la recherche
        });
    }

    // --- Mise à jour des numéros de ligne ---
    function updateLineNumbers() {
        const rows = document.querySelectorAll('#invoice-details tbody tr');
        rows.forEach((row, index) => {
            const lineNumberElem = row.querySelector('.line-number');
            if (lineNumberElem) {
                lineNumberElem.textContent = index + 1;
            }
        });
    }
});