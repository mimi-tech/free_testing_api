const { Router } = require("express");
const { auth } = require("../controllers");
const { validate } = require("../middlewares");
const { auth: validator } = require("../validator");

const routes = Router();

routes.get("/", auth.welcomeText);

routes.post(
  "/create-account",
  validate(validator.softMoveAccountRegistration),
  auth.softMoveAccountRegistration
);

routes.post(
  "/login",
  validate(validator.generalLogin),
  auth.generalLogin
);

routes.post(
  "/validate-user-token",
  validate(validator.validateUserToken),
  auth.validateUserToken
);

routes.put(
  "/update-account-data",
  validate(validator.updateAccountData),
  auth.updateAccountData
);

routes.delete(
  "/delete-account",
  validate(validator.deleteAUser),
  auth.deleteAUser
);

routes.get(
  "/get-a-user",
  validate(validator.getAUser),
  auth.getAUser
);

routes.post(
  "/favorite-product",
  validate(validator.favouriteProduct),
  auth.favouriteProduct
);

routes.post(
  "/cart-product",
  validate(validator.cartProduct),
  auth.cartProduct
);

module.exports = routes;
