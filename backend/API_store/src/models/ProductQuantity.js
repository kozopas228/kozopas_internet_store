class ProductQuantity {
    constructor(id, basketId, productId, quantity) {
        this.id = id;
        this.basketId = basketId;
        this.productId = productId;
        this.quantity = quantity;
    }
}

module.exports = ProductQuantity;