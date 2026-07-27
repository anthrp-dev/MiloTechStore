let productsList=[];

async function getProducts() 
{
    try{
    const response = await fetch('https://fakestoreapi.com/products');
    const products = await response.json();
    productsList = products;

}
catch (error) {
    console.error('Error fetching products:', error);
}

}
getProducts();