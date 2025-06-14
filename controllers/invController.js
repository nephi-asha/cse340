const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view by inventory id
 * ************************** */
invCont.buildDetailByInvId = async function (req, res, next) {
  const invId = req.params.invId
  const vehicle = await invModel.getVehicleByInvId(invId)
  if (!vehicle) {
    return res
      .status(404)
      .render("errors/error", { title: "Vehicle Not Found" })
  }
  const nav = await utilities.getNav()
  const vehicleDetail = utilities.buildVehicleDetail(vehicle)
  res.render("./inventory/detail", {
    title: `${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    vehicleDetail,
  })
}

/**
 * Build the inventory management view
 */
invCont.buildManagementView = async function (req, res, next) {
  const nav = await utilities.getNav()
  const message = req.flash ? req.flash("message") : null
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    message: message && message.length ? message[0] : null,
  })
}

/**
 * Build add classification view
 */
invCont.buildAddClassificationView = async function (req, res, next) {
  const nav = await utilities.getNav()
  const message = req.flash ? req.flash("message") : null
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    message: message && message.length ? message[0] : null,
  })
}

/**
 * Add classification POST handler
 */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  try {
    const result = await invModel.addClassification(classification_name)
    if (result) {
      req.flash("message", "Classification added successfully!")
      // Rebuild nav and render management view
      const nav = await utilities.getNav()
      res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
        message: "Classification added successfully!",
      })
    } else {
      res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav: await utilities.getNav(),
        message: "Failed to add classification.",
      })
    }
  } catch (err) {
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav: await utilities.getNav(),
      message: "Error: " + err.message,
    })
  }
}

/**
 * Build add inventory view
 */
invCont.buildAddInventoryView = async function (req, res, next) {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  const message = req.flash ? req.flash("message") : null
  res.render("./inventory/add-inventory", {
    title: "Add Inventory Item",
    nav,
    classificationList,
    message: message && message.length ? message[0] : null,
  })
}

/**
 * Add inventory POST handler
 */
invCont.addInventory = async function (req, res, next) {
  // Use destructuring to match DB field names
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
    classification_id,
  } = req.body
  try {
    const result = await invModel.addInventory({
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    })
    if (result) {
      req.flash("message", "Inventory item added successfully!")
      const nav = await utilities.getNav()
      res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
        message: "Inventory item added successfully!",
      })
    } else {
      const nav = await utilities.getNav()
      const classificationList = await utilities.buildClassificationList(
        classification_id
      )
      res.render("./inventory/add-inventory", {
        title: "Add Inventory Item",
        nav,
        classificationList,
        message: "Failed to add inventory item.",
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
      })
    }
  } catch (err) {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(
      classification_id
    )
    res.render("./inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
      classificationList,
      message: "Error: " + err.message,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    })
  }
}

invCont.triggerIntentionalError = function (req, res, next) {
  next(new Error("Intentional server error for testing (500)."))
}

module.exports = invCont