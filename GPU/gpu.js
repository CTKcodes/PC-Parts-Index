document.addEventListener('DOMContentLoaded', () => {
    fetch('video-card.json')
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

            const memorySlider = document.getElementById('memory-slider');
            memorySlider.value = 0;
            document.getElementById('memory-min').textContent = '0Gb';

            memorySlider.addEventListener('input', () => {
                const memoryFloor = parseInt(memorySlider.value, 10);
                document.getElementById('memory-min').textContent = `${memoryFloor}Gb`;
                filterProducts();
            });

            filterProducts();
        });
});

function filterProducts() {
    const brandFilter = document.querySelector('input[name="brand"]:checked').value;
    const priceFloor = document.getElementById('price-slider').value;

    const memorySlider = document.getElementById('memory-slider');
    const memorySliderValue = parseInt(memorySlider.value, 10);
    document.getElementById('memory-min').textContent = `${memorySliderValue}Gb`;

    document.getElementById('price-min').textContent = `$${priceFloor}`;
    const priceMax = document.getElementById('price-slider').max;
    document.getElementById('price-max').textContent = `$${priceMax}`;

    const filteredProducts = window.products.filter(product => {
        let brandMatch = false;
        switch (brandFilter) {
            case 'Radeon':
                brandMatch = product.chipset.includes('Radeon') || product.chipset.includes('RX') || product.chipset.includes('FirePro');
                break;
            case 'Intel':
                brandMatch = product.chipset.includes('Intel') || product.chipset.includes('Arc');
                break;
            case 'NVIDIA':
                brandMatch = product.chipset.includes('GeForce') || product.chipset.includes('RTX') ||
                    product.chipset.includes('Quadro') || product.chipset.match(/T\d+/) ||
                    product.chipset.includes('Titan') || product.chipset.includes('NVS');
                break;
            default:
                brandMatch = true;
                break;
        }

        const memoryMatch = product.memory >= memorySliderValue;

        let priceMatch = product.price !== null && product.price >= parseFloat(priceFloor);

        return brandMatch && memoryMatch && priceMatch;
    });

    displayProducts(filteredProducts);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('memory-max').textContent = '48 Gb';
});

function displayProducts(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = '<div class="row"></div>';
    const row = container.querySelector('.row');

    products.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';

        const productElement = document.createElement('div');
        productElement.className = 'card';

        if (product.chipset.includes('Radeon') || product.chipset.includes('RX') || product.chipset.includes('FirePro')) {
            productElement.classList.add('bg-light-red');
        } else if (product.chipset.includes('Intel') || product.chipset.includes('Arc')) {
            productElement.classList.add('bg-light-blue');
        } else if (product.chipset.includes('GeForce') || product.chipset.includes('RTX') || product.chipset.includes('Quadro') || product.chipset.match(/T\d+/) || product.chipset.includes('Titan')
            || product.chipset.includes('NVS')) {
            productElement.classList.add('bg-light-green');
        }

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const productName = document.createElement('h5');
        productName.className = 'card-title';
        productName.textContent = product.name;

        const chipsetInfo = document.createElement('p');
        chipsetInfo.className = 'text-secondary h6';
        chipsetInfo.textContent = product.chipset;

        const productPrice = document.createElement('p');
        productPrice.className = 'card-text';
        productPrice.textContent = product.price !== null ? `$${product.price} USD` : 'Price Unknown';

        cardBody.appendChild(productName);
        cardBody.appendChild(chipsetInfo);
        cardBody.appendChild(productPrice);

        productElement.appendChild(cardBody);
        col.appendChild(productElement);
        row.appendChild(col);
    });
}