const fs = require("fs");
const mongoose = require("mongoose");

// Read .env.local file
const envConfig = fs.readFileSync(".env.local", "utf8");
const envVars = {};
envConfig.split("\n").forEach((line) => {
  if (line.trim() && !line.startsWith("#")) {
    const [key, value] = line.split("=");
    envVars[key.trim()] = value.trim();
  }
});

console.log("MONGODB_URI:", envVars.MONGODB_URI);
console.log("ADMIN_EMAIL:", envVars.ADMIN_EMAIL);

// Connect to MongoDB
mongoose
  .connect(envVars.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    // Define a simple user schema
    const userSchema = new mongoose.Schema(
      {
        name: String,
        email: String,
        password: String,
        isAdmin: { type: Boolean, default: false },
      },
      { timestamps: true }
    );

    const User = mongoose.model("User", userSchema);

    // Find the admin user
    const user = await User.findOne({
      email: envVars.ADMIN_EMAIL || "mjservices410@gmail.com",
    });

    if (user) {
      console.log("User found:");
      console.log("ID:", user._id);
      console.log("Email:", user.email);
      console.log("Is Admin:", user.isAdmin);

      // Update isAdmin if it's not set
      if (!user.isAdmin) {
        console.log("Updating user to isAdmin = true...");
        user.isAdmin = true;
        await user.save();
        console.log("User updated successfully");
      } else {
        console.log("User is already an admin");
      }
    } else {
      console.log("User not found");
    }

    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error:", err);
    mongoose.connection.close();
  });
