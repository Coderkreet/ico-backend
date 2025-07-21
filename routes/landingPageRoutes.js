const express = require('express');
const router = express.Router();
const contentController = require('../controllers/landingpageControllers');

// --- Event Routes ---
router.post('/events', contentController.createEvent);
router.get('/events', contentController.getAllEvents);
router.get('/events/type/:type', contentController.getEventsByType);
router.get('/events/:id', contentController.getEventById);
router.put('/events/:id', contentController.updateEvent);
router.delete('/events/:id', contentController.deleteEvent);

// --- FAQ Routes ---
router.post('/faqs', contentController.createFAQ);
router.get('/faqs', contentController.getAllFAQs);
router.get('/faqs/:id', contentController.getFAQById);
router.put('/faqs/:id', contentController.updateFAQ);
router.delete('/faqs/:id', contentController.deleteFAQ);

// --- Logo Routes ---
router.post('/logos', contentController.uploadLogo);
router.get('/logos/latest', contentController.getLatestLogo);
router.delete('/logos/:id', contentController.deleteLogo);

// --- Our Products Routes ---
router.post('/create-products', contentController.createProduct);
router.get('/get-products', contentController.getAllProducts);
router.get('/get-products/:id', contentController.getProductById);
router.put('/update-products/:id', contentController.updateProduct);
router.delete('/delete-products/:id', contentController.deleteProduct);


// --- Overview Routes ---
router.post('/overviews', contentController.createOverview);
router.get('/overviews', contentController.getAllOverviews);
router.get('/overviews/:id', contentController.getOverviewById);
router.put('/overviews/:id', contentController.updateOverview);
router.delete('/overviews/:id', contentController.deleteOverview);


// === WHY CHOOSE US ROUTES ===
router.post('/why-choose-us/create', contentController.createWhyChooseUs);
router.get('/why-choose-us/all', contentController.getAllWhyChooseUs);
router.get('/why-choose-us/:id', contentController.getWhyChooseUsById);
router.put('/why-choose-us/update/:id', contentController.updateWhyChooseUs);
router.delete('/why-choose-us/delete/:id', contentController.deleteWhyChooseUs);

// === ROADMAP ROUTES ===
router.post('/roadmap/create', contentController.createRoadMap);
router.get('/roadmap/all', contentController.getAllRoadMaps);
router.get('/roadmap/:id', contentController.getRoadMapById);
router.put('/roadmap/update/:id', contentController.updateRoadMap);
router.delete('/roadmap/delete/:id', contentController.deleteRoadMap);

// === TOKEN ROUTES ===
router.post('/token/create', contentController.createToken);
router.get('/token/all', contentController.getAllTokens);
router.get('/token/:id', contentController.getTokenById);
router.put('/token/update/:id', contentController.updateToken);
router.delete('/token/delete/:id', contentController.deleteToken);



// POST: Create multiple tokenomics entries
router.post('/createTokenomics', contentController.createTokenomics);
router.get('/getTokenomics', contentController.getTokenomics);
router.put('/updateTokenomics/:id', contentController.updateTokenomics);
router.delete('/deleteTokenomics/:id', contentController.deleteTokenomics);



router.post('/createTokenTracker', contentController.createTokenTracker);             
router.get('/getTokenTrackers', contentController.getTokenTrackers);                
router.get('/getTokenTrackerById/:id', contentController.getTokenTrackerById);          
router.put('/updateTokenTracker/:id', contentController.updateTokenTracker);         
router.delete('/deleteTokenTracker/:id', contentController.deleteTokenTracker); 


router.post('/createMarketStats', contentController.createMarketStats);              
router.get('/getMarketStats', contentController.getMarketStats);                  
router.get('/getMarketStatsById/:id', contentController.getMarketStatsById);            
router.put('/updateMarketStats/:id', contentController.updateMarketStats);             
router.delete('/deleteMarketStats/:id', contentController.deleteMarketStats); 



router.post('/createEcosystem', contentController.createEcosystem);
router.get('/getAllEcosystems', contentController.getAllEcosystems);
router.get('/getEcosystemById/:id', contentController.getEcosystemById);
router.put('/updateEcosystem/:id', contentController.updateEcosystem);
router.delete('/deleteEcosystem/:id', contentController.deleteEcosystem);



router.post('/createBitcoinStats', contentController.createBitcoinStats);
router.get('/BitcoinStats', contentController.getBitcoinStats);
router.put('/updateBitcoinStats/:id', contentController.updateBitcoinStats);
router.delete('/deleteBitcoinStats/:id', contentController.deleteBitcoinStats);


router.get("/getAllFooterLinks", contentController.getAllFooterLinks);
router.post("/createFooterLink", contentController.createFooterLink);
router.put("/updateFooterLink/:id", contentController.updateFooterLink);
router.delete("/deleteFooterLink/:id", contentController.deleteFooterLink);


//HEADER ROUTES
router.post('/create-header' , contentController.createHeaderContent)
router.get('/get-header', contentController.getLatestHeaderContent)
router.put('/update-header/:id' , contentController.updateHeaderContent)
router.delete('/delete-header/:id' , contentController.deleteHeaderContent)

//HEADER SLIDER ROUTES
router.post('/create-header-slider', contentController.createSlider)
router.get('/get-header-slider', contentController.getAllSliders)
router.put('/update-header-slider/:id', contentController.updateSlider)
router.delete('/delete-header-slider/:id', contentController.deleteSlider)

// LISTED PLATFORM ROUTES
router.post('/create-platforms', contentController.createListedPlatform);
router.get('/get-platforms', contentController.getAllListedPlatforms);
router.put('/update/:id', contentController.updateListedPlatform);
router.delete('/delete/:id', contentController.deleteListedPlatform);

//TOKEN DETAILS ROUTES
router.post('/create-token-details', contentController.createTokenDetails);
router.get('/get-token-details', contentController.getAllTokenDetails);
router.put('/update-token-details/:id', contentController.updateTokenDetails);
router.delete('/delete-token-details/:id', contentController.deleteTokenDetails);


//WALLET ROUTES
router.post('/create-wallet', contentController.createConnectWallet);
router.get('/get-wallets', contentController.getAllConnectWallets);    
router.get('/get-wallet/:id', contentController.getConnectWalletById);
router.put('/update-wallet/:id', contentController.updateConnectWallet);
router.delete('/delete-wallet/:id', contentController.deleteConnectWallet);


//NEWS ROUTES
router.post("/create-news", contentController.createNews);
router.get("/get-news", contentController.getAllNews);
router.get("/get-news/:id", contentController.getNewsById);
router.put("/update-news/:id", contentController.updateNews);
router.delete("/delete-news/:id", contentController.deleteNews);

//TERMS AND CONDITIONS ROUTES
router.post('/create-terms', contentController.createTermAndCondition);
router.get('/get-terms', contentController.getAllTermsAndConditions);
router.get('/get-particular-term/:id', contentController.getTermAndConditionById);
router.put('/update-terms/:id', contentController.updateTermAndCondition);
router.delete('/delete-terms/:id', contentController.deleteTermAndCondition);


//PRIVACY POLICY ROUTES
router.post("/create-policy", contentController.createPrivacyPolicy);
router.get("/get-policy", contentController.getAllPrivacyPolicies);
router.get("/get-policy/:id", contentController.getPrivacyPolicyById);
router.put("/update-policy/:id", contentController.updatePrivacyPolicy);
router.delete("/delete-policy/:id", contentController.deletePrivacyPolicy);

//COOKIEE POLICY ROUTES
router.post("/create-cookiee", contentController.createCookiePolicy);
router.get("/get-cookiee", contentController.getAllCookiePolicies);
router.get("/get-cookiee/:id", contentController.getCookiePolicyById);
router.put("/update-cookiee/:id", contentController.updateCookiePolicy);
router.delete("/delete-cookiee/:id", contentController.deleteCookiePolicy);

//BLOG ROUTES
router.post('/create-blog', contentController.createBlog);
router.get('/get-blogs', contentController.getAllBlogs);
router.get('/get-blogs/:id', contentController.getBlogById);
router.put('/update-blogs/:id', contentController.updateBlog);
router.delete('/delete-blogs/:id', contentController.deleteBlog);

//COPYWRITE ROUTES
router.post("/create-copywrite", contentController.createCopyWrite);
router.get("/get-copywrite", contentController.getAllCopyWrites);
router.get("/get-copywrite/:id", contentController.getCopyWriteById);
router.put("/update-copywrite/:id", contentController.updateCopyWrite);
router.delete("/delete-copywrite/:id", contentController.deleteCopyWrite);


//FOOTER DESCRIPTION ROUTES
router.post("/create-description", contentController.createDescription);
router.get("/get-description", contentController.getAllDescriptions);
router.get("/get-description/:id", contentController.getDescriptionById);
router.put("/update-description/:id", contentController.updateDescription);
router.delete("/delete-description/:id", contentController.deleteDescription);

//CONTACT ROUTES

router.post("/create-contact", contentController.createContact);
router.get("/get-contact", contentController.getAllContacts);

router.get('/get-xio-data', contentController.getXioData);
router.post('/purchase-xio-coin', contentController.purchaseXioCoin);



module.exports = router;
