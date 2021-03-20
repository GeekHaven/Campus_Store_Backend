const mongoose = require("mongoose");
const supertest = require("supertest");
const {
  initialProducts,
  initialUsers,
  initialSellers,
  loginUser,
  loginSeller,
  addProduct,
  createOrder,
  User,
  Seller,
  Product,
  Order,
  app,
} = require("../test_helper");

const api = supertest(app);
const url = "/orders";

let seller, buyer, product1, product2, order1, order2, buyer2;
beforeEach(async () => {
  await User.deleteMany({});
  await Order.deleteMany({});
  await Product.deleteMany({});
  await Seller.deleteMany({});
  seller = await loginSeller(initialSellers[0]);
  buyer = await loginUser(initialUsers[0]);
  buyer2 = await loginUser(initialUsers[1]);
  product1 = await addProduct(seller.tokenSeller.id, initialProducts[0]);
  product2 = await addProduct(seller.tokenSeller.id, initialProducts[1]);
  order1 = await createOrder(buyer.tokenUser.id, product1);
  order2 = await createOrder(buyer.tokenUser.id, product2);
});

describe("Getting an order by id", () => {
  it("returns correct order when given correct headers", async () => {
    const { body } = await api
      .get(`${url}/${order1._id}`)
      .set("Authorization", `bearer ${buyer.token}`)
      .expect(200);
    await order1
      .populate("seller")
      .populate("user")
      .populate("product")
      .execPopulate();
    expect(JSON.stringify(body)).toBe(JSON.stringify(order1));
  });

  it("returns error when given incorrect id", async () => {
    const { body } = await api
      .get(`${url}/${order1._id}hehe`)
      .set("Authorization", `bearer ${buyer.token}`)
      .expect(404);
  });

  it("returns error when given malformed headers", async () => {
    const { body } = await api
      .get(`${url}/${order1._id}`)
      .set("Authorization", `bearer blehbleh`)
      .expect(400);
    expect(body.error).toBe("Invalid token");
  });

  it("returns error when given incorrect headers", async () => {
    const { body } = await api
      .get(`${url}/${order1._id}`)
      .set("Authorization", `bearer ${buyer2.token}`)
      .expect(404);
  });
});

describe("Getting all the orders for a user", () => {
  it("returns correct orders when given correct headers", async () => {
    const { body } = await api
      .get(`${url}`)
      .set("Authorization", `bearer ${buyer.token}`)
      .expect(200);
    expect(body).toHaveLength(2);
    expect(JSON.stringify(body[0])).toBe(JSON.stringify(order2));
    expect(JSON.stringify(body[1])).toBe(JSON.stringify(order1));
  });

  it("returns error order when given incorrect headers", async () => {
    const { body } = await api
      .get(`${url}`)
      .set("Authorization", `bearer blehbleh`)
      .expect(400);
    expect(body.error).toBe("Invalid token");
  });

  it("returns empty array for users with no orders", async () => {
    const { body } = await api
      .get(`${url}`)
      .set("Authorization", `bearer ${seller.token}`)
      .expect(200);
    expect(body).toHaveLength(0);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
