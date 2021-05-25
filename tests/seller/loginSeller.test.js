const mongoose = require("mongoose");
const supertest = require("supertest");
const {
  initialSellers,
  registerSeller,
  app,
  Product,
  User,
  Seller,
} = require("../test_helper");
const api = supertest(app);

let seller;
beforeEach(async () => {
  await User.deleteMany({});
  await Product.deleteMany({});
  await Seller.deleteMany({});
  seller = await registerSeller(initialSellers[0]);
});

const url = "/seller";

describe("Login tests for the seller", () => {
  it("Should login a seller if correct credentials are given", async () => {
    const { body } = await api
      .post(`${url}/login`)
      .send({
        email: initialSellers[0].email,
        password: initialSellers[0].password,
      })
      .expect(200);
    expect(body.token).toBeDefined();
    expect(JSON.stringify(body.tokenUser)).toBe(
      JSON.stringify({
        email: initialSellers[0].email,
        id: String(seller._id),
        type: "seller",
      })
    );
  });

  it("should return 400 in case of incomplete data", async () => {
    const res = await api
      .post(`${url}/login`)
      .send({
        email: initialSellers[0].email,
      })
      .expect(400);
    expect(res.body.error).toBe("Please enter all the details");

    const res2 = await api
      .post(`${url}/login`)
      .send({
        email: initialSellers[0].email,
      })
      .expect(400);

    expect(res2.body.error).toBe("Please enter all the details");
  });

  it("should return 401 error in case of non existing email", async () => {
    const { body } = await api
      .post(`${url}/login`)
      .send({
        email: initialSellers[1].email,
        password: initialSellers[1].password,
      })
      .expect(401);
    expect(body.error).toBe("Email does not exist. Please register first.");
  });

  it("should return 401 error in case of wrong password", async () => {
    const { body } = await api
      .post(`${url}/login`)
      .send({
        email: initialSellers[0].email,
        password: initialSellers[1].password,
      })
      .expect(401);
    expect(body.error).toBe("Invalid credentials");
  });
});

afterAll(() => {
  mongoose.connection.close();
});
