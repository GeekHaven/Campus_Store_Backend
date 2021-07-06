const mongoose = require("mongoose");
const supertest = require("supertest");
const {
  initialSellers,
  initialProducts,
  initialUsers,
  addProduct,
  createOrder,
  loginSeller,
  app,
  Product,
  User,
  Seller,
  loginUser,
} = require("../test_helper");
const api = supertest(app);

let seller, user1, user2, product;
beforeEach(async () => {
  await User.deleteMany({});
  await Product.deleteMany({});
  await Seller.deleteMany({});
  seller = await loginSeller(initialSellers[0]);
  user1 = await loginUser(initialUsers[0]);
  user2 = await loginUser(initialUsers[1]);
  product = await addProduct(seller.tokenSeller.id, initialProducts[0]);
  await createOrder(user1.tokenUser.id, product, 1);
  await createOrder(user2.tokenUser.id, product, 2);
});

const url = "/seller/profile";

describe("Seller data retrieval tests", () => {
  it("returns the sellers data when correct headers are sent", async () => {
    const { body } = await api
      .get(url)
      .set("Authorization", `Bearer ${seller.token}`)
      .expect(200);

    let sellerData = await Seller.findById(seller.tokenSeller.id)
      .populate({
        path: "orders",
        populate: { path: "user" },
      })
      .populate({
        path: "orders",
        populate: { path: "seller" },
      })
      .populate({
        path: "orders",
        populate: { path: "product" },
      })
      .exec();

    expect(JSON.stringify(body._id)).toBe(JSON.stringify(sellerData._id));
    expect(JSON.stringify(sellerData.orders)).toBe(JSON.stringify(body.orders));
  });

  it("returns 404 error when token is not of a seller", async () => {
    await api
      .get(url)
      .set("Authorization", `Bearer ${user1.token}`)
      .expect(404);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
