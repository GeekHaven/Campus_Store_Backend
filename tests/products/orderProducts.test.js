const mongoose = require("mongoose");
const supertest = require("supertest");
const {
  initialProducts,
  initialUsers,
  loginUser,
  loginSeller,
  addProduct,
  app,
  Product,
  Seller,
  User,
} = require("../test_helper");
const api = supertest(app);

let seller, buyer, product1, product2;
beforeEach(async () => {
  await User.deleteMany({});
  await Product.deleteMany({});
  await Seller.deleteMany({});
  seller = await loginSeller(initialUsers[0]);
  buyer = await loginUser(initialUsers[1]);
  product1 = await addProduct(seller.tokenSeller.id, initialProducts[0]);
  product2 = await addProduct(seller.tokenSeller.id, initialProducts[1]);
});

const url = "/product";

describe("Placing order for a product", () => {
  it("adds an order for the product when given proper info", async () => {
    const { body } = await api
      .post(`${url}/${product1._id}/order`)
      .send({ quantity: 2 })
      .set("Authorization", `bearer ${buyer.token}`)
      .expect(201);

    expect(JSON.stringify(body.product)).toBe(JSON.stringify(product1));

    const user = await User.findById(buyer.tokenUser.id)
      .populate("orders")
      .exec();

    expect(user.orders).toHaveLength(1);
    expect(user.orders[0]._id.toString()).toBe(body._id);

    await api
      .post(`${url}/${product2._id}/order`)
      .send({ quantity: 1 })
      .set("Authorization", `bearer ${buyer.token}`)
      .expect(201);

    const user2 = await User.findById(buyer.tokenUser.id)
      .populate("orders")
      .exec();

    expect(user2.orders).toHaveLength(2);
  });

  it("returns 400 if quantity > available stock", async () => {
    const { body } = await api
      .post(`${url}/${product1._id}/order`)
      .send({ quantity: 10000 })
      .set("Authorization", `bearer ${buyer.token}`)
      .expect(400);

    expect(body.error).toBe("Quantity not available");
  });
});

afterAll(() => {
  mongoose.connection.close();
});
