const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/validation")

router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.buildDetailByInvId);
router.get("/error-test", invController.triggerIntentionalError);

// Management view
router.get("/", invController.buildManagementView);
// Add classification view
router.get("/add-classification", invController.buildAddClassificationView);
// Add classification POST
router.post("/add-classification", utilities.validateClassification, invController.addClassification);
// Add inventory view
router.get("/add-inventory", invController.buildAddInventoryView);
// Add inventory POST
router.post("/add-inventory", utilities.validateInventory, invController.addInventory);

module.exports = router;