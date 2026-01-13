/**
 * Agri-Bot - Chatbot JavaScript
 * Keyword-based response engine
 */

class AgriChatbot {
  constructor() {
    this.messagesContainer = document.getElementById('chatMessages');
    this.inputField = document.getElementById('chatInput');
    this.sendButton = document.getElementById('chatSend');
    this.suggestionsContainer = document.querySelector('.chat-suggestions');
    this.faqData = [];
    
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
  }
  
  getDefaultFAQ() {
    return [
      {
        keywords: ['hello', 'hi', 'hey', 'namaste'],
        response: 'Hello! 🌾 Welcome to Agri-Bot. I\'m here to help you with farming tips, crop information, and agricultural resources. How can I assist you today?'
      },
      {
        keywords: ['crop', 'grow', 'plant', 'farming'],
        response: 'Great question about crops! 🌱 The best crops depend on your region and season. Popular crops in India include:\n\n• Kharif (Monsoon): Rice, Maize, Cotton, Soybean\n• Rabi (Winter): Wheat, Mustard, Chickpea, Potato\n• Zaid (Summer): Watermelon, Cucumber, Muskmelon\n\nWould you like specific information about any crop?'
      },
      {
        keywords: ['weather', 'rain', 'climate', 'forecast'],
        response: 'Weather is crucial for farming! ☀️🌧️ Here are some tips:\n\n• Check local forecasts regularly\n• Plan irrigation based on rainfall predictions\n• Protect crops during extreme weather\n• Use weather apps for real-time updates\n\nVisit our Resources page for weather tools!'
      },
      {
        keywords: ['fertilizer', 'nutrient', 'soil', 'manure'],
        response: 'Healthy soil = Healthy crops! 🌿 Here\'s what you should know:\n\n• Get soil tested regularly\n• Use organic manure when possible\n• Balance NPK (Nitrogen, Phosphorus, Potassium)\n• Consider green manuring\n\nWould you like tips on organic fertilizers?'
      },
      {
        keywords: ['pest', 'insect', 'disease', 'protection'],
        response: 'Pest management is essential! 🐛 Here are some strategies:\n\n• Integrated Pest Management (IPM)\n• Neem-based natural pesticides\n• Crop rotation to break pest cycles\n• Regular field monitoring\n• Biological control methods\n\nWant to learn about organic pest control?'
      },
      {
        keywords: ['water', 'irrigation', 'drip', 'sprinkler'],
        response: 'Smart irrigation saves water and money! 💧\n\n• Drip irrigation: 90% efficiency\n• Sprinkler: Good for large areas\n• Mulching reduces evaporation\n• Water early morning or evening\n• Rainwater harvesting is valuable\n\nCheck our Sustainable Farming page for more!'
      },
      {
        keywords: ['market', 'price', 'sell', 'buy'],
        response: 'Marketing your produce is important! 🛒\n\n• Check mandi prices regularly\n• Explore Farmer Producer Organizations (FPOs)\n• Consider direct-to-consumer sales\n• Visit our Marketplace section\n• Government e-NAM portal can help\n\nWant to explore our marketplace?'
      },
      {
        keywords: ['government', 'scheme', 'subsidy', 'loan', 'pm'],
        response: 'Several government schemes support farmers! 🏛️\n\n• PM-KISAN: ₹6000/year direct benefit\n• Soil Health Card Scheme\n• PM Fasal Bima Yojana\n• Kisan Credit Card\n• MGNREGA for rural employment\n\nVisit our Resources page for detailed information!'
      },
      {
        keywords: ['organic', 'natural', 'sustainable', 'eco'],
        response: 'Sustainable farming is the future! 🌍\n\n• Reduce chemical inputs\n• Practice crop rotation\n• Use compost and green manure\n• Conserve water resources\n• Maintain biodiversity\n\nExplore our Sustainable Farming section for guides!'
      },
      {
        keywords: ['seed', 'variety', 'hybrid'],
        response: 'Choosing the right seeds is crucial! 🌱\n\n• Use certified seeds from trusted sources\n• Consider hybrid varieties for better yield\n• Save indigenous seeds for sustainability\n• Check seed treatment before sowing\n• Store seeds properly for next season\n\nNeed recommendations for specific crops?'
      },
      {
        keywords: ['harvest', 'yield', 'production'],
        response: 'Maximizing your harvest! 🌾\n\n• Harvest at the right maturity stage\n• Use proper post-harvest handling\n• Store crops in appropriate conditions\n• Consider value addition\n• Keep records for better planning\n\nWant tips on storage and processing?'
      },
      {
        keywords: ['thank', 'thanks', 'bye', 'goodbye'],
        response: 'You\'re welcome! 🙏 Thank you for using Agri-Bot. Feel free to come back anytime with your farming questions. Happy farming! 🌾'
      },
      {
        keywords: ['help', 'support', 'contact'],
        response: 'I\'m here to help! 🤝 You can:\n\n• Ask me any farming question\n• Visit our Education section for courses\n• Check Resources for tools and guides\n• Contact our team for personalized support\n\nWhat would you like to know?'
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
    }
    
    // Suggestion buttons
    const suggestionBtns = document.querySelectorAll('.chat-suggestions__btn');
    suggestionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const question = btn.textContent;
        this.addMessage(question, 'user');
        this.processMessage(question);
      });
    });
  }
  
  showWelcomeMessage() {
    setTimeout(() => {
      this.addMessage(
        'Hello! 🌾 I\'m Agri-Bot, your virtual farming assistant. I can help you with crop information, farming tips, government schemes, and more. What would you like to know?',
        'bot'
      );
    }, 500);
  }
  
  handleSend() {
    const message = this.inputField.value.trim();
    if (!message) return;
    
    this.addMessage(message, 'user');
    this.inputField.value = '';
    this.processMessage(message);
  }
  
  addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message--${sender}`;
    messageDiv.textContent = text;
    
    this.messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
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
  
  processMessage(message) {
    this.showTypingIndicator();
    
    // Simulate typing delay
    setTimeout(() => {
      this.hideTypingIndicator();
      const response = this.findResponse(message);
      this.addMessage(response, 'bot');
    }, 1000 + Math.random() * 1000);
  }
  
  findResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Search through FAQ data
    for (const faq of this.faqData) {
      for (const keyword of faq.keywords) {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          return faq.response;
        }
      }
    }
    
    // Default response if no keyword match
    return this.getDefaultResponse();
  }
  
  getDefaultResponse() {
    const responses = [
      'I\'m not sure I understand. Could you rephrase that? You can ask me about crops, weather, irrigation, pests, or government schemes! 🌱',
      'Interesting question! I\'m still learning. Try asking about specific crops, farming techniques, or agricultural resources. 🤔',
      'I\'d love to help! Please try asking about topics like organic farming, pest control, market prices, or irrigation methods. 💡',
      'I\'m here to assist with farming queries. You can ask about seeds, fertilizers, weather, or government schemes. What interests you? 🌾'
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
    new AgriChatbot();
  }
});
