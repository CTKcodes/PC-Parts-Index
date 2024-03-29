document.addEventListener('DOMContentLoaded', () => {
    fetch('cpu.json')
        .then(response => response.json())
        .then(products => {
            window.products = products;

            const maxPrice = Math.max(...products.map(product => product.price ? product.price : 0));
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

            filterProducts();
        });
});

function filterProducts() {
    const brandFilter = document.querySelector('input[name="brand"]:checked').value;
    const coreCountFilters = document.querySelectorAll('input[name="core_count"]:checked');
    const graphicsFilter = document.querySelector('input[name="graphics"]:checked').value;

    const priceFloor = document.getElementById('price-slider').value;
    const showNullPrices = document.getElementById('show-null-prices').checked;

    document.getElementById('price-min').textContent = `$${priceFloor}`;
    const priceMax = document.getElementById('price-slider').max;
    document.getElementById('price-max').textContent = `$${priceMax}`;

    const filteredProducts = window.products.filter(product => {
        let brandMatch = brandFilter === 'any' || product.name.includes(brandFilter);

        const coreCountMatch = Array.from(coreCountFilters).some(filter => product.core_count == filter.value);

        let graphicsMatch = true;
        if (graphicsFilter === "hasGraphics") {
            graphicsMatch = product.graphics !== null;
        } else if (graphicsFilter === "noGraphics") {
            graphicsMatch = product.graphics === null;
        }


        let priceMatch = product.price >= parseFloat(priceFloor);
        if (!showNullPrices && product.price === null) return false;

        return brandMatch &&
            (coreCountFilters.length === 0 || coreCountMatch) &&
            graphicsMatch &&
            (showNullPrices ? product.price === null : priceMatch);
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

        if (product.name.includes('AMD')) {
            productElement.classList.add('bg-light-red');
        } else if (product.name.includes('Intel')) {
            productElement.classList.add('bg-light-blue');
        }

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const productName = document.createElement('h5');
        productName.className = 'card-title';
        productName.textContent = product.name;

        const productSpecs = document.createElement('p');
        productSpecs.className = 'text-secondary h6';
        productSpecs.textContent = `Cores: ${product.core_count}, Core Clock: ${product.core_clock} GHz, Boost Clock: ${product.boost_clock} GHz, TDP: ${product.tdp} Watts`;

        const productPrice = document.createElement('p');
        productPrice.className = 'card-text';
        productPrice.textContent = product.price !== null ? `$${product.price} USD` : 'Price Unknown';

        cardBody.appendChild(productName);
        cardBody.appendChild(productSpecs);
        cardBody.appendChild(productPrice);

        productElement.appendChild(cardBody);
        col.appendChild(productElement);
        row.appendChild(col);
    });
}