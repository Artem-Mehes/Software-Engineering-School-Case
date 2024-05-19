import request from "supertest";
import app, { supabase } from "../app";

afterEach(async () => {
  await supabase.from("subscriptions").delete().neq("id", 0);
});

describe("Rate API", () => {
  it("should return a valid currency rate", async () => {
    const response = await request(app).get("/api/rate");
    expect(response.status).toBe(200);
    expect(typeof response.body).toBe("number");
  });

  it("should subscribe a valid email", async () => {
    const response = await request(app)
      .post("/api/subscribe")
      .send({ email: "test@example.com" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("E-mail додано");
  });

  it("should not subscribe an already subscribed email", async () => {
    const email = "test@example.com";

    await request(app).post("/api/subscribe").send({ email });

    const response = await request(app).post("/api/subscribe").send({ email });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe(email);
  });
});
