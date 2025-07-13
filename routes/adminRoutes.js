// this is admin routes file
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

const checkAdminLoggedIn = require('../middleware/adminMiddleware');
// const { MinerModel } = require('../models/miner.model');

// require("../utils/adminRegister").adminRegister()


// Admin management
router.post('/login', adminController.loginAdmin);
router.post('/create-admin', adminController.createAdmin);
router.post('/forgot-password', adminController.forgotPassword);
router.post('/reset-password', adminController.resetPassword);
router.get('/logout', adminController.logoutAdmin);



router.get('/getAllUsers', checkAdminLoggedIn, adminController.getAllUsers);
router.get('/get-user-details/:id', checkAdminLoggedIn, adminController.getUserDetails);
router.put('/block-unblock-user/:id', checkAdminLoggedIn, adminController.blockUnblockuser)

router.get('/get-dashboard-data', checkAdminLoggedIn, adminController.getDashboardData);

// deposite fund history
router.get('/get-fund-deposit-history', checkAdminLoggedIn, adminController.getDepositHistory);
// withdrawal history
router.get('/get-withdrawal-history', checkAdminLoggedIn, adminController.getWithdrawalHistory);

router.get('/all-user-id-name', checkAdminLoggedIn, adminController.AllUserIdName);


router.get('/token-price', adminController.getTokenPrice);
router.post('/token-price', adminController.updateTokenPrice);


router.get("/token-purchases",  adminController.getAllTokenPurchaseHistory);
router.get("/token-purchases/:userId", adminController.getUserTokenPurchaseHistory);


router.get("/support-in-process", adminController.getAllMessage);

router.post("/support/status/approve/:ticketId", adminController.ticketApprove);

router.post("/support/status/reject/:ticketId",adminController.ticketReject);

// Apply authentication middleware to routes that require authentication
// router.use(checkAdminLoggedIn);

// router.get('/get-admin', checkAdminLoggedIn, adminController.getAdmin);

// router.get('/get-miners', checkAdminLoggedIn, adminController.getMiners);
// router.get('/create-miner', checkAdminLoggedIn, adminController.createOrUpdateMiner);
// router.put('/update-miner/:id', checkAdminLoggedIn, adminController.createOrUpdateMiner);
// router.get('/get-purchased-miners-history', checkAdminLoggedIn, adminController.getPurchasedMinersHistory);

// router.put('/update-referral-percentages', checkAdminLoggedIn, adminController.updateReferralPercentages);



// // referral income history
// router.get('/get-referral-income-history', checkAdminLoggedIn, adminController.getReferralIncomeHistory);
// // miner income history
// router.get('/get-miner-income-history', checkAdminLoggedIn, adminController.getMinerIncomeHistory);

// // swap history
// router.get('/get-swap-history', checkAdminLoggedIn, adminController.getSwapHistory);
// // holding history
// router.get('/get-holding-history', checkAdminLoggedIn, adminController.getHoldingHistory);



// router.get('/get-user-purchased-miner/:id', checkAdminLoggedIn, adminController.getUserPurchasedMiners);
// router.get('/get-user-holdings-trading/:id', checkAdminLoggedIn, adminController.getUserHoldingsHistory);


module.exports = router;