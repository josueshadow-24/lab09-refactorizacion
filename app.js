/*
 * ============================================================
 *  LABORATORIO 09 - Código base (ES5)
 *  Sistema de gestión de una tienda de tecnología
 * ------------------------------------------------------------
 *  Este archivo está escrito INTENCIONALMENTE con sintaxis ES5:
 *    - Variables declaradas con var
 *    - Funciones tradicionales con function
 *    - Objetos planos
 *    - Valores por defecto "manuales" con ||
 *    - Acceso a propiedades con punto / índice
 *    - concat() y Object.assign() para combinar datos
 *    - Uso del objeto "arguments" para argumentos variables
 *
 *  Tu tarea: refactorizarlo a ES6+ y modularizarlo
 *  (datos.js, utilidades.js y app.js).
 * ============================================================
 */

// ============================================================
//  DATOS (base de datos simulada)
// ============================================================

const tienda = {
  nombre: 'TecnoStore',
  ruc: '20123456789',
  direccion: {
    calle: 'Av. Arequipa 1250',
    distrito: 'Lince',
    ciudad: 'Lima'
  }
};

const configuracionPorDefecto = {
  moneda: 'S/',
  igv: 0.18,
  descuentoMaximo: 30,
  mostrarStock: true
};

const configuracionUsuario = {
  moneda: 'S/',
  descuentoMaximo: 25
};

const productosLaptops = [
  { id: 1, nombre: 'Laptop Lenovo IdeaPad 3', categoria: 'Laptops', precio: 2499.90, stock: 8 },
  { id: 2, nombre: 'Laptop HP Pavilion 15', categoria: 'Laptops', precio: 3199.00, stock: 5 },
  { id: 3, nombre: 'MacBook Air M2', categoria: 'Laptops', precio: 4899.00, stock: 2 }
];

const productosAccesorios = [
  { id: 4, nombre: 'Mouse Logitech M170', categoria: 'Accesorios', precio: 39.90, stock: 50 },
  { id: 5, nombre: 'Teclado Redragon Kumara', categoria: 'Accesorios', precio: 149.00, stock: 0 },
  { id: 6, nombre: 'Audífonos Sony WH-CH520', categoria: 'Accesorios', precio: 199.00, stock: 15 }
];

const productosMonitores = [
  { id: 7, nombre: 'Monitor LG 24" IPS', categoria: 'Monitores', precio: 549.00, stock: 10 },
  { id: 8, nombre: 'Monitor Samsung 27" Curvo', categoria: 'Monitores', precio: 899.00, stock: 3 }
];

const clientes = [
  {
    id: 101,
    nombres: 'Ana',
    apellidos: 'Torres Quispe',
    email: 'ana.torres@correo.com',
    direccion: { distrito: 'Miraflores', ciudad: 'Lima' },
    tipo: 'frecuente'
  },
  {
    id: 102,
    nombres: 'Luis',
    apellidos: 'Ramírez Huamán',
    email: 'luis.ramirez@correo.com',
    direccion: { distrito: 'Cercado', ciudad: 'Arequipa' },
    tipo: 'nuevo'
  },
  {
    id: 103,
    nombres: 'María',
    apellidos: 'Flores Chávez',
    email: 'maria.flores@correo.com',
    direccion: { distrito: 'Víctor Larco', ciudad: 'Trujillo' },
    tipo: 'frecuente'
  }
];

const pedido = {
  codigo: 'PED-0001',
  clienteId: 101,
  items: [
    { productoId: 1, cantidad: 1 },
    { productoId: 4, cantidad: 2 },
    { productoId: 7, cantidad: 1 }
  ]
};

// Coordenadas del almacén [latitud, longitud]
const ubicacionAlmacen = [-12.0853, -77.0346];

// ============================================================
//  FUNCIONES (lógica de negocio)
// ============================================================

// Une todas las listas de productos en un solo catálogo
const obtenerCatalogo = () => [...productosLaptops, ...productosAccesorios, ...productosMonitores];

// Combina la configuración por defecto con la del usuario
const obtenerConfiguracion = () => ({ ...configuracionPorDefecto, ...configuracionUsuario });

// Da formato a un monto. Si no se envía moneda o decimales, usa valores por defecto
const formatearPrecio = (monto, moneda = 'S/', decimales = 2) => `${moneda} ${monto.toFixed(decimales)}`;

// Calcula el precio con descuento. Si no se envía porcentaje, no aplica descuento
const calcularDescuento = (precio, porcentaje = 0) => {
  const descuento = precio * (porcentaje / 100);
  return precio - descuento;
};

// Calcula el precio final con IGV
const calcularPrecioConIGV = (precio, igv = 0.18) => precio + (precio * igv);

// Devuelve un texto con la información de un producto
const describirProducto = ({ nombre, precio, stock, categoria }) => {
  const estado = stock > 0 ? `Disponible (${stock} und.)` : 'AGOTADO';
  return `[${categoria}] ${nombre} - ${formatearPrecio(precio)} - ${estado}`;
};

// Devuelve el nombre completo y la ciudad de un cliente
const resumenCliente = ({ nombres, apellidos, email, direccion: { distrito, ciudad } }) => 
  `${nombres} ${apellidos} <${email}> - ${distrito}, ${ciudad}`;

// Busca un producto por su id
const buscarProductoPorId = (catalogo, id) => catalogo.find((producto) => producto.id === id) || null;

// Busca un cliente por su id
const buscarClientePorId = (listaClientes, id) => listaClientes.find((cliente) => cliente.id === id) || null;

// Filtra productos por categoría
const filtrarPorCategoria = (catalogo, categoria) => 
  catalogo.filter((producto) => producto.categoria === categoria);

// Devuelve solo los productos con stock disponible
const productosDisponibles = (catalogo) => 
  catalogo.filter(({ stock }) => stock > 0);

// Devuelve una lista con los nombres de los productos
const listarNombres = (catalogo) => 
  catalogo.map(({ nombre }) => nombre);

// Suma una cantidad indefinida de números (usa "arguments")
const sumarMontos = (...montos) => montos.reduce((total, monto) => total + monto, 0);

// Registra un mensaje con varias etiquetas (usa "arguments")
const registrarEvento = (tipo, ...etiquetas) => {
  console.log(`[${tipo.toUpperCase()}] ${etiquetas.join(' | ')}`);
};

// Actualiza el stock de un producto creando un objeto nuevo
const actualizarProducto = (producto, cambios) => ({ ...producto, ...cambios });

// Calcula el detalle y total de un pedido
const calcularPedido = (pedidoActual, catalogo, porcentajeDescuento = 0) => {
  const { codigo, items } = pedidoActual;
  const config = obtenerConfiguracion();
  const detalle = [];
  const subtotales = [];

  for (const item of items) {
    const { productoId, cantidad } = item;
    const producto = buscarProductoPorId(catalogo, productoId);
    const subtotal = producto.precio * cantidad;

    detalle.push(`${cantidad} x ${producto.nombre} = ${formatearPrecio(subtotal, config.moneda)}`);
    subtotales.push(subtotal);
  }

  const subtotalGeneral = sumarMontos(...subtotales);
  const conDescuento = calcularDescuento(subtotalGeneral, porcentajeDescuento);
  const total = calcularPrecioConIGV(conDescuento, config.igv);

  return {
    codigo,
    detalle,
    subtotal: subtotalGeneral,
    descuento: porcentajeDescuento,
    total
  };
};

// Obtiene el producto más caro y el más barato
const obtenerExtremos = (catalogo) => {
  const ordenados = [...catalogo].sort((a, b) => b.precio - a.precio);
  return [ordenados[0], ordenados[ordenados.length - 1]];
};

// ============================================================
//  PROGRAMA PRINCIPAL
// ============================================================
const { nombre: nombreTienda, ruc, direccion: { calle, distrito: distritoTienda, ciudad: ciudadTienda } } = tienda;

console.log('==============================================');
console.log(`  ${nombreTienda} - RUC ${ruc}`);
console.log(`  ${calle}, ${distritoTienda} - ${ciudadTienda}`);
console.log('==============================================');

// 1. Configuración
const config = obtenerConfiguracion();
console.log('\n--- 1. Configuración del sistema ---');
console.log(config);

// 2. Catálogo completo
const catalogo = obtenerCatalogo();
console.log(`\n--- 2. Catálogo completo (${catalogo.length} productos) ---`);
catalogo.forEach((prod) => console.log(describirProducto(prod)));

// 3. Filtros
console.log('\n--- 3. Filtros ---');
console.log('Monitores:', listarNombres(filtrarPorCategoria(catalogo, 'Monitores')));
console.log(`Con stock: ${productosDisponibles(catalogo).length} de ${catalogo.length}`);

// 4. Producto más caro y más barato (acceso por índice)
const [masCaro, masBarato] = obtenerExtremos(catalogo);
console.log('\n--- 4. Extremos de precio ---');
console.log(`Más caro   : ${masCaro.nombre} (${formatearPrecio(masCaro.precio)})`);
console.log(`Más barato : ${masBarato.nombre} (${formatearPrecio(masBarato.precio)})`);

// 5. Clientes
console.log('\n--- 5. Clientes registrados ---');
clientes.forEach((cli, index) => console.log(`${index + 1}. ${resumenCliente(cli)}`));

// 6. Descuentos y formatos (prueba de valores por defecto)
console.log('\n--- 6. Descuentos y formatos ---');
console.log(`Sin descuento     : ${formatearPrecio(calcularDescuento(1000))}`);
console.log(`Con 15% descuento : ${formatearPrecio(calcularDescuento(1000, 15))}`);
console.log(`Formato en dólares: ${formatearPrecio(250, '$')}`);
console.log(`Con 3 decimales   : ${formatearPrecio(99.5, 'S/', 3)}`);

// 7. Pedido
console.log('\n--- 7. Pedido ---');
const cliente = buscarClientePorId(clientes, pedido.clienteId);
const descuentoCliente = cliente.tipo === 'frecuente' ? 10 : 0;
const resultado = calcularPedido(pedido, catalogo, descuentoCliente);

console.log(`Pedido : ${resultado.codigo}`);
console.log(`Cliente: ${cliente.nombres} ${cliente.apellidos} (${cliente.tipo})`);
resultado.detalle.forEach((linea) => console.log(`  - ${linea}`));
console.log(`Subtotal          : ${formatearPrecio(resultado.subtotal)}`);
console.log(`Descuento aplicado: ${resultado.descuento}%`);
console.log(`Total (con IGV)   : ${formatearPrecio(resultado.total)}`);

// 8. Actualización de stock (objeto nuevo sin modificar el original)
console.log('\n--- 8. Actualización de stock ---');
const teclado = buscarProductoPorId(catalogo, 5);
const tecladoActualizado = actualizarProducto(teclado, { stock: 20 });
console.log(`Original   : ${describirProducto(teclado)}`);
console.log(`Actualizado: ${describirProducto(tecladoActualizado)}`);

// 9. Suma con cantidad variable de argumentos
console.log('\n--- 9. Suma de montos variables ---');
console.log(`Ventas del día: ${formatearPrecio(sumarMontos(1200, 350.5, 89.9, 2499.9))}`);

// 10. Ubicación del almacén (acceso por índice a un arreglo)
const [latitud, longitud] = ubicacionAlmacen;
console.log('\n--- 10. Ubicación del almacén ---');
console.log(`Latitud: ${latitud} | Longitud: ${longitud}`);

// 11. Registro de eventos
console.log('\n--- 11. Eventos ---');
registrarEvento('info', 'Sistema iniciado', 'Catálogo cargado', 'Pedido procesado');
registrarEvento('alerta', 'Producto agotado', teclado.nombre);

console.log('\n==============================================');
console.log('  Fin de la ejecución');
console.log('==============================================');
