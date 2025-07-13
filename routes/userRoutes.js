
const router = require('express').Router();

const UserController = require('../controllers/userController');
const { WalletRegister, WalletLogin } = require('../controllers/walletController');
const { authenticateUser } = require('../middleware/userMiddleware');
const { UserModel } = require('../models/userModel');

// User registration route
// const { userNotverifyAccountDelete } = require('../utils/verifyAccountCalculate');

// setInterval(() => {
//     userNotverifyAccountDelete();
// }, 1000)


// ------------------------------------ACCOUINT DETAIL START -------------------------------------
// register
router.post('/register', WalletRegister);
router.post('/register-with-email', UserController.registerWithEmailPass);
router.post('/user-otp-verify', UserController.OTPVerify)
// User login
router.post('/login', WalletLogin);
router.post('/login-with-username', UserController.loginWithEmailPass);

//forget password
router.post('/forget-password', UserController.forgetPassword)
router.post('/verify-forget-otp', UserController.verifyForgetOtp)
router.post('/create-new-password', UserController.resetPassword)


router.post('/fill-user-details', UserController.updateUserDetails);

router.get('/profile', authenticateUser, UserController.UserProfile);

router.get('/logout', UserController.UserLogout);

router.get('/get-user-details/:id', UserController.getUserDetails)


router.post("/purchase-token",  UserController.purchaseToken);
 
router.get("/get-token-history", authenticateUser, UserController.getUserPurchaseHistory);

router.post("/support/create",authenticateUser, UserController.helpAndSupport);

router.get("/support/messages", authenticateUser, UserController.getAllHelpAndSupportHistory);


// router.post('/withdraw-amount', authenticateUser, UserController.Withdrawal)
// router.get('/withdrawal-history', authenticateUser, UserController.WithdrawalsHistory)


// router.post('/update-profile', authenticateUser, UserController.updateUserDetails);
// // get logged in user
// router.get('/get-user', authenticateUser, UserController.GetUser);
// router.get('/get-direct-users', authenticateUser, UserController.getDirectReferrals);



// router.get('/get-all-users', UserController.getAllUsers)


// router.get('/get-miners', UserController.getMiners)

// router.get('/get-purchased-miners', authenticateUser, UserController.getPurchasedMiners)

// router.post('/deposit-amount', authenticateUser, UserController.deposit)
// router.post('/purchase-miner', authenticateUser, UserController.buyOrRentMiner)
// router.put('/unlock-miner', authenticateUser, UserController.unlockMiner)
// router.get('/get-holdings', authenticateUser, UserController.getHoldings)


// router.get('/get-swaping-data', authenticateUser, UserController.swappingData)

// router.post('/swap-amount', authenticateUser, UserController.swapAmount)
// router.post('/re-swap-amount', authenticateUser, UserController.reSwapAmount)
// router.get('/swap-history', authenticateUser, UserController.swapHistory)
// router.get('/get-miner-income-history', authenticateUser, UserController.getIncomeHistory)

// router.get('/get-refer-income-history', authenticateUser, UserController.getReferralIncome)


// router.get('/get-hold-token-history', authenticateUser, UserController.userTokenHoldHistory)


module.exports = router;