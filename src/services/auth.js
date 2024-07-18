/* eslint-disable no-unreachable */
//const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { constants } = require("../configs");
const { usersAccount, favourites, cart } = require("../models");
/**
 * Display welcome text
 * @param {Object} params  no params.
 * @returns {Promise<Object>} Contains status, and returns message
 */
const welcomeText = async () => {
  try {
    return {
      status: true,
      message: "welcome to eazy move app authentication service",
    };
  } catch (error) {
    return {
      status: false,
      message: constants.SERVER_ERROR("WELCOME TEXT"),
    };
  }
};

/**
 * for creating account for a user account.
 * @param {Object} params email, password, username, profileImageUrl.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */
 const softMoveAccountRegistration = async (params) => {
  
  try {
    const { email, password, username,
      firstName,lastName
    } = params;
    //check if  account is already registered
    const userAccount = await usersAccount.findOne({
      email: email,
    });

    if (userAccount) {
      return {
        status: false,
        message: "email already exist",
      };
    }


    //check if user name is already registered
    const userNameInUse = await usersAccount.findOne({
      username: username,
    });

    if (userNameInUse) {
      return {
        status: false,
        message: "This username already exist",
      };
    }

    //encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);
    
   //check if user is uploading image
  //  if(profileImageUrl){
  //   const {status: getUploadStatus,  message: getUploadMessage, data:result } = await request(
  //     `${process.env.EAZYMOVE_UPLOAD_FILE}/upload-file`,
  //     "post",body
  //   );
    
  //   if (getUploadStatus === false) {
  //     return {
  //       status: getUploadStatus,
  //       message: getUploadMessage,
  //     };
  //   }
  //   data = result;
  //  }
   



    //create account
    const newUserAccount = await usersAccount.create({
      email: email,
      password: hashedPassword,
      username: username,
      firstName:firstName,
      lastName:lastName,
    });
  
    
    //send emailCode to user email
    
    const publicData = {
      id: newUserAccount._id,
      email: newUserAccount.email,
      username: newUserAccount.username,
      firstName: newUserAccount.firstName,
      lastName: newUserAccount.lastName,
    };

    return {
      status: true,
      message: "Account created successfully",
      data: publicData,
    };
  } catch (error) {
    console.log(error);
    return {
    
      status: false,
      message: constants.SERVER_ERROR("CREATING ACCOUNT"),
    };
  }
};



  /**
 * login any in app user
 * @param {Object} params  contains email, password and accountTypes.
 * @returns {Promise<Object>} Contains status, and returns message
 */
const generalLogin = async (params) => {
  try {
    const { email, password } = params;

    const userExist = await usersAccount.findOne(
      { email: email });

    if (!userExist) {
      return {
        status: false,
        message: "incorrect credentials!",
      };
    }

    //extract and store existing encrypted user password
    const existingUserPassword = userExist.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    //validate incoming user password with existing password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUserPassword
    );

    if (!isPasswordCorrect) {
      return {
        status: false,
        message: "incorrect credentials",
        
      };
    }

    const {
      email: _email,
      username,
      _id,

    } = userExist;

    const serializeUserDetails = {
     
      _email,
      username,
      _id,
    };
   
    const accessToken = jwt.sign(serializeUserDetails, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const publicData = {
      id: userExist._id,
      email: userExist.email,
      username: userExist.username,
      firstName: userExist.firstName,
      lastName: userExist.lastName,
    };
    return {
      status: true,
      message: "Login successful",
      token: accessToken,
      data: publicData,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: constants.SERVER_ERROR("LOGIN"),
    };
  }}



/**
 * validates user token
 * @param {Object} params  contains email, password and roles.
 * @returns {Promise<Object>} Contains status, and returns message
 */
 const validateUserToken = async (params) => {
  try {
    const { token } = params;

    let loggedInUser;

    //verify jwt token
    const check = jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return {
          status: false,
        };
      }

      loggedInUser = user;

      return {
        status: true,
      };
    });

    if (!check.status) {
      return {
        status: false,
        message: "Invalid Token",
      };
    }

    //fetch loggedinuser details
    const _user = await usersAccount.findOne({ email: loggedInUser._email });

    const {
      
      email,
      username,
      _id,
      id,
    } = _user;

    const serializeUserDetails = {
      email,
      username,
      _id,
      id,
    };

    return {
      status: true,
      message: "succes",
      data: serializeUserDetails,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.SERVER_ERROR("TOKEN VERIFICATION"),
    };
  }
};




/**
 * update a user account
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */
 const updateAccountData = async (params) => {
  try {
    const { authId, ...dataParams } = params;
    const accountToUpdate = await usersAccount.findOne({_id: authId});
    if (!accountToUpdate) {
      return {
        status: false,
        message: "Invalid user"
      }
    }
    accountToUpdate.firstName = (dataParams.firstName != undefined) ? dataParams.firstName : accountToUpdate.firstName;
    accountToUpdate.lastName = (dataParams.lastName != undefined) ? dataParams.lastName : accountToUpdate.lastName;
    accountToUpdate.customerId = dataParams.customerId;
    if(dataParams.updateUsername != undefined){
      //check if username is already existing",
      
      const isUserNameExisting = await usersAccount.findOne(
        { $and: [{ _id: accountToUpdate._id }, { username: dataParams.updateUsername }] });
  
  
      if (isUserNameExisting) {
        return {
          status: false,
          message: "This username is already existing",
        };
      }
      accountToUpdate.username =  dataParams.updateUsername;

    }


    if(dataParams.updateEmail !== undefined){
      //check if email is already existing",

      const isEmailExisting = await usersAccount.findOne(
        { $and: [{ _id: accountToUpdate._id }, {  email: dataParams.updateEmail }] });
  
  
      if (isEmailExisting) {
        return {
          status: false,
          message: "This email is already existing",
        };
      }
      accountToUpdate.email =  dataParams.updateEmail;

    }

    accountToUpdate.email =  accountToUpdate.email;

    accountToUpdate.username = accountToUpdate.username;
    


    accountToUpdate.save()

    return {
      data:accountToUpdate,
      status: true,
      message: "Account updated successfully"
    }
  } catch (error) {
    return {
      status: false,
      message: constants.SERVER_ERROR("UPDATE ACCOUNT DATA"),
    };
  }
}


/**
 * for fetching a user
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

const getAUser = async (params) => {
  const { authId,email } = params;
  try {
    const user = await usersAccount.findOne(
      { $or: [{ email: email }, { _id:authId }] });

    if (!user) {
      return {
        status: false,
        message: "User not found",
      }};
      //get favourites
      const favouritesProduct = await getFavourites({email: email});

      const addToCart = await getAddToCart({email:email})

      //send emailCode to user email
    
const publicData = {
  id: user._id,
  email: user.email,
  username: user.username,
  firstName: user.firstName,
  lastName: user.lastName,
  favouriteCount: user.favouriteCount,
  addToCount: user.addToCount,
  favouritedProduct: favouritesProduct.data,
  productAddedToCart: addToCart.data,
};
    return {
      status: true,
      data: publicData,
    };
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("GETTING A USER"),
    };
  }
    }
    /**
 * for deleting an account using the users ID
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const deleteAUser = async (params) => {
  try {
    const { userAuthId } = params;

    //check if the user is already existing
    const user = await usersAccount.findOne({
      _id: userAuthId,
    });

    if (!user) {
      return {
        status: false,
        message: "User does not exist",
      };
    }
   //go ahead and delete the account
   await usersAccount.deleteOne({
    _id: userAuthId,
  });

  return {
    status: true,
    message: "account deleted successfully",
  };
  
} catch (e) {
  return {
    status: false,
    message: constants.SERVER_ERROR("DELETING CHURCH APP ACCOUNT"),
  };
}
};

 /**
 * for favouriting product
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const favouriteProduct = async (params) => {
  try {
    const {
      authId,
       email,
        productId,
        productTitle,
        productDescription,
        productImage,
        productPrice,
        productCategory,
    
       } = params;

    //check if the user is already existing
    const user = await usersAccount.findOne({
      email: email
    });
   
    const product = await favourites.findOne(
      { $and: [{ productId: productId }, {  email: email }] });

    if (product) {
      user.favouriteCount -= 1;
      user.save();
      return {
        status: false,
        message: "Product removed from favourite",
      };
    }
   //go ahead and delete the account
   await favourites.create({
    authId: authId,
        email: email,
        productId: productId,
        productTitle: productTitle,
        productDescription: productDescription,
        productImage: productImage,
        productPrice: productPrice,
        productCategory: productCategory,
  });
  user.favouriteCount += 1;
  user.save();
  return {
    status: true,
    message: "Product added to favourite",
  };
  
} catch (e) {
  console.log(e);
  return {
   
    status: false,
    message: constants.SERVER_ERROR("Favouriting product"),
  };
}
 }
 /**
 * for adding to cart product
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message
 */

 const cartProduct = async (params) => {
  try {
    const {
      authId,
       email,
        productId,
        productTitle,
        productDescription,
        productImage,
        productPrice,
        productCategory,
    
       } = params;

    //check if the user is already existing
    const user = await usersAccount.findOne({email: email});
    const product = await cart.findOne({ $and: [{ productId: productId }, {  email: email }] });

    if (product) {
      user.addToCount -= 1;
      user.save();
      return {
        status: true,
        message: "Product removed from cart",
      };
    }
   //go ahead and delete the account
   await cart.create({
    authId: authId,
        email: email,
        productId: productId,
        productTitle: productTitle,
        productDescription: productDescription,
        productImage: productImage,
        productPrice: productPrice,
        productCategory: productCategory,
  });
  user.addToCount += 1;
  user.save();
  return {
    status: true,
    message: "Product added to add",
  };
  
} catch (e) {
  return {
    status: false,
    message: constants.SERVER_ERROR("Adding product to cart"),
  };
}
 }

 const getFavourites = async (params) => {
  const { email } = params;
  try {
    const product = await favourites.find(
     { email: email });

    if (!product) {
      return {
        status: false,
        message: "You have not favourite any product",
      }};

      //send emailCode to user email

    return {
      status: true,
      data: product,
    };
  } catch (e) {
    return {
      status: false,
      message: constants.SERVER_ERROR("GETTING Favorite Product"),
    };
  }
    }

    const getAddToCart = async (params) => {
      const { email } = params;
      try {
        const product = await cart.find(
         { email: email });
    
        if (!product) {
          return {
            status: false,
            message: "You have not added any product to cart",
          }};
    
          //send emailCode to user email
    
        return {
          status: true,
          data: product,
        };
      } catch (e) {
        return {
          status: false,
          message: constants.SERVER_ERROR("GETTING Product in cart"),
        };
      }
        }

module.exports = {
  welcomeText,
  softMoveAccountRegistration,
  generalLogin,
  validateUserToken,
  updateAccountData,
  getAUser,
  deleteAUser,
  favouriteProduct,
  cartProduct,
  getFavourites,
  getAddToCart
};

