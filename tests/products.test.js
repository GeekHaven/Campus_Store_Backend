const mongoose = require("mongoose");
const supertest = require("supertest");
const {
  initialProducts,
  initialUsers,
  loginUser,
  addProduct,
} = require("./test_helper");
const app = require("../app");
const User = require("../models/users");
const Product = require("../models/products");

const api = supertest(app);

let seller, buyer;
beforeEach(async () => {
  await User.deleteMany({});
  await Product.deleteMany({});
  seller = await loginUser(initialUsers[0]);
  buyer = await loginUser(initialUsers[1]);
});

const url = "/product";

describe("Creating products", () => {
  it("Adds new product when correct info is given", async () => {
    const res = await api
      .post(`${url}/create`)
      .send(initialProducts[0])
      .set("Authorization", `bearer ${seller.token}`)
      .expect(201);
    const product = await Product.findById(res.body._id);
    expect(product).toMatchObject(initialProducts[0]);
  });

  it("returns error when the required fields are not filled", async () => {
    let res = await api
      .post(`${url}/create`)
      .send(initialProducts[2])
      .set("Authorization", `bearer ${seller.token}`)
      .expect(400);
    expect(res.body.error).toBe(
      "Product validation failed: image: Path `image` is required."
    );

    res = await api
      .post(`${url}/create`)
      .send(initialProducts[3])
      .set("Authorization", `bearer ${seller.token}`)
      .expect(400);
    expect(res.body.error).toBe(
      "Product validation failed: stock: Path `stock` is required."
    );

    res = await api
      .post(`${url}/create`)
      .send(initialProducts[4])
      .set("Authorization", `bearer ${seller.token}`)
      .expect(400);
    expect(res.body.error).toBe(
      "Product validation failed: price: Path `price` is required."
    );
  });

  it("Returns 401 status and error when token not provided", async () => {
    const res = await api
      .post(`${url}/create`)
      .send(initialProducts[0])
      .expect(401);
    const product = await Product.findById(res.body._id);
    expect(product).toBeFalsy();
    expect(res.body.error).toBe("Unauthorized");
  });

  it("Returns 401 status and error when invalid token is provided", async () => {
    const res = await api
      .post(`${url}/create`)
      .send(initialProducts[0])
      .set("Authorization", `bearer random.bs.here`)
      .expect(401);
    const product = await Product.findById(res.body._id);
    expect(product).toBeFalsy();
    expect(res.body.error).toBe("Unauthorized");
  });

  it("Returns 401 status and error when the user is not a seller", async () => {
    const res = await api
      .post(`${url}/create`)
      .send(initialProducts[0])
      .set("Authorization", `bearer ${buyer.token}`)
      .expect(401);
    const product = await Product.findById(res.body._id);
    expect(product).toBeFalsy();
    expect(res.body.error).toBe("Unauthorized");
  });
});

describe("Getting all products", () => {
  let product1, product2;
  beforeEach(async () => {
    Product.deleteMany({});
    product1 = await addProduct(seller.tokenUser.id, initialProducts[0]);
    product2 = await addProduct(seller.tokenUser.id, initialProducts[1]);
  });

  it("gets all the products sorted by latest", async () => {
    const { body } = await api.get(url).expect(200);
    expect(body).toHaveLength(2);
    expect(JSON.stringify(body[0])).toBe(JSON.stringify(product2));
    expect(JSON.stringify(body[1])).toBe(JSON.stringify(product1));
  });

  it("gets the product in case of a valid id", async () => {
    const { body } = await api.get(`${url}/${product1._id}`).expect(200);
    expect(JSON.stringify(body)).toBe(JSON.stringify(product1));
  });

  it("returns 404 in case of an invalid id", async () => {
    await api.get(`${url}/${product1._id + 1000}`).expect(404);
  });
});

describe("Placing order for a product", () => {
  let product1, product2;
  beforeEach(async () => {
    Product.deleteMany({});
    product1 = await addProduct(seller.tokenUser.id, initialProducts[0]);
    product2 = await addProduct(seller.tokenUser.id, initialProducts[1]);
  });

  it("adds an order for the product when given proper info", async () => {
    const correctOrder = {
      userid: buyer.tokenUser.id.toJSON(),
      sellerid: seller.tokenUser.id.toJSON(),
      product: product1._id.toJSON(),
    };

    const res = await api
      .post(`${url}/${product1._id}/order`)
      .set("Authorization", `bearer ${buyer.token}`)
      .expect(201);
    expect(res.body).toMatchObject(correctOrder);

    const user = await User.findById(buyer.tokenUser.id)
      .populate("orders")
      .exec();

    expect(user.orders).toHaveLength(1);
    expect(JSON.stringify(user.orders[0])).toBe(JSON.stringify(res.body));

    const res2 = await api
      .post(`${url}/${product2._id}/order`)
      .set("Authorization", `bearer ${buyer.token}`)
      .expect(201);

    const user2 = await User.findById(buyer.tokenUser.id)
      .populate("orders")
      .exec();

    expect(user2.orders).toHaveLength(2);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
