module.exports = (htmlTemplate, product) => {
  let output = htmlTemplate.replaceAll("{%PRODUCTNAME%}", product.productName);
  output = output.replaceAll("{%IMAGE%}", product.image);
  output = output.replaceAll("{%PRICE%}", product.price);
  output = output.replaceAll("{%DESC%}", product.description);
  output = output.replaceAll("{%QUANTITY%}", product.quantity);
  output = output.replaceAll("{%ID%}", product.id);
  output = output.replaceAll("{%NUTRIENTS%}", product.nutrients);
  output = output.replaceAll("{%FROM%}", product.from);
  if (product.organic === false) {
    output = output.replaceAll("{%NOT_ORGANIC%}", "not-organic");
  }
  return output;
};
