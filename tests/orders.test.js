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
const Order = require("../models/orders");

const api = supertest(app);

let seller, buyer, product1, product2, order1, order2;
beforeAll(async () => {
  User.deleteMany({});
  Order.deleteMany({});
  seller = await loginUser(initialUsers[0]);
  buyer = await loginUser(initialUsers[1]);
  product1 = await addProduct(seller, initialProducts[0]);
  product2 = await addProduct(seller, initialProducts[1]);
  order1 = await createOrder(buyer, product1);
  order2 = await createOrder(buyer, product2);
});

// describe("Getting an order by id", () => {
//   it.only("returns correct order when given correct headers", async () => {
//     const res = await api
//       .get(`/orders/${order1._id}`)
//       .set("Authorization", buyer.token);
//     expect(res.data).toBe(order1);
//   });
// });

afterAll(() => {
  mongoose.connection.close();
});
