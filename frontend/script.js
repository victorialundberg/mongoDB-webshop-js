// let main = document.getElementById("main");
// let navigation = document.getElementById("navigation");
// let userNavBtns = document.getElementById("userNavBtns");
// let logoutBtn = document.getElementById("logoutBtn");
// let categoryNavBtn = document.getElementById("categoryNavBtn");
// let productNavBtn = document.querySelector(".productNavBtn");
// let orderNavBtn = document.getElementById("orderNavBtn");
// let homePage = document.getElementById("homePage");
// let userContainer = document.getElementById("userContainer");
// let addUserForm = document.getElementById("addUserForm");
// let categoryContainer = document.getElementById("categoryContainer");
// let categoryBtn = document.getElementById("categoryBtn");
// let allproductsContainer = document.getElementById("allProductsContainer");
// let allProductsWrapper = document.getElementById("allProductsWrapper");
// let productName = document.getElementById("productName");
// let productBtnContainer = document.getElementById("productBtnContainer");

// let productContainer = document.getElementById("productContainer");
// let productDescription = document.getElementById("productDescription");
// let productPrice = document.getElementById("productPrice");
// let productCategory = document.getElementById("productCategory");
// let orderBtns = document.getElementById("orderBtns");
// let getAllOrders = document.getElementById("getAllOrders");
// let getOrder = document.getElementById("getOrder");
// let allOrdersContainer = document.getElementById("allOrdersContainer");
// let orderContainer = document.getElementById("orderContainer");
// let orderUser = document.getElementById("orderUser");
// let orderProduct = document.getElementById("orderProduct");
// let orderProductQuantity = document.getElementById("orderProductQuantity");
// let errorContainer = document.getElementById("errorContainer");


function clearRenderedContent() {
    renderedContent.innerHTML = "";
}

//*-*-*-*-*-*-*-*-*-*-*Endpoints*-*-*-*-*-*-*-*-*-*\\
//------------------------User----------------------\\

// Get users

let getAllUsersBtn = document.getElementById("getAllUsersBtn");
let renderedContent = document.getElementById("renderedContent");

getAllUsersBtn.addEventListener("click", getAllUsersFunction);

function getAllUsersFunction() {

    fetch('http://localhost:3000/api/users')
        .then(res => res.json())
        .then(data => {
            // clearRenderedContent();
            let table = `
        <table>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>UserID</th>
            </tr>`;
            data.forEach(user => {
                table += `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.id}</td>
                </tr>
            `
            });
            table += `</table>`
            renderedContent.innerHTML = table;
        });
};

// Get user

let getUser = document.getElementById("getUser");
let userId = document.getElementById("userId");
let getUserBtn = document.getElementById("getUserBtn");

getUserBtn.addEventListener("click", getUserFunction);
function getUserFunction(event) {
    event.preventDefault()

    let userIdValue = {
        id: userId.value
    }

    fetch('http://localhost:3000/api/users', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userIdValue)
    })
        .then(res => {
            if (res.status === 404 || res.status === 400) {
                return res.json().then(data => {
                    return Promise.reject(new Error(data.message));
                });
            } else {
                return res.json();
            }
        })
        .then(data => {
            // clearRenderedContent();
            userId.value = "";
            if (data.name && data.id && data.email) {
                renderedContent.innerHTML = `
            <table>
                <tr>
                    <th>Name</th>
                    <th>UserID</th>
                    <th>Email</th>
                    <th>Password</th>
                </tr>
                <tr>
                    <td>${data.name}</td>
                    <td>${data.id}</td>
                    <td>${data.email}</td>
                    <td>${data.password}</td>
                </tr>
            </tabe>
            `
            }
        })
        .catch(error => {
            console.error("Error:", error.message);
            // clearRenderedContent();
            renderedContent.innerHTML = `
        <p> There is no user with that ID </p>
        `
        });
};

// Add user

let userName = document.getElementById("userName");
let userEmail = document.getElementById("userEmail");
let userPassword = document.getElementById("userPassword");
let saveUserBtn = document.getElementById("saveUserBtn");

saveUserBtn.addEventListener("click", saveUserFunction);

function saveUserFunction(event) {
    event.preventDefault()

    let user = {
        name: userName.value,
        email: userEmail.value,
        password: userPassword.value
    }

    fetch('http://localhost:3000/api/users/add', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    })
        .then(res => {
            if (res.status === 404 || res.status === 400) {
                return res.json().then(data => {
                    return Promise.reject(new Error(data.message));
                });
            } else {
                return res.json();
            }
        })
        .then(data => {
            // clearRenderedContent();
            userName.value = "";
            userEmail.value = "";
            userPassword.value = "";
            renderedContent.innerHTML = `
        <p>The user ${data.name} have been added</p>
        `
        })
}

// Login user
let currentUser;

let loginEmail = document.getElementById("loginEmail");
let loginPassword = document.getElementById("loginPassword");
let loginBtn = document.getElementById("loginBtn");
let loginForm = document.getElementById("loginForm");

loginBtn.addEventListener("click", loginUserFunction);

function loginUserFunction(event) {
    event.preventDefault()

    let user = {
        email: loginEmail.value,
        password: loginPassword.value
    }

    fetch('http://localhost:3000/api/users/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    })
        .then(res => {
            if (!res.ok) {
                return res.json().then(data => {
                    return Promise.reject(new Error(data.message));
                });
            } else {
                return res.json();
            }

        })
        .then(data => {
            currentUser = data.id;
            loginEmail.value = "";
            loginPassword.value = "";
            renderedContent.innerHTML = `
        <p>User ID ${data.id} is logged in</p>
        `
        })
        .catch(error => {
            console.error("Error:", error.message);
            // clearRenderedContent();
            renderedContent.innerHTML = `
        <p> Sorry, you can't come in </p>
        `
        });
}


//-----------------------Products----------------------\\

// Get products

let allProducts;

let getAllProductsBtn = document.getElementById("getAllProductsBtn");
let image = {
    src: 'images/image-coming-soon.png',
    alt: 'image coming soon',
    width: 50,
    height: 50
}

getAllProductsBtn.addEventListener("click", getAllProductsFunction);

function getAllProductsFunction() {

    fetch('http://localhost:3000/api/products')
        .then(res => res.json())
        .then(data => {
            allProducts = data;
            // console.log(allProducts);
            // clearRenderedContent();
            let table = `<table>`;
            data.forEach(product => {
                table += `
                <tr>
                    <td><img src="${image.src}" alt="${image.alt}" width="${image.width}" height="${image.height}"></img></td>
                    <td>Name: ${product.name}</td>
                    <td>
                        <button onClick="showProductFunction('${product.id}')">Show product</button>
                    </td>
                </tr>
            `
            });
            table += `</table>`
            renderedContent.innerHTML = table;
        });
};

// Get product

function showProductFunction(productId) {

    let url = `http://localhost:3000/api/products/${productId}`;

    fetch(url)
        .then(res => res.json())
        .then(product => {
            // clearRenderedContent();
            renderedContent.innerHTML = `
        <img src="${image.src}" alt="${image.alt}" width="${image.width}" height="${image.height}"></img>
        <p>${product.name}</p>
        <p>${product.description}</p>
        <p>${product.price}</p>
        <p>${product.lager}</p>
        <p>${product.category}</p>
        <input type="number" min="0" id="updateCartInput">
        <button onClick="updateCartFunction('${product.id}')">Update shopping cart</button>
        `
        })
};

// Add to shopping cart

let shoppingCart = {};

function updateCartFunction(productId) {
    let updateCartInput = document.getElementById("updateCartInput");
    let productQuantity = updateCartInput.value;
    shoppingCart[productId] = productQuantity;
    // console.log(shoppingCart);
}

// Get shopping cart


let shoppingCartBtn = document.getElementById("shoppingCartBtn");

shoppingCartBtn.addEventListener("click", shoppingCartFunction);

function shoppingCartFunction() {

    if (Object.keys(shoppingCart).length > 0) {

        let displayShoppingCart = `<table>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price per unit</th>
                            <th>Quantity</th>
                        </tr>
                    `;

        for (let productId in shoppingCart) {

            let product = allProducts.find(p => p.id == productId)
            displayShoppingCart += `
                <tr>
                    <td>${product.name}</td>
                    <td>${product.description}</td>
                    <td>${product.price}</td>
                    <td>${shoppingCart[productId]}</td>
                </tr>
            `;
        };

        displayShoppingCart += `</table>
                                 <button onClick="placeOrder()">Order</button>`;
        renderedContent.innerHTML = displayShoppingCart;

    } else {
        renderedContent.innerHTML = `<p>Shopping cart is empty!</p>`
    }

}

// Add product

let productNameInput = document.getElementById("productNameInput");
let productDescriptionInput = document.getElementById("productDescriptionInput");
let productPriceInput = document.getElementById("productPriceInput");
let productLagerInput = document.getElementById("productLagerInput");
let productCategoryInput = document.getElementById("productCategoryInput");
let addProductToken = document.getElementById("addProductToken");
let addProductBtn = document.getElementById("addProductBtn")


function addProductFunction(event) {
    event.preventDefault()

    let product = {
        name: productNameInput.value,
        description: productDescriptionInput.value,
        price: productPriceInput.value,
        lager: productLagerInput.value,
        category: productCategoryInput.value,
        token: addProductToken.value
    }

    fetch('http://localhost:3000/api/users/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    })

}

//-------------------------Order------------------------\\

function placeOrder() {

    let order = {
        user: currentUser,
            products: []
    }

    for (let productId in shoppingCart) {

        order.products.push({productId: productId, quantity: shoppingCart[productId]})
    }

    fetch('http://localhost:3000/api/orders/add', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
    })
    .then(res => {
        if (res.status === 400) {
            return res.json().then(data => {
                return Promise.reject(new Error(data.message));
            });
        } else {
            return res.json();
        }
    })
    .then(data => {
        renderedContent.innerHTML = `
    <p>Your order has been placed</p>
    `
    })
    .catch(error => {
        console.error("Error:", error.message);
        renderedContent.innerHTML = `
    <p> You have to login to place an order </p>
    `
    });

}

/*



*/



// Display cart





// NEXT UP

// Create order from shopping cart







// render product with onclick for next function, add to cart


// addToCartBtn.addEventListener("click", addToCartFunction);

// function addToCartFunction() {
//     // Add specific produt to cart array
// }

/* - specific product page -
<td>Description: ${item.description}</td>
<td>Price: ${item.price}</td>
<td>In Stock: ${item.lager}</td>
<td>Category: ${item.category}</td>
<td>ID: ${item.id}</td>
<td>
    <button id="addToCartBtn">Add to cart</button>
</td>
*/




/*
// Get all products
<button id="showProductBtn">Show product</button>
<button id="addToCartBtn">Add to cart</button>
// For each product, button for add to cart and get more info
// Get product

// Add product

// Get product from category // vg

//-----------------------Category----------------------\\

// Add category // vg

// Get all categories // vg

//-------------------------Order------------------------\\


// Get all orders

// Add order for user
// Via kundvagn

// Get order for user // vg


*/


/////////////
// anonym funktion, kan vara bra om man vill kalla på flera funktioner inuti den
// sendChatBtn.addEventListener("clicl", () => {
//     fetch
// }
