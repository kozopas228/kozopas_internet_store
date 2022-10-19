class Order {
    constructor(id, creationDate, status, basketId, productsQuantities) {
        this.id = id;
        this.creationDate = creationDate;
        this.status = status;
        this.basketId = basketId;
        this.productsQuantities = productsQuantities;
    }
}

module.exports = Order;