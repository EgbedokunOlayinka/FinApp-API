const User = require("../models/User");
const Profile = require("../models/Profile");

class ProfileController {
  static async setDetails(req, res, next) {
    try {
      const { firstName, lastName } = req.body;
      const userId = req.user.userId;
      const urlId = req.params.id;

      // check if current user id is the same as the id in the url
      if (userId !== urlId) {
        return res.status(403).json({
          success: false,
          message: "Cannot set profile details for another user",
        });
      }

      // check if profile exists already
      const profileExists = await Profile.findOne({ userId });

      if (profileExists) {
        return res.status(400).json({
          success: false,
          message: "Profile already exists",
        });
      }

      const newProfile = { firstName, lastName, userId };

      const createProfile = await Profile.create(newProfile);

      return res.status(201).json({
        success: true,
        message: "Profile created successfully",
        data: createProfile,
      });
    } catch (err) {
      if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((val) => val.message);

        return res.status(400).json({
          success: false,
          message: messages,
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Server Error",
        });
      }
    }
  }

  static async updateProfile(req, res, next) {
    try {
        const { firstName, lastName } = req.body;
        const userId = req.user.userId;
        const urlId = req.params.id;

        // check if current user id is the same as the id in the url
        if (userId !== urlId) {
        return res.status(403).json({
            success: false,
            message: "Cannot set profile details for another user",
        });
        };

        const newProfile = { firstName, lastName, userId };

        const updateProfile = await Profile.findOneAndUpdate({_id: userId}, newProfile, {
            new: true,
            runValidators: true
        });

        return res.status(201).json({
            success: true,
            message: "Profile updated successfully",
            data: updateProfile,
        });

    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map((val) => val.message);
    
            return res.status(400).json({
              success: false,
              message: messages,
            });
        } else {
            return res.status(500).json({
              success: false,
              message: "Server Error",
            });
        }
    }
  }
}

module.exports = ProfileController;
