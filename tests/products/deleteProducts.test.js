const mongoose = require("mongoose");
const supertest = require("supertest");
const {
  initialProducts,
  initialUsers,
  initialSellers,
  loginUser,
  loginSeller,
  addProduct,
  app,
  Product,
  User,
  Seller,
} = require("../test_helper");
const api = supertest(app);

let seller, buyer, product1;
beforeEach(async () => {
  await User.deleteMany({});
  await Product.deleteMany({});
  await Seller.deleteMany({});

  seller = await loginSeller(initialUsers[0]);
  buyer = await loginUser(initialUsers[1]);
  product1 = await addProduct(seller.tokenSeller.id, initialProducts[0]);
});

const url = "/product";

describe("Deleting products", () => {
  it("deletes the product when proper data is sent by the seller", async () => {
    await api
      .delete(`${url}/${product1._id}`)
      .set("Authorization", `bearer ${seller.token}`)
      .expect(204);

    const product = await Product.findById(product1._id);
    expect(product).toBeNull();
  });

  it("returns error when proper data is not sent", async () => {
    await api
      .delete(`${url}/${product1._id + 1000}`)
      .set("Authorization", `bearer ${seller.token}`)
      .expect(404);
    let product = await Product.findById(product1._id);
    expect(product).toBeDefined();

    await api.delete(`${url}/${product1._id}`).expect(401);
    product = await Product.findById(product1._id);
    expect(product).toBeDefined();

    await api
      .delete(`${url}/${product1._id}`)
      .set("Authorization", `bearer ${buyer.token}`)
      .expect(401);
    product = await Product.findById(product1._id);
    expect(product).toBeDefined();
  });
});

afterAll(() => {
  mongoose.connection.close();
});
