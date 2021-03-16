const mongoose = require("mongoose");
const supertest = require("supertest");
const { initialUsers, addUser, app, User } = require("../test_helper");

const api = supertest(app);
const signup = "/auth/signup";
const login = "/auth/login";

beforeEach(async () => {
  await User.deleteMany({});
});

describe("Signup tests", () => {
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

  it("Sends 400 status and error message in case of duplicate email ids", async () => {
    await api.post(signup).send(initialUsers[0]);
    const user2 = {
      ...initialUsers[1],
      email: initialUsers[0].email,
    };

    const res2 = await api.post(signup).send(user2).expect(400);
    expect(res2.body.error).toBe(
      `User validation failed: email: Error, expected \`email\` to be unique. Value: \`${initialUsers[0].email}\``
    );
  });
});

afterAll(() => {
  mongoose.connection.close();
});
