document.addEventListener('DOMContentLoaded', () => {
    fetch('power-supply.json')
        .then(response => response.json())
        .then(products => {
            window.products = products;

            const maxPrice = Math.max(...products.map(product => product.price || 0));
            const maxWattage = Math.max(...products.map(product => product.wattage || 0));

            const priceSlider = document.getElementById('price-slider');
            priceSlider.min = 0;
            priceSlider.max = maxPrice;
            priceSlider.step = 0.01;
            priceSlider.value = 0;
            document.getElementById('price-slider').max = maxPrice;
            document.getElementById('price-max').textContent = `$${maxPrice}`;
            document.getElementById('price-min').textContent = '$0';

            priceSlider.addEventListener('input', () => {
                const priceFloor = parseFloat(priceSlider.value);
                document.getElementById('price-min').textContent = `$${priceFloor}`;
                filterProducts();
            });

            const wattageSlider = document.getElementById('wattage-slider');
            wattageSlider.min = 0;
            wattageSlider.max = maxWattage;
            wattageSlider.value = 0;
            document.getElementById('wattage-slider').max = maxWattage;
            document.getElementById('wattage-max').textContent = `${maxWattage}W`;
            document.getElementById('wattage-min').textContent = '0W';

            wattageSlider.addEventListener('input', () => {
                const wattageFloor = parseInt(wattageSlider.value, 10);
                document.getElementById('wattage-min').textContent = `${wattageFloor}W`;
                filterProducts();
            });

            filterProducts();
        });
});

function filterProducts() {
    const priceFloor = parseFloat(document.getElementById('price-slider').value);
    const wattageFloor = parseInt(document.getElementById('wattage-slider').value);

    document.getElementById('price-min').textContent = `$${priceFloor}`;
    document.getElementById('wattage-min').textContent = `${wattageFloor}W`;

    const filteredProducts = window.products.filter(product => {
        let priceMatch = product.price !== null && product.price >= priceFloor;
        let wattageMatch = product.wattage >= wattageFloor;

        return priceMatch && wattageMatch;
    });

    displayProducts(filteredProducts);
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function getEfficiencyColor(efficiency) {
    if (!efficiency) return '#f8f9fa';

    const colors = {
        'bronze': '#ffac59',
        'silver': '#C0C0C0', 
        'gold': '#f5da49', 
        'platinum': '#3ebecf', 
        'titanium': '#9fc9cf' 
    };
    return colors[efficiency.toLowerCase()] || '#f8f9fa';
}

function displayProducts(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = '';
    const row = document.createElement('div');
    row.className = 'row';

    products.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';

        const productElement = document.createElement('div');
        productElement.className = 'card';
        productElement.style.backgroundColor = getEfficiencyColor(product.efficiency);

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const productName = document.createElement('h5');
        productName.className = 'card-title';
        productName.textContent = product.name;

        const efficiencyText = product.efficiency ? capitalize(product.efficiency) : 'Unknown';
        const detailsInfo = document.createElement('p');
        detailsInfo.className = 'text-secondary mb-0';
        detailsInfo.textContent = `${product.wattage}W, ${product.type}, ${product.modular ? product.modular + ' Modular' : 'Non-Modular'}, Efficiency: ${efficiencyText}`;

        const productPrice = document.createElement('p');
        productPrice.className = 'card-text mt-1';
        productPrice.textContent = `$${product.price} USD`;

        cardBody.appendChild(productName);
        cardBody.appendChild(detailsInfo);
        cardBody.appendChild(productPrice);

        productElement.appendChild(cardBody);
        col.appendChild(productElement);
        row.appendChild(col);
    });

    container.appendChild(row);
}
