const url = 'https://store.tildacdn.com/api/tgetproduct/';
let productContainer, popup;

(async () => {
    try {
        const response = await fetch(url)
        const product = await response.json()
        startProductRendering(product)
    } catch (err) {
        console.log(err)
    }
})()

function startProductRendering(product){
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderProduct)
    } else {
        renderProduct(product)
        addListeners()
    }
}


function renderProduct(product){
    productContainer = document.querySelector('.product-root')
    const productImages = JSON.parse(product.images)
    let quantityColor;
    if(product.quantity === 0 ) {
        quantityColor = 'red'
    } else if(product.quantity > 0 && product.quantity < 4){
        quantityColor = 'yellow'
    } else {
        quantityColor = 'green'
    }
    const productHTML = `<div class="product">
            <div class="product-image-wrapper">
                <div class="product-image">
                    <img src="${productImages[0].img}" alt="${product.title}">
                </div>
                <div class="product-miniatures">
                    ${productImages.map(((img, index) => {
                        let imgSrc = img.img
                        return index 
                        ?`<div class="miniature">
                            <img src="${imgSrc}" alt="${product.title}">
                        </div>`
                        : `<div class="miniature active">
                            <img src="${imgSrc}" alt="${product.title}">
                        </div>`   
                    }))}
                </div>
            </div>
            <div class="product-details">
                <div class="product-header border-bottom">
                    <div class="product-title" data-title>${product.title}</div>
                    <div class="product-quantity gray-text">Availability: <span class="product-quantity-value ${quantityColor}">${product.quantity} in stock</span></div>
                </div>

                <div class="product-description gray-text">
                    ${product.descr}
                </div>
                <div class="product-price border-bottom">
                    <ins class="product-price-current"><span class="product-price-value">${product.price}</span>&#8381;</ins>
                    <del class="product-price-old gray-text"><span class="product-price-value">${product.priceold}</span>&#8381;</del>
                </div>
                
                ${product.quantity === 0
                    ?`<button disabled class="btn btn-primary product-button" data-cart>
                        Add to Cart
                    </button>`
                    :`<button class="btn btn-primary product-button" data-cart>
                        Add to Cart
                    </button>`
                }
                
            </div>
        </div>`
    productContainer.insertAdjacentHTML('beforeend', productHTML)
}

function addListeners(){
    popup = document.querySelector('.popup-overlay')

    document.querySelectorAll('.miniature').forEach(miniature => {
        miniature.addEventListener('click', miniatureClickHandler)
    })

    document.querySelector('.product').addEventListener('click', buyBtnHandler)

    popup.addEventListener('click', hideAddToCartMessage)
}

function miniatureClickHandler(e){
    const miniature = e.currentTarget
    document.querySelector('.product-image img').setAttribute('src', miniature.querySelector('img').getAttribute('src'))
    miniature.parentNode.querySelector('.active').classList.remove('active')
    miniature.classList.add('active')
}

function buyBtnHandler(e){
    if (e.target.hasAttribute('data-cart')) {
        const product = e.target.closest('.product');
        const productInfo = {
            title: product.querySelector('.product-title').innerText,
        };

        fillAddToCartMessage(productInfo)
    }
}

function fillAddToCartMessage(productInfo){
    popup.querySelector('.cart-message-product-title').innerText = productInfo.title
    showAddToCartMessage()
}

function showAddToCartMessage(){
    popup.style.display = 'block'
}

function hideAddToCartMessage(e){
    const target = e.target
    if(target.classList.contains('popup-overlay') || target.classList.contains('close-btn') || target.classList.contains('btn')){
        popup.style.display = 'none'
    }
}

