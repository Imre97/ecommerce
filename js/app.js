//products
const products = [
    {
        id: '1',
        product_name: 'Cat bed',
        price: 45.99,
        image: './images/product1.jpg',
        alt: 'cat bed'
    },
    {
        id: '2',
        product_name: 'Dog bed',
        price: 64.99,
        image: './images/product2.jpg',
        alt: 'dog bed'
    },
    {
        id: '3',
        product_name: 'Dog bowl',
        price: 15.99,
        image: './images/product3.jpg',
        alt: 'dog bowl'
    },
    {
        id: '4',
        product_name: 'Dog harness',
        price: 49.95,
        image: './images/product4.jpg',
        alt: 'dog harness'
    },
    {
        id: '5',
        product_name: 'Dog leash',
        price: 25.99,
        image: './images/product5.jpg',
        alt: 'dog leash'
    },
    {
        id: '6',
        product_name: 'Cat furniture',
        price: 99.95,
        image: './images/product6.jpg',
        alt: 'cat furniture'
    },
    {
        id: '7',
        product_name: 'Dog balls',
        price: 10.99,
        image: './images/product7.jpg',
        alt: 'dog balls',
    }
]

//_____________________Variable__________________________________

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');

let cart = [];
let buttonsDOM = [];

//________________Events__________________________

cartBtn.addEventListener('click', showCart);
closeCartBtn.addEventListener('click',hideCart);



function getPageLayout(){
    for(let i=0; i<products.length;i++){
        let markup = 
        `<article class="product">
            <div class="img-container">
                <img src='${products[i].image}' alt="${products[i].alt}" class="product-img">
                <button class="bag-btn" data-id=${products[i].id}>
                    <i class="fas fa-shopping-cart"></i>add to cart
                </button>
            </div>
            <h3>${products[i].product_name}</h3>
            <h4>$${products[i].price}</h4>
        </article>`
    productsDOM.innerHTML += markup;
    }
}


function getCartButton(){
    const buttons = [...document.querySelectorAll('.bag-btn')];
    buttonsDOM = buttons;
    
    buttons.forEach(button =>{
        let id = button.dataset.id;
        let inCart = cart.find(item => item.id === id);

        if(inCart){
            button.innerHTML = 'In cart';
            button.disabled = true;
        }
        button.addEventListener('click', event=>{
            event.target.innerText = 'In cart';
            event.target.disabled = true;

            let cartItem = {...getProducts(id), amount: 1};
            cart = [...cart, cartItem];
            saveCart(cart);

            setCartValues(cart);

            addCartItem(cartItem);

            showCart();
        })
    })
}

function setCartValues(cart){
    let tempTotal = 0;
    let itemTotal = 0;

    cart.map(item => {
        tempTotal += item.price * item.amount;
        itemTotal += item.amount;
    });

    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemTotal;
}

function addCartItem(item){
    let div = document.createElement('div')
    div.classList.add('cart-item')
    div.innerHTML = 
        `<img src=${item.image} alt=${item.alt}>
        <div>
            <h4>${item.product_name}</h4>
            <h5>$${item.price}</h5>
            <span class="remove-item" data-id=${item.id}>remove</span>
        </div>
        <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>`;
    cartContent.appendChild(div);
}

function setupApp(){
    cart = getCart();
    setCartValues(cart);
    popularCart(cart);
}

function showCart(){
    cartOverlay.classList.add('transparentBcg');
    cartDOM.classList.add('showCart');
}

function hideCart(){
    cartOverlay.classList.remove('transparentBcg');
    cartDOM.classList.remove('showCart');
}

function popularCart(cart){
    cart.forEach(item => addCartItem(item));
}


//___________________________cart logic_________________________________

clearCartBtn.addEventListener('click',clearCart);

cartContent.addEventListener('click', event =>{
    if(event.target.classList.contains('remove-item')){
        let item = event.target;
        let id = item.dataset.id;
        cartContent.removeChild(item.parentElement.parentElement);
        removeItem(id)
    }else if (event.target.classList.contains('fa-chevron-up')){
        let item = event.target;
        let id = item.dataset.id;
        let tempItem = cart.find(item => item.id === id)
        tempItem.amount = tempItem.amount + 1;
        saveCart(cart);
        setCartValues(cart);
        item.nextElementSibling.innerText = tempItem.amount;
    } else if (event.target.classList.contains('fa-chevron-down')){
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        if(tempItem.amount > 0){
            saveCart(cart);
            setCartValues(cart);
            lowerAmount.previousElementSibling.innerText = tempItem.amount;
        } else {
            cartContent.removeChild(lowerAmount.parentElement.parentElement);
            removeItem(id);

        }
    }
})

function clearCart(){
    let cartItem = cart.map(item => item.id);
    cartItem.forEach(id => removeItem(id));
    hideCart();

    while(cartContent.children.length > 0){
        cartContent.removeChild(cartContent.children[0]);
    }
}

function removeItem(id){
    cart = cart.filter(item => item.id !== id);
    setCartValues(cart);
    saveCart(cart);
    let button = getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i>Add to cart`;
}

function getSingleButton(id){
    return buttonsDOM.find(button => button.dataset.id === id);
}

//______________________localstorage functions______________________________

function saveProducts(products){
    localStorage.setItem('products', JSON.stringify(products));
}

function getProducts(id){
    let products = JSON.parse(localStorage.getItem('products'))
    return products.find(item => item.id === id)
}
function saveCart(cart){
    localStorage.setItem('cart', JSON.stringify(cart))
}

function getCart(){
    if(localStorage.getItem('cart')){
        return JSON.parse(localStorage.getItem('cart'));
    } else {
        return [];
    }
}


document.addEventListener('DOMContentLoaded', ()=>{
    getPageLayout();
    saveProducts(products);
    setupApp()
    getCartButton();
})
