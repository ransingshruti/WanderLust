// assignOwner.js
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const User = require("./models/user");

async function main() {
  try {
    // USE the SAME connection string as app.js
    await mongoose.connect("mongodb+srv://Shruti:root@cluster0.wfvxhqa.mongodb.net/WanderLust");
    console.log("DB connected");

    // CHANGE username to the user you want as default owner
    const defaultUser = await User.findOne({ username: "shruti" });
    if (!defaultUser) {
      console.log("Default user not found. Create that user first.");
      return;
    }

    const res = await Listing.updateMany(
      { owner: { $exists: false } }, // only listings without owner
      { $set: { owner: defaultUser._id } }
    );

    console.log(`Matched ${res.matchedCount}, Modified ${res.modifiedCount}`);
  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    await mongoose.connection.close();
    console.log("DB connection closed");
  }
}

main();


