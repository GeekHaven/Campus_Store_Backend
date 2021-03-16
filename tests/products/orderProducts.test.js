const mongoose = require("mongoose");
const supertest = require("supertest");
const {
  initialProducts,
  initialUsers,
  loginUser,
  addProduct,
  app,
  Product,
  User,
} = require("../test_helper");
const api = supertest(app);

let seller, buyer, product1, product2;
beforeEach(async () => {
  await User.deleteMany({});
  await Product.deleteMany({});
  seller = await loginUser(initialUsers[0]);
  buyer = await loginUser(initialUsers[1]);
  product1 = await addProduct(seller.tokenUser.id, initialProducts[0]);
  product2 = await addProduct(seller.tokenUser.id, initialProducts[1]);
});

const url = "/product";

describe("Placing order for a product", () => {
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
