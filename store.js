class Store extends Array {

    constructor() {
        let products = JSON.parse(localStorage.getItem("products"));

        if (!products || products?.length === 0) {
            products = [
                {
                    id: 1,
                    name: "Apple",
                    count: 1,
                    isBought: false
                },
                {
                    id: 2,
                    name: "Cavyn",
                    count: 3,
                    isBought: false
                },
                {
                    id: 3,
                    name: "Mango",
                    count: 1,
                    isBought: true
                }
            ];
        }

        super(...products);
    }

    push(...args) {
        const pushed = super.push(...args);
        this.save();
        return pushed;
    }

    filter(...args) {
        const changed = super.filter(...args);
        this.save();
        return changed;
    }

    removeProduct(id) {
        const productIndex = super.findIndex((product) => product.id === id);
        super.splice(productIndex, 1);
        this.save();
    }

    save(){
        localStorage.setItem("products", JSON.stringify(this));
    }

}

export default new Store();