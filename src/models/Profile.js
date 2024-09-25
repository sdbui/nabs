import mongoose, { Schema, models } from "mongoose";

// the type of text to be generated
const Blurb = {
  PRAYER: 'prayer',
  JOKE: 'joke',
  MOTIVATION: 'words of motivation',
  INSPIRATION: 'words of inspiration',
  ANECDOTE: 'funny anectdote'
}

const profileSchema = new Schema(
  {
    blurbTypes: {
      type: [String],
      required: false,
    },
    tags: {
      type: [String],
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    dob: {
      type: Date,
      required: false,
    },
  }
);

const Profile = models?.Profile || mongoose.model("Profile", profileSchema);
export default Profile;