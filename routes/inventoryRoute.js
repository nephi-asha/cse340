const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.buildDetailByInvId);
router.get("/error-test", invController.triggerIntentionalError);

module.exports = router;