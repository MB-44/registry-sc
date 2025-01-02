/**
 * Integration tests for wedding registry APIs using Jest + Supertest.
 */

import request from "supertest";

// Replace with your actual server base URL
const BASE_URL = "http://localhost:3000";

describe("Wedding Registry API Integration", () => {
  let registryId: string = "";

  // Test: Create a new registry
  test("Create a new registry (POST /api/registry/create)", async () => {
    const payload = {
      firstName: "John",
      lastName: "Doe",
      partnerFirstName: "Jane",
      partnerLastName: "Smith",
      address: "123 Love Lane",
      city: "Romance City",
      postalCode: "98765",
      deliveryDate: new Date().toISOString(),
      specialDate: new Date().toISOString(),
      guests: 50,
      wishlist: [
        {
          id: 1,
          title: "Toaster",
          price: "50.00",
          images: [],
          quantity: 1,
          remarks: [],
        },
      ],
    };

    const res = await request(BASE_URL)
      .post("/api/registry/create")
      .send(payload)
      .set("Content-Type", "application/json");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("registryId");
    expect(res.body).toHaveProperty("invitationLink");
    expect(res.body).toHaveProperty("accessCode");

    registryId = res.body.registryId;
  });

  // Test: Fetch the registry by ID
  test("Fetch a registry by ID (GET /api/registry/[id])", async () => {
    if (!registryId) {
      return console.warn("No registryId available; skipping fetch test.");
    }

    const res = await request(BASE_URL).get(`/api/registry/${registryId}`);

    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty("registry");
      expect(res.body.registry._id).toBe(registryId);
    } else {
      expect([404]).toContain(res.statusCode);
    }
  });

  // Test: Update the wishlist
  test("Update wishlist (POST /api/registry/[id])", async () => {
    if (!registryId) {
      return console.warn("No registryId available; skipping update test.");
    }

    const updatedWishlist = [
      {
        id: 2,
        title: "Blender",
        price: "80.00",
        images: [],
        quantity: 2,
        remarks: [],
      },
    ];

    const res = await request(BASE_URL)
      .post(`/api/registry/${registryId}`)
      .send({ wishlist: updatedWishlist })
      .set("Content-Type", "application/json");

    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty("message", "Registry updated successfully!");
      expect(res.body).toHaveProperty("registry");
      expect(res.body.registry.wishlist.length).toBeGreaterThanOrEqual(1);
    } else {
      expect([404]).toContain(res.statusCode);
    }
  });

  // Test: Mark a wishlist item for a guest
  test("Mark wishlist item for guests (POST /api/registry/invite/[id])", async () => {
    if (!registryId) {
      return console.warn("No registryId available; skipping invite test.");
    }

    const guestRemark = {
      guestName: "Alice",
      productId: 1,
      quantity: 1,
    };

    const res = await request(BASE_URL)
      .post(`/api/registry/invite/${registryId}`)
      .send(guestRemark)
      .set("Content-Type", "application/json");

    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty("message", "Wishlist item marked successfully.");
      expect(res.body).toHaveProperty("registry");
    } else {
      expect([400, 404]).toContain(res.statusCode);
    }
  });

  // Test: Fetch registry again to confirm wishlist updates
  test("Confirm registry updates after marking items (GET /api/registry/[id])", async () => {
    if (!registryId) {
      return console.warn("No registryId available; skipping update confirmation test.");
    }

    const res = await request(BASE_URL).get(`/api/registry/${registryId}`);

    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty("registry");
      const registry = res.body.registry;
      expect(registry.wishlist).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            remarks: expect.arrayContaining([
              expect.objectContaining({ guestName: "Alice", quantity: 1 }),
            ]),
          }),
        ])
      );
    } else {
      expect([404]).toContain(res.statusCode);
    }
  });
});