class Product {
    constructor(id, name, price, quantity, image, brandId, typeId, colorsIds, productSpecsIds) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.image = image;
        this.brandId = brandId;
        this.typeId = typeId;
        this.colorsIds = colorsIds;
        this.productSpecsIds = productSpecsIds;
    }
}

module.exports = Product;