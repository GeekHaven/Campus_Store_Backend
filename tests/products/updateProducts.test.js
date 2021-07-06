const mongoose = require("mongoose");
const supertest = require("supertest");
const {
  initialProducts,
  initialUsers,
  initialSellers,
  loginSeller,
  loginUser,
  addProduct,
  app,
  Product,
  Seller,
  User,
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

describe("Updating products", () => {
  it("updates the product when proper data is sent by the seller", async () => {
    await api
      .put(`${url}/${product1._id}`)
      .set("Authorization", `bearer ${seller.token}`)
      .send({
        name: "Aparoksha red tee",
        description: "A red tee from aparoksha",
      })
      .expect(200);
    const updated = await Product.findById(product1._id);
    expect(updated).toMatchObject({
      ...initialProducts[0],
      name: "Aparoksha red tee",
      description: "A red tee from aparoksha",
    });
  });

  it("returns 401 in case of unauthorized user", async () => {
    await api
      .put(`${url}/${product1._id}`)
      .set("Authorization", `bearer ${buyer.token}`)
      .send({
        name: "Aparoksha red tee",
        description: "A red tee from aparoksha",
      })
      .expect(401);

    let original = await Product.findById(product1._id);
    expect(original).toMatchObject(initialProducts[0]);

    await api
      .put(`${url}/${product1._id + 10000}`)
      .set("Authorization", `bearer ${seller.token}`)
      .send({
        name: "Aparoksha red tee",
        description: "A red tee from aparoksha",
      })
      .expect(404);

    original = await Product.findById(product1._id);
    expect(original).toMatchObject(initialProducts[0]);

    await api
      .put(`${url}/${product1._id}`)
      .send({
        name: "Aparoksha red tee",
        description: "A red tee from aparoksha",
      })
      .expect(401);

    original = await Product.findById(product1._id);
    expect(original).toMatchObject(initialProducts[0]);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
