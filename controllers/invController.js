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

invCont.triggerIntentionalError = function (req, res, next) {
  next(new Error("Intentional server error for testing (500)."))
}

module.exports = invCont