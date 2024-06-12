const cartModel = require("../Models/cartModel");

const addToCart = async (req, res) => {
  const { _id } = req.user;
  try {
    const userCart = await cartModel.findOne({ user: _id.toString() });

    if (!userCart) {
      return res.json({ status: 401, message: "Cart not found" });
    }

    const { _id: foodItemId, title, price, quantity, imageUrl } = req.body;

    let foodItemIndex = -1;
    // Check if the food item already exists in the cart
    for (let i = 0; i < userCart.foodItems.length; i++) {
      if (userCart.foodItems[i]._id.toString() === foodItemId.toString()) {
        foodItemIndex = i;
        break;
      }
    }

    if (foodItemIndex !== -1) {
      // If the food item already exists, increase its quantity
      userCart.foodItems[foodItemIndex].quantity += 1;
    } else {
      // If the food item does not exist, add it to the cart
      userCart.foodItems.push({
        _id: foodItemId,
        title,
        price: price * quantity,
        quantity,
        imageUrl,
      });
    }

    // Calculate total price based on individual prices of each food item
    let totalPrice = 0;
    for (const item of userCart.foodItems) {
      totalPrice += item.price * item.quantity;
    }

    // Update the total price
    userCart.totalPrice = totalPrice;

    // Mark cart as modified before saving
    userCart.markModified("foodItems");

    // Save the updated cart
    await userCart.save();

    return res.json({ status: true, message: "Your food added successfully" });
  } catch (error) {
    return res.json({ status: false, error: error.message });
  }
};

const getCartItems = async (req, res) => {
  const { _id } = req.user;
  try {
    const cart = await cartModel.findOne({ user: _id.toString() });
    if (!cart) {
      return res.json({ status: 404, message: "Couldn't find cart" });
    }
    return res.json({ status: true, cart: cart });
  } catch (error) {
    return res.json({ status: false, error: error.message });
  }
};

const deleteItemFromCart = async (req, res) => {
  const { _id } = req.user;
  try {
    const userCart = await cartModel.findOne({ user: _id.toString() });
    if (!userCart) {
      return res.json({ status: 401, messsage: "Cart not found" });
    }
    const isItemExist = userCart.foodItems.find(
      (item) => item._id.toString() === req.params.id
    );
    console.log(isItemExist);
    if (!isItemExist) {
      return res.json({ status: 404, message: "Food item not found" });
    }
    userCart.foodItems = userCart.foodItems.filter(
      (item) => item._id.toString() !== req.params.id
    );
    // Recalculate the total price
    let totalPrice = 0;
    for (const item of userCart.foodItems) {
      totalPrice += item.price * item.quantity;
    }
    userCart.totalPrice = totalPrice;
    // Save the updated cart
    await userCart.save();
    return res.json({
      status: 200,
      message: "Item removed successfully",
    });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const increaseQuantityOfItem = async (req, res) => {
  const { _id } = req.user;
  try {
    const cart = await cartModel.findOne({ user: _id.toString() });
    if (!cart) {
      return res.json({ status: 404, message: "Couldn't find cart" });
    }

    const itemToUpdate = cart.foodItems.find(
      (item) => item._id === req.params.id
    );

    if (!itemToUpdate) {
      return res.json({ status: 404, message: "Item not found in cart" });
    }

    // Increase the quantity of the item
    itemToUpdate.quantity += 1;

    // Mark cart as modified before saving
    cart.markModified("foodItems");

    let totalPrice = 0;
    for (const item of cart.foodItems) {
      totalPrice += item.price * item.quantity;
    }

    // Update the total price
    cart.totalPrice = totalPrice;

    // Save the updated cart document
    await cart.save();

    return res.json({
      status: 200,
      message: "Quantity increased successfully",
    });
  } catch (error) {
    return res.json({ status: 401, message: error.message });
  }
};

const decreaseQuantityOfItem = async (req, res) => {
  const { _id } = req.user;
  try {
    const cart = await cartModel.findOne({ user: _id.toString() });
    if (!cart) {
      return res.json({ status: 404, message: "Couldn't find cart" });
    }

    const itemToUpdate = cart.foodItems.find(
      (item) => item._id === req.params.id
    );

    if (!itemToUpdate) {
      return res.json({ status: 404, message: "Item not found in cart" });
    }

    // Increase the quantity of the item
    itemToUpdate.quantity -= 1;

    // Mark cart as modified before saving
    cart.markModified("foodItems");

    let totalPrice = 0;
    for (const item of cart.foodItems) {
      totalPrice += item.price * item.quantity;
    }

    // Update the total price
    cart.totalPrice = totalPrice;

    // Save the updated cart document
    await cart.save();

    return res.json({
      status: 200,
      message: "Quantity decreased successfully",
    });
  } catch (error) {
    return res.json({ status: 401, message: error.message });
  }
};

module.exports = {
  addToCart,
  getCartItems,
  deleteItemFromCart,
  increaseQuantityOfItem,
  decreaseQuantityOfItem,
};
