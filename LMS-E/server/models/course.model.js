import { model, Schema } from "mongoose";

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minLength: [8, "Title must be at least 8 characters"],
      maxLength: [59, "Title should be less than 60 characters"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      minLength: [8, "Description must be at least 8 characters"],
      maxLength: [199, "Description should be less than 200 characters"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
    },

    thumbnail: {
      public_id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },

    // FIXED HERE 🔥🔥
    // lecture → video AND required remove (lecture may be without video before upload)
    lectures: [
      {
        title: String,
        description: String,
        video: {
          public_id: {
            type: String,
            default: "",
          },
          secure_url: {
            type: String,
            default: "",
          },
        },
      },
    ],

    numberOfLactures: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Course = model("Course", courseSchema);

export default Course;
