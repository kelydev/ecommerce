# Ecommerce API - Proyecto Completo

Este es un proyecto de ecommerce completo desarrollado con Node.js, Express.js, MongoDB y Handlebars que incluye todas las funcionalidades requeridas para gestión de productos, carritos y vistas.

## Características

### Productos
- CRUD completo de productos
- Paginación avanzada
- Filtros por categoría y disponibilidad
- Ordenamiento por precio (ascendente/descendente)
- Búsqueda por query parameters

### Carritos
- CRUD completo de carritos
- Agregar productos al carrito
- Actualizar cantidades de productos
- Eliminar productos específicos
- Vaciar carrito completo
- Populate de productos para mostrar información completa

### Vistas
- Vista de productos con paginación
- Vista de detalle de producto
- Vista de carrito específico
- Interfaz moderna con Bootstrap 5

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Base de datos**: MongoDB con Mongoose
- **Template Engine**: Handlebars
- **Frontend**: Bootstrap 5
- **Paginación**: mongoose-paginate-v2

## Endpoints API

### Productos (`/api/products`)
```
GET    /api/products              - Obtener productos (con filtros y paginación)
GET    /api/products/:id          - Obtener producto por ID
POST   /api/products              - Crear nuevo producto
PUT    /api/products/:id          - Actualizar producto
DELETE /api/products/:id          - Eliminar producto
```

#### Query Parameters para GET /api/products:
- `limit` (opcional): Número de productos por página (default: 10)
- `page` (opcional): Página a mostrar (default: 1)
- `sort` (opcional): Ordenamiento por precio ("asc" o "desc")
- `query` (opcional): Filtro por categoría o disponibilidad ("available", "unavailable", nombre de categoría)

### Carritos (`/api/carts`)
```
GET    /api/carts                        - Obtener todos los carritos
POST   /api/carts                        - Crear nuevo carrito
GET    /api/carts/:cid                   - Obtener carrito por ID
PUT    /api/carts/:cid                   - Actualizar carrito completo
DELETE /api/carts/:cid                   - Vaciar carrito

POST   /api/carts/:cid/product/:pid      - Agregar producto al carrito
PUT    /api/carts/:cid/products/:pid     - Actualizar cantidad de producto
DELETE /api/carts/:cid/products/:pid     - Eliminar producto específico
```

### Usuarios (`/api/users`)
```
GET    /api/users                 - Obtener usuarios
POST   /api/users                 - Crear usuario
GET    /api/users/:id             - Obtener usuario por ID
PUT    /api/users/:id             - Actualizar usuario
DELETE /api/users/:id             - Eliminar usuario
```

## Rutas de Vistas

```
GET    /products                  - Vista de productos con paginación
GET    /products/:pid             - Vista de detalle de producto
GET    /carts/:cid                - Vista de carrito específico
```

## Instalación

1. Clona el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd ecommerce
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno en `.env`:
```env
MONGO_URI=tu_uri_de_mongodb
```

4. Inicia el servidor:
```bash
npm start
```

El servidor se ejecutará en `http://localhost:8080`

## Estructura del Proyecto

```
ecommerce/
├── src/
│   ├── models/
│   │   ├── user.model.js
│   │   ├── product.model.js
│   │   └── cart.model.js
│   ├── routes/
│   │   ├── users.router.js
│   │   ├── products.router.js
│   │   ├── carts.router.js
│   │   └── views.router.js
│   ├── views/
│   │   ├── layouts/
│   │   │   └── main.handlebars
│   │   ├── index.handlebars
│   │   ├── product-detail.handlebars
│   │   └── cart.handlebars
│   ├── public/
│   └── app.js
├── package.json
└── README.md
```

## Modelos de Datos

### Producto
```javascript
{
  title: String,           // Requerido
  description: String,     // Requerido
  code: String,           // Requerido, único
  price: Number,          // Requerido
  status: Boolean,        // Default: true
  stock: Number,          // Requerido
  category: String,       // Requerido
  thumbnails: [String]    // Array de URLs de imágenes
}
```

### Carrito
```javascript
{
  products: [{
    product: ObjectId,     // Referencia a Product
    quantity: Number       // Default: 1
  }]
}
```

### Usuario
```javascript
{
  nombre: String,         // Requerido
  apellido: String,       // Requerido
  edad: Number,          // Requerido
  dni: String,           // Requerido, único
  curso: String,         // Requerido
  nota: Number           // Requerido
}
```

## Funcionalidades Destacadas

### Respuesta de API de Productos
La API de productos devuelve una respuesta estructurada:
```json
{
  "status": "success",
  "payload": [...],
  "totalPages": 5,
  "prevPage": 1,
  "nextPage": 3,
  "page": 2,
  "hasPrevPage": true,
  "hasNextPage": true,
  "prevLink": "/api/products?page=1&limit=10",
  "nextLink": "/api/products?page=3&limit=10"
}
```

### Populate en Carritos
Los carritos utilizan `populate` para mostrar información completa de los productos:
```json
{
  "products": [{
    "product": {
      "_id": "...",
      "title": "Producto",
      "price": 100,
      "description": "..."
    },
    "quantity": 2
  }]
}
```

## Interfaz de Usuario

- **Design moderno** con Bootstrap 5
- **Responsive** para todos los dispositivos
- **Filtros dinámicos** por categoría y precio
- **Paginación intuitiva**
- **Carrito interactivo** con actualización de cantidades
- **Transiciones suaves** y efectos hover

## Ejemplo de Uso

### Crear un producto:
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nuevo Producto",
    "description": "Descripción del producto",
    "code": "PROD001",
    "price": 99.99,
    "stock": 10,
    "category": "electronics"
  }'
```

### Obtener productos con filtros:
```bash
curl "http://localhost:8080/api/products?limit=5&page=1&sort=asc&query=electronics"
```

### Crear carrito y agregar producto:
```bash
# Crear carrito
curl -X POST http://localhost:8080/api/carts

# Agregar producto (usando IDs reales)
curl -X POST http://localhost:8080/api/carts/CART_ID/product/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -d '{"quantity": 2}'
```
## URLs para Probar

Una vez que tengas el servidor ejecutándose, puedes probar:

- **Vista de productos**: http://localhost:8080/products
- **API de productos**: http://localhost:8080/api/products
- **API de carritos**: http://localhost:8080/api/carts

---