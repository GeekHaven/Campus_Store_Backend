const mongoose = require("mongoose");
const supertest = require("supertest");
const {
  initialSellers,
  initialProducts,
  initialUsers,
  loginSeller,
  createOrder,
  loginUser,
  addProduct,
  app,
  Product,
  User,
  Order,
  Seller,
} = require("../test_helper");
const api = supertest(app);

let seller, user1, user2, product, order1, order2, seller2;
beforeEach(async () => {
  await User.deleteMany({});
  await Product.deleteMany({});
  await Seller.deleteMany({});
  seller = await loginSeller(initialSellers[0]);
  user1 = await loginUser(initialUsers[0]);
  user2 = await loginUser(initialUsers[1]);
  product = await addProduct(seller.tokenSeller.id, initialProducts[0]);
  seller2 = await loginSeller(initialSellers[1]);
  order1 = await createOrder(user1.tokenUser.id, product, 1);
  order2 = await createOrder(user1.tokenUser.id, product, 2);
});

const url = "/seller";

describe("Getting orders by id", () => {
  it("returns order when id and token is valid", async () => {
    const { body } = await api
      .get(`${url}/orders/${order1._id}`)
      .set("Authorization", `Bearer ${seller.token}`)
      .expect(200);
    expect(body.length).toBe(order1.length);
    expect(JSON.stringify(body._id)).toBe(JSON.stringify(order1._id));
    expect(JSON.stringify(body.seller._id)).toBe(JSON.stringify(order1.seller));
  });

  it("returns 404 when user is not a seller", async () => {
    await api
      .get(`${url}/orders/${order1._id}`)
      .set("Authorization", `Bearer ${user1.token}`)
      .expect(404);
  });

  it("returns 404 when the order seller isn't the same as token seller", async () => {
    await api
      .get(`${url}/orders/${order1._id}`)
      .set("Authorization", `Bearer ${seller2.token}`)
      .expect(404);
  });
});

describe("Modifying the order information", () => {
  it("edits the order when correct info is passed", async () => {
    const { body } = await api
      .put(`${url}/orders/${order1._id}`)
      .send({
        delivered: true,
        confirmed: true,
        outForDelivery: true,
      })
      .set("Authorization", `Bearer ${seller.token}`)
      .expect(200);
    const { confirmed, delivered, outForDelivery } = body;
    console.log(body);
    expect({
      delivered: true,
      confirmed: true,
      outForDelivery: true,
    }).toMatchObject({
      confirmed,
      delivered,
      outForDelivery,
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
