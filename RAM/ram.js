document.addEventListener('DOMContentLoaded', () => {
    fetch('memory.json')
        .then(response => response.json())
        .then(products => {
            window.products = products;

            const maxPrice = Math.max(...products.map(product => product.price || 0));
            const priceSlider = document.getElementById('price-slider');
            priceSlider.min = 0;
            priceSlider.max = maxPrice;
            priceSlider.step = 0.01;
            priceSlider.value = 0;
            document.getElementById('price-slider').max = maxPrice;
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
    const priceFloor = document.getElementById('price-slider').value;
    const ddrVersionChecks = document.querySelectorAll('input[name="ddr_version"]:checked');
    const selectedDDRVersions = Array.from(ddrVersionChecks).map(checkbox => `DDR${checkbox.value}`);

    const filteredProducts = window.products.filter(product => {
        const priceMatch = product.price !== null && product.price >= parseFloat(priceFloor);

        const ddrVersion = `DDR${product.speed[0]}`;

        const ddrMatch = selectedDDRVersions.length === 0 || selectedDDRVersions.includes(ddrVersion);

        return priceMatch && ddrMatch;
    });

    displayProducts(filteredProducts);
}

function displayProducts(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = '<div class="row"></div>';
    const row = container.querySelector('.row');

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

        const speedInfo = document.createElement('p');
        speedInfo.className = 'text-secondary mb-0';
        speedInfo.textContent = `DDR${product.speed[0]}, ${product.speed[1]}MHz, CAS ${product.cas_latency}, ${product.modules[0]}x${product.modules[1]}GB`;

        const productPrice = document.createElement('p');
        productPrice.className = 'card-text mt-1';
        productPrice.textContent = product.price !== null ? `$${product.price} USD` : 'Price Unknown';

        cardBody.appendChild(productName);
        cardBody.appendChild(speedInfo);
        cardBody.appendChild(productPrice);

        productElement.appendChild(cardBody);
        col.appendChild(productElement);
        row.appendChild(col);
    });
}
