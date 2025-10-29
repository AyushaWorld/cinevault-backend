import * as yup from "yup";

export const registerSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const movieShowSchema = yup.object().shape({
  title: yup.string().required("Title is required").trim(),
  type: yup
    .string()
    .required("Type is required")
    .oneOf(["Movie", "TV Show"], "Type must be Movie or TV Show"),
  director: yup.string().required("Director is required").trim(),
  budget: yup.string().trim(),
  location: yup.string().trim(),
  duration: yup.string().required("Duration is required").trim(),
  year: yup
    .number()
    .required("Year is required")
    .min(1800, "Year must be after 1800")
    .max(new Date().getFullYear() + 5, "Year cannot be too far in the future"),
  genre: yup.string().trim(),
  rating: yup
    .number()
    .min(0, "Rating must be at least 0")
    .max(10, "Rating must be at most 10"),
  description: yup.string().trim(),
});

export const validateData = async (schema, data) => {
  try {
    await schema.validate(data, { abortEarly: false });
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: error.inner.reduce((acc, err) => {
        acc[err.path] = err.message;
        return acc;
      }, {}),
    };
  }
};
