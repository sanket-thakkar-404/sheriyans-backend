import userModel from "../model/user.model.js";
import { ApiError } from "./apiError.js";

export const findUser = async (query) => {

  const user = await userModel.findOne(query).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;

};

