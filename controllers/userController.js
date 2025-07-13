const { UserModel } = require("../models/userModel");
const { getToken } = require("../utils/getTokenGenerator");
const { getComparePassword, getHashPassword } = require("../utils/encrypt");
const { getOtpGenerate } = require("../utils/otpGenerator");
const { sendToOtp } = require("../utils/sendOtpToNodemailer");
const { uploadImageToImageKit } = require("../utils/uploadImage");
const TokenPurchase = require("../models/tokenPurchaseHistory");
const TokenPrice = require("../models/tokenvalueModel");
const Support = require("../models/supportModel");

const AdminModel = require("../models/adminModels");
const { sendSMS } = require("../utils/sendOtpToMoblie");


exports.registerWithEmailPass = async (req, res) => {
    try {
        const { name, email, password, mobile, country } = req.body;
        if (!name || !password || !mobile || !email || !country) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: "User already exists." });
        }

        const hashedPassword = await getHashPassword(password);
        const mobileOtp = getOtpGenerate();
        const emailOtp = getOtpGenerate();
        console.log(mobileOtp, emailOtp)
        const users = await UserModel.find()

        let newUser;
        if (users.length === 0) {
            newUser = await UserModel({
                name,
                email,
                password: hashedPassword,
                mobile,
                country,
                otpDetails: {
                    mobileOtp: mobileOtp.otp,
                    emailOtp: emailOtp.otp,
                    mobileExpireAt: mobileOtp.expireOtp,
                    emailExpireAt: emailOtp.expireOtp,
                },
            });
        } else {
            if (user) {
                // If email exists but not verified, update it
                newUser = await UserModel.findOneAndUpdate(
                    { email },
                    {   name,
                        password: hashedPassword,
                        mobile,
                        country,
                        otpDetails: {
                            mobileOtp: mobileOtp.otp,
                            emailOtp: emailOtp.otp,
                            mobileExpireAt: mobileOtp.expireOtp,
                            emailExpireAt: emailOtp.expireOtp,
                        },
                    },
                    { new: true }
                );
            } else {
                // create new user 
                newUser = await UserModel({
                    name,
                    email,
                    password: hashedPassword,
                    mobile,
                    country,
                    otpDetails: {
                        mobileOtp: mobileOtp.otp,
                        emailOtp: emailOtp.otp,
                        mobileExpireAt: mobileOtp.expireOtp,
                        emailExpireAt: emailOtp.expireOtp,
                    },
                });
            }
        }

        // Send OTP for verification
        await sendToOtp({ emailOtp, user: newUser, subject: "ICo Account Verification OTP ✔", });
        await sendSMS('+919993914345', `Your OTP for ICO registration is ${mobileOtp.otp}. It will expire in 10 minutes.`);

       
        console.log(newUser)
        await newUser.save();

        return res.status(201).json({
            success: true,
            data: newUser
        });
    } catch (error) {
        console.log("Error in registration:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

exports.loginWithEmailPass = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }
        const user = await UserModel.findOne({email: email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found." });
        }
        const isMatch = await getComparePassword(user, password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials." });
        }
        const token = await getToken(user);
        user.token = token;
        await user.save();
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            success: true,
            message: "Login successfully.",
            data: user,
        });
    } catch (error) {
        console.log("Error in login:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

exports.OTPVerify = async (req, res) => {
    const { email, emailOtp, mobileOtp } = req.body;
    try {
        const User = await UserModel.findOne({ email });
        if (!User)
            return res
                .status(400)
                .json({ success: false, message: "Invalid credentials" });
        if (
            User.otpDetails.emailOtp !== emailOtp ||
            User.otpDetails.emailExpireAt < Date.now() || User.otpDetails.mobileOtp !== mobileOtp || User.otpDetails.mobileExpireAt < Date.now()
        )
            return res
                .status(400)
                .json({ success: false, message: "Invalid or expired OTP" });
        User.otpDetails.isEmailVerified = true;
        User.otpDetails.isMobileVerified = true;
        User.isActive = true;
        User.activeDate = new Date();
        User.otpDetails.emailOtp = null
        User.otpDetails.mobileOtp = null;
        User.otpDetails.emailExpireAt = null;
        User.otpDetails.mobileExpireAt = null;

        const token = await getToken(User)
        User.token = token
        await User.save();
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 day expiration
        });
        res.status(200).json({
            success: true,
            message: "User Account verified successfully.",
            id: User._id,
            token: token
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (email ) {
            return res.status(400).json({ success: false, message: "email  is required" });
        }

        const user = await UserModel.findOne({email: email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const emailOtp = getOtpGenerate();
        const mobileOtp = getOtpGenerate();
        user.otpDetails.mobileOtp = mobileOtp.otp;
        user.otpDetails.mobileExpireAt = mobileOtp.expireOtp;
        user.otpDetails.emailOtp = emailOtp.otp;
        user.otpDetails.emailExpireAt = emailOtp.expireOtp;
        await user.save();

        await sendToOtp({
            emailOtp,
            user,
            subject: "Password Reset Request",
        });
        await sendSMS('+919993914345', `Your OTP for Prestorix registration is ${mobileOtp.otp}. It will expire in 10 minutes.`);


        return res.status(200).json({
            success: true,
            message: "OTP sent to your registered email for password reset.",
            email: user.email,
            mobile: user.mobile
        });
    } catch (error) {
        console.log("Error sending email: ", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.verifyForgetOtp = async (req, res) => {
    const { email , emailOtp, mobileOtp } = req.body;
    try {
        const User = await UserModel.findOne({email: email });
        if (!User)
            return res
                .status(400)
                .json({ success: false, message: "Invalid credentials" });
        if (
            User.otpDetails.emailOtp !== emailOtp ||
            User.otpDetails.emailExpireAt < Date.now() || User.otpDetails.mobileOtp !== mobileOtp || User.otpDetails.mobileExpireAt < Date.now()
        )
            return res
                .status(400)
                .json({ success: false, message: "Invalid or expired OTP" });
        User.otpDetails.isEmailVerified = true;
        User.otpDetails.isMobileVerified = true;
        User.isActive = true;
        User.activeDate = new Date();
        User.otpDetails.emailOtp = null
        User.otpDetails.mobileOtp = null;
        User.otpDetails.emailExpireAt = null;
        User.otpDetails.mobileExpireAt = null;

        return res.status(200).json({ success: true, message: "OTP Verified, set a new password." })
    } catch (error) {
        console.log("Error verifying otp: ", error)
        return res.status(500).json({ success: false, message: error.message });
    }
}


exports.resetPassword = async (req, res) => {
    try {
        const { email , password } = req.body
        // console.log(req.body)
        const user = await UserModel.findOne({email: email })
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." })
        }

        if (!password) {
            return res.status(400).json({ success: false, message: "Password is required." });
        }

        const hashedPassword = await getHashPassword(password);
        if (user.password === hashedPassword) {
            return res.status(400).json({ success: false, message: "New password cannot be the same as the old password." });
        }
        user.password = hashedPassword
        await user.save()

        res.status(200).json({ success: true, message: "Password changed successfully." })
    } catch (error) {
        console.log("Error creating new password: ", error)
        return res.status(500).json({ success: false, message: error.message })
    }
}


exports.updateUserDetails = async (req, res) => {
    try {
        const user = req.user;
        const { mobile, email, profile,title,dob,address,pincode,city } = req.body;

        let url;
        if (profile) {
            url = profile.startsWith('http://') || profile.startsWith('https://')
                ? profile
                : await uploadImageToImageKit(profile, 'ICO');
            if (!url) {
                return res.status(500).json({ message: 'Error uploading image' });
            }
        }
        const newUser = await UserModel.findByIdAndUpdate(
            user._id,
            { name: mobile, email, picture: url,title, dob, address, pincode, city },
            { new: true }
        );
        return res.status(200).json({
            success: true,
            message: "User updated successfully.",
            data: newUser,
        });
    } catch (error) {
        console.log("Error updating user details:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

exports.UserProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id);
        res.status(200).json({
            success: true,
            message: "User Profile.",
            data: user,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.UserLogout = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id);
        user.tokenBlock.push(user.token);
        user.token = null;
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        });

        return res
            .status(200)
            .json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Server error" });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }
};



exports.purchaseToken = async (req, res) => {
  try {
    const userId = req.user._id; // assuming user is authenticated and userId is in req.user
    const { symbol, qty } = req.body;

    if (!symbol || !qty || isNaN(qty) || qty <= 0) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // Get latest token price
    const priceData = await TokenPrice.findOne().sort({ updatedAt: -1 });
    if (!priceData) {
      return res.status(400).json({ error: "Token price not available" });
    }

    const tokenPrice = priceData.price;
    const totalCost = tokenPrice * qty;

    // Update TokenPurchase history
    const purchase = await TokenPurchase.create({
      userId,
      symbol,
      qty,
      valueInUSDT: totalCost,
      tokenPriceAtPurchase: tokenPrice
    });

    // Update user's tokenHolding
    const user = await User.findById(userId);
    const holding = user.tokenHolding.find(t => t.symbol === symbol);
    if (holding) {
      holding.qty += qty;
      holding.valueInUSDT += totalCost;
    } else {
      user.tokenHolding.push({
        symbol,
        qty,
        valueInUSDT: totalCost
      });
    }

    // Update user's total investment
    user.account.totalInvestment += totalCost;
    await user.save();

    res.status(200).json({
      message: "Token purchased successfully",
      purchase,
      totalInvestment: user.account.totalInvestment,
      tokenHolding: user.tokenHolding
    });

  } catch (error) {
    console.error("Token purchase error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



exports.getUserPurchaseHistory = async (req, res) => {
  try {
    const userId = req.user._id; // assuming auth middleware attaches user

    const purchases = await TokenPurchase.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Token purchase history fetched successfully",
      data: purchases
    });
  } catch (error) {
    console.error("Error fetching token purchase history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.helpAndSupport = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const { message, subject } = req.body;
    console.log(req.body);
    if (!message || !subject) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const support = await Support.create({
      userId,
      message,
      subject,
      createdAt: new Date(),
    });
    await support.save();
    res
      .status(201)
      .json({ success: true, message: "Support request sent Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getAllHelpAndSupportHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const supportHistory = await Support.find({ userId }).sort({
      createdAt: -1,
    });
    res.json({ success: true, data: supportHistory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// exports.Withdrawal = async (req, res) => {
//     try {
//         const { amount, walletAddress } = req.body;
//         console.log(amount, walletAddress)
//         if (!amount || !walletAddress) return res.status(400).json({ success: false, withdrawalPermission: "Rejected", message: "Amount & Wallet Address are required." });
//         const user = await UserModel.findById(req.user._id).populate({ path: 'withdrawal', select: 'amount createdAt walletAddress' });
//         if (!user) return res.status(404).json({ success: false, message: "User not exists." });
//         if (amount > user.account.currentIncome) return res.status(400).json({ success: false, message: "Insufficient funds." });
//         // if (amount < admin.min || amount > admin.max) {
//         //     return res.status(400).json({ success: false, message: "Amount is outside the minimum and maximum withdrawal limit." });
//         // }
//         await WithdrawalUsdt({ req, res, userId: user._id, walletAddress, amount });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// }

// exports.WithdrawalsHistory = async (req, res) => {
//     try {
//         const user = await UserModel.findById(req.user._id, { withdrawal: 1, username: 1, investment: 1 }).populate({ path: 'withdrawal' });
//         const history = user.withdrawal;
//         const totalAmount = history.reduce((total, w) => total + w.amount, 0);
//         const today = new Date();
//         const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
//         const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
//         const todayAmount = history.filter(w => new Date(w.createdAt) >= startOfDay && new Date(w.createdAt) <= endOfDay)
//             .reduce((total, w) => total + w.amount, 0);
//         return res.status(200).json({ success: true, data: { history, totalAmount, todayAmount }, message: "Withdrawal finds successfully. " });
//     } catch (error) {
//         console.error("Error fetching total withdrawal:", error);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// }


// exports.GetUser = async (req, res) => {
//     try {
//         const user = req.user;
//         const newUser = await UserModel.findById(user._id).select("name walletAddress isActive account mobile email picture referralLink sponsor activeDate userId fund createdAt tokenHolding");

//         let totalPreValue = 0;
//         let totalCurHoldValue = 0;

//         for (const item of newUser.tokenHolding) {
//             const token = item.symbol;
//             const qty = item.qty; // e.g. 0.02
//             const preValueInUSDT = item.valueInUSDT; // directly 10 USDT, no multiply
//             const currentPricePerToken = await getCurrentTokenValue(token); // e.g. 640 USDT per BNB
//             const curHoldValueInUSDT = qty * currentPricePerToken; // 0.02 * 640 = 12.8 USDT

//             const profitOrLoss = ((curHoldValueInUSDT - preValueInUSDT) / preValueInUSDT) * 100;

//             // add to totals
//             totalPreValue += preValueInUSDT;
//             totalCurHoldValue += curHoldValueInUSDT;
//         }

//         // Now calculate total PnL
//         const totalPortfolioPnLPerc = ((totalCurHoldValue - totalPreValue) / totalPreValue) * 100;
//         const totalPortfolioPnL = totalCurHoldValue - totalPreValue

//         newUser._doc.totalPortfolioPnLPerc = totalPortfolioPnLPerc;
//         newUser._doc.totalPortfolioPnL = totalPortfolioPnL;
//         // console.log(newUser);
//         return res.status(200).json({
//             success: true,
//             message: "User fetched successfully.",
//             data: newUser,
//         });
//     } catch (error) {
//         console.log(error);
//         return res
//             .status(500)
//             .json({ success: false, message: "Server error" });
//     }
// };


// exports.getDirectReferrals = async (req, res) => {
//     try {
//         const user = req.user;
//         const users = await UserModel.find({ sponsor: user._id }).select("name walletAddress isActive account mobile email picture referralLink sponsor activeDate userId createdAt");;
//         return res.status(200).json({ success: true, data: users });
//     } catch (error) {
//         return res.status(401).json({ success: false, message: error.message });
//     }
// }



// exports.getAllUsers = async (req, res) => {
//     try {
//         const users = await UserModel.find();
//         return res.status(200).json({ success: true, data: users });
//     } catch (error) {
//         return res.status(401).json({ success: false, message: error.message });
//     }
// };



// exports.deposit = async (req, res) => {
//     try {
//         const user = req.user;
//         const { amount, txResponse, recipientAddress, userAddress } = req.body;
//         if (!amount) return res.status(400).json({ success: false, message: "Amount is required." });
//         if (amount < 0) return res.status(400).json({ success: false, message: "Invalid amount." });

//         const txnId = generateTxnId();
//         const transaction = await TransactionModel.create({
//             userId: user._id,
//             amount: Number(amount),
//             clientAddress: userAddress,
//             mainAddress: recipientAddress,
//             hash: txResponse.hash,
//             transactionID: txnId,
//             type: "deposit"
//         })

//         user.fund += Number(amount);
//         user.transaction.push(transaction._id);
//         await user.save();
//         return res.status(200).json({ success: true, message: "Deposit successful." });
//     } catch (error) {
//         console.log("Error depositing:", error);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// }


// exports.getMiners = async (req, res) => {
//     try {
//         const miners = await MinerModel.find();
//         return res.status(200).json({ success: true, data: miners });
//     } catch (error) {
//         return res.status(401).json({ success: false, message: error.message });
//     }
// }

// exports.buyOrRentMiner = async (req, res) => {
//     try {
//         const user = req.user;
//         const { minerId, investment, token } = req.body;
//         const miner = await MinerModel.findById(minerId);
//         if (investment > user.fund) return res.status(400).json({ success: false, message: "Insufficient funds" });
//         if (investment < miner.min || investment > miner.max) {
//             return res.status(400).json({ success: false, message: "Invalid investment amount" });
//         }
//         if (!miner) return res.status(404).json({ success: false, message: "Miner not found" });

//         const mining = await MiningModel.create({
//             miner: miner._id,
//             investment: Number(investment),
//             token,
//             user: user._id,
//             isActive: true,
//         })

//         user.fund -= Number(investment);
//         user.miners.push(mining._id);
//         user.account.totalInvestment = (user.account.totalInvestment || 0.0) + Number(investment);

//         await user.save();

//         const referralPercentages = user.levelPercentages;
//         let currentUser = user
//         console.log(currentUser)
//         for (let level = 1; level <= Object.keys(referralPercentages).length; level++) {
//             const sponsor = await UserModel.findById(currentUser
//                 .sponsor);
//             console.log(sponsor)
//             if (!sponsor) break;
//             if (sponsor) {
//                 const referralIncome = (Number(investment) * (referralPercentages.get(level) || 0)) / 100;

//                 sponsor.account.totalReferralEarning = (sponsor.account.totalReferralEarning || 0) + referralIncome;
//                 sponsor.account.currentIncome = (sponsor.account.currentIncome || 0) + referralIncome;

//                 // Log referral income
//                 sponsor.referralIncomes.push({
//                     income: referralIncome,
//                     from: user._id,
//                     date: new Date(),
//                 });
//                 await sponsor.save();
//             }
//             currentUser = sponsor; // Move up the referral chain
//         }


//         if (miner.minerType === "buy") {
//             return res.status(200).json({ success: true, message: "Miner bought successfully" });
//         } else {
//             return res.status(200).json({ success: true, message: "Miner rented successfully" });
//         }
//     } catch (error) {
//         console.log("Error buying or renting miner:", error);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };

// exports.unlockMiner = async (req, res) => {
//     try {
//         const user = req.user;
//         const { id } = req.body;
//         const mining = await MiningModel.findById(id);
//         if (!mining) return res.status(404).json({ success: false, message: "Miner not found" });

//         mining.unlocked = true;
//         mining.unlockedAt = new Date();
//         mining.isActive = false
//         await mining.save();
//         user.fund = mining.investment + mining.earning;
//         await user.save();

//         return res.status(200).json({ success: true, message: "Miner unlocked successfully", data: mining });
//     } catch (error) {
//         console.log("Error unlocking miner:", error);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// }


// exports.getPurchasedMiners = async (req, res) => {
//     try {
//         const user = req.user;
//         const miners = await MiningModel.find({ _id: { $in: user.miners } }).populate("miner");
//         return res.status(200).json({ success: true, data: miners });
//     } catch (error) {
//         return res.status(401).json({ success: false, message: error.message });
//     }
// }

// exports.getHoldings = async (req, res) => {
//     try {
//         const user = req.user;
//         const miners = await MiningModel.find({ _id: { $in: user.miners }, unlocked: false }).populate("miner");

//         res.status(200).json({ success: true, data: miners });
//     } catch (error) {
//         console.log("Error fetching holdings:", error);
//         return res.status(401).json({ success: false, message: error.message });
//     }
// }


// exports.swapAmount = async (req, res) => {
//     try {
//         const user = req.user;
//         const { from, to, initialValue } = req.body;

//         if (!from || !to) return res.status(400).json({ success: false, message: "Both from and to are required." });
//         if (!from.value || !to.value || from.value <= 0 || to.value < 0) return res.status(400).json({ success: false, message: "Invalid amount." });

//         user.totalFund = user.fund + (user.account?.currentIncome || 0);
//         await user.save()

//         if (from.value > user.totalFund) return res.status(400).json({ success: false, message: "Insufficient funds." });

//         const swapp = await SwapModel.create({
//             from: {
//                 value: from.value,
//                 token: from.token,
//             },
//             to: {
//                 value: to.value,
//                 token: to.token,
//             },
//             userId: user._id,
//         });

//         let remainingAmount = from.value;

//         if (user.account.currentIncome >= remainingAmount) {
//             user.account.currentIncome -= remainingAmount;
//         } else {
//             remainingAmount -= user.account.currentIncome;
//             user.account.currentIncome = 0;
//             user.fund -= remainingAmount;
//         }
//         user.swapingHistory.push({
//             swapId: swapp._id,
//             initialAmount: initialValue,
//             currentAmount: initialValue,
//         })

//         const existing = user.tokenHolding.find((token) => token.symbol === to.token);
//         if (existing) {
//             existing.qty += to.value;
//             existing.valueInUSDT += from.value
//         } else {
//             user.tokenHolding.push({ symbol: to.token, qty: to.value, valueInUSDT: from.value });
//         }

//         await user.save();

//         return res.status(200).json({ success: true, message: "Swap successful." });
//     } catch (error) {
//         console.log("Error swapping:", error);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// }

// exports.swappingData = async (req, res) => {
//     try {
//         const user = req.user;
//         user.totalFund = user.fund + (user.account?.currentIncome || 0);
//         const total = user.totalFund
//         await user.save()
//         const userFind = await UserModel.findById(user._id).populate({ path: 'swapingHistory.swapId' });
//         const holds = userFind.swapingHistory
//         // const swaps = await SwapModel.find({ userId: user._id });
//         return res.status(200).json({ success: true, data: { holds, total } });
//     } catch (error) {
//         console.log("❌ Error fetching data:", error);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// }

// exports.swapHistory = async (req, res) => {
//     try {
//         const user = req.user;
//         const findUser = await UserModel.findById(user._id).populate({ path: 'swapingHistory.swapId' });
//         for (let i = 0; i < findUser.swapingHistory.length; i++) {
//             const swap = findUser.swapingHistory[i];
//             const swapData = await SwapModel.findById(swap.swapId);
//             swap.currentAmount = await getCurrentTokenValue(swapData.to.token);
//         }
//         await findUser.save()
//         const swaps = findUser.swapingHistory
//         return res.status(200).json({ success: true, data: swaps });
//     } catch (error) {
//         console.log("❌ Error fetching data:", error);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// }

// exports.getIncomeHistory = async (req, res) => {
//     try {
//         const user = req.user;
//         const userFind = await UserModel.findById(user._id).populate({
//             path: "miners",
//             populate: {
//                 path: "miner",
//                 model: "Miner" // Ensure this matches the model name in MinerModel
//             }
//         });
//         const miners = userFind.miners;

//         return res.status(200).json({ status: true, data: miners });
//     } catch (error) {
//         console.log("❌ Error fetching data:", error);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// }

// exports.getReferralIncome = async (req, res) => {
//     try {
//         const user = req.user

//         const incomes = await UserModel.findById(user._id).populate({
//             path: "referralIncomes",
//             populate: "from"
//         })
//         return res.status(200).json({ success: true, data: incomes.referralIncomes });
//     } catch (error) {
//         console.log("❌ Error fetching data:", error);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// }

// exports.reSwapAmount = async (req, res) => {
//     try {
//         const user = req.user;
//         const { from, to, initialValue } = req.body;
//         if (!from.value || !to.value || from.value <= 0 || to.value < 0) return res.status(400).json({ success: false, message: "Invalid amount." });

//         const swapp = await SwapModel.create({
//             from: {
//                 value: from.value,
//                 token: from.token,
//             },
//             to: {
//                 value: to.value,
//                 token: to.token,
//             },
//             userId: user._id,
//         });

//         let amount = to.value;
//         user.account.currentIncome += amount;

//         user.swapingHistory.push({
//             swapId: swapp._id,
//             initialAmount: initialValue,
//             currentAmount: initialValue,
//             status: "RESWAP"
//         })

//         const existing = user.tokenHolding.find((token) => token.symbol === from.token);
//         existing.qty -= from.value;

//         await user.save();

//         return res.status(200).json({ success: true, message: "Re-Swap successful." });
//     } catch (error) {
//         console.log("Error swapping:", error);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// }

// exports.userTokenHoldHistory = async (req, res) => {
//     try {
//         const user = req.user;
//         const findUser = await UserModel.findById(user._id).populate({ path: 'swapingHistory.swapId' });
//         const uniqueTokens = [];
//         for (const item of findUser.tokenHolding) {
//             const token = item.symbol;
//             const qty = item.qty; // e.g. 0.02
//             const preValueInUSDT = item.valueInUSDT; // directly 10 USDT, no multiply
//             const currentPricePerToken = await getCurrentTokenValue(token); // e.g. 640 USDT per BNB
//             const curHoldValueInUSDT = qty * currentPricePerToken; // 0.02 * 640 = 12.8 USDT

//             const profitOrLoss = ((curHoldValueInUSDT - preValueInUSDT) / preValueInUSDT) * 100;

//             uniqueTokens.push({
//                 symbol: token,
//                 holding: qty,
//                 preValueInUSDT,
//                 curHoldValueInUSDT,
//                 totalPnLValue: profitOrLoss,
//                 currentAmount: currentPricePerToken,
//                 tokens: findUser.tokenHolding
//             });
//         }
//         // console.log("Tokens", uniqueTokens)
//         return res.status(200).json({ success: true, message: "Swap Holding History.", data: uniqueTokens });

//     } catch (err) {
//         console.log("Error in getting token holdings:", err);
//         return res.status(500).json({ success: false, message: err.message });
//     }
// }