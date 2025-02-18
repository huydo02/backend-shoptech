//cập nhật số lượng sản phẩm
const inputQuantity = document.querySelectorAll("input[name='quantity']");
if (inputQuantity.length > 0) {
    // console.log(inputQuantity);
    inputQuantity.forEach(input => {
        input.addEventListener("change", () => {
            const quantity = parseInt(input.value);
            const productId = input.getAttribute("product-id");
            // console.log(quantity);
            // console.log(productId);
            window.location.href = `/cart/update/${productId}/${quantity}`;
        })
    })
}