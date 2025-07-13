const Event = require('../models/eventLandingPageModels');
const FAQ = require('../models/faqLandingPageModels');
const Logo = require('../models/logoLandingPageModels');
const OurProduct = require('../models/ourProductLandingPageModels');
const Overview = require('../models/overviewLandingPageModels');
const WhyChooseUs = require('../models/whyChooseUsLandingPageModels');
const RoadMap = require('../models/roadMapLandingPageModels');
const Token = require('../models/tokenLandingPageModels');
const { uploadImageToCloud } = require('../utils/uploadImage');
const { TokenomicsModel } = require('../models/technomicsTokenLandingPageModel');
const { TokenTrackerModel } = require('../models/tockenTrackerModel');
const { MarketStatsModel } = require('../models/marketStatusModel');
const { EcosystemModel } = require('../models/ecosystemModel');
const BitcoinStats = require('../models/bitCoinStatusModel');
const Footer = require("../models/footerModel");
const LandingHeader = require("../models/landigHeader.model");
const HeaderSlider = require("../models/headerSlider.model");
const ListedPlatform = require("../models/listedPlatform.model");
const TokenDetails = require("../models/tokenDetails.model");
const ConnectWallet = require('../models/wallet.model'); 
const News = require("../models/news.model"); 
const TermAndCondition = require('../models/termAndCondition.model');
const PrivacyPolicy = require("../models/privacyPolicy.model");
const CookiePolicy = require('../models/cookiePolicy.model');
const Blog = require('../models/blog.model');
const CopyWrite = require("../models/copyWrite.model");
const FooterDescription = require("../models/footerDescription.model");
const Contact = require("../models/contact.model");
// --- Event Handlers ---
exports.createEvent = async (req, res) => {
 try {
     const { text,image, type } = req.body;
     
     if (!text ||!image|| !type) {
       return res.status(400).json({ message: 'Text and type are required' });
     }
 
     let imageUrl = '';
     if (image) {
       imageUrl = await uploadImageToCloud(image, 'ICO');
     }
     const newEvent = new Event({
       text,
       image: imageUrl,
       type
     });
 
     const savedEvent = await newEvent.save();
     res.status(201).json({ message: 'Event created successfully', data: savedEvent });
   } catch (err) {
     console.error(err); // Add logging for easier debugging
     res.status(500).json({ message: 'Server error: ' + err.message });
   }
};

exports.getAllEvents = async (req, res) => {
   try {
    const events = await Event.find();
    res.status(200).json({ count: events.length, data: events });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEventsByType = async (req, res) => {
  try {
    const events = await Event.find({ type: req.params.type });
    res.status(200).json({ count: events.length, data: events });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEventById = async (req, res) => {
 try {
    const { text, image, type } = req.body;
    let imageUrl = '';
    if (image) {
      imageUrl = await uploadImageToCloud(image, 'ICO');
    }
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      { text, imageUrl, type },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json({ message: 'Event updated', data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { text, image, type } = req.body;
    const imageUrl = image ? await uploadImageToCloud(image, 'ICO') : undefined;
    const updateData = { text, type };
    if (imageUrl) updateData.image = imageUrl;

    const updated = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json({ message: 'Event updated', data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- FAQ Handlers ---
exports.createFAQ = async (req, res) => {
 try {
    //  console.log(req.body)
     const faq = new FAQ(req.body);
     const savedFAQ = await faq.save();
     res.status(201).json(savedFAQ);
   } catch (err) {
     res.status(400).json({ error: err.message });
   }
};

exports.getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFAQById = async (req, res) => {
  try {
      const faq = await FAQ.findById(req.params.id);
      if (!faq) return res.status(404).json({ error: 'FAQ not found' });
      res.json(faq);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

exports.updateFAQ = async (req, res) => {
 try {
    const updatedFAQ = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFAQ) return res.status(404).json({ error: 'FAQ not found' });
    res.json(updatedFAQ);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteFAQ = async (req, res) => {
  try {
    const deletedFAQ = await FAQ.findByIdAndDelete(req.params.id);
    if (!deletedFAQ) return res.status(404).json({ error: 'FAQ not found' });
    res.json({ 
        message: 'FAQ deleted successfully' ,
        faq:deletedFAQ
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Logo Handlers ---
exports.uploadLogo = async (req, res) => {
  try {
      const {image} = req.body;
      if (!req.body) return res.status(400).json({ message: 'No file uploaded' });
  
      let imageUrl = '';
      if (image) {
        imageUrl = await uploadImageToCloud(image, 'ICO');
      }
  
       const newLogo = new Logo({
            imageUrl: imageUrl,
          });
     
          const savedLogo = await newLogo.save();
      res.status(201).json({ message: 'Logo uploaded', data: savedLogo  });
    } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(500).json({ message: err.message });
    }
};

exports.getLatestLogo = async (req, res) => {
 try {
    const latestLogo = await Logo.findOne().sort({ createdAt: -1 }); // Gets the most recently added logo

    if (!latestLogo) return res.status(404).json({ message: 'No logo found' });

    res.status(200).json({ message: 'Logo fetched', data: latestLogo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteLogo = async (req, res) => {
  try {
    const logo = await Logo.findByIdAndDelete(req.params.id);
    if (!logo) return res.status(404).json({ message: 'Logo not found' });

    res.status(200).json({ message: 'Logo deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Our Product Handlers ---
// exports.createProduct = async (req, res) => {
//   try {
//       const { text, image, url,title } = req.body;
//       if (!text || !image || !url || !title) {
//         return res.status(400).json({ message: 'All fields (text, image, url, title) are required' });
//       }
//        let imageUrl = '';
//       if (image) {
//         imageUrl = await uploadImageToCloud(image, 'ICO');
//       }
  
//       const product = await OurProduct.create({ text, imageUrl, url,title });
//       res.status(201).json({ message: 'Product created', data: product });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
// };

exports.createProduct = async (req, res) => {
  try {
    const { text, description, cards } = req.body;

    if (!text || !description || !Array.isArray(cards) || cards.length === 0) {
      return res.status(400).json({ message: 'Text, description, and at least one card are required' });
    }

    const processedCards = await Promise.all(
      cards.map(async (card) => {
        if (!card.image || !card.url || !card.title) {
          throw new Error('Each card must have image, url, and title');
        }

        const imageUrl = await uploadImageToCloud(card.image, 'ICO');
        return {
          image: imageUrl,
          url: card.url,
          title: card.title,
        };
      })
    );

    const product = await OurProduct.create({
      text,
      description,
      cards: processedCards,
    });

    res.status(201).json({ message: 'Product created', data: product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



exports.getAllProducts = async (req, res) => {
  try {
    const products = await OurProduct.find();
    res.status(200).json({ count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await OurProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ data: product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// exports.updateProduct = async (req, res) => {
//  try {
//      const { text, image, url,title } = req.body;
//       let imageUrl = '';
//      if (image) {
//        imageUrl = await uploadImageToCloud(image, 'ICO');
//      }
//      const updated = await OurProduct.findByIdAndUpdate(
//        req.params.id,
//        { text, imageUrl, url,title },
//        { new: true }
//      );
//      if (!updated) return res.status(404).json({ message: 'Product not found' });
 
//      res.status(200).json({ message: 'Product updated', data: updated });
//    } catch (err) {
//      res.status(500).json({ message: err.message });
//    }
// };


exports.updateProduct = async (req, res) => {
  try {
    const { text, description, cards } = req.body;

    if (!text || !description || !Array.isArray(cards) || cards.length === 0) {
      return res.status(400).json({ message: 'Text, description, and at least one card are required' });
    }

    // Process card images
    const processedCards = await Promise.all(
      cards.map(async (card) => {
        if (!card.image || !card.url || !card.title) {
          throw new Error('Each card must have image, url, and title');
        }

        const imageUrl = await uploadImageToCloud(card.image, 'ICO');
        return {
          image: imageUrl,
          url: card.url,
          title: card.title,
        };
      })
    );

    const updated = await OurProduct.findByIdAndUpdate(
      req.params.id,
      { text, description, cards: processedCards },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated', data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await OurProduct.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({
       message: 'Product deleted',
       ourproduct:deleted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Overview Handlers ---
exports.createOverview = async (req, res) => {
  try {
    const { text, topDescription, card } = req.body;

    if (!text || !topDescription || !Array.isArray(card) || card.length === 0) {
      return res.status(400).json({ message: 'Text, topDescription, and at least one card are required' });
    }

    const processedCards = await Promise.all(
      card.map(async (item) => {
        let imageUrl = '';
        if (item.image) {
          imageUrl = await uploadImageToCloud(item.image, 'ICO');
        }
        return {
          title: item.title,
          description: item.description,
          image: imageUrl,
        };
      })
    );

    const overview = await Overview.create({ text, topDescription, card: processedCards });

    res.status(201).json({ message: 'Overview created', data: overview });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




exports.getAllOverviews = async (req, res) => {
  try {
      const overviews = await Overview.find();
      res.status(200).json({ count: overviews.length, data: overviews });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

exports.getOverviewById = async (req, res) => {
   try {
    const overview = await Overview.findById(req.params.id);
    if (!overview) return res.status(404).json({ message: 'Overview not found' });

    res.status(200).json({ data: overview });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOverview = async (req, res) => {
  try {
    const { text, topDescription, card } = req.body;

    if (!text || !topDescription || !Array.isArray(card)) {
      return res.status(400).json({ message: 'Text, topDescription, and card are required' });
    }

    const processedCards = await Promise.all(
      card.map(async (item) => {
        let imageUrl = item.image;
        if (item.image && item.image.startsWith('data:image')) {
          imageUrl = await uploadImageToCloud(item.image, 'ICO');
        }
        return {
          title: item.title,
          description: item.description,
          image: imageUrl
        };
      })
    );

    const updateData = {
      text,
      topDescription,
      card: processedCards
    };

    const updated = await Overview.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Overview not found' });
    }

    res.status(200).json({ message: 'Overview updated', data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




exports.deleteOverview = async (req, res) => {
  try {
    const deleted = await Overview.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Overview not found' });

    res.status(200).json({ 
        message: 'Overview deleted',
        overview: deleted});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// === WHY CHOOSE US CONTROLLERS ===

exports.createWhyChooseUs = async (req, res) => {
  try {
    const { text,image } = req.body;
    if (!text || !image) return res.status(400).json({ message: 'Text is required' });
    let imageUrl = '';
     if (image) {
       imageUrl = await uploadImageToCloud(image, 'ICO');
     }
    const item = await WhyChooseUs.create({ text,imageUrl });
    res.status(201).json({ message: 'Created successfully', data: item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllWhyChooseUs = async (req, res) => {
  try {
    const items = await WhyChooseUs.find();
    res.status(200).json({ count: items.length, data: items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getWhyChooseUsById = async (req, res) => {
  try {
    const item = await WhyChooseUs.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ data: item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateWhyChooseUs = async (req, res) => {
  try {
    const updated = await WhyChooseUs.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ message: 'Updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteWhyChooseUs = async (req, res) => {
  try {
    const deleted = await WhyChooseUs.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// === ROADMAP CONTROLLERS ===

exports.createRoadMap = async (req, res) => {
  try {
    const { milestone, quarter, year, status,list } = req.body;
    if (!milestone || !quarter || !year || !list) {
      return res.status(400).json({ message: 'Milestone, quarter ,listand year are required' });
    }
    const roadmap = await RoadMap.create({ milestone, quarter, year, status,list });
    res.status(201).json({ message: 'Roadmap milestone created', data: roadmap });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllRoadMaps = async (req, res) => {
  try {
    const milestones = await RoadMap.find();
    res.status(200).json({ count: milestones.length, data: milestones });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRoadMapById = async (req, res) => {
  try {
    const milestone = await RoadMap.findById(req.params.id);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
    res.status(200).json({ data: milestone });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateRoadMap = async (req, res) => {
  try {
    const updated = await RoadMap.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Milestone not found' });
    res.status(200).json({ message: 'Milestone updated', data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteRoadMap = async (req, res) => {
  try {
    const deleted = await RoadMap.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Milestone not found' });
    res.status(200).json({ message: 'Milestone deleted', data: deleted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// === TOKEN CONTROLLERS ===

exports.createToken = async (req, res) => {
  try {
    const {
      name,
      ticker,
      chain,
      description,
      saleStart,
      saleEnd,
      tokensForSale,
      exchangeRate,
      minTransaction,
      acceptedCurrencies,
      logoImage,
      title,
      subtitle,
    } = req.body;
   
    let logoImageUrl = "";
    if (logoImage) {
      logoImageUrl = await uploadImageToCloud(logoImage, "token/logo");
    }
 console.log(req.body);
    const token = new Token({
      name,
      ticker,
      chain,
      description,
      saleStart,
      saleEnd,
      tokensForSale,
      exchangeRate,
      minTransaction,
      acceptedCurrencies,
      logoImage: logoImageUrl,
      title,
      subtitle,
    });

    await token.save();

    res.status(201).json({ message: "Token info created", data: token });
  } catch (err) {
    console.error("Token creation error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getAllTokens = async (req, res) => {
  try {
    const tokens = await Token.find().sort({ createdAt: -1 });;
    res.status(200).json({ count: tokens.length, data: tokens });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTokenById = async (req, res) => {
  try {
    const token = await Token.findById(req.params.id);
    if (!token) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ data: token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateToken = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.logoImage) {
      const logoImageUrl = await uploadImageToCloud(updates.logoImage, "token/logo");
      updates.logoImage = logoImageUrl;
    }

    const updatedToken = await Token.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedToken) {
      return res.status(404).json({ message: "Token not found" });
    }

    res.status(200).json({ message: "Token updated", data: updatedToken });
  } catch (err) {
    console.error("Token update error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteToken = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Token.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Token not found" });
    }

    res.status(200).json({ message: "Token deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};






exports.createTokenomics = async (req, res) => {
    try {
        const data = req.body;

        if (!data) {
            return res.status(400).json({ success: false, message: 'Expected an array of tokenomics entries.' });
        }

        const createdEntries = await TokenomicsModel.create(data);
        return res.status(201).json({ success: true, data: createdEntries, message: 'Tokenomics data saved.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.getTokenomics = async (req, res) => {
    try {
        const entries = await TokenomicsModel.find();
        return res.status(200).json({ success: true, data: entries });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// Update a tokenomics entry by ID
exports.updateTokenomics = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await TokenomicsModel.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updated) {
            return res.status(404).json({ success: false, message: "Tokenomics entry not found." });
        }

        res.status(200).json({ success: true, data: updated, message: "Tokenomics entry updated successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a tokenomics entry by ID
exports.deleteTokenomics = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await TokenomicsModel.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Tokenomics entry not found." });
        }

        res.status(200).json({ success: true, message: "Tokenomics entry deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};





// CREATE
exports.createTokenTracker = async (req, res) => {
    try {
        const tracker = await TokenTrackerModel.create(req.body);
        res.status(201).json({ success: true, data: tracker, message: 'Token Tracker created.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// READ (All or single by ID)
exports.getTokenTrackers = async (req, res) => {
  try {
    const tracker = await TokenTrackerModel.findOne().sort({ createdAt: -1 }); 

    if (!tracker) {
      return res.status(404).json({ success: false, message: 'No tracker found' });
    }

    res.status(200).json({ success: true, data: tracker });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



exports.getTokenTrackerById = async (req, res) => {
    try {
        const tracker = await TokenTrackerModel.findById(req.params.id);
        if (!tracker) return res.status(404).json({ success: false, message: 'Tracker not found.' });
        res.status(200).json({ success: true, data: tracker });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE
exports.updateTokenTracker = async (req, res) => {
    try {
        const tracker = await TokenTrackerModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!tracker) return res.status(404).json({ success: false, message: 'Tracker not found.' });
        res.status(200).json({ success: true, data: tracker, message: 'Token Tracker updated.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE
exports.deleteTokenTracker = async (req, res) => {
    try {
        const tracker = await TokenTrackerModel.findByIdAndDelete(req.params.id);
        if (!tracker) return res.status(404).json({ success: false, message: 'Tracker not found.' });
        res.status(200).json({ success: true, message: 'Token Tracker deleted.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};





// CREATE
exports.createMarketStats = async (req, res) => {
  try {
    const market = await MarketStatsModel.create(req.body);
    res.status(201).json({ success: true, data: market, message: "Market stats created." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// READ ALL
exports.getMarketStats = async (req, res) => {
  try {
    const stats = await MarketStatsModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// READ ONE
exports.getMarketStatsById = async (req, res) => {
  try {
    const stat = await MarketStatsModel.findById(req.params.id);
    if (!stat) return res.status(404).json({ success: false, message: "Stat not found." });
    res.status(200).json({ success: true, data: stat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE
exports.updateMarketStats = async (req, res) => {
  try {
    const stat = await MarketStatsModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!stat) return res.status(404).json({ success: false, message: "Stat not found." });
    res.status(200).json({ success: true, data: stat, message: "Market stats updated." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE
exports.deleteMarketStats = async (req, res) => {
  try {
    const stat = await MarketStatsModel.findByIdAndDelete(req.params.id);
    if (!stat) return res.status(404).json({ success: false, message: "Stat not found." });
    res.status(200).json({ success: true, message: "Market stats deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




exports.createEcosystem = async (req, res) => {
  try {
    const { title, description, cards } = req.body;

    if (!title || !description || !Array.isArray(cards)) {
      return res.status(400).json({ success: false, message: "Title, description, and cards are required." });
    }

    // Upload each card's base64 logo and replace it with the cloud URL
    const updatedCards = await Promise.all(cards.map(async (card) => {
      let logoUrl = '';
      if (card.logo) {
        logoUrl = await uploadImageToCloud(card.logo, 'ICO');
      }
      return {
        serialNumber: card.serialNumber,
        text: card.text,
        logo: logoUrl
      };
    }));

    const ecosystem = await EcosystemModel.create({
      title,
      description,
      cards: updatedCards
    });

    res.status(201).json({ success: true, data: ecosystem, message: "Ecosystem created successfully." });
  } catch (error) {
    console.error("Error creating ecosystem:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// READ ALL
exports.getAllEcosystems = async (req, res) => {
  try {
    const data = await EcosystemModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// READ ONE
exports.getEcosystemById = async (req, res) => {
  try {
    const ecosystem = await EcosystemModel.findById(req.params.id);
    if (!ecosystem) return res.status(404).json({ success: false, message: 'Ecosystem not found.' });
    res.status(200).json({ success: true, data: ecosystem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE
exports.updateEcosystem = async (req, res) => {
  try {
    const { title, description, cards } = req.body;

    if (!title || !description || !Array.isArray(cards)) {
      return res.status(400).json({ success: false, message: "Title, description, and cards are required." });
    }

    // Upload logos for cards if base64 is provided
    const updatedCards = await Promise.all(cards.map(async (card) => {
      let logoUrl = card.logo;

      // Check if it's a base64 string
      if (logoUrl && logoUrl.startsWith('data:image')) {
        logoUrl = await uploadImageToCloud(logoUrl, 'ICO');
      }

      return {
        serialNumber: card.serialNumber,
        text: card.text,
        logo: logoUrl
      };
    }));

    const updated = await EcosystemModel.findByIdAndUpdate(
      req.params.id,
      { title, description, cards: updatedCards },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Ecosystem not found.' });
    }

    res.status(200).json({ success: true, data: updated, message: "Ecosystem updated successfully." });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// DELETE
exports.deleteEcosystem = async (req, res) => {
  try {
    const deleted = await EcosystemModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Ecosystem not found.' });
    res.status(200).json({ success: true, message: "Ecosystem deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// Create
exports.createBitcoinStats = async (req, res) => {
  try {
    const { dailyLow, dailyHigh, weeklyLow, weeklyHigh } = req.body;

    if ([dailyLow, dailyHigh, weeklyLow, weeklyHigh].some(v => v == null)) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const stats = new BitcoinStats({ dailyLow, dailyHigh, weeklyLow, weeklyHigh });
    await stats.save();
    res.status(201).json({ message: 'Bitcoin stats created', data: stats });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get All
exports.getBitcoinStats = async (req, res) => {
  try {
    
    const stats = await BitcoinStats.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update
exports.updateBitcoinStats = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await BitcoinStats.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: 'Stats updated', data: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete
exports.deleteBitcoinStats = async (req, res) => {
  try {
    const { id } = req.params;
    await BitcoinStats.findByIdAndDelete(id);
    res.status(200).json({ message: 'Stats deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



// Create a new footer entry
exports.createFooterLink = async (req, res) => {
  try {
    const { platform, logo, url } = req.body;

    if (!platform || !logo || !url) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
   
      logoUrl = await uploadImageToCloud(logo, 'ICO');
    
    const footer = new Footer({ platform, logo:logoUrl, url });
    await footer.save();

    res.status(201).json({ success: true, message: "Footer link created", data: footer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all footer links
exports.getAllFooterLinks = async (req, res) => {
  try {
    const links = await Footer.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: links });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a footer link by ID
exports.updateFooterLink = async (req, res) => {
  try {
    const { platform, logo, url } = req.body;

     if (!platform || !logo || !url) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
   
    logoUrl = await uploadImageToCloud(logo, 'ICO');
    
    const updated = await Footer.findByIdAndUpdate(
      req.params.id,
      { platform, logo:logoUrl, url },
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: "Footer link not found" });

    res.status(200).json({ success: true, message: "Footer link updated", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a footer link
exports.deleteFooterLink = async (req, res) => {
  try {
    const deleted = await Footer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Footer link not found" });

    res.status(200).json({ success: true, message: "Footer link deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



//headers Content
exports.createHeaderContent = async (req, res) => {
  try {
    const {
      headerTitle,
      subTitle,
      description,
      sideLogoTitle,
      logoImage,
      sideLogo,
      staticImage,
      lightPaper,
      whitePaper,
      onePager,
      navLogo,
      auditReport,
      solidProof 
    } = req.body;

    let logoImageUrl = "";
    let sideLogoUrl = "";
    let staticImageUrl = "";
    let lightPaperUrl = "";
    let whitePaperUrl = "";
    let onePagerUrl = "";
    let navLogoUrl = "";
    let auditReportUrl = "";
    let solidProofUrl = ""; // ✅ New variable

    if (logoImage) {
      logoImageUrl = await uploadImageToCloud(logoImage, "landingHeader/logo", "logoImage");
    }

    if (sideLogo) {
      sideLogoUrl = await uploadImageToCloud(sideLogo, "landingHeader/sideLogo", "sideLogo");
    }

    if (staticImage) {
      staticImageUrl = await uploadImageToCloud(staticImage, "landingHeader/staticImage", "staticImage");
    }

    if (lightPaper) {
      lightPaperUrl = await uploadImageToCloud(lightPaper, "landingHeader/papers", "lightPaper");
    }

    if (whitePaper) {
      whitePaperUrl = await uploadImageToCloud(whitePaper, "landingHeader/papers", "whitePaper");
    }

    if (onePager) {
      onePagerUrl = await uploadImageToCloud(onePager, "landingHeader/papers", "onePager");
    }

    if (navLogo) {
      navLogoUrl = await uploadImageToCloud(navLogo, "landingHeader/navLogo", "navLogo");
    }

    if (auditReport) {
      auditReportUrl = auditReport.startsWith("http")
        ? auditReport
        : await uploadImageToCloud(auditReport, "landingHeader/papers", "auditReport");
    }

    if (solidProof) {
      solidProofUrl = solidProof.startsWith("http")
        ? solidProof
        : await uploadImageToCloud(solidProof, "landingHeader/papers", "solidProof");
    }

    const newHeader = new LandingHeader({
      headerTitle,
      subTitle,
      logoImage: logoImageUrl,
      description,
      sideLogo: sideLogoUrl,
      sideLogoTitle,
      staticImage: staticImageUrl,
      lightPaper: lightPaperUrl,
      whitePaper: whitePaperUrl,
      onePager: onePagerUrl,
      navLogo: navLogoUrl,
      auditReport: auditReportUrl,
      solidProof: solidProofUrl, // ✅ Save to DB
    });

    await newHeader.save();

    res.status(201).json({ success: true, data: newHeader });
  } catch (error) {
    console.error("Header creation error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};






exports.getLatestHeaderContent = async (req, res) => {
  try {
    const latestHeader = await LandingHeader.findOne().sort({ createdAt: -1 });

    if (!latestHeader) {
      return res.status(404).json({ success: false, message: "No header content found" });
    }

    res.status(200).json({ success: true, data: latestHeader });
  } catch (error) {
    console.error("Fetch latest header error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch latest header" });
  }
};

exports.updateHeaderContent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      headerTitle,
      subTitle,
      description,
      sideLogoTitle,
      logoImage,
      sideLogo,
      staticImage,
      lightPaper,
      whitePaper,
      onePager,
      navLogo,
      auditReport,
      solidProof
    } = req.body;

    const header = await LandingHeader.findById(id);
    if (!header) {
      return res.status(404).json({ success: false, message: "Header not found" });
    }

    if (logoImage) {
      header.logoImage = await uploadImageToCloud(logoImage, "landingHeader/logo", "logoImage");
    }

    if (sideLogo) {
      header.sideLogo = await uploadImageToCloud(sideLogo, "landingHeader/sideLogo", "sideLogo");
    }

    if (staticImage) {
      header.staticImage = await uploadImageToCloud(staticImage, "landingHeader/staticImage", "staticImage");
    }

    if (lightPaper) {
      header.lightPaper = await uploadImageToCloud(lightPaper, "landingHeader/papers", "lightPaper");
    }

    if (whitePaper) {
      header.whitePaper = await uploadImageToCloud(whitePaper, "landingHeader/papers", "whitePaper");
    }

    if (onePager) {
      header.onePager = await uploadImageToCloud(onePager, "landingHeader/papers", "onePager");
    }

    if (navLogo) {
      header.navLogo = await uploadImageToCloud(navLogo, "landingHeader/navLogo", "navLogo");
    }

    // ✅ Handle auditReport (ignore empty or missing)
    if (auditReport !== undefined && auditReport !== "") {
      header.auditReport = auditReport.startsWith("http")
        ? auditReport
        : await uploadImageToCloud(auditReport, "landingHeader/papers", "auditReport");
    }

    // ✅ Handle solidProof (ignore empty or missing)
    if (solidProof !== undefined && solidProof !== "") {
      header.solidProof = solidProof.startsWith("http")
        ? solidProof
        : await uploadImageToCloud(solidProof, "landingHeader/papers", "solidProof");
    }

    if (headerTitle !== undefined) header.headerTitle = headerTitle;
    if (subTitle !== undefined) header.subTitle = subTitle;
    if (description !== undefined) header.description = description;
    if (sideLogoTitle !== undefined) header.sideLogoTitle = sideLogoTitle;

    await header.save();

    res.status(200).json({ success: true, data: header });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};








exports.deleteHeaderContent = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await LandingHeader.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Header not found" });
    }

    res.status(200).json({ success: true, message: "Header deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Header Slider Content
exports.createSlider = async (req, res) => {
  try {
    const { images } = req.body; // array of base64 strings

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ success: false, message: "No images provided" });
    }

    const uploadedUrls = [];

    for (const base64 of images) {
      const url = await uploadImageToCloud(base64, "headerSlider");
      uploadedUrls.push(url);
    }

    const newSlider = new HeaderSlider({ images: uploadedUrls });
    await newSlider.save();

    res.status(201).json({ success: true, data: newSlider });
  } catch (error) {
    console.error("Create slider error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSlider = async (req, res) => {
  try {
    const { id } = req.params;
    const { images } = req.body; // new base64 image array

    const slider = await HeaderSlider.findById(id);
    if (!slider) {
      return res.status(404).json({ success: false, message: "Slider not found" });
    }

    const uploadedUrls = [];

    for (const base64 of images) {
      const url = await uploadImageToCloud(base64, "headerSlider");
      uploadedUrls.push(url);
    }

    slider.images = uploadedUrls;
    await slider.save();

    res.status(200).json({ success: true, data: slider });
  } catch (error) {
    console.error("Update slider error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteSlider = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await HeaderSlider.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Slider not found" });
    }

    res.status(200).json({ success: true, message: "Slider deleted successfully" });
  } catch (error) {
    console.error("Delete slider error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getAllSliders = async (req, res) => {
  try {
    const sliders = await HeaderSlider.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: sliders });
  } catch (error) {
    console.error("Get all sliders error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch sliders" });
  }
};


//Listed platforms
exports.createListedPlatform = async (req, res) => {
  try {
    const { platformName, platforms } = req.body;

    if (!platformName || !Array.isArray(platforms)) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    const uploadedPlatforms = [];

    for (const item of platforms) {
      const imageUrl = await uploadImageToCloud(item.image, "listedPlatforms");

      uploadedPlatforms.push({
        image: imageUrl,
        title: item.title,
        link: item.link, // ✅ Now including the link
      });
    }

    const newPlatform = new ListedPlatform({
      platformName,
      platforms: uploadedPlatforms,
    });

    await newPlatform.save();

    res.status(201).json({ success: true, data: newPlatform });
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllListedPlatforms = async (req, res) => {
  try {
    const data = await ListedPlatform.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch platforms" });
  }
};

exports.updateListedPlatform = async (req, res) => {
  try {
    const { id } = req.params;
    const { platformName, platforms } = req.body;

    const existing = await ListedPlatform.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Listed platform not found" });
    }

    if (platformName) {
      existing.platformName = platformName;
    }

    if (Array.isArray(platforms)) {
      const updatedPlatforms = [];

      for (const item of platforms) {
        const imageUrl = await uploadImageToCloud(item.image, "listedPlatforms");
        updatedPlatforms.push({
          image: imageUrl,
          title: item.title,
          link: item.link, 
        });
      }

      existing.platforms = updatedPlatforms;
    }

    await existing.save();

    res.status(200).json({ success: true, data: existing });
  } catch (error) {
    console.error("Update error:", error);
  res.status(500).json({ success: false, message: error.message });
  }
};



exports.deleteListedPlatform = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ListedPlatform.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//TOKEN DETAILS
exports.createTokenDetails = async (req, res) => {
  try {
    const {
      tokenName,
      symbol,
      decimals,
      address,
      network
    } = req.body;

    const token = await TokenDetails.create({
      tokenName,
      symbol,
      decimals,
      address,
      network
    });

    res.status(201).json({ success: true, message: "Token created", data: token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTokenDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      tokenName,
      symbol,
      decimals,
      address,
      network
    } = req.body;

    const updatedToken = await TokenDetails.findByIdAndUpdate(
      id,
      {
        tokenName,
        symbol,
        decimals,
        address,
        network
      },
      { new: true }
    );

    if (!updatedToken) {
      return res.status(404).json({ success: false, message: "Token not found" });
    }

    res.status(200).json({ success: true, message: "Token updated", data: updatedToken });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};






exports.deleteTokenDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedToken = await TokenDetails.findByIdAndDelete(id);

    if (!deletedToken) {
      return res.status(404).json({ success: false, message: "Token not found" });
    }

    res.status(200).json({ success: true, message: "Token deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getAllTokenDetails = async (req, res) => {
  try {
    const tokens = await TokenDetails.find();
    res.status(200).json({ success: true, data: tokens });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//Wallet Connect
exports.createConnectWallet = async (req, res) => {
  try {
    const { rightTitle, rightDescription, leftTitle, leftDescription } = req.body;

    const newWallet = new ConnectWallet({
      rightTitle,
      rightDescription,
      leftTitle, 
      leftDescription,
    });

    await newWallet.save();

    res.status(201).json({ success: true, message: "Wallet content created", data: newWallet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllConnectWallets = async (req, res) => {
  try {
    const wallets = await ConnectWallet.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: wallets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getConnectWalletById = async (req, res) => {
  try {
    const { id } = req.params;
    const wallet = await ConnectWallet.findById(id);

    if (!wallet) {
      return res.status(404).json({ success: false, message: "Wallet content not found" });
    }

    res.status(200).json({ success: true, data: wallet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.updateConnectWallet = async (req, res) => {
  try {
    const { id } = req.params;
    const { rightTitle, rightDescription, leftTitle, leftDescription } = req.body;

    const wallet = await ConnectWallet.findById(id);

    if (!wallet) {
      return res.status(404).json({ success: false, message: "Wallet content not found" });
    }

    wallet.rightTitle = rightTitle ?? wallet.rightTitle;
    wallet.rightDescription = rightDescription ?? wallet.rightDescription;
    wallet.leftTitle = leftTitle ?? wallet.leftTitle;
    wallet.leftDescription = leftDescription ?? wallet.leftDescription;

    await wallet.save();

    res.status(200).json({ success: true, message: "Wallet content updated", data: wallet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteConnectWallet = async (req, res) => {
  try {
    const { id } = req.params;

    const wallet = await ConnectWallet.findByIdAndDelete(id);

    if (!wallet) {
      return res.status(404).json({ success: false, message: "Wallet content not found" });
    }

    res.status(200).json({ success: true, message: "Wallet content deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.createNews = async (req, res) => {
  try {
    const { images } = req.body;

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ success: false, message: "Images are required" });
    }

    const uploadedImages = await Promise.all(images.map(async (img) => {
      let uploadedImageUrl = img.image;

      // Upload only if image is base64 data
      if (img.image && img.image.startsWith('data:image')) {
        uploadedImageUrl = await uploadImageToCloud(img.image, 'news');
      }

      return {
        image: uploadedImageUrl,  // uploaded URL or original string
        link: img.link || ''      // store link as-is
      };
    }));

    const news = await News.create({ images: uploadedImages });

    res.status(201).json({ success: true, news });
  } catch (err) {
    console.error("Create News Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};



// Get All News
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, news });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get News by ID
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ success: false, message: "News not found" });
    res.status(200).json({ success: true, news });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update News
exports.updateNews = async (req, res) => {
  try {
    const { images } = req.body;

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ success: false, message: "Images are required" });
    }

    const uploadedImages = await Promise.all(images.map(async (img) => {
      let finalImageUrl = img.image;

      if (img.image && img.image.startsWith('data:image')) {
        finalImageUrl = await uploadImageToCloud(img.image, 'news');
      }

      return {
        image: finalImageUrl || '',  
        link: img.link || ''         
      };
    }));

    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      { images: uploadedImages },
      { new: true }
    );

    if (!updatedNews) {
      return res.status(404).json({ success: false, message: "News not found" });
    }

    res.status(200).json({ success: true, news: updatedNews });
  } catch (err) {
    console.error("Update News Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};



// Delete News
exports.deleteNews = async (req, res) => {
  try {
    const deleted = await News.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "News not found" });
    res.status(200).json({ success: true, message: "News deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

async function processPdfField(pdfContent, folder, filename) {
  if (!pdfContent) return "";
  if (pdfContent.startsWith("http")) return pdfContent;
  return await uploadImageToCloud(pdfContent, folder, filename);
}

// CREATE
exports.createTermAndCondition = async (req, res) => {
  try {
    const { termCondition } = req.body;

    if (!Array.isArray(termCondition) || termCondition.length === 0) {
      return res.status(400).json({ success: false, message: "termCondition must be a non-empty array" });
    }

    const newTerm = new TermAndCondition({ termCondition });
    const savedTerm = await newTerm.save();

    res.status(201).json({ success: true, data: savedTerm });
  } catch (error) {
    console.error("Create TermAndCondition error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// READ ALL
exports.getAllTermsAndConditions = async (req, res) => {
  try {
    const terms = await TermAndCondition.find().sort({ updatedAt: -1 });
    res.status(200).json({ success: true, data: terms });
  } catch (error) {
    console.error("Get all terms error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// READ ONE by ID
exports.getTermAndConditionById = async (req, res) => {
  try {
    const { id } = req.params;
    const term = await TermAndCondition.findById(id);

    if (!term) {
      return res.status(404).json({ success: false, message: "Term not found" });
    }

    res.status(200).json({ success: true, data: term });
  } catch (error) {
    console.error("Get term by ID error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE by ID
exports.updateTermAndCondition = async (req, res) => {
  try {
    const { id } = req.params;
    const { termCondition } = req.body;

    if (!Array.isArray(termCondition) || termCondition.length === 0) {
      return res.status(400).json({ success: false, message: "termCondition must be a non-empty array" });
    }

    const updated = await TermAndCondition.findByIdAndUpdate(
      id,
      { termCondition },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Term not found" });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("Update term error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE by ID
exports.deleteTermAndCondition = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TermAndCondition.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Term not found" });
    }

    res.status(200).json({ success: true, message: "Term deleted successfully" });
  } catch (error) {
    console.error("Delete term error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// CREATE
exports.createPrivacyPolicy = async (req, res) => {
  try {
    const { privacyPolicy } = req.body;

    if (!Array.isArray(privacyPolicy) || privacyPolicy.length === 0) {
      return res.status(400).json({ success: false, message: "privacyPolicy must be a non-empty array" });
    }

    const newPolicy = new PrivacyPolicy({ privacyPolicy });
    const savedPolicy = await newPolicy.save();

    res.status(201).json({ success: true, data: savedPolicy });
  } catch (error) {
    console.error("Create PrivacyPolicy error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// READ ALL
exports.getAllPrivacyPolicies = async (req, res) => {
  try {
    const policies = await PrivacyPolicy.find().sort({ updatedAt: -1 });
    res.status(200).json({ success: true, data: policies });
  } catch (error) {
    console.error("Get all privacy policies error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// READ ONE by ID
exports.getPrivacyPolicyById = async (req, res) => {
  try {
    const { id } = req.params;
    const policy = await PrivacyPolicy.findById(id);

    if (!policy) {
      return res.status(404).json({ success: false, message: "Privacy policy not found" });
    }

    res.status(200).json({ success: true, data: policy });
  } catch (error) {
    console.error("Get privacy policy by ID error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE by ID
exports.updatePrivacyPolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { privacyPolicy } = req.body;

    if (!Array.isArray(privacyPolicy) || privacyPolicy.length === 0) {
      return res.status(400).json({ success: false, message: "privacyPolicy must be a non-empty array" });
    }

    const updated = await PrivacyPolicy.findByIdAndUpdate(
      id,
      { privacyPolicy },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Privacy policy not found" });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("Update privacy policy error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE by ID
exports.deletePrivacyPolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PrivacyPolicy.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Privacy policy not found" });
    }

    res.status(200).json({ success: true, message: "Privacy policy deleted successfully" });
  } catch (error) {
    console.error("Delete privacy policy error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.createCookiePolicy = async (req, res) => {
  try {
    const { cookiePolicy } = req.body;

    if (!Array.isArray(cookiePolicy) || cookiePolicy.length === 0) {
      return res.status(400).json({ success: false, message: "cookiePolicy must be a non-empty array" });
    }

    const newPolicy = new CookiePolicy({ cookiePolicy });
    const savedPolicy = await newPolicy.save();

    res.status(201).json({ success: true, data: savedPolicy });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAllCookiePolicies = async (req, res) => {
  try {
    const policies = await CookiePolicy.find().sort({ updatedAt: -1 });
    res.status(200).json({ success: true, data: policies });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getCookiePolicyById = async (req, res) => {
  try {
    const { id } = req.params;
    const policy = await CookiePolicy.findById(id);

    if (!policy) {
      return res.status(404).json({ success: false, message: "Cookie policy not found" });
    }

    res.status(200).json({ success: true, data: policy });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateCookiePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { cookiePolicy } = req.body;

    if (!Array.isArray(cookiePolicy) || cookiePolicy.length === 0) {
      return res.status(400).json({ success: false, message: "cookiePolicy must be a non-empty array" });
    }

    const updated = await CookiePolicy.findByIdAndUpdate(
      id,
      { cookiePolicy },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Cookie policy not found" });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteCookiePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CookiePolicy.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Cookie policy not found" });
    }

    res.status(200).json({ success: true, message: "Cookie policy deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


//Blog Section 
exports.createBlog = async (req, res) => {
  try {
    const { title, description, image, textArea } = req.body;

    let imageUrl = image;

    // If image is base64, upload it to cloud
    if (image && image.startsWith('data:image/')) {
      imageUrl = await uploadImageToCloud(image, 'Blogs');
    }

    const newBlog = await Blog.create({
      title,
      description,
      image: imageUrl,
      textArea,
    });

    res.status(201).json({ success: true, message: 'Blog created successfully', data: newBlog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create blog', error: error.message });
  }
};

// Get All Blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch blogs', error: error.message });
  }
};

// Get Blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch blog', error: error.message });
  }
};

// Update Blog
// Update Blog
exports.updateBlog = async (req, res) => {
  try {
    const { title, description, image, textArea } = req.body;

    let imageUrl = image;

    if (image && image.startsWith('data:image/')) {
      imageUrl = await uploadImageToCloud(image, 'Blogs');
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, description, image: imageUrl, textArea },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    res.status(200).json({ success: true, message: 'Blog updated successfully', data: updatedBlog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update blog', error: error.message });
  }
};


// Delete Blog
exports.deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);

    if (!deletedBlog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    res.status(200).json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete blog', error: error.message });
  }
};

exports.createCopyWrite = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newCopyWrite = await CopyWrite.create({ title, description });
    res.status(201).json({ success: true, message: "CopyWrite created", data: newCopyWrite });
  } catch (error) {
    res.status(500).json({ success: false, message: "Creation failed", error: error.message });
  }
};

// Get All CopyWrites
exports.getAllCopyWrites = async (req, res) => {
  try {
    const all = await CopyWrite.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: all });
  } catch (error) {
    res.status(500).json({ success: false, message: "Fetch failed", error: error.message });
  }
};

// Get Single CopyWrite
exports.getCopyWriteById = async (req, res) => {
  try {
    const copyWrite = await CopyWrite.findById(req.params.id);
    if (!copyWrite) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: copyWrite });
  } catch (error) {
    res.status(500).json({ success: false, message: "Fetch failed", error: error.message });
  }
};

// Update CopyWrite
exports.updateCopyWrite = async (req, res) => {
  try {
    const { title, description } = req.body;
    const updated = await CopyWrite.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, message: "Updated successfully", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update failed", error: error.message });
  }
};

// Delete CopyWrite
exports.deleteCopyWrite = async (req, res) => {
  try {
    const deleted = await CopyWrite.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed", error: error.message });
  }
};

// Create Footer Description
exports.createDescription = async (req, res) => {
  try {
    const { description } = req.body;
    const newDescription = new FooterDescription({ description });
    await newDescription.save();
    res.status(201).json({ success: true, data: newDescription });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get All Footer Descriptions
exports.getAllDescriptions = async (req, res) => {
  try {
    const descriptions = await FooterDescription.find();
    res.status(200).json({ success: true, data: descriptions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Single Footer Description by ID
exports.getDescriptionById = async (req, res) => {
  try {
    const description = await FooterDescription.findById(req.params.id);
    if (!description) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.status(200).json({ success: true, data: description });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Footer Description
exports.updateDescription = async (req, res) => {
  try {
    const updated = await FooterDescription.findByIdAndUpdate(
      req.params.id,
      { description: req.body.description },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Footer Description
exports.deleteDescription = async (req, res) => {
  try {
    const deleted = await FooterDescription.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Create contact message
exports.createContact = async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;

    const newContact = new Contact({ fullName, email, phone, subject, message });
    await newContact.save();

    res.status(201).json({ success: true, data: newContact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all contact messages
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
