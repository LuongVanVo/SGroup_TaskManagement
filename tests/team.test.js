import request from "supertest";
import app from "../src/servers.js";

describe("GET /api/teams", () => {
  it("show return all teams", async () => {
    const res = await request(app).get("/api/teams");
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
  });
});

describe("GET /api/getAllMember", () => {
  it("show return all members", async () => {
    const res = await request(app).get("/api/getAllMember");
    expect(res.statusCode).toBe(200);
  });
});
