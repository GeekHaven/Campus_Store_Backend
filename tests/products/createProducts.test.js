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

let seller, buyer;
beforeEach(async () => {
  await User.deleteMany({});
  await Product.deleteMany({});
  seller = await loginUser(initialUsers[0]);
  buyer = await loginUser(initialUsers[1]);
});

const url = "/product";

describe("Creating products", () => {
  it("Adds new product when correct info is given", async () => {
    const res = await api
      .post(`${url}/create`)
      .send(initialProducts[0])
      .set("Authorization", `bearer ${seller.token}`)
      .expect(201);
    const product = await Product.findById(res.body._id);
    expect(product).toMatchObject(initialProducts[0]);
  });

  it("returns 400 when no data provided", async () => {
    const res = await api
      .post(`${url}/create`)
      .set("Authorization", `bearer ${seller.token}`)
      .expect(400);
    expect(res.body.error).toEqual("Please enter all the details");
  });

  it("returns error when the required fields are not filled", async () => {
    let res = await api
      .post(`${url}/create`)
      .send(initialProducts[2])
      .set("Authorization", `bearer ${seller.token}`)
      .expect(400);
    expect(res.body.error).toBe(
      "Product validation failed: image: Path `image` is required."
    );

    res = await api
      .post(`${url}/create`)
      .send(initialProducts[3])
      .set("Authorization", `bearer ${seller.token}`)
      .expect(400);
    expect(res.body.error).toBe(
      "Product validation failed: stock: Path `stock` is required."
    );

    res = await api
      .post(`${url}/create`)
      .send(initialProducts[4])
      .set("Authorization", `bearer ${seller.token}`)
      .expect(400);
    expect(res.body.error).toBe(
      "Product validation failed: price: Path `price` is required."
    );
  });

  it("Returns 401 status and error when token not provided", async () => {
    const res = await api
      .post(`${url}/create`)
      .send(initialProducts[0])
      .expect(401);
    const product = await Product.findById(res.body._id);
    expect(product).toBeFalsy();
    expect(res.body.error).toBe("Unauthorized");
  });

  it("Returns 401 status and error when invalid token is provided", async () => {
    const res = await api
      .post(`${url}/create`)
      .send(initialProducts[0])
      .set("Authorization", `bearer random.bs.here`)
      .expect(401);
    const product = await Product.findById(res.body._id);
    expect(product).toBeFalsy();
    expect(res.body.error).toBe("Unauthorized");
  });

  it("Returns 401 status and error when the user is not a seller", async () => {
    const res = await api
      .post(`${url}/create`)
      .send(initialProducts[0])
      .set("Authorization", `bearer ${buyer.token}`)
      .expect(401);
    const product = await Product.findById(res.body._id);
    expect(product).toBeFalsy();
    expect(res.body.error).toBe("Unauthorized");
  });
});

afterAll(() => {
  mongoose.connection.close();
});
