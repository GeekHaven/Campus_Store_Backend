const mongoose = require("mongoose");
const supertest = require("supertest");
const {
  initialSellers,
  initialProducts,
  initialUsers,
  addProduct,
  loginSeller,
  app,
  Product,
  User,
  Seller,
  loginUser,
} = require("../test_helper");
const api = supertest(app);

let seller1, seller2, user1, product1, product2, product3;
beforeEach(async () => {
  await User.deleteMany({});
  await Product.deleteMany({});
  await Seller.deleteMany({});
  seller1 = await loginSeller(initialSellers[0]);
  seller2 = await loginSeller(initialSellers[1]);
  user1 = await loginUser(initialUsers[0]);
  product1 = await addProduct(seller1.tokenSeller.id, initialProducts[0]);
  product2 = await addProduct(seller1.tokenSeller.id, initialProducts[1]);
  product3 = await addProduct(seller2.tokenSeller.id, initialProducts[5]);
});

const url = "/seller/products";

describe("getting products for a particular seller", () => {
  it("should return a sellers products when valid request", async () => {
    const { body } = await api
      .get(url)
      .set("Authorization", `Bearer ${seller1.token}`)
      .expect(200);

    await product1.populate("seller").execPopulate();
    await product2.populate("seller").execPopulate();
    expect(JSON.stringify(body)).toBe(JSON.stringify([product1, product2]));
  });

  it("should return 404 when the user is not a seller", async () => {
    const { body } = await api
      .get(url)
      .set("Authorization", `Bearer ${user1.token}`)
      .expect(404);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
