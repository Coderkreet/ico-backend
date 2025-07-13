const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    picture: {
        type: String,
        
    },
    name: { type: String,  },
    email: { type: String, unique: true },
    password: { type: String,  },
    country: { type: String,  },
    mobile: { type: String,  },
    title: { type: String,  },
    dob: { type: String,  },
    address:{type: String, },
    pincode:{type: String, },
    city:{type: String, },
    otpDetails: {
        mobileOtp: { type: String,  },
        emailOtp: { type: String,  },
        mobileExpireAt: { type: Date,  },
        emailExpireAt: { type: Date,  },
        isEmailVerified: { type: Boolean, default: false },
        isMobileVerified: { type: Boolean, default: false },
    },
    walletAddress: { type: String,  },
    token: { type: String,  },
    tokenBlock: { type: Array, default: [] },
    isActive: { type: Boolean, default: false },
    activeDate: {
        type: Date,
        
    },
    referralLink: { type: String,  },
    // transaction: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Transaction'
    // }],
    account: {
        totalInvestment: { type: Number, default: 0.0 },
        totalEarning: { type: Number, default: 0.0 },
        totalReferralEarning: { type: Number, default: 0.0 },
        totalWithdrawal: { type: Number, default: 0.0 },
        currentIncome: { type: Number, default: 0.0 },
    },
    // withdrawal: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Withdrawal'
    // }],
    tokenHolding: [{
        symbol: { type: String,  },
        qty: { type: Number, default: 0.0 },
        valueInUSDT: { type: Number, default: 0.0 },
    }]

}, { timestamps: true, versionKey: false });


exports.UserModel = mongoose.model('Userdetail', userSchema)