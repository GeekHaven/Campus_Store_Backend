# Campus Store Backend
Backend for campus store

<h2>Database Schema</h2>

### users schema

* username: string
* email: string
* passwordHash: string
* orders: Id, ref -> Order
* isAdmin: boolean

### sellers schema

* username: string
* email: string
* passwordHash: string
* orders: Id, ref -> Order

### products schema

* name: string
* seller: Id, ref -> Seller
* price: number
* description: string
* image: string
* stock: number

### orders schema

* product: Id, ref -> Product
* seller: Id, ref -> Seller
* user: Id, ref -> user
* quantity: number
* confirmed: boolean
* delivered: boolean
* outForDelivery: boolean

## API Endpoints


### `POST /auth/login`
**req**
* Body
    * Required: { email, password }

**res**
* status: 201
* body: empty
---
### `POST /auth/signup`
**req**
* Body:
    * Required: { email, password }
    * Optional: { username, isAdmin }

**res**
* status: 200
* body: { token, user }

---
### `GET /orders`
**req**
* Headers
    * Authentication: Bearer token
* Body
    * Required: email, password
**res**
* status: 201
---
### `POST /orders/:id`
**req**
* Headers
    * Authentication: Bearer token

**res**
* status: 200
* body: { orders }
---

### `POST /product`
**res**
* status: 200
* body: { [product] }
---

### `GET /product/:id`
**res**
* status: 200
* body: { product }
---

### `PUT /product/:id`
**req**
* Headers
    * Authentication: Bearer token
* Body
    * Optional: { name, price, description, image, stock }

**res**
* status: 200
* body: { product }
---

### `DELETE /product/:id`
**req**
* Headers
    * Authentication: Bearer token

**res**
* status: 204
---

### `GET /product/:id/order`
**res**
* status: 200
* body: { product }
---

### `POST /product/:id/order`
**req**
* Headers
    * Authentication: Bearer token
* Body
    * Required: { quantity }

**res**
* status: 201
* body: { order }
---

### `POST /product/create`
**req**
* Headers
    * Authentication: Bearer token
* Body
    * Required: { name, price, description, image, stock }

**res**
* status: 201
* body: { product }
---

### `POST /seller/login`
**req**
* Body
    * Required: { email, password }

**res**
* status: 200
* body: { token, user }
---

### `GET /seller/profile`
**req**
* Headers
    * Authentication: Bearer token

**res**
* status: 200
* body: { seller (populated) } 
---

### `GET /seller/orders`
**req**
* Headers
    * Authentication: Bearer token

**res**
* status: 200
* body: { seller (populated) }
---

### `GET /seller/orders/:id`
**req**
* Headers
    * Authentication: Bearer token

**res**
* status: 200
* body: { order }
---

### `PUT /seller/orders/:id`
**req**
* Headers
    * Authentication: Bearer token
    * body: { confirmed, delivered, outForDelivery }

**res**
* status: 200
* body: { order }