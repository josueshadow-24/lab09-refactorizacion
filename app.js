import {
  tienda,   clientes,  pedido,  ubicacionAlmacen
} from './datos.js';

import {
  obtenerCatalogo,  obtenerConfiguracion,  formatearPrecio,  calcularDescuento,  describirProducto,  resumenCliente,
  buscarProductoPorId,  buscarClientePorId,  filtrarPorCategoria,  productosDisponibles,  listarNombres,  sumarMontos,
  registrarEvento,  actualizarProducto,  calcularPedido,  obtenerExtremos
} from './utilidades.js';
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
