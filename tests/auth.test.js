const mongoose = require("mongoose");
const supertest = require("supertest");
const { initialUsers, addUser } = require("./test_helper");
const app = require("../app");
const User = require("../models/users");

const api = supertest(app);
const signup = "/auth/signup";
const login = "/auth/login";

beforeEach(async () => {
  await User.deleteMany({});
});

describe("Signup test", () => {
  it("User is signed up correctly when details are complete", async () => {
    const user = initialUsers[0];
    console.log(user);
    await api.post(signup).send(user).expect(201);
    const addedUser = User.find({ email: user.email });
    expect(addedUser).toBeTruthy();
  });

  it("Sends 400 status and error message in case of duplicate email", async () => {
    const user = initialUsers[0];
    await addUser(user);
    const res = await api.post(signup).send(user).expect(400);
    expect(res.body.error).toBe(
      "User validation failed: email: Error, expected `email` to be unique. Value: `sarthak@gmail.com`"
    );
  });

  it("Sends 400 status and error message in case of incomplete data", async () => {
    const user1 = initialUsers[2];
    const user2 = initialUsers[3];
    const res1 = await api.post(signup).send(user1).expect(400);
    const res2 = await api.post(signup).send(user2).expect(400);
    expect(res1.body.error).toBe("Email and password fields are required");
    expect(res2.body.error).toBe("Email and password fields are required");
  });

  it("Sends 400 status and error message in case of short password", async () => {
    const user = initialUsers[4];
    const res = await api.post(signup).send(user).expect(400);
    expect(res.body.error).toBe("Password must be longer than 6 characters");
  });
});

describe("Login tests", () => {
  let user;
  beforeEach(async () => {
    user = initialUsers[0];
    await addUser(user);
  });

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
    expect(res.body.error).toBe("Enter all the details");

    res = await api.post(login).send({ email: user.email }).expect(400);
    expect(res.body.error).toBe("Enter all the details");
  });
});

afterAll(() => {
  mongoose.connection.close();
});
