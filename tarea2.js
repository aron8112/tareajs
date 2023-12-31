// Cada producto que vende el super es creado con esta clase
class Producto {
  sku; // Identificador único del producto
  nombre; // Su nombre
  categoria; // Categoría a la que pertenece este producto
  precio; // Su precio
  stock; // Cantidad disponible en stock

  constructor(sku, nombre, precio, categoria, stock) {
    this.sku = sku;
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;

    // Si no me definen stock, pongo 10 por default
    if (stock) {
      this.stock = stock;
    } else {
      this.stock = 10;
    }
  }
}

// Creo todos los productos que vende mi super
const queso = new Producto("KS944RUR", "Queso", 10, "lacteos", 4);
const gaseosa = new Producto("FN312PPE", "Gaseosa", 5, "bebidas");
const cerveza = new Producto("PV332MJ", "Cerveza", 20, "bebidas");
const arroz = new Producto("XX92LKI", "Arroz", 7, "alimentos", 20);
const fideos = new Producto("UI999TY", "Fideos", 5, "alimentos");
const lavandina = new Producto("RT324GD", "Lavandina", 9, "limpieza");
const shampoo = new Producto("OL883YE", "Shampoo", 3, "higiene", 50);
const jabon = new Producto("WE328NJ", "Jabon", 4, "higiene", 3);

// Genero un listado de productos. Simulando base de datos
const productosDelSuper = [
  queso,
  gaseosa,
  cerveza,
  arroz,
  fideos,
  lavandina,
  shampoo,
  jabon,
];

// Cada cliente que venga a mi super va a crear un carrito
class Carrito {
  productos; // Lista de productos agregados
  categorias; // Lista de las diferentes categorías de los productos en el carrito
  precioTotal; // Lo que voy a pagar al finalizar mi compra

  // Al crear un carrito, empieza vació
  constructor() {
    this.precioTotal = 0;
    this.productos = [];
    this.categorias = [];
  }

  /**
   * función que agrega @{cantidad} de productos con @{sku} al carrito
   */

  async agregarProducto(sku, cantidad) {
    try {
      // Busco el producto en la "base de datos"
      const producto = await findProductBySku(sku);
      // console.log("Producto encontrado", producto);

      const prodExist = this.productos.find((p) => p.sku === sku);

      if (prodExist) {
        prodExist.cantidad += cantidad;
      } else {
        // Creo un producto nuevo
        const nuevoProducto = new ProductoEnCarrito(
          sku,
          producto.nombre,
          cantidad
        );
        this.productos.push(nuevoProducto);
        if (!this.categorias.includes(producto.categoria)) {
          this.categorias.push(producto.categoria);
        }
      }
      this.precioTotal = this.precioTotal + producto.precio * cantidad;
      //console.log(`Agregando ${cantidad} ${sku}`);
    } catch (error) {
      console.log("Error: " + error);
    }
  }

  async eliminarProducto(sku, cantidad) {
    try {
      // Busco el producto en la "base de datos"
      const producto = await findProductBySku(sku);
      // console.log("Producto encontrado", producto);

      const prodExist = this.productos.find((p) => p.sku === sku);

      if (prodExist) {
        if (cantidad < prodExist.cantidad) {
          prodExist.cantidad -= cantidad;
        } else {
          //Se eliminan todos los productos
          //Se busca el producto y se elimina
          const productoIndex = this.productos.findIndex((p) => p.sku === sku);
          this.productos.splice(productoIndex, 1);
          //Se elimina la categoría del carrito
          const catIndex = [...new Set(this.productos.map((p) => p.categoria))];
          this.categorias.splice(catIndex, 1);
        }
      } else {
        console.log("El Producto no se encuentra en el carrito");
      }
      this.precioTotal = this.precioTotal - producto.precio * cantidad;
      //console.log(`Agregando ${cantidad} ${sku}`);
    } catch (error) {
      console.log("Error: " + error);
    }
  }
}

// Cada producto que se agrega al carrito es creado con esta clase
class ProductoEnCarrito {
  sku; // Identificador único del producto
  nombre; // Su nombre
  cantidad; // Cantidad de este producto en el carrito

  constructor(sku, nombre, cantidad) {
    this.sku = sku;
    this.nombre = nombre;
    this.cantidad = cantidad;
  }
}

// Función que busca un producto por su sku en "la base de datos"
function findProductBySku(sku) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const foundProduct = productosDelSuper.find(
        (product) => product.sku === sku
      );
      if (foundProduct) {
        resolve(foundProduct);
      } else {
        reject(`Product ${sku} not found`);
      }
    }, 1500);
  });
}

const carrito = new Carrito();
carrito.agregarProducto("WE328NJ", 2);
// carrito.agregarProducto('WE328NJ', 5);
carrito.agregarProducto("UI999TY", 2);
// carrito.agregarProducto('UI999TY', 3);

//carrito.agregarProducto('WE555NJ', 2);
setTimeout(() => {
  console.log(carrito);
}, 3000);

setTimeout(() => {
  carrito
    .eliminarProducto("WE328NJ", 2)
    .then((mensaje) => {
      console.log(mensaje);
      console.log(carrito);
    })
    .catch((error) => {
      console.log(error);
    });
}, 4000);
