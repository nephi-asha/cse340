const validation = {};

validation.validateClassification = (req, res, next) => {
  const { classification_name } = req.body;
  const pattern = /^[A-Za-z0-9]+$/;
  if (!classification_name || !pattern.test(classification_name)) {
    const nav = res.locals.nav || '';
    return res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      message: "Classification name must not contain spaces or special characters.",
      classification_name
    });
  }
  next();
};

validation.validateInventory = (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body;
  let errors = [];
  if (!inv_make || !/^[A-Za-z0-9 ]+$/.test(inv_make)) errors.push("Invalid make");
  if (!inv_model || !/^[A-Za-z0-9 ]+$/.test(inv_model)) errors.push("Invalid model");
  if (!inv_year || isNaN(inv_year) || inv_year < 1900 || inv_year > 2099) errors.push("Invalid year");
  if (!inv_description) errors.push("Description required");
  if (!inv_image) errors.push("Image path required");
  if (!inv_thumbnail) errors.push("Thumbnail path required");
  if (!inv_price || isNaN(inv_price) || inv_price < 0) errors.push("Invalid price");
  if (!inv_miles || isNaN(inv_miles) || inv_miles < 0) errors.push("Invalid miles");
  if (!inv_color || !/^[A-Za-z ]+$/.test(inv_color)) errors.push("Invalid color");
  if (!classification_id) errors.push("Classification required");
  if (errors.length > 0) {
    const nav = res.locals.nav || '';
    const utilities = require("./index");
    utilities.buildClassificationList(classification_id).then(classificationList => {
      res.render("./inventory/add-inventory", {
        title: "Add Inventory Item",
        nav,
        classificationList,
        message: errors.join(", "),
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
      });
    });
    return;
  }
  next();
};

module.exports = validation;
