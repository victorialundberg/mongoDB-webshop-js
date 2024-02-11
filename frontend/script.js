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
            renderedContent.innerHTML = `
        <p>${error.message}</p>
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
            userName.value = "";
            userEmail.value = "";
            userPassword.value = "";
            renderedContent.innerHTML = `
        <p>The user ${data.name} have been added</p>
        `
        })
}

// Login user

let loginEmail = document.getElementById("loginEmail");
let loginPassword = document.getElementById("loginPassword");
let loginForm = document.getElementById("loginForm");

if (localStorage.getItem("currentUser")) {
    loginForm.innerHTML = `
    <button onClick="logout()">Logout</button>
    `
}

function loginUserFunction() {

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
            localStorage.setItem("currentUser", data.id);
            loginEmail.value = "";
            loginPassword.value = "";
            renderedContent.innerHTML = `
            <p>User ID ${data.id} is logged in</p>
            `
            loginForm.innerHTML = `
            <button onClick="logout()">Logout</button>
            `
        })
        .catch(error => {
            console.error("Error:", error.message);
            renderedContent.innerHTML = `
        <p>${error.message}</p>
        `
        });
}

function logout() {
    localStorage.removeItem("currentUser");
    loginForm.innerHTML = `
    Email<input type="text" id="loginEmail"> <br/>
    Password<input type="password" id="loginPassword">
    <button onClick="loginUserFunction()" type="button">Login</button>
    `
    renderedContent.innerHTML = `
    <p>You have been logged out</p>
    `
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


function updateCartFunction(productId) {
    let updateCartInput = document.getElementById("updateCartInput");
    let productQuantity = updateCartInput.value;
    
    let shoppingCart = getShoppingCart();

    shoppingCart[productId] = productQuantity;
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
}

// Get shopping cart

function getShoppingCart() {
    let shoppingCartJson = localStorage.getItem("shoppingCart");
    let shoppingCart = {};

    if (shoppingCartJson) {
        shoppingCart = JSON.parse(shoppingCartJson);
    }
    return shoppingCart;
}


let shoppingCartBtn = document.getElementById("shoppingCartBtn");

shoppingCartBtn.addEventListener("click", shoppingCartFunction);

function shoppingCartFunction() {

    let shoppingCart = getShoppingCart();

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

addProductBtn.addEventListener("click", addProductFunction);

function addProductFunction(event) {
    event.preventDefault()

    let product = {
        name: productNameInput.value,
        description: productDescriptionInput.value,
        price: parseInt(productPriceInput.value),
        lager: parseInt(productLagerInput.value),
        category: productCategoryInput.value,
        token: addProductToken.value
    }

    fetch('http://localhost:3000/api/products/add', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    })
    .then(res => {
        if (res.status === 401) {
            return res.json().then(data => {
                return Promise.reject(new Error(data.message));
            });
        } else {
            return res.json();
        }
    })
    .then(data => {
        productNameInput.value = "",
        productDescriptionInput.value = "";
        productPriceInput.value = "";
        productLagerInput.value = "";
        productCategoryInput.value = "";
        addProductToken.value = "";
        renderedContent.innerHTML = `
        <p>The product ${data.name} has been added</p>
        `
    })
    .catch(error => {
        console.error("Error:", error.message);
        renderedContent.innerHTML = `
        <p>${error.message}</p>
    `
    });

}

//-------------------------Order------------------------\\

function placeOrder() {

    let order = {
        user: localStorage.getItem("currentUser"),
            products: []
    }

    let shoppingCart = getShoppingCart();

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
    localStorage.removeItem("shoppingCart")
    })
    .catch(error => {
        console.error("Error:", error.message);
        renderedContent.innerHTML = `
    <p>${error.message}</p>
    `
    });

}

// Get all orders

let allOrdersInput = document.getElementById("allOrdersInput");
let getAllOrdersBtn = document.getElementById("getAllOrdersBtn");

getAllOrdersBtn.addEventListener("click", getAllOrders);

function getAllOrders() {
    fetch('http://localhost:3000/api/orders/all?apikey='+allOrdersInput.value)
    .then(res => {
        if (res.status === 401) {
            return res.json().then(data => {
                return Promise.reject(new Error(data.message));
            });
        } else {
            return res.json();
        }
    })
    .then(data => {
        let orders = `<table>`
        data.forEach(order => {
            orders += `
            <tr>
                <th>User: ${order.user}</th>
            </tr>
            `
        
            order.products.forEach(product => {
                orders += `
                <tr>
                    <td>${product.productId}</td>
                    <td>${product.quantity}</td>
                </tr>
                `
            })
        })



        data.forEach(user => {
        console.log(user);
        });

        orders += `</table>`
        renderedContent.innerHTML = orders;
    })
    .catch(error => {
        console.error("Error:", error.message);
        renderedContent.innerHTML = `
    <p>${error.message}</p>
    `
    });
}