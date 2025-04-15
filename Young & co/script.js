const productContainer = document.querySelector(".product-list")
const isProductDetailPage = document.querySelector(".product-detail")
const isCartPage = document.querySelector(".cart")

if (productContainer) {
    displayProducts();
} else if (isProductDetailPage) {
    displayProductDetail()
} else if (isCartPage) {
    displayCart();
}

function displayProducts() {
    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
        <div class="img-box">
            <img src="${product.colors[0].mainImage}">
        </div>
        <h2 class="title">${product.title}</h2>
        <span class="price">${product.price}</span>
        `;
        productContainer.appendChild(productCard);

        const imgBox = productCard.querySelector(".img-box");
        imgBox.addEventListener("click", () => {
            sessionStorage.setItem("selectedProduct", JSON.stringify(product));
            window.location.href = "product-details.html";
        });
    });
}

function displayProductDetail() {
    const productData = JSON.parse(sessionStorage.getItem("selectedProduct"));

    const titleEl = document.querySelector(".title");
    const priceEl = document.querySelector(".price");
    const descriptionEl = document.querySelector(".description");
    const mainImageContainer = document.querySelector(".main-img");
    const thumbnailContainer = document.querySelector(".thumbnail-list");
    const colorContainer  = document.querySelector(".color-options");
    const sizeContainer = document.querySelector(".size-options");
    const addToCartBtn = document.querySelector(".btn");

    let selectedColor = productData.colors[0];
    let selectedSize = selectedColor.sizes[0];

    function updateProductDisplay(colorData) {
        if (!colorData.sizes.includes(selectedSize)) {
            selectedSize = colorData.sizes[0];
        }

        mainImageContainer.innerHTML = `<img src="${colorData.mainImage}">`;

        thumbnailContainer.innerHTML = "";
        const allThumbnails = [colorData.mainImage].concat(colorData.thumbnails.slice(0, 3));
        allThumbnails.forEach(thumb => {
            const img = document.createElement("img");
            img.src = thumb;

            thumbnailContainer.appendChild(img);

            img.addEventListener("click", () => {
                mainImageContainer.innerHTML = `<img src="${thumb}">`;
            });
        });

        colorContainer.innerHTML = "";
        productData.colors.forEach(color => {
            const img = document.createElement("img");
            img.src = color.mainImage;
            if (color.name === colorData.name) img.classList.add("selected");

            colorContainer.appendChild(img);

            img.addEventListener("click", () => {
                selectedColor = color;
                updateProductDisplay(color);
            });
        });

        sizeContainer.innerHTML = "";
        colorData.sizes.forEach(size => {
            const btn = document.createElement("button");
            btn.textContent = size;
            if (size === selectedSize) btn.classList.add("selected");

            sizeContainer.appendChild(btn);

            btn.addEventListener("click", () => {
                document.querySelectorAll(".size-options button").forEach(el => el.classList.remove("selected"));
                btn.classList.add("selected");
                selectedSize = size;
            });
        });
    }

    titleEl.textContent = productData.title;
    priceEl.textContent = productData.price;
    descriptionEl.textContent = productData.description;

    updateProductDisplay(selectedColor);

    addToCartBtn.addEventListener("click", () => {
        addToCart(productData, selectedColor, selectedSize);
    });
}

function addToCart(product, color, size) {
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    const existingItem = cart.find(item => item.id === product.id && item.color === color.name && item.size === size);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: color.mainImage,
            color: color.name,
            size: size,
            quantity: 1
        });
    }

    sessionStorage.setItem("cart", JSON.stringify(cart));

    updateCartBadge();
    updateCheckoutButton();
}

function displayCart() {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    
    const cartItemsContainer = document.querySelector(".cart-items");
    const subtotalEl = document.querySelector(".subtotal");
    const grandTotalEl = document.querySelector(".grand-total");

    cartItemsContainer.innerHTML = "";

    if (cart.length == 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        subtotalEl.innerHTML = "R0";
        grandTotalEl.innerHTML = "R0";
        return;
    }

    let subtotal = 0;

    cart.forEach((item, index) => {
        let price = typeof item.price === "string" 
            ? parseFloat(item.price.replace(/[^0-9.]/g, ""))
            : item.price;
    
        const itemTotal = price * item.quantity;
        subtotal += itemTotal;
    
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <div class="product">
                <img src="${item.image}">
                <div class="item-detail">
                    <p>${item.title}</p>
                    <div class="size-color-box">
                        <span class="size">${item.size}</span>
                        <span class="color">${item.color}</span>
                    </div>
                </div>
            </div>
            <span class="price">R${price.toFixed(2)}</span>
            <div class="quantity">
                <input type="number" value="${item.quantity}" min="1" data-index="${index}">
            </div>
            <span class="total-price">R${itemTotal.toFixed(2)}</span>
            <button class="remove" data-index="${index}"><i class="ri-close-fill"></i></button>
        `;
    
        cartItemsContainer.appendChild(cartItem);
    });    
    
    subtotalEl.textContent = `R${subtotal.toFixed(2)}`;
    grandTotalEl.textContent = `R${subtotal.toFixed(2)}`;

    // Listen for quantity changes
    document.querySelectorAll(".quantity input").forEach(input => {
            input.addEventListener("change", (e) => {
            const index = e.target.dataset.index;
            const newQuantity = parseInt(e.target.value);

            if (newQuantity < 1) return;

        // Update cart in sessionStorage
            cart[index].quantity = newQuantity;
            sessionStorage.setItem("cart", JSON.stringify(cart));

            // Re-render cart
            displayCart();
            updateCartBadge();
        });
    });

    document.querySelectorAll(".remove").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = e.target.closest("button").dataset.index;
            cart.splice(index, 1);
            sessionStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
            updateCartBadge();
        });
    });
}

function updateCartBadge() {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const badge = document.querySelector(".cart-item-count");

    if (badge) {
        if (cartCount > 0) {
            badge.textContent = cartCount;
            badge.style.display = "block";
        } else {
            badge.style.display = "none";
        }
    }
}

updateCartBadge();

document.addEventListener("DOMContentLoaded", () => {
    const checkoutBtn = document.querySelector(".checkout-btn");

    // Function to check if the cart is empty
    function updateCheckoutButton() {
        const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
        
        // Disable or enable the button based on cart content
        if (cart.length === 0) {
            checkoutBtn.disabled = true;
        } else {
            checkoutBtn.disabled = false;
        }
    }

    // Run it on page load to set initial state
    updateCheckoutButton();

    // Check cart again whenever the cart is updated
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    sessionStorage.setItem("cart", JSON.stringify(cart));
    
    // If cart changes (for example after adding/removing items), update button
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

            if (cart.length === 0) {
                showEmptyCartAlert(); // Show empty alert
                return;
            }

            // Clear cart and update UI
            sessionStorage.removeItem("cart");
            displayCart();
            updateCartBadge();

            // Show custom alert for successful checkout
            const alertBox = document.querySelector(".custom-alert");
            alertBox.textContent = "Thank you for your purchase!";
            alertBox.style.display = "block";

            // Hide alert after 2 seconds
            setTimeout(() => {
                alertBox.style.display = "none";
            }, 2000);

            // Refresh the page after 2 seconds (to ensure cart UI is refreshed)
            setTimeout(() => {
                location.reload(); // This reloads the page to reflect the empty cart
            }, 2000); // Adjust this timeout to match the alert duration
        });
    }

    // Run update on cart changes (for example when adding/removing items)
    updateCheckoutButton();
});
