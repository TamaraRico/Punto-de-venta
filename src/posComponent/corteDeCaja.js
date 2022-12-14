import React from 'react';

var user = null;
var pass = null;

function getSalesByDate(start, end){
    return new Promise((resolve, reject) => {
        window.api.send('sales_by_date:fetch', start, end);
        window.api.receive('sales_by_date:fetch', async (data) => {
            resolve(data)
        })
    })
}

function getProduct(barcode){
    return new Promise((resolve, reject) => {
        window.api.send('product:getByBarcode', barcode);
        window.api.receive('product:getOne', (data) => {
            resolve(data);
        });
	})
}

export function corteDeCajaEnX(user){//pasar empleado activo como parametro
    var elementosComprados = []
    let startTime = user.entrada;
    let stopTime  = user.salida;    
    getSalesByDate(startTime, stopTime).then((data) => {
        data.forEach(element => {
            var productBarcode = element.purchased_products.products.barcode;
            var cantidadDelProducto = element.purchased_products.products.quantity;
            var productName = null;
            var price = null;
            getProduct(productBarcode).then((data) => {
                if (data !== "null") {
                  const product = JSON.parse(data);
                  productName = product.name
                  price = product.priceUnit
                }
            });
            const obj = data.find(productName);
            if(obj !== null) {
                var cantidadComprada = obj.cantidad;
                obj.cantidad = obj.cantidad + cantidadDelProducto;
                obj.total = obj.total + cantidadComprada * price;
            } else {
                var precioTotal = cantidadDelProducto * price;
                var p = {
                    nombre : productName,
                    cantidad : cantidadDelProducto,
                    total : precioTotal
                };
                elementosComprados.push(p);
            }
        })
    });
    return elementosComprados;
    // generar recibo
}

const elementsByCategory = [
    {
        categoria: "Papeleria",
        productos: []
    },
    {
        categoria: "Miscelanea",
        productos: []
    },
    {
        categoria: "Regalos",
        productos: []
    }
]

export function corteDeCajaEnZ(user){
    var elementosComprados = []
    let startTime = user.entrada;
    let stopTime  = user.salida;
    getSalesByDate(startTime, stopTime).then((data) => { // pasar a otro metodo, igual que el corte en X
        data.forEach(element => {
            var productBarcode = element.purchased_products.products.barcode;
            var productCategory = element.purchased_products.category;
            var cantidadDelProducto = element.purchased_products.products.quantity;
            var productName = null;
            var price = null;
            getProduct(productBarcode).then((data) => {
                if (data !== "null") {
                  const product = JSON.parse(data);
                  productName = product.name
                  price = product.priceUnit
                }
            });
            const obj = data.find(productCategory).productos;
            const objProduct = obj.find(productName);
            if(objProduct != null){
                var cantidadComprada = objProduct.cantidad;
                objProduct.cantidad = objProduct.cantidad + cantidadDelProducto;
                objProduct.total = objProduct.total + cantidadComprada * price;
            }else{
                var precioTotal = cantidadDelProducto * price;
                var p = {
                    categoria: productCategory,
                    productos : [
                        {
                            nombre : productName,
                            cantidad : cantidadDelProducto,
                            total : precioTotal
                        }
                    ]
                };
                elementosComprados.push(p);
            }
        })
    });
    return elementosComprados;
    // generar recibo
}