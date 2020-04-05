import * as userModel from '../models/user';


export async function getUserList() {
  return await userModel.getUserList();
}

export async function getUserProfile(userId) {
  var user = await userModel.getUser(userId);
  if (!user) return null;
  user.state = await userModel.getUserState(userId);
  user.categoryState = await userModel.getUserCategoryState(userId);
  user.brandState = await userModel.getUserBrandState(userId);
  user.history = await userModel.getUserHistory(userId);
  user.categoryHistory = await userModel.getUserCategoryHistory(userId);
  return user;
}
