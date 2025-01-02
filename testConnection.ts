import connectToDB from "@/lib/db";
import Registry from "./src/models/Registry";


async function testConnection() {
  try {
    await connectToDB();
    console.log("✅ Connected to MongoDB successfully!");

    const testRegistry = new Registry({
      firstName: "Test",
      lastName: "User",
      partnerFirstName: "Partner",
      partnerLastName: "User",
      address: "123 Test St",
      city: "Testville",
      postalCode: "12345",
      deliveryDate: new Date(),
      specialDate: new Date(),
      guests: 10,
      wishlist: [],
    });

    await testRegistry.save();
    console.log("✅ Test registry saved successfully!");
  } catch (error) {
    console.error("❌ Error saving test registry:", error);
  }
}

testConnection();