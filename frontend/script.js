fetch("http://localhost:3000/products")
.then((response) => {
    return response.json();
})
.then((data) => {
    console.log(data);

    document.body.innerHTML = `<h1>${data.prodcut}</h1>`;
})