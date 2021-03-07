const mongoose = require("mongoose");
const supertest = require("supertest");
const {
  initialProducts,
  initialUsers,
  loginUser,
  addProduct,
  createOrder,
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
});

afterAll(() => {
  mongoose.connection.close();
});
