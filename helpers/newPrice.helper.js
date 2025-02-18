
module.exports.newPriceProducts = (product) => {
    const newProduct = product.map(item => {
        item._doc.priceNew = (item.price - (item.price * item.discountPercentage / 100)).toFixed(0);
        return item;
    });
    return newProduct;
}

module.exports.newPriceProductDetail = (product) => {
    // console.log(product.discountPercentage)
    //console.log("product", (product.price - (product.price * product.discountPercentage / 100)).toFixed(0))
    const newPrice = (product.price - (product.price * product.discountPercentage / 100)).toFixed(0);
    return newPrice;
}