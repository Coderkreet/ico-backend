const { ethers } = require('ethers');
const { UserModel } = require('../models/userModel');
const { getToken } = require('../utils/getTokenGenerator');


const provider = new ethers.JsonRpcProvider(process.env.BSC_RPC_URL);
// const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const xpfiWallet = new ethers.Wallet(process.env.XPFI_PRIVATE_KEY, provider);

const usdtAbi = [
    "function balanceOf(address account) view returns (uint256)",
    "function transfer(address to, uint256 value) returns (bool)",
    "function decimals() view returns (uint8)"
];



exports.WalletRegister = async (req, res) => {
    const { walletAddress, } = req.body;
    if (!walletAddress) return res.status(500).json({ success: false, message: "Wallet Address is required." })
    try {
        let user = await UserModel.findOne({ walletAddress });
        // const newReferralLink = generateRandomReferralLink();
        // const name = newReferralLink

        // const id = generateUserId();

        if (user) return res.status(500).json({ success: false, message: "Wallet Address already exists." });

        // const allUsers = await UserModel.countDocuments()
        // if (allUsers == 0) {
            const newUser = new UserModel({ walletAddress });
            await newUser.save();
            const token = await getToken(newUser);
            newUser.token = token;
            newUser.isVerified = true;
            await newUser.save();
            res.cookie('ICO', token, { httpOnly: false, secure: true, sameSite: 'Strict', path: '/', maxAge: 30 * 24 * 60 * 60 * 1000 });
            return res.json({ success: true, message: "Register successfully.", token,  });
        // }

        // const sponsor = await UserModel.findOne({ referralLink: referral });
        // if (!sponsor) return res.status(500).json({ success: false, message: "Invalid Referral Id." });

        // const newUser = new UserModel({ walletAddress, sponsor: sponsor._id,  });
        // await newUser.save();
        // sponsor.partners.push(newUser._id);
        // const token = await getToken(newUser);
        // newUser.token = token,
            // newUser.isVerified = true;

        // await newUser.save();
        // await sponsor.save();

        // res.cookie('ICO', token, { httpOnly: false, secure: true, sameSite: 'Strict', path: '/', maxAge: 30 * 24 * 60 * 60 * 1000 });
        // return res.json({ success: true, message: "Register successfully.", token, id: newUser._id });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.WalletLogin = async (req, res) => {
    const { walletAddress } = req.body;
    if (!walletAddress) return res.status(500).json({ success: false, message: "Wallet Address is required." })
    try {
        let user = await UserModel.findOne({ walletAddress });
        if (!user) return res.status(500).json({ success: false, message: "Wallet Address not exists." });
        const token = await getToken(user)
        user.token = token
        await user.save();
        res.cookie('ICO', token, { httpOnly: false, secure: true, sameSite: 'Strict', path: '/', maxAge: 30 * 24 * 60 * 60 * 1000 });
        return res.status(200).json({ success: true, message: "login successfully.", token, id: user._id });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message });
    }
}






exports.TransferXIOCoin = async ({ req, res, walletAddress, amount }) => {
    try {
        // Initialize contract


        console.log(`Transferring XPFI Coin to ${walletAddress} for amount: ${amount}`);
        const usdtContract = new ethers.Contract(process.env.XPFI_CONTRACT_ADDRESS, usdtAbi, xpfiWallet);


        console.log(`Transferring XPFI Coin from ${xpfiWallet.address} to ${walletAddress} for amount: ${amount}`,usdtContract);

        // Validate inputs
        if (!ethers.isAddress(walletAddress)) {
            return res.status(400).json({ status: false, message: "Invalid recipient address" });
        }
        if (!Number(amount) || Number(amount) <= 0) {
            return res.status(400).json({ status: false, message: "Invalid amount" });
        }

        // Get decimals dynamically (in case it's not 18)
        // const decimals = await usdtContract.decimals();

            let decimals;
        try {
            decimals = await usdtContract.decimals();
            console.log(`XPFI Coin Decimals: ${decimals}`);
        } catch (error) {
            console.error("Error getting decimals:", error);
            return res.status(500).json({ status: false, message: `Failed to get decimals: ${error.message}` });
        }

        console.log(`XPFI Coin Decimals: ${decimals}`);
        const amountToSend = ethers.parseUnits((Number(amount)).toString(), decimals);
        console.log(`Amount to send: ${ethers.formatUnits(amountToSend, decimals)} XPFI Coin`);

        // Check sender's XPFI Coin balance
        const walletUsdtBalance = await usdtContract.balanceOf(xpfiWallet.address);
        console.log(`Sender (${xpfiWallet.address}) XPFI Coin Balance: ${ethers.formatUnits(walletUsdtBalance, decimals)} XPFI Coin`);

        if (walletUsdtBalance < amountToSend) {
            return res.status(400).json({
                status: false,
                message: `Not enough XPFI Coin balance for transfer in admin wallet. Available: ${ethers.formatUnits(walletUsdtBalance, decimals)}, Required: ${ethers.formatUnits(amountToSend, decimals)}`,
            });
        }

        // Estimate gas
        const gasLimit = await usdtContract.transfer.estimateGas(walletAddress, amountToSend);
        console.log(`Estimated Gas Limit: ${gasLimit.toString()}`);

        // Fetch fee data
        const feeData = await provider.getFeeData();
        const gasPrice = feeData.gasPrice || ethers.parseUnits("5", "gwei");
        console.log(`Gas Price: ${ethers.formatUnits(gasPrice, "gwei")} gwei`);

        // Check BNB balance for gas fees
        const walletBalance = await provider.getBalance(xpfiWallet.address);
        const estimatedGasFee = gasLimit * gasPrice;
        console.log(`Estimated Gas Fee: ${ethers.formatUnits(estimatedGasFee, "ether")} BNB`);

        if (walletBalance < estimatedGasFee) {

            console.log(`Not enough BNB for gas fees in admin wallet. Available: ${ethers.formatUnits(walletBalance, "ether")}, Required: ${ethers.formatUnits(estimatedGasFee, "ether")}`);
            return res.status(400).json({
                status: false,
                message: `Not enough BNB for gas fees in admin wallet. Available: ${ethers.formatUnits(walletBalance, "ether")}, Required: ${ethers.formatUnits(estimatedGasFee, "ether")}`,
            });
        }

        // Execute transaction
        console.log(`Transferring ${ethers.formatUnits(amountToSend, decimals)} XPFI Coin from ${xpfiWallet.address} to ${walletAddress}`);
        const tx = await usdtContract.transfer(walletAddress, amountToSend, { gasLimit, gasPrice });
        console.log(`Transaction Hash: ${tx.hash}`);

        // Wait for confirmation
        await tx.wait();
        console.log("XPFI Coin transfer successful!");

        // Save transaction to database
        // const txnId = generateTxnId();
        // const transaction = await TransactionModel.create({
        //     userId,
        //     amount: Number(amount),
        //     clientAddress: walletAddress,
        //     mainAddress: xpfiWallet.address,
        //     hash: tx.hash,
        //     transactionID: txnId,
        //     type: "XPFI_Coin_Transfer",
        //     status: "Completed",
        // });

        return res.status(200).json({
            success: true,
            status: true,
            message: "Z-Coin Purchase Successful!",
            hash: tx.hash,
            gasLimit: gasLimit.toString(),
            gasPrice: ethers.formatUnits(gasPrice, "gwei"),
        });
    } catch (error) {
        console.error("❌ Error during XPFI Coin transfer:", error);
        return res.status(500).json({ status: false, message: error.message });
    }
};
