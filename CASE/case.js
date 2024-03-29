document.addEventListener('DOMContentLoaded', () => {
    fetch('case.json')
        .then(response => response.json())
        .then(cases => {
            window.cases = cases;

            const maxPrice = Math.max(...cases.map(c => parseFloat(c.price || 0)));
            const priceSlider = document.getElementById('price-slider');
            priceSlider.min = 0;
            priceSlider.max = maxPrice;
            priceSlider.step = 0.01;
            priceSlider.value = 0;
            document.getElementById('price-max').textContent = `$${maxPrice}`;
            document.getElementById('price-min').textContent = `$0`;

            priceSlider.addEventListener('input', () => {
                document.getElementById('price-min').textContent = `$${priceSlider.value}`;
                filterProducts();
            });

            filterProducts();
        });
});

function filterProducts() {
    const priceLimit = parseFloat(document.getElementById('price-slider').value);
    document.getElementById('price-min').textContent = `$${priceLimit}`;

    const filteredCases = window.cases.filter(c => c.price !== null && parseFloat(c.price) >= priceLimit);

    displayProducts(filteredCases);
}

function displayProducts(cases) {
    const container = document.getElementById('product-container');
    container.innerHTML = '';
    const row = document.createElement('div');
    row.className = 'row';

    cases.forEach(c => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';

        const card = document.createElement('div');
        card.className = 'card';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = c.name;

        const description = document.createElement('p');
        description.className = 'text-secondary';
        description.textContent = `Type: ${c.type || 'N/A'}, Color: ${c.color || 'N/A'}, Side Panel: ${c.side_panel || 'N/A'}`;

        const price = document.createElement('p');
        price.className = 'card-text';
        price.textContent = `$${c.price} USD`;

        cardBody.appendChild(title);
        cardBody.appendChild(description);
        cardBody.appendChild(price);
        card.appendChild(cardBody);
        col.appendChild(card);
        row.appendChild(col);
    });

    container.appendChild(row);
}
