const mongoose = require("mongoose");
const supertest = require("supertest");
const { initialUsers, addUser, app, User } = require("../test_helper");
const api = supertest(app);
const signup = "/auth/signup";
const login = "/auth/login";

let user;
beforeEach(async () => {
  await User.deleteMany({});
  user = initialUsers[0];
  await addUser(user);
});

describe("Login tests", () => {
  it("Logs in user and returns token when creds are valid", async () => {
    const res = await api
      .post(login)
      .send({ email: user.email, password: user.password })
      .expect(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.tokenUser.email).toBe(user.email);
  });

  it("Returns 401 status and error message in case of wrong password", async () => {
    const res = await api
      .post(login)
      .send({ email: user.email, password: "randombs" })
      .expect(401);
    expect(res.body.error).toBe("Invalid credentials");
  });

  it("Returns 401 status and error message in case of wrong email", async () => {
    const res = await api
      .post(login)
      .send({ email: "www.email.com", password: "randombs" })
      .expect(401);
    expect(res.body.error).toBe("Email does not exist. Please signup first.");
  });

  it("Returns 400 status and error message in case of incomplete details", async () => {
    let res = await api.post(login).send({ password: "randombs" }).expect(400);
    expect(res.body.error).toBe("Please enter all the details");

    res = await api.post(login).send({ email: user.email }).expect(400);
    expect(res.body.error).toBe("Please enter all the details");
  });
});

afterAll(() => {
  mongoose.connection.close();
});
