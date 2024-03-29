document.addEventListener('DOMContentLoaded', () => {
    fetch('internal-hard-drive.json')
        .then(response => response.json())
        .then(products => {
            window.products = products;

            const maxCapacity = Math.max(...products.map(product => product.capacity));
            const capacitySlider = document.getElementById('capacity-slider');
            capacitySlider.min = 0;
            capacitySlider.max = maxCapacity;
            capacitySlider.value = 0;
            document.getElementById('capacity-max').textContent = formatCapacity(maxCapacity);
            document.getElementById('capacity-min').textContent = '0GB';

            capacitySlider.addEventListener('input', () => {
                const capacityFloor = parseInt(capacitySlider.value);
                document.getElementById('capacity-min').textContent = formatCapacity(capacityFloor);
                filterProducts();
            });

            const maxPrice = Math.max(...products.map(product => product.price || 0));
            const priceSlider = document.getElementById('price-slider');
            priceSlider.min = 0;
            priceSlider.max = maxPrice;
            priceSlider.step = 0.01;
            priceSlider.value = 0;
            document.getElementById('price-max').textContent = `$${maxPrice}`;
            document.getElementById('price-min').textContent = '$0';

            priceSlider.addEventListener('input', () => {
                const priceFloor = parseFloat(priceSlider.value);
                document.getElementById('price-min').textContent = `$${priceFloor}`;
                filterProducts();
            });

            filterProducts();
        });
});

function filterProducts() {
    const capacityFloor = parseInt(document.getElementById('capacity-slider').value);
    const priceFloor = parseFloat(document.getElementById('price-slider').value);
    const showUnknownPrices = document.getElementById('show-unknown-prices').checked;

    document.getElementById('capacity-min').textContent = formatCapacity(capacityFloor);
    document.getElementById('price-min').textContent = `$${priceFloor}`;

    const filteredProducts = window.products.filter(product => {
        const capacityMatch = product.capacity >= capacityFloor;
        const priceKnown = product.price !== null;
        const priceMatch = priceKnown && product.price >= priceFloor;

        return showUnknownPrices ? !priceKnown : priceMatch && capacityMatch;
    });

    displayProducts(filteredProducts);
}

function formatCapacity(capacity) {
    if (capacity >= 1000) {
        return `${Math.round(capacity / 100) / 10}TB`; 
    } else {
        return `${Math.round(capacity)}GB`;
    }
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

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const productName = document.createElement('h5');
        productName.className = 'card-title';
        productName.textContent = product.name;

        const productDetails = document.createElement('p');
        productDetails.className = 'text-secondary mb-0';

        const capacityLabel = formatCapacity(product.capacity);
        const typeLabel = typeof product.type === 'number' ? `${product.type} rpm` : product.type;
        const formFactorLabel = typeof product.form_factor === 'number' ? `${product.form_factor} inch` : product.form_factor;

        productDetails.textContent = `${capacityLabel}, ${typeLabel}, ${formFactorLabel}`;

        const productPrice = document.createElement('p');
        productPrice.className = 'card-text mt-1'; 
        productPrice.textContent = product.price !== null ? `$${product.price} USD` : 'Price Unknown';

        cardBody.appendChild(productName);
        cardBody.appendChild(productDetails);
        cardBody.appendChild(productPrice);

        productElement.appendChild(cardBody);
        col.appendChild(productElement);
        row.appendChild(col);
    });

    container.appendChild(row);
}
