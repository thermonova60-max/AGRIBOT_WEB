/**
 * Agri-Bot - Enhanced Chatbot JavaScript
 * Powered by Google Gemini AI with agricultural knowledge base
 */

class AgriChatbot {
  constructor() {
    this.messagesContainer = document.getElementById('chatMessages');
    this.inputField = document.getElementById('chatInput');
    this.sendButton = document.getElementById('chatSend');
    this.suggestionsContainer = document.querySelector('.chat-suggestions');
    this.faqData = [];
    this.conversationContext = [];
    this.userName = localStorage.getItem('agribot_user') || '';
    
    // Gemini API Configuration
    this.GEMINI_API_KEY = 'AIzaSyD0KipHg9M5zeO6-jTnEq8vIpbp6lbW2EM';
    this.GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    
    this.init();
  }
  
  async init() {
    await this.loadFAQ();
    this.bindEvents();
    this.showWelcomeMessage();
  }
  
  async loadFAQ() {
    try {
      const response = await fetch('data/faq.json');
      if (response.ok) {
        this.faqData = await response.json();
      }
    } catch (e) {
      console.log('Using default FAQ data');
      this.faqData = this.getDefaultFAQ();
    }
    // Merge with extended knowledge
    this.faqData = [...this.faqData, ...this.getExtendedKnowledge()];
  }
  
  getDefaultFAQ() {
    return [
      {
        keywords: ['hello', 'hi', 'hey', 'namaste', 'good morning', 'good evening', 'hola'],
        response: "Hello! 🌾 Welcome to Agri-Bot, your intelligent farming companion. I'm here to help you with:\n\n• 🌱 Crop selection & cultivation\n• 💧 Irrigation & water management\n• 🐛 Pest & disease control\n• 🌿 Organic farming techniques\n• 🏛️ Government schemes & subsidies\n• 📊 Market prices & selling tips\n\nWhat would you like to explore today?"
      },
      {
        keywords: ['how are you', 'how do you do', 'whats up'],
        response: "I'm doing great, thank you for asking! 🌟 I'm always ready to help farmers succeed. How can I assist you with your agricultural needs today?"
      }
    ];
  }
  
  getExtendedKnowledge() {
    return [
      // CROP CULTIVATION
      {
        keywords: ['crop', 'grow', 'plant', 'farming', 'cultivation', 'agriculture'],
        response: "🌱 **Crop Cultivation Guide**\n\nChoosing the right crop is crucial! Here's what to consider:\n\n**Seasonal Crops in India:**\n• 🌧️ Kharif (Jun-Oct): Rice, Maize, Cotton, Soybean, Groundnut\n• ❄️ Rabi (Oct-Mar): Wheat, Mustard, Chickpea, Potato, Barley\n• ☀️ Zaid (Mar-Jun): Watermelon, Cucumber, Muskmelon\n\n**Key Factors:**\n• Soil type and pH level\n• Water availability\n• Climate conditions\n• Market demand\n• Investment capacity\n\nWould you like specific guidance on any crop?"
      },
      {
        keywords: ['rice', 'paddy', 'dhan', 'chawal'],
        response: "🍚 **Complete Rice/Paddy Farming Guide**\n\n**Best Season:** Kharif (June-July sowing)\n\n**Varieties:**\n• Basmati (Premium, aromatic)\n• IR-64 (High yield)\n• Pusa-1121 (Export quality)\n• Swarna (Disease resistant)\n\n**Cultivation Steps:**\n1. Nursery preparation (20-25 days)\n2. Main field preparation with puddling\n3. Transplanting at 2-3 seedlings/hill\n4. Maintain 5cm water initially\n5. Apply fertilizers in splits\n\n**Water Management:**\n• SRI method saves 40% water\n• Alternate wetting-drying technique\n\n**Yield Potential:** 50-70 quintals/hectare\n\nNeed tips on rice pest management?"
      },
      {
        keywords: ['wheat', 'gehu', 'gehun'],
        response: "🌾 **Complete Wheat Farming Guide**\n\n**Best Season:** Rabi (October-November sowing)\n\n**Popular Varieties:**\n• HD-2967 (Most popular)\n• PBW-550 (High yield)\n• Lokwan (For chapati)\n• Sharbati (Premium quality)\n\n**Soil Requirements:**\n• Well-drained loamy soil\n• pH: 6.0-7.5\n• Good organic matter\n\n**Irrigation Schedule:**\n• Crown root initiation (20-25 days)\n• Tillering (40-45 days)\n• Jointing (60-65 days)\n• Flowering (80-85 days)\n• Milking (100-105 days)\n\n**Yield Potential:** 45-55 quintals/hectare\n\nWant to know about wheat diseases?"
      },
      {
        keywords: ['tomato', 'tamatar'],
        response: "🍅 **Tomato Cultivation Guide**\n\n**Seasons:** Year-round in polyhouse, Rabi in open field\n\n**Varieties:**\n• Pusa Ruby (High yield)\n• Arka Vikas (Disease tolerant)\n• Cherry tomatoes (High value)\n• Hybrid varieties (F1)\n\n**Spacing:** 60cm × 45cm\n\n**Key Practices:**\n• Raised bed cultivation\n• Staking for support\n• Pinching for better fruiting\n• Drip irrigation recommended\n\n**Common Issues:**\n• Leaf curl virus - Use resistant varieties\n• Fruit borer - Pheromone traps help\n• Blossom end rot - Calcium spray\n\n**Yield:** 400-600 quintals/hectare\n\nNeed more details on any aspect?"
      },
      {
        keywords: ['potato', 'aloo', 'aaloo'],
        response: "🥔 **Potato Farming Guide**\n\n**Best Season:** Rabi (October planting)\n\n**Varieties:**\n• Kufri Jyoti (Popular)\n• Kufri Pukhraj (Early maturing)\n• Kufri Chipsona (For processing)\n• Kufri Badshah (Late blight tolerant)\n\n**Seed Rate:** 25-30 quintals/hectare\n\n**Key Points:**\n• Use certified, disease-free seeds\n• Cut seed pieces should have 2-3 eyes\n• Planting depth: 5-7 cm\n• Ridge planting preferred\n\n**Fertilizer (NPK):** 150:60:100 kg/ha\n\n**Harvest:** 75-120 days (variety dependent)\n\n**Yield:** 200-300 quintals/hectare\n\nAsk about potato storage tips!"
      },
      {
        keywords: ['onion', 'pyaaz', 'pyaj'],
        response: "🧅 **Onion Farming Guide**\n\n**Seasons:**\n• Kharif: May-June transplanting\n• Late Kharif: Aug-Sep\n• Rabi: Dec-Jan (Best quality)\n\n**Varieties:**\n• Nasik Red (Storage quality)\n• Pusa Ridhi (High yield)\n• Arka Kalyan (Kharif suitable)\n• White onion (Export)\n\n**Nursery Period:** 6-8 weeks\n**Transplanting:** 15cm × 10cm spacing\n\n**Critical Points:**\n• Stop irrigation 10 days before harvest\n• Cure bulbs for 3-4 days after harvest\n• Store in well-ventilated structures\n\n**Yield:** 250-350 quintals/hectare\n\nWant tips on onion storage?"
      },
      {
        keywords: ['cotton', 'kapas', 'narma'],
        response: "🧶 **Cotton Cultivation Guide**\n\n**Best Season:** Kharif (June-July sowing)\n\n**Varieties:**\n• Bt Cotton hybrids (Bollworm resistant)\n• Desi cotton (Traditional)\n• Long staple varieties (Suvin, DCH)\n\n**Spacing:** 90cm × 60cm or 120cm × 60cm\n\n**Key Management:**\n• Seed treatment before sowing\n• Maintain proper plant population\n• Refuge crop (non-Bt) mandatory\n• INM + IPM approach\n\n**Picking Schedule:**\n• 3-4 pickings at 15-day intervals\n• Pick in dry conditions\n\n**Yield:** 15-25 quintals/hectare\n\nNeed info on cotton pest management?"
      },
      {
        keywords: ['sugarcane', 'ganna', 'oos'],
        response: "🎋 **Sugarcane Cultivation Guide**\n\n**Planting Seasons:**\n• Autumn (Oct-Nov): Best yields\n• Spring (Feb-Mar): Common practice\n\n**Varieties:**\n• CoJ-64 (Early maturing)\n• Co-238 (High sugar)\n• CoS-767 (Disease resistant)\n\n**Seed Rate:** 40,000 three-budded setts/ha\n\n**Critical Practices:**\n• Trench planting method\n• Hot water treatment of setts\n• Earthing up at 90-120 days\n• Trash mulching\n\n**Irrigation:** 6-8 irrigations needed\n\n**Duration:** 10-12 months\n**Yield:** 800-1000 quintals/hectare\n\nWant information on ratoon management?"
      },
      
      // VEGETABLES
      {
        keywords: ['vegetable', 'sabji', 'sabzi', 'vegetables'],
        response: "🥬 **Vegetable Farming Guide**\n\n**High-Value Vegetables:**\n• 🥒 Cucumber - Quick returns (45-50 days)\n• 🌶️ Chilli - Year-round demand\n• 🥬 Cabbage - Good storage life\n• 🥕 Carrot - Winter specialty\n• 🍆 Brinjal - Multiple harvests\n\n**Protected Cultivation Options:**\n• Polyhouse - Premium vegetables\n• Net house - Pest-free produce\n• Shade net - Summer cultivation\n\n**Success Tips:**\n• Plan based on market demand\n• Maintain crop calendar\n• Use raised beds\n• Drip irrigation = 30% water saving\n• Regular pest scouting\n\nWhich vegetable interests you?"
      },
      {
        keywords: ['chilli', 'mirchi', 'chili', 'pepper'],
        response: "🌶️ **Chilli Cultivation Guide**\n\n**Varieties:**\n• Byadgi (Dry chilli, high color)\n• Guntur (Pungent, export quality)\n• Pusa Jwala (Fresh market)\n• Bird's eye (High capsaicin)\n\n**Nursery:** 40-50 days\n**Spacing:** 60cm × 45cm\n\n**Key Points:**\n• Well-drained soil essential\n• Avoid waterlogging\n• Pinch terminal bud for bushy growth\n• Harvest at color break stage\n\n**Major Pests:**\n• Thrips - Blue sticky traps\n• Mites - Wettable sulphur spray\n• Fruit borer - Pheromone traps\n\n**Yield:** 80-120 quintals fresh/hectare"
      },
      
      // IRRIGATION
      {
        keywords: ['water', 'irrigation', 'drip', 'sprinkler', 'watering', 'sinchai'],
        response: "💧 **Smart Irrigation Guide**\n\n**Irrigation Methods:**\n\n**1. Drip Irrigation (90% efficient)**\n• Best for: Vegetables, orchards, flowers\n• Water saving: 40-60%\n• Subsidy available: Up to 90%\n\n**2. Sprinkler System (75% efficient)**\n• Best for: Field crops, large areas\n• Types: Portable, permanent, pivot\n\n**3. Micro-Sprinkler (80% efficient)**\n• Best for: Orchards, nurseries\n\n**Water Conservation Tips:**\n• Mulching reduces evaporation by 25%\n• Water early morning/evening\n• Rainwater harvesting\n• Soil moisture sensors\n• Deficit irrigation for some crops\n\n**Government Subsidy:** PMKSY scheme offers support!\n\nNeed help choosing a system?"
      },
      {
        keywords: ['rainwater', 'rain water', 'water harvesting'],
        response: "🌧️ **Rainwater Harvesting Guide**\n\n**On-Farm Techniques:**\n\n**1. Farm Ponds**\n• Size: Based on runoff & area\n• Lining options: Silpaulin, clay, cement\n• Subsidy: Up to 50% under PMKSY\n\n**2. Percolation Tanks**\n• Recharge groundwater\n• Reduces runoff\n\n**3. Check Dams**\n• Community level implementation\n• Increases water table\n\n**4. Roof Water Collection**\n• For homestead gardens\n• First flush diverter essential\n\n**Benefits:**\n• Supplemental irrigation during dry spells\n• Reduces dependency on groundwater\n• Fish culture possible in ponds\n\nWant details on farm pond construction?"
      },
      
      // FERTILIZERS & SOIL
      {
        keywords: ['fertilizer', 'fertiliser', 'nutrient', 'urea', 'dap', 'npk', 'khad'],
        response: "🌿 **Fertilizer & Nutrient Management**\n\n**Understanding NPK:**\n• N (Nitrogen): Leaf growth, green color\n• P (Phosphorus): Root development, flowering\n• K (Potassium): Fruit quality, disease resistance\n\n**Common Fertilizers:**\n• Urea (46% N)\n• DAP (18-46-0)\n• MOP (60% K)\n• NPK complexes (Various grades)\n\n**Application Tips:**\n• Always based on soil test!\n• Split application better than single dose\n• Apply when soil is moist\n• Don't mix with seeds\n\n**Organic Alternatives:**\n• FYM: 10-15 tonnes/hectare\n• Vermicompost: 2-3 tonnes/hectare\n• Neem cake: Pest repellent + nutrient\n\n**Nano Fertilizers:** New tech - 50ml replaces 50kg urea!\n\nWant soil testing information?"
      },
      {
        keywords: ['soil', 'mitti', 'land', 'earth'],
        response: "🌍 **Soil Health Management**\n\n**Soil Testing is Key!**\n• Test every 2-3 years\n• Cost: ₹50-100 per sample\n• Available at KVKs, Soil Testing Labs\n\n**Ideal Soil Parameters:**\n• pH: 6.0-7.5 for most crops\n• EC: < 1.0 dS/m\n• Organic Carbon: > 0.5%\n\n**Soil Health Card Scheme:**\n• Free testing under government scheme\n• Crop-wise recommendations\n• Apply at nearest agriculture office\n\n**Improving Soil Health:**\n• Add organic matter regularly\n• Practice crop rotation\n• Green manuring (Dhaincha, Sunhemp)\n• Avoid burning crop residues\n• Reduce tillage when possible\n\n**Problem Soils:**\n• Acidic: Add lime\n• Alkaline: Add gypsum\n• Saline: Improve drainage\n\nNeed specific soil improvement tips?"
      },
      {
        keywords: ['organic', 'jaivik', 'natural farming', 'zero budget'],
        response: "🌿 **Organic & Natural Farming**\n\n**Key Principles:**\n• No synthetic chemicals\n• Soil health focus\n• Biodiversity promotion\n• Sustainable practices\n\n**Organic Inputs:**\n• Jeevamrit (Fermented cow dung culture)\n• Beejamrit (Seed treatment)\n• Panchagavya (Growth promoter)\n• Vermicompost (Nutrient rich)\n\n**Zero Budget Natural Farming (ZBNF):**\n• Pioneered by Subhash Palekar\n• Uses only on-farm inputs\n• Desi cow based preparations\n\n**Certification:**\n• PGS (Participatory Guarantee System) - Group certification\n• Third party - For export markets\n• Conversion period: 2-3 years\n\n**Premium:** 20-50% higher prices\n\n**Government Support:**\n• Paramparagat Krishi Vikas Yojana\n• ₹50,000/hectare over 3 years\n\nWant to learn preparation methods?"
      },
      {
        keywords: ['compost', 'vermicompost', 'khaad', 'manure'],
        response: "♻️ **Composting & Manure Guide**\n\n**Vermicomposting:**\n• Worms: Eisenia fetida (Red wiggler)\n• Setup: Shaded area, moisture 60-70%\n• Inputs: Cow dung + crop residues\n• Duration: 45-60 days\n• Yield: 60% of input material\n\n**Pit Composting:**\n• Size: 3m × 1.5m × 1m\n• Layer: Residues + cow dung + soil\n• Turn every 15 days\n• Ready in 3-4 months\n\n**Enriched FYM:**\n• Add rock phosphate: 10kg/tonne\n• Add Trichoderma: 2kg/tonne\n• Greatly improves nutrient content\n\n**Application Rates:**\n• FYM: 10-15 tonnes/ha\n• Vermicompost: 2-3 tonnes/ha\n\n**Benefits:**\n• Improves soil structure\n• Increases water retention\n• Slow nutrient release\n\nNeed vermicompost bed setup details?"
      },
      
      // PEST & DISEASE MANAGEMENT
      {
        keywords: ['pest', 'insect', 'keeda', 'keet', 'bug'],
        response: "🐛 **Integrated Pest Management (IPM)**\n\n**Prevention First:**\n• Use resistant varieties\n• Proper crop rotation\n• Field sanitation\n• Seed treatment\n\n**Monitoring:**\n• Yellow sticky traps (Whiteflies, aphids)\n• Blue sticky traps (Thrips)\n• Pheromone traps (Specific pests)\n• Regular field scouting\n\n**Biological Control:**\n• Trichogramma cards (Egg parasitoid)\n• Chrysoperla (Predator)\n• Ladybird beetles (Aphid predator)\n• NPV (Virus for caterpillars)\n\n**Organic Pesticides:**\n• Neem oil 2-3ml/L\n• Beauveria bassiana\n• Bacillus thuringiensis (Bt)\n\n**Chemical (Last Resort):**\n• Follow ETL (Economic Threshold Level)\n• Rotate chemical groups\n• Observe waiting period\n\nDescribe your pest problem for specific advice!"
      },
      {
        keywords: ['disease', 'bimari', 'rog', 'fungus', 'virus', 'bacteria'],
        response: "🦠 **Crop Disease Management**\n\n**Common Diseases:**\n\n**Fungal:**\n• Powdery mildew - Wettable sulphur\n• Downy mildew - Metalaxyl + Mancozeb\n• Leaf spots - Carbendazim\n• Rusts - Propiconazole\n\n**Bacterial:**\n• Wilt - Soil treatment, resistant varieties\n• Leaf blight - Copper fungicides\n• Soft rot - Avoid waterlogging\n\n**Viral:**\n• Leaf curl - Control vectors (whiteflies)\n• Mosaic - Remove infected plants\n• Yellow vein - Use virus-free seeds\n\n**Prevention:**\n• Seed treatment with fungicide\n• Crop rotation (3-year cycle)\n• Proper drainage\n• Balanced nutrition\n• Hot water seed treatment (for some)\n\n**Bio-control:**\n• Trichoderma viride\n• Pseudomonas fluorescens\n\nDescribe symptoms for specific diagnosis!"
      },
      {
        keywords: ['weed', 'kharpatwar', 'ghaas', 'weedicide'],
        response: "🌿 **Weed Management Guide**\n\n**Weed Types:**\n• Grasses (Monocots)\n• Broadleaf (Dicots)\n• Sedges (Triangular stem)\n\n**Control Methods:**\n\n**Cultural:**\n• Timely sowing at proper density\n• Competitive crop varieties\n• Mulching (Straw, plastic)\n• Intercropping\n\n**Mechanical:**\n• Hand weeding\n• Hoeing\n• Wheel hoe/Cono weeder\n• Power weeder\n\n**Chemical:**\n• Pre-emergence: Apply before weeds emerge\n• Post-emergence: After weed emergence\n• Follow label recommendations\n• Safety gear essential\n\n**Herbicide Examples:**\n• Rice: Pretilachlor, Bispyribac sodium\n• Wheat: 2,4-D, Sulfosulfuron\n• Soybean: Imazethapyr\n\n**Organic Options:**\n• Thick mulch\n• Cover crops\n• Solarization\n\nNeed weed-specific recommendations?"
      },
      
      // GOVERNMENT SCHEMES
      {
        keywords: ['government', 'scheme', 'subsidy', 'yojana', 'sarkari'],
        response: "🏛️ **Government Schemes for Farmers**\n\n**Income Support:**\n• **PM-KISAN:** ₹6000/year direct benefit\n• **PM Fasal Bima Yojana:** Crop insurance\n\n**Credit:**\n• **Kisan Credit Card:** Low interest loans\n• **Interest Subvention:** 3% rebate on timely payment\n\n**Infrastructure:**\n• **PMKSY:** Irrigation support, micro-irrigation\n• **SMAM:** Farm mechanization\n• **MIDH:** Horticulture development\n\n**Organic Farming:**\n• **PKVY:** ₹50,000/ha for 3 years\n\n**Marketing:**\n• **e-NAM:** Online trading platform\n• **Gramin Bhandaran:** Storage support\n\n**How to Apply:**\n• Visit nearest Agriculture Office\n• Common Service Centers (CSCs)\n• Kisan Call Center: 1800-180-1551\n• KVK (Krishi Vigyan Kendra)\n\nWhich scheme interests you?"
      },
      {
        keywords: ['pm kisan', 'pmkisan', 'kisan samman', 'kisan nidhi'],
        response: "💰 **PM-KISAN Scheme Details**\n\n**Benefit:** ₹6000 per year in 3 installments of ₹2000\n\n**Eligibility:**\n• All landholding farmer families\n• Land records in farmer's name\n\n**Exclusions:**\n• Institutional landholders\n• Government employees\n• Income tax payers\n• Pensioners (₹10,000+/month)\n\n**Documents Required:**\n• Aadhaar card\n• Land records\n• Bank account details\n• Mobile number\n\n**Registration:**\n1. Visit pmkisan.gov.in\n2. Or visit CSC/Agriculture Office\n3. Verify through e-KYC\n\n**Check Status:**\n• Beneficiary Status on website\n• Helpline: 155261 or 011-24300606\n\n**Current Status:** 14+ installments released\n\nNeed help with registration?"
      },
      {
        keywords: ['loan', 'kcc', 'credit', 'kisan credit', 'bank'],
        response: "🏦 **Kisan Credit Card (KCC) Guide**\n\n**Benefits:**\n• Interest rate: 7% (4% with subvention)\n• Flexible withdrawal\n• Crop + personal insurance\n• No collateral up to ₹1.6 lakh\n\n**Loan Limits:**\n• Based on land holding & crop\n• Typically ₹3 lakh maximum\n• Higher for allied activities\n\n**Documents:**\n• Land records\n• Identity proof\n• Address proof\n• Passport size photos\n• Bank statement (if existing account)\n\n**Process:**\n1. Apply at any bank branch\n2. Or use PM-KISAN portal\n3. Processing: 2-4 weeks\n\n**Repayment:**\n• Flexible within 12 months\n• Renewal possible annually\n\n**Extended KCC:**\n• Animal husbandry\n• Fisheries\n• Dairy farming\n\nNeed help applying?"
      },
      {
        keywords: ['insurance', 'fasal bima', 'crop insurance', 'pmfby'],
        response: "🛡️ **PM Fasal Bima Yojana**\n\n**Premium Rates:**\n• Kharif: 2% of sum insured\n• Rabi: 1.5% of sum insured\n• Horticulture: 5%\n\n**Coverage:**\n• Prevented sowing\n• Mid-season adversity\n• Post-harvest losses (14 days)\n• Localized calamities\n\n**Covered Risks:**\n• Drought, flood, hailstorm\n• Pest & disease\n• Unseasonal rainfall\n• Fire, lightning\n\n**Claim Process:**\n1. Report loss within 72 hours\n2. Helpline: 1800-180-1111\n3. Or via Crop Insurance app\n4. Survey by insurance company\n5. Claim settlement: 2-4 months\n\n**Tips:**\n• Insure before cutoff date\n• Keep all receipts\n• Document damage with photos\n• Co-operate with survey team\n\nHave questions about claims?"
      },
      
      // MARKET & PRICES
      {
        keywords: ['market', 'price', 'sell', 'mandi', 'bazaar', 'rate'],
        response: "📊 **Agricultural Marketing Guide**\n\n**Market Options:**\n\n**1. APMC Mandi**\n• Regulated prices\n• Auction system\n• Market fee applicable\n\n**2. e-NAM (Online)**\n• Pan-India trading\n• Better price discovery\n• 1000+ mandis connected\n• Website: enam.gov.in\n\n**3. Direct Marketing**\n• FPOs (Farmer Producer Orgs)\n• Contract farming\n• Supermarket chains\n• Export\n\n**4. Farm Gate Sales**\n• Local consumers\n• No transport cost\n\n**Price Information:**\n• Agmarknet.gov.in\n• Kisan Call Center: 1800-180-1551\n• Commodity-specific apps\n\n**Tips for Better Prices:**\n• Grade/sort produce\n• Time your sales\n• Bulk through FPO\n• Value addition\n\nNeed current prices for specific crop?"
      },
      {
        keywords: ['fpo', 'farmer producer', 'cooperative', 'sangathan'],
        response: "👥 **Farmer Producer Organizations (FPOs)**\n\n**What is FPO?**\n• Collective of farmers (min. 300)\n• Company/Cooperative registered\n• Aggregation + marketing\n\n**Benefits:**\n• Better bargaining power\n• Input purchase at lower cost\n• Direct market linkages\n• Value addition possible\n• Credit access improved\n• Government support priority\n\n**Government Support:**\n• ₹18 lakh equity grant\n• ₹15 lakh matching equity\n• Credit guarantee up to ₹2 crore\n• 3 years management support\n\n**How to Join/Form:**\n1. Contact NABARD/SFAC\n2. Or State Agriculture Department\n3. 10,000 FPOs scheme ongoing\n\n**Success Examples:**\n• Sahyadri Farms (Nashik)\n• INI Farms (Grapes export)\n• VAPCOL (Gujarat)\n\nWant to know how to join an FPO?"
      },
      {
        keywords: ['storage', 'warehouse', 'bhandar', 'godown'],
        response: "🏪 **Storage & Warehousing Guide**\n\n**Storage Options:**\n\n**1. Scientific Warehouses**\n• WDRA registered\n• Negotiable receipts\n• Pledge finance possible\n\n**2. Farm Level Storage**\n• Improved grain bins\n• Hermetic bags (for seeds)\n• Cold storage for perishables\n\n**Government Support:**\n• Gramin Bhandaran Yojana\n• 25% subsidy (33% for special categories)\n• Maximum: 10,000 MT capacity\n\n**Cold Chain:**\n• MIDH subsidies available\n• Pack houses, cold rooms\n• Reefer vehicles\n\n**Storage Tips:**\n• Clean & dry produce properly\n• Optimal moisture for grains: 12-14%\n• Regular inspection\n• Proper ventilation\n• Pest management\n\n**Losses Reduction:**\n• Scientific storage: <2% loss\n• Traditional: 10-15% loss\n\nNeed specific storage guidance?"
      },
      
      // EQUIPMENT & MACHINERY
      {
        keywords: ['equipment', 'machine', 'tractor', 'yantra', 'implement'],
        response: "🚜 **Farm Mechanization Guide**\n\n**Essential Equipment:**\n\n**Land Preparation:**\n• Tractor + implements\n• Rotavator/Cultivator\n• Leveler\n\n**Sowing:**\n• Seed drill\n• Transplanter (paddy)\n• Dibbler\n\n**Irrigation:**\n• Pump sets\n• Drip/Sprinkler systems\n\n**Plant Protection:**\n• Sprayers (Knapsack, Power)\n• Drones (emerging)\n\n**Harvesting:**\n• Combine harvester\n• Reaper binder\n• Threshers\n\n**Government Subsidy (SMAM):**\n• 40-50% subsidy\n• 80% for SC/ST/Women\n• Apply online or at Ag. Office\n\n**Custom Hiring:**\n• CHCs (Custom Hiring Centers)\n• Aggregator apps available\n• Rent instead of buying\n\nNeed specific machinery advice?"
      },
      {
        keywords: ['drone', 'uav', 'smart farming', 'precision'],
        response: "🚁 **Drone & Smart Farming**\n\n**Agricultural Drones:**\n\n**Uses:**\n• Spraying (10x faster than manual)\n• Crop monitoring\n• Mapping & surveying\n• Seed broadcasting\n\n**Regulations:**\n• DGCA approval mandatory\n• Nano drones (<250g) exempt\n• License required for spraying\n\n**Subsidy:**\n• 50% under SMAM\n• 75% for SC/ST/Women\n• CHCs can apply for 40%\n\n**Precision Agriculture:**\n• Soil sensors\n• Weather stations\n• Variable rate application\n• AI-based advisories\n\n**Available Platforms:**\n• IFFCO's Agri-GPS\n• CropIn\n• Plantix (disease ID)\n• Fasal app\n\n**Benefits:**\n• 25-30% input savings\n• Better yield monitoring\n• Reduced labor dependency\n\nInterested in specific technology?"
      },
      
      // WEATHER & CLIMATE
      {
        keywords: ['weather', 'mausam', 'climate', 'forecast', 'rain', 'barish'],
        response: "☀️🌧️ **Weather & Climate Advisory**\n\n**Weather Information Sources:**\n• IMD (India Meteorological Dept)\n• Meghdoot app\n• Kisan Suvidha app\n• Local TV/Radio\n\n**Agro-Advisories:**\n• District-wise forecasts\n• Crop-specific guidance\n• 5-day weather outlook\n• SMS alerts available\n\n**Climate-Smart Practices:**\n• Drought tolerant varieties\n• Flood resistant varieties\n• Crop diversification\n• Agroforestry\n• Contingency plans ready\n\n**Weather Insurance:**\n• WBCIS (Weather Based Crop Insurance)\n• Automatic claim settlement\n• Based on weather data\n\n**App Recommendations:**\n• Meghdoot (IMD official)\n• Skymet\n• AccuWeather\n\n**Helpline:** Kisan Call Center 1800-180-1551\n\nNeed specific weather advice?"
      },
      
      // LIVESTOCK & ALLIED
      {
        keywords: ['cow', 'buffalo', 'dairy', 'milk', 'gai', 'bhains', 'doodh'],
        response: "🐄 **Dairy Farming Guide**\n\n**Breeds:**\n\n**Cows:**\n• Holstein Friesian (20-25L/day)\n• Jersey (15-20L/day)\n• Gir, Sahiwal (Indigenous, A2 milk)\n\n**Buffaloes:**\n• Murrah (12-15L/day)\n• Mehsana\n• Nili Ravi\n\n**Management:**\n• Clean water 24/7\n• Balanced ration (dry + green + concentrate)\n• Clean housing\n• Regular deworming\n• Vaccination schedule\n\n**Economics:**\n• Break-even: 6-8 liters/day\n• Profit at 10+ liters\n\n**Government Support:**\n• NABARD dairy schemes\n• Rashtriya Gokul Mission\n• Subsidy up to 50%\n• KCC for dairy\n\n**Marketing:**\n• Dairy cooperatives\n• Direct sales (premium milk)\n• Value addition (paneer, ghee)\n\nNeed feeding schedule or health tips?"
      },
      {
        keywords: ['poultry', 'chicken', 'murgi', 'egg', 'anda', 'broiler', 'layer'],
        response: "🐔 **Poultry Farming Guide**\n\n**Types:**\n• Layer (Eggs): BV-300, Lohmann\n• Broiler (Meat): Cobb, Ross\n• Desi (Free-range): Kadaknath, Aseel\n\n**Housing:**\n• 1 sq ft/bird (broiler)\n• 2 sq ft/bird (layer)\n• Proper ventilation essential\n• Litter management\n\n**Feeding:**\n• Starter: 0-3 weeks\n• Grower: 3-6 weeks\n• Finisher: 6+ weeks (broiler)\n• Layer mash for egg birds\n\n**Economics:**\n• Broiler: 35-42 days cycle\n• Layer: Peak at 25-35 weeks\n• ROI: 15-25%\n\n**Health:**\n• Vaccination critical\n• Biosecurity measures\n• Clean water always\n\n**Government Support:**\n• Poultry Venture Capital Fund\n• NABARD schemes\n• Bank finance available\n\nNeed specific guidance?"
      },
      {
        keywords: ['goat', 'sheep', 'bakri', 'bhed', 'bheda'],
        response: "🐐 **Goat & Sheep Farming**\n\n**Popular Breeds:**\n\n**Goats:**\n• Jamunapari (Milk + Meat)\n• Boer (Meat)\n• Beetal (Dairy)\n• Sirohi, Barbari (Dual purpose)\n\n**Sheep:**\n• Nellore (Meat)\n• Merino cross (Wool)\n• Deccani (Hardy)\n\n**Advantages:**\n• Low investment\n• Quick returns (6-8 months)\n• Multiple births common\n• Grazing on wasteland\n\n**Management:**\n• Stall-fed or grazing\n• Deworming every 3 months\n• Vaccination schedule\n• Clean housing\n\n**Economics:**\n• 10 does can give 20-25 kids/year\n• Meat rate: ₹400-500/kg\n\n**Government Support:**\n• NABARD schemes\n• SC/ST special schemes\n• 35-50% subsidy available\n\nWant detailed business plan?"
      },
      {
        keywords: ['fish', 'fishery', 'aquaculture', 'machhli', 'matsya'],
        response: "🐟 **Fish Farming Guide**\n\n**Types:**\n\n**Freshwater:**\n• Carp (Rohu, Catla, Mrigal)\n• Tilapia\n• Pangasius\n• Catfish (Magur, Singhi)\n\n**Brackishwater:**\n• Shrimp/Prawn\n• Sea bass\n\n**Pond Requirements:**\n• 0.5-1 hectare ideal\n• Depth: 1.5-2 meters\n• Water source assured\n\n**Stocking:**\n• 5000-10000 fingerlings/ha\n• Composite fish culture best\n\n**Feeding:**\n• Natural + supplementary feed\n• FCR: 1.5-2.0 expected\n\n**Yield:** 5-8 tonnes/ha/year\n\n**Government Support:**\n• PMMSY (Blue Revolution)\n• 40% subsidy (60% for special)\n• KCC extended to fisheries\n\n**Revenue:** ₹3-5 lakh/ha/year potential\n\nNeed pond construction guidance?"
      },
      {
        keywords: ['bee', 'honey', 'madhu', 'shahad', 'beekeeping'],
        response: "🐝 **Beekeeping Guide**\n\n**Species:**\n• Apis mellifera (Italian bee): Best for commercial\n• Apis cerana (Indian bee): Indigenous\n\n**Requirements:**\n• Bee boxes (10-frame Langstroth)\n• Flora source nearby\n• Water source\n• Basic tools\n\n**Production:**\n• 20-40 kg honey/box/year\n• + Beeswax, propolis, royal jelly\n\n**Benefits:**\n• Low investment (₹5000/box)\n• Pollination service income\n• Multiple products\n• Women-friendly enterprise\n\n**Government Support:**\n• National Beekeeping & Honey Mission\n• Training programs free\n• Subsidy on equipment\n\n**Marketing:**\n• Direct sale (premium)\n• KVIC/NDDB\n• Export market growing\n\n**Income Potential:**\n• ₹1500-2500/box/year\n• 50 boxes = ₹1-1.5 lakh/year\n\nWant to learn management practices?"
      },
      
      // HORTICULTURE
      {
        keywords: ['fruit', 'orchard', 'mango', 'banana', 'phal', 'bagwani'],
        response: "🍎 **Fruit Farming Guide**\n\n**High-Value Fruits:**\n\n**Tropical:**\n• Mango - Long term investment\n• Banana - Quick returns (12-14 months)\n• Papaya - Early bearing\n• Guava - Hardy, reliable\n\n**Subtropical:**\n• Citrus (Orange, Lemon)\n• Pomegranate\n• Grape\n\n**Temperate:**\n• Apple, Pear (Himalayas)\n• Peach, Plum\n\n**Key Points:**\n• Quality planting material essential\n• Proper spacing important\n• Integrated nutrient management\n• High-density possible\n\n**Government Support:**\n• MIDH: 40-50% subsidy\n• Drip subsidy additional\n• Area expansion schemes\n\n**Income:**\n• Mango: ₹1.5-3 lakh/acre (bearing)\n• Banana: ₹1.5-2 lakh/acre/year\n\nWhich fruit interests you?"
      },
      
      // EDUCATION & RESOURCES
      {
        keywords: ['learn', 'course', 'training', 'education', 'siksha', 'sikhna'],
        response: "📚 **Agricultural Learning Resources**\n\n**Online Courses:**\n• Swayam (Free govt courses)\n• ICAR e-Krishi Shiksha\n• Coursera (International)\n\n**Field Training:**\n• KVK (Krishi Vigyan Kendra) - Free\n• ATMA programs\n• Agricultural Universities\n\n**Mobile Apps:**\n• Kisan Suvidha (Govt)\n• IFFCO Kisan\n• Plantix (Disease ID)\n• Agrimarket\n\n**YouTube Channels:**\n• Kisan of India\n• Technical Farming\n• Krishi Jagran\n\n**Helplines:**\n• Kisan Call Center: 1800-180-1551\n• 24/7 service, toll-free\n• Multiple languages\n\n**Magazines/Publications:**\n• Krishi Jagran\n• Indian Farming\n• Progressive Farming\n\nCheck our Education section for courses!"
      },
      
      // GREETINGS & OTHERS
      {
        keywords: ['thank', 'thanks', 'shukriya', 'dhanyawad', 'bye', 'goodbye'],
        response: "🙏 Thank you for chatting with Agri-Bot!\n\n**Remember:**\n• Save my number for farming queries\n• Check our Resources section for tools\n• Visit Education for free courses\n• Explore Marketplace for quality inputs\n\n**Quick Contacts:**\n• Kisan Call Center: 1800-180-1551\n• Agriculture Helpline: 1551\n\nHappy farming! May your harvest be bountiful! 🌾✨\n\nFeel free to return anytime with questions!"
      },
      {
        keywords: ['help', 'sahayata', 'madad', 'support'],
        response: "🤝 **How Can I Help You?**\n\n**I can assist with:**\n\n🌱 **Crops:** Cultivation, varieties, seasons\n💧 **Irrigation:** Methods, scheduling, conservation\n🐛 **Pest & Disease:** Identification, control\n🌿 **Organic Farming:** Practices, inputs, certification\n🏛️ **Schemes:** PM-KISAN, KCC, subsidies\n📊 **Marketing:** Prices, platforms, FPOs\n🚜 **Equipment:** Selection, subsidies\n🐄 **Livestock:** Dairy, poultry, fisheries\n🍎 **Horticulture:** Fruits, vegetables\n☀️ **Weather:** Forecasts, advisories\n\n**Try asking:**\n• \"How to grow tomatoes?\"\n• \"Tell me about PM-KISAN\"\n• \"Best irrigation for wheat\"\n• \"Organic pest control methods\"\n\nWhat would you like to know?"
      },
      {
        keywords: ['who are you', 'what are you', 'kya ho', 'kaun ho'],
        response: "🤖 **About Agri-Bot**\n\nI'm Agri-Bot, your AI-powered agricultural assistant!\n\n**My Capabilities:**\n• Answer farming questions 24/7\n• Provide crop-specific guidance\n• Share government scheme information\n• Offer pest & disease management tips\n• Guide on market prices & selling\n• Support sustainable farming practices\n\n**My Mission:**\nTo empower every farmer with knowledge and resources for successful, sustainable agriculture.\n\n**Developed by:**\nA team passionate about agricultural technology and farmer welfare.\n\n**Languages:**\nCurrently English with Hindi terms supported.\n\nHow can I help you today? 🌾"
      },
      {
        keywords: ['problem', 'issue', 'dikkat', 'samasya'],
        response: "🔧 **Let Me Help You!**\n\nI notice you're facing an issue. To help better:\n\n**Please share:**\n• Crop name\n• Growth stage\n• Specific symptoms observed\n• Region/location\n• Any photos (describe what you see)\n\n**Common Issues I Can Help With:**\n• Yellowing leaves\n• Wilting plants\n• Pest attacks\n• Low yield\n• Disease symptoms\n• Water problems\n• Nutrient deficiency\n\n**For Urgent Help:**\n• Kisan Call Center: 1800-180-1551\n• Local KVK scientist\n• Agriculture officer\n\nDescribe your problem in detail!"
      },
      {
        keywords: ['best', 'top', 'recommend', 'suggestion', 'sujhav'],
        response: "💡 **My Recommendations**\n\nTo give you the best suggestions, please tell me:\n\n**What are you looking for?**\n\n• 🌱 Best crops for your region?\n• 💧 Best irrigation method?\n• 🌿 Best fertilizer for your crop?\n• 🚜 Best equipment?\n• 🛒 Best place to sell?\n• 📚 Best course to learn?\n• 🐄 Best livestock to rear?\n\n**Share:**\n• Your location/state\n• Available resources (land, water, capital)\n• Your experience level\n\nThen I can provide personalized recommendations!"
      }
    ];
  }
  
  bindEvents() {
    if (this.sendButton) {
      this.sendButton.addEventListener('click', () => this.handleSend());
    }
    
    if (this.inputField) {
      this.inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleSend();
        }
      });
      
      // Auto-grow input
      this.inputField.addEventListener('input', () => {
        this.inputField.style.height = 'auto';
        this.inputField.style.height = this.inputField.scrollHeight + 'px';
      });
    }
    
    // Suggestion buttons
    const suggestionBtns = document.querySelectorAll('.chat-suggestions__btn');
    suggestionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const question = btn.textContent;
        this.addMessage(question, 'user');
        this.processMessage(question);
        
        // Add ripple effect
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => btn.style.transform = '', 150);
      });
    });
  }
  
  showWelcomeMessage() {
    const greeting = this.getTimeBasedGreeting();
    const userName = this.userName ? `, ${this.userName}` : '';
    
    setTimeout(() => {
      this.addMessage(
        `${greeting}${userName}! 🌾 I'm Agri-Bot, your intelligent farming companion.\n\nI'm here to help you with:\n• 🌱 Crop cultivation & management\n• 💧 Irrigation & water solutions\n• 🐛 Pest & disease control\n• 🏛️ Government schemes & subsidies\n• 📊 Market prices & selling tips\n\nJust type your question or tap a suggestion below!`,
        'bot'
      );
    }, 500);
  }
  
  getTimeBasedGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }
  
  handleSend() {
    const message = this.inputField.value.trim();
    if (!message) return;
    
    this.addMessage(message, 'user');
    this.inputField.value = '';
    this.inputField.style.height = 'auto';
    this.conversationContext.push({ role: 'user', content: message });
    this.processMessage(message);
  }
  
  addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message--${sender}`;
    
    // Format message with markdown-like styling
    const formattedText = this.formatMessage(text);
    messageDiv.innerHTML = formattedText;
    
    this.messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
    
    // Add animation class
    messageDiv.style.animation = 'messageIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
  }
  
  formatMessage(text) {
    // Convert **text** to bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Convert newlines to breaks
    text = text.replace(/\n/g, '<br>');
    // Convert bullet points
    text = text.replace(/• /g, '<span style="color: var(--primary);">•</span> ');
    return text;
  }
  
  showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message message--typing';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    
    this.messagesContainer.appendChild(typingDiv);
    this.scrollToBottom();
  }
  
  hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
      indicator.remove();
    }
  }
  
  async processMessage(message) {
    this.showTypingIndicator();
    
    // Use Gemini AI for all responses
    try {
      const aiResponse = await this.getGeminiResponse(message);
      this.hideTypingIndicator();
      this.addMessage(aiResponse, 'bot');
      this.conversationContext.push({ role: 'assistant', content: aiResponse });
    } catch (error) {
      console.error('Gemini API error:', error);
      this.hideTypingIndicator();
      
      // Fallback to keyword-based response if API fails
      const keywordResponse = this.findKeywordResponse(message);
      if (keywordResponse) {
        this.addMessage(keywordResponse, 'bot');
      } else {
        this.addMessage("I'm having trouble connecting to my AI brain right now. 🌱 Please check your internet connection and try again!", 'bot');
      }
    }
    
    // Keep context manageable
    if (this.conversationContext.length > 20) {
      this.conversationContext = this.conversationContext.slice(-20);
    }
  }
  
  async getGeminiResponse(userMessage) {
    const systemPrompt = `You are Agri-Bot, an expert AI agricultural assistant for Indian farmers. You provide helpful, accurate, and practical farming advice.

Your expertise includes:
- Crop cultivation (rice, wheat, vegetables, fruits, cotton, sugarcane, etc.)
- Irrigation and water management
- Fertilizers and soil health
- Pest and disease management (IPM)
- Organic and natural farming
- Government schemes (PM-KISAN, KCC, PMFBY, PKVY, etc.)
- Market prices and selling strategies
- Farm equipment and mechanization
- Livestock and dairy farming
- Weather and climate-smart agriculture

Guidelines:
- Give practical, actionable advice
- Use simple language farmers can understand
- Include specific numbers (yields, rates, timings) when relevant
- Mention relevant government schemes and subsidies
- Use emojis to make responses friendly 🌾🌱💧
- Keep responses concise but informative
- If asked about non-agricultural topics, politely redirect to farming topics
- Provide India-specific advice (crops, seasons, schemes)

Previous conversation context:
${this.conversationContext.slice(-6).map(msg => `${msg.role}: ${msg.content}`).join('\n')}`;

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: systemPrompt + '\n\nUser question: ' + userMessage }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
      ]
    };

    const response = await fetch(`${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Details:', errorData);
      throw new Error(`API request failed: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Gemini Response:', data);
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    }
    
    throw new Error('Invalid response format');
  }
  
  findKeywordResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for exact matches first
    for (const faq of this.faqData) {
      for (const keyword of faq.keywords) {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          return faq.response;
        }
      }
    }
    
    // Fuzzy matching for common misspellings
    return this.fuzzyMatch(lowerMessage);
  }
  
  findResponse(message) {
    // Legacy method - now calls findKeywordResponse
    return this.findKeywordResponse(message);
  }
  
  fuzzyMatch(message) {
    const corrections = {
      'wheate': 'wheat',
      'ric': 'rice',
      'tamoto': 'tomato',
      'fertlizer': 'fertilizer',
      'pestiside': 'pesticide',
      'irigation': 'irrigation',
      'orgnic': 'organic',
      'goverment': 'government',
      'sceme': 'scheme'
    };
    
    for (const [wrong, correct] of Object.entries(corrections)) {
      if (message.includes(wrong)) {
        const correctedMessage = message.replace(wrong, correct);
        for (const faq of this.faqData) {
          for (const keyword of faq.keywords) {
            if (correctedMessage.includes(keyword.toLowerCase())) {
              return faq.response;
            }
          }
        }
      }
    }
    
    return null;
  }
  
  getContextualDefaultResponse() {
    const responses = [
      "I'd love to help with that! 🌱 Could you please be more specific? Try asking about:\n\n• Specific crops (rice, wheat, tomato)\n• Farming techniques (irrigation, fertilizers)\n• Government schemes (PM-KISAN, KCC)\n• Pest & disease management\n• Market prices & selling",
      
      "Interesting question! 🤔 I'm continuously learning. Here are some topics I'm great at:\n\n• 🌾 Crop cultivation guides\n• 💧 Irrigation methods\n• 🐛 Pest control solutions\n• 🏛️ Government schemes\n• 📊 Marketing advice\n\nTry rephrasing your question!",
      
      "I want to help you succeed! 💡 For the best answer, please mention:\n\n• Your crop name\n• Your region (if relevant)\n• Specific problem you're facing\n\nOr browse our quick suggestions below!",
      
      "I'm here to empower your farming journey! 🌾\n\nPopular topics farmers ask about:\n• How to increase yield?\n• Best time to sow crops?\n• How to control pests naturally?\n• Government subsidies available?\n\nWhat interests you?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('chatMessages')) {
    window.agriChatbot = new AgriChatbot();
  }
});
