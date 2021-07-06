const mongoose = require("mongoose");
const supertest = require("supertest");
const {
  initialProducts,
  initialUsers,
  loginSeller,
  loginUser,
  addProduct,
  app,
  Product,
  User,
  Seller,
} = require("../test_helper");
const api = supertest(app);

let seller, product1, product2;
beforeEach(async () => {
  await User.deleteMany({});
  await Product.deleteMany({});
  await Seller.deleteMany({});

  seller = await loginSeller(initialUsers[0]);
  product1 = await addProduct(seller.tokenSeller.id, initialProducts[0]);
  product2 = await addProduct(seller.tokenSeller.id, initialProducts[1]);
});

const url = "/product";

describe("Getting the products", () => {
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

afterAll(() => {
  mongoose.connection.close();
});
