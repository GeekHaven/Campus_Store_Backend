const mongoose = require("mongoose");
const supertest = require("supertest");
const {
  initialUsers,
  initialSellers,
  loginUser,
  app,
  Product,
  User,
  Seller,
} = require("../test_helper");
const api = supertest(app);

const url = "/seller/signup";

let admin, user;
beforeEach(async () => {
  await User.deleteMany({});
  await Product.deleteMany({});
  await Seller.deleteMany({});
  admin = await loginUser(initialUsers[5]);
  user = await loginUser(initialUsers[0]);
});

describe("Register tests for the seller", () => {
  it("should add a new seller if request sent by admin", async () => {
    await api
      .post(url)
      .send(initialSellers[0])
      .set("Authorization", `Bearer ${admin.token}`)
      .expect(201);
    const { username, email } = initialSellers[0];
    const seller = await Seller.findOne({ email });
    expect(seller).toMatchObject({
      email,
      username,
    });
  });

  it("returns 401 error if the user is not an admin", async () => {
    const res = await api
      .post(url)
      .send(initialSellers[0])
      .set("Authorization", `Bearer ${user.token}`)
      .expect(401);

    expect(res.body.error).toBe("Unauthorized to perform the required action");
    const { email } = initialSellers[0];
    const seller = await Seller.findOne({ email });
    expect(seller).toBeNull();
  });

  it("returns 400 error if email or password is missing", async () => {
    const { body: b1 } = await api
      .post(url)
      .send({ email: initialSellers[0].email })
      .set("Authorization", `Bearer ${admin.token}`)
      .expect(400);

    expect(b1.error).toBe("Email and password are required fields");

    const { body: b2 } = await api
      .post(url)
      .send({ email: initialSellers[0].password })
      .set("Authorization", `Bearer ${admin.token}`)
      .expect(400);

    expect(b2.error).toBe("Email and password are required fields");
  });
});

afterAll(() => {
  mongoose.connection.close();
});
