import store from "./store.js";

const productListElement = document.getElementById('product-list');
const addFormElement = document.getElementById('add-form');
const productBoughtListElement = document.getElementById('products-bought-list');
const productLeftListElement = document.getElementById('products-left-list');

function formSubmitHandler(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    if (!formProps.productName) return;

    const product = {id: Date.now(), name: formProps.productName, count: 1, isBought: false};

    store.push(product);
    renderProductElement(product);
}

function renderProductElement(product){

    function decreaseHandler(){
        if (product.count === 2){
            decreaseButton.disabled = true;
        }
        product.count -= 1;
        itemCount.innerText = product.count;
        store.save();

        renderSummaryElement();
    }

    function increaseHandler() {
        decreaseButton.disabled = false;
        product.count += 1;
        itemCount.innerText = product.count;
        store.save();

        renderSummaryElement();
    }

    function stateChangeHandler(){
        product.isBought = !product.isBought;
        productWrapper.className = "product-list__item" + (product.isBought ? " product-list__item_removed" : "");

        renderSummaryElement();
    }

    function removeHandler(){
        // decreaseButton.removeEventListener("click", decreaseHandler);
        // increaseButton.removeEventListener("click", increaseButton);
        productWrapper.remove();
        summaryElement.remove();
        store.removeProduct(product.id)
    }

    function renderSummaryElement(){
        summaryElement.innerHTML = `${product.name} <span>${product.count}</span>`;

        if (product.isBought && summaryElement.parentElement !== productBoughtListElement){
            summaryElement.remove();
            productBoughtListElement.appendChild(summaryElement);
        }else if (summaryElement.parentElement !== productLeftListElement){
            summaryElement.remove();
            productLeftListElement.appendChild(summaryElement);
        }
    }

    let isEditing = false;
    function titleChangeHandler(){
        if (isEditing) return;
        isEditing = true;

        const changeInput = document.createElement("input");
        changeInput.className = "product-list__item-title-change";
        changeInput.value = product.name;
        changeInput.placeholder = product.name;
        changeInput.type = "text";
        productTitle.replaceWith(changeInput);
        changeInput.focus();

        changeInput.addEventListener("blur", (e) => {
            product.name = changeInput.value;
            store.save();
            productTitle.innerText = product.name;
            renderSummaryElement();
            changeInput.replaceWith(productTitle);
        })
    }

    const productWrapper = document.createElement("li");
    productWrapper.className = "product-list__item" + (product.isBought ? " product-list__item_removed" : "");

    const productTitle = document.createElement("p");
    productTitle.innerText = product.name;
    productTitle.className = "product-list__item-title";
    productWrapper.appendChild(productTitle);
    productTitle.addEventListener("click", titleChangeHandler);

    const productCountWrapper = document.createElement("div");
    productCountWrapper.className = "product-list__item-count-wrapper";
    productWrapper.appendChild(productCountWrapper);

    const decreaseButton = document.createElement("button");
    decreaseButton.className = "product-list__item-decrease-button tooltip-button button-shadow";
    decreaseButton.dataset.tooltip = "Прибрати товар";
    decreaseButton.innerText = "-";
    decreaseButton.disabled = product.count <= 1;
    productCountWrapper.appendChild(decreaseButton);
    decreaseButton.addEventListener("click", decreaseHandler);

    const itemCount = document.createElement("span");
    itemCount.className = "product-list__item-count";
    itemCount.innerText = product.count;
    productCountWrapper.appendChild(itemCount);

    const increaseButton = document.createElement("button");
    increaseButton.className = "product-list__item-increase-button tooltip-button button-shadow";
    increaseButton.dataset.tooltip = "Додати товар";
    increaseButton.innerText = "+";
    productCountWrapper.appendChild(increaseButton);
    increaseButton.addEventListener("click", increaseHandler);

    const itemStateWrapper = document.createElement("div");
    itemStateWrapper.className = "product-list__item-state";
    productWrapper.appendChild(itemStateWrapper);

    const stateButton = document.createElement("button");
    stateButton.className = "product-list__item-state-button";
    stateButton.innerText = " Куплено";
    stateButton.addEventListener("click", stateChangeHandler);

    const removeButton = document.createElement("button");
    removeButton.className = "product-list__remove-item-button button-shadow tooltip-button";
    removeButton.dataset.tooltip = "Прибрати товар";
    removeButton.innerText = "×";
    removeButton.addEventListener("click", removeHandler)

    const summaryElement = document.createElement("li");
    renderSummaryElement();

    itemStateWrapper.appendChild(stateButton);
    itemStateWrapper.appendChild(removeButton);
    productListElement.appendChild(productWrapper);
}

addFormElement.addEventListener('submit', formSubmitHandler);

function init(){
    store.forEach(product => {
        renderProductElement(product);
    })
}

init();


