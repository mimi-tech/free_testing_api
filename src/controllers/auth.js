const { auth } = require("../services");
const { response } = require("../helpers");

const welcomeText = async (req, res) => {
  const data = await auth.welcomeText(req.form);
  return response(res, data);
};

const softMoveAccountRegistration = async (req, res) => {
  const data = await auth.softMoveAccountRegistration(req.form);
  return response(res, data);
};

const generalLogin = async (req, res) => {
  const data = await auth.generalLogin(req.form);
  return response(res, data);
};

const validateUserToken = async (req, res) => {
  const data = await auth.validateUserToken(req.form);
  return response(res, data);
};


const updateAccountData = async (req, res) => {
  const data = await auth.updateAccountData(req.form);
  return response(res, data);
}


const deleteAUser = async (req, res) => {
  const data = await auth.deleteAUser(req.form);
  return response(res, data);
}

const getAUser = async (req, res) => {
  const data = await auth.getAUser(req.form);
  return response(res, data);
}

const favouriteProduct = async (req, res) => {
  const data = await auth.favouriteProduct(req.form);
  return response(res, data);
}

const cartProduct = async (req, res) => {
  const data = await auth.cartProduct(req.form);
  return response(res, data);
}
module.exports = {
  welcomeText,
  softMoveAccountRegistration,
  generalLogin,
  validateUserToken,
  updateAccountData,
  deleteAUser,
  getAUser,
  favouriteProduct,
  cartProduct,
};
