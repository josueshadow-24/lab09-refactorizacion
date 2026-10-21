import { 
  productosLaptops, 
  productosAccesorios, 
  productosMonitores, 
  configuracionPorDefecto, 
  configuracionUsuario 
} from './datos.js';


// ============================================================
//  FUNCIONES (lógica de negocio)
// ============================================================

// Une todas las listas de productos en un solo catálogo
export const obtenerCatalogo = () => [...productosLaptops, ...productosAccesorios, ...productosMonitores];

// Combina la configuración por defecto con la del usuario
export const obtenerConfiguracion = () => ({ ...configuracionPorDefecto, ...configuracionUsuario });

// Da formato a un monto. Si no se envía moneda o decimales, usa valores por defecto
export const formatearPrecio = (monto, moneda = 'S/', decimales = 2) => `${moneda} ${monto.toFixed(decimales)}`;

// Calcula el precio con descuento. Si no se envía porcentaje, no aplica descuento
export const calcularDescuento = (precio, porcentaje = 0) => {
  const descuento = precio * (porcentaje / 100);
  return precio - descuento;
};

// Calcula el precio final con IGV
export const calcularPrecioConIGV = (precio, igv = 0.18) => precio + (precio * igv);

// Devuelve un texto con la información de un producto
export const describirProducto = ({ nombre, precio, stock, categoria }) => {
  const estado = stock > 0 ? `Disponible (${stock} und.)` : 'AGOTADO';
  return `[${categoria}] ${nombre} - ${formatearPrecio(precio)} - ${estado}`;
};

// Devuelve el nombre completo y la ciudad de un cliente
export const resumenCliente = ({ nombres, apellidos, email, direccion: { distrito, ciudad } }) => 
  `${nombres} ${apellidos} <${email}> - ${distrito}, ${ciudad}`;

// Busca un producto por su id
export const buscarProductoPorId = (catalogo, id) => catalogo.find((producto) => producto.id === id) || null;

// Busca un cliente por su id
export const buscarClientePorId = (listaClientes, id) => listaClientes.find((cliente) => cliente.id === id) || null;

// Filtra productos por categoría
export const filtrarPorCategoria = (catalogo, categoria) => 
  catalogo.filter((producto) => producto.categoria === categoria);

// Devuelve solo los productos con stock disponible
export const productosDisponibles = (catalogo) => 
  catalogo.filter(({ stock }) => stock > 0);

// Devuelve una lista con los nombres de los productos
export const listarNombres = (catalogo) => 
  catalogo.map(({ nombre }) => nombre);

// Suma una cantidad indefinida de números (usa "arguments")
export const sumarMontos = (...montos) => montos.reduce((total, monto) => total + monto, 0);

// Registra un mensaje con varias etiquetas (usa "arguments")
export const registrarEvento = (tipo, ...etiquetas) => {
  console.log(`[${tipo.toUpperCase()}] ${etiquetas.join(' | ')}`);
};

// Actualiza el stock de un producto creando un objeto nuevo
export const actualizarProducto = (producto, cambios) => ({ ...producto, ...cambios });

// Calcula el detalle y total de un pedido
export const calcularPedido = (pedidoActual, catalogo, porcentajeDescuento = 0) => {
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
export const obtenerExtremos = (catalogo) => {
  const ordenados = [...catalogo].sort((a, b) => b.precio - a.precio);
  return [ordenados[0], ordenados[ordenados.length - 1]];
};