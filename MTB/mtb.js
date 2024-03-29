document.addEventListener('DOMContentLoaded', () => {
    fetch('motherboard.json')
        .then(response => response.json())
        .then(products => {
            window.products = products;

            const maxPrice = Math.max(...products.map(product => product.price || 0));
            const priceSlider = document.getElementById('price-slider');
            priceSlider.min = 0;
            priceSlider.max = maxPrice;
            priceSlider.step = 0.01;
            priceSlider.value = 0;
            document.getElementById('price-max').textContent = `$${maxPrice}`;
            document.getElementById('price-min').textContent = '$0';

            priceSlider.addEventListener('input', () => {
                document.getElementById('price-min').textContent = `$${priceSlider.value}`;
                filterProducts();
            });

            filterProducts(); 
        });
});

function filterProducts() {
    const socketFilter = document.querySelector('input[name="socket"]:checked').value;
    const priceFloor = document.getElementById('price-slider').value;

    const priceMax = document.getElementById('price-slider').max;
    document.getElementById('price-max').textContent = `$${priceMax}`;

    const filteredProducts = window.products.filter(product => {
        const socketMatch = socketFilter === 'all' || product.socket.includes(socketFilter);
        let priceMatch = product.price !== null && product.price >= parseFloat(priceFloor);

        return socketMatch && priceMatch;
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

        if (product.socket.includes('AM') || product.socket.includes('TR') || product.socket.includes('FM')) {
            productElement.classList.add('bg-light-red');
        } else if (product.socket.includes('LGA') || product.socket.match(/N\d+/) || product.socket.includes('Atom')) {
            productElement.classList.add('bg-light-blue');
        }

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const productName = document.createElement('h5');
        productName.className = 'card-title';
        productName.textContent = product.name;

        const socketInfo = document.createElement('p');
        socketInfo.className = 'text-secondary mb-0';
        socketInfo.textContent = `Socket: ${product.socket}, Form Factor: ${product.form_factor}`;

        const productPrice = document.createElement('p');
        productPrice.className = 'card-text mt-1';
        productPrice.textContent = product.price !== null ? `$${product.price} USD` : 'Price Unknown';

        cardBody.appendChild(productName);
        cardBody.appendChild(socketInfo);
        cardBody.appendChild(productPrice);

        productElement.appendChild(cardBody);
        col.appendChild(productElement);
        row.appendChild(col);
    });

    container.appendChild(row);
}
