const Joi = require("joi");

module.exports = {
  softMoveAccountRegistration: {
    email: Joi.string().required(),
    password: Joi.string().required(),
    username: Joi.string().lowercase({ force: true }).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
   
    
    
  },
  
  generalLogin: {
    email: Joi.string().required(),
    password: Joi.string().required(),
  },

  validateUserToken: {
    token: Joi.string().required(),
  },

  

  updateAccountData: {
    updateEmail: Joi.string(),
    updateUsername: Joi.string().lowercase({ force: true }),
    firstName: Joi.string(),
    lastName: Joi.string(),
  },
  
  deleteAUser: {
    userAuthId: Joi.string().required()
  },
  getAUser: {
    authId: Joi.string(),
    email: Joi.string()
  },

  favouriteProduct: {
    productId: Joi.number().required(),
    productTitle: Joi.string().required(),
    productPrice: Joi.number().required(),
    productImage: Joi.string().required(),
    productDescription: Joi.string().required(),
    productCategory: Joi.string().required()
  },
  cartProduct: {
    productId: Joi.number().required(),
    productTitle: Joi.string().required(),
    productPrice: Joi.number().required(),
    productImage: Joi.string().required(),
    productDescription: Joi.string().required(),
    productCategory: Joi.string().required()
  }


};
