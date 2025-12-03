// Chat service for travel planning chatbot
// Handles conversation context, intent detection, and response generation

const INTENTS = {
  GREETING: 'greeting',
  ITINERARY: 'itinerary',
  DESTINATION: 'destination',
  BUDGET: 'budget',
  WEATHER: 'weather',
  PACKING: 'packing',
  ATTRACTIONS: 'attractions',
  ROUTE: 'route',
  FAQ: 'faq',
  COST: 'cost',
  UNKNOWN: 'unknown',
};

const DESTINATIONS = {
  jaipur: {
    name: 'Jaipur',
    budget: { low: 15000, mid: 30000, high: 60000 },
    weather: 'Hot summers (Apr-Jun: 35-45°C), pleasant winters (Oct-Mar: 10-25°C)',
    bestTime: 'October to March',
    attractions: ['Amber Fort', 'City Palace', 'Hawa Mahal', 'Jantar Mantar'],
    hiddenGems: ['Panna Meena Ka Kund', 'Galtaji Temple', 'Anokhi Museum'],
  },
  ooty: {
    name: 'Ooty',
    budget: { low: 12000, mid: 25000, high: 50000 },
    weather: 'Cool throughout the year (15-25°C), monsoon from June to September',
    bestTime: 'April to June, September to November',
    attractions: ['Ooty Lake', 'Botanical Gardens', 'Doddabetta Peak', 'Rose Garden'],
    hiddenGems: ['Emerald Lake', 'Mudumalai National Park', 'Pykara Falls'],
  },
  maldives: {
    name: 'Maldives',
    budget: { low: 80000, mid: 150000, high: 300000 },
    weather: 'Tropical (26-30°C year-round), dry season Nov-Apr, wet season May-Oct',
    bestTime: 'November to April',
    attractions: ['Male', 'Maafushi', 'Biyadhoo Island', 'Sun Island'],
    hiddenGems: ['Fulhadhoo Island', 'Thulusdhoo', 'Dhigurah'],
  },
  paris: {
    name: 'Paris',
    budget: { low: 100000, mid: 200000, high: 400000 },
    weather: 'Mild summers (20-25°C), cold winters (3-8°C), spring and fall are pleasant',
    bestTime: 'April to June, September to October',
    attractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Arc de Triomphe'],
    hiddenGems: ['Sainte-Chapelle', 'Montmartre', 'Canal Saint-Martin'],
  },
};

const PACKING_LISTS = {
  beach: ['Swimwear', 'Sunscreen SPF 50+', 'Sunglasses', 'Beach towel', 'Flip-flops', 'Hat', 'Light cotton clothes', 'Waterproof bag'],
  mountain: ['Warm layers', 'Waterproof jacket', 'Hiking boots', 'Thermal wear', 'Gloves', 'Cap', 'First aid kit', 'Water bottle'],
  city: ['Comfortable walking shoes', 'Light jacket', 'Day bag', 'Universal adapter', 'Camera', 'Comfortable clothes', 'Umbrella'],
  desert: ['Light, breathable clothes', 'Wide-brimmed hat', 'Sunglasses', 'Sunscreen', 'Scarf', 'Closed-toe shoes', 'Water bottle'],
};

const FAQ_ANSWERS = {
  visa: 'Visa requirements vary by destination and nationality. Check the embassy website of your destination country for specific requirements. Most countries require a valid passport with at least 6 months validity.',
  insurance: 'Travel insurance is highly recommended. It covers medical emergencies, trip cancellations, lost luggage, and more. Basic plans start around ₹500-2000 for a week.',
  currency: 'Always carry some local currency. Use ATMs abroad for better rates, but inform your bank beforehand. Credit cards are widely accepted in most tourist destinations.',
  safety: 'Research your destination, avoid isolated areas at night, keep copies of important documents, and stay aware of local customs and laws. Register with your embassy if traveling to high-risk areas.',
  booking: 'Book flights 6-8 weeks in advance for best prices. Hotels can be booked closer to travel dates, but popular destinations require early booking. Use comparison sites for deals.',
};

// Intent detection
function detectIntent(message, context) {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.match(/hi|hello|hey|namaste|start|begin/)) return INTENTS.GREETING;
  if (lowerMsg.match(/itinerary|plan|schedule|day.*day|trip.*plan/)) return INTENTS.ITINERARY;
  if (lowerMsg.match(/destination|place|where|go|visit|travel/)) return INTENTS.DESTINATION;
  if (lowerMsg.match(/budget|cost|price|expensive|cheap|affordable|money/)) return INTENTS.BUDGET;
  if (lowerMsg.match(/weather|climate|temperature|rain|sunny|cold|hot/)) return INTENTS.WEATHER;
  if (lowerMsg.match(/pack|packing|luggage|bag|what.*bring|carry/)) return INTENTS.PACKING;
  if (lowerMsg.match(/attraction|sightseeing|see|visit|monument|place.*see/)) return INTENTS.ATTRACTIONS;
  if (lowerMsg.match(/route|path|way|how.*reach|distance|between/)) return INTENTS.ROUTE;
  if (lowerMsg.match(/faq|question|help|how|what|why|when/)) return INTENTS.FAQ;
  if (lowerMsg.match(/estimate|total|spend|expense/)) return INTENTS.COST;
  
  return INTENTS.UNKNOWN;
}

// Extract destination from message
function extractDestination(message) {
  const lowerMsg = message.toLowerCase();
  for (const [key, dest] of Object.entries(DESTINATIONS)) {
    if (lowerMsg.includes(key) || lowerMsg.includes(dest.name.toLowerCase())) {
      return key;
    }
  }
  return null;
}

// Extract budget range
function extractBudgetRange(message) {
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.match(/low|budget|cheap|affordable|economical/)) return 'low';
  if (lowerMsg.match(/mid|medium|moderate|average/)) return 'mid';
  if (lowerMsg.match(/high|luxury|premium|expensive/)) return 'high';
  return null;
}

// Generate response based on intent and context
export function generateChatResponse(message, context = {}) {
  const intent = detectIntent(message, context.lastMessage || message);
  const destination = extractDestination(message) || context.destination;
  const budgetRange = extractBudgetRange(message) || context.budgetRange || 'mid';
  
  // Update context
  const newContext = {
    ...context,
    destination: destination || context.destination,
    budgetRange: budgetRange || context.budgetRange,
    lastIntent: intent,
    lastMessage: message,
  };

  let response = '';
  let quickReplies = [];
  let suggestions = null;

  switch (intent) {
    case INTENTS.GREETING:
      response = "Hi! 👋 I'm your travel planning assistant. I can help you with:\n\n" +
        "✨ Creating day-by-day itineraries\n" +
        "🌍 Suggesting destinations based on your preferences\n" +
        "💰 Budget estimates and cost breakdowns\n" +
        "🌤️ Weather insights and best time to visit\n" +
        "🎒 Packing lists and outfit recommendations\n" +
        "🏛️ Popular attractions and hidden gems\n" +
        "🗺️ Route optimization between places\n" +
        "❓ Travel FAQs and tips\n\n" +
        "What would you like to plan today?";
      quickReplies = ['Plan a trip', 'Suggest destination', 'Budget estimate', 'Weather info'];
      break;

    case INTENTS.DESTINATION:
      if (destination) {
        const dest = DESTINATIONS[destination];
        response = `Great choice! ${dest.name} is an amazing destination. Here's what you should know:\n\n` +
          `🌤️ **Weather**: ${dest.weather}\n` +
          `📅 **Best Time**: ${dest.bestTime}\n` +
          `💰 **Budget Range**:\n` +
          `   • Budget: ₹${dest.budget.low.toLocaleString()}\n` +
          `   • Mid-range: ₹${dest.budget.mid.toLocaleString()}\n` +
          `   • Luxury: ₹${dest.budget.high.toLocaleString()}\n\n` +
          `Would you like me to create a detailed itinerary for ${dest.name}?`;
        quickReplies = ['Create itinerary', 'Attractions', 'Packing list', 'Weather details'];
        newContext.destination = destination;
      } else {
        response = "I'd love to suggest a destination! Could you tell me:\n\n" +
          "• Your budget range (low/mid/high)\n" +
          "• Preferred travel style (beach/mountain/city/culture)\n" +
          "• Time of year you're planning to travel\n" +
          "• Number of days\n\n" +
          "Or just tell me a destination you're interested in!";
        quickReplies = ['Jaipur', 'Ooty', 'Maldives', 'Paris'];
      }
      break;

    case INTENTS.ITINERARY:
      if (destination) {
        const dest = DESTINATIONS[destination];
        const days = context.days || 3;
        response = `Here's a ${days}-day itinerary for ${dest.name}:\n\n`;
        
        const itinerary = generateItinerary(destination, days);
        itinerary.forEach((day, idx) => {
          response += `**Day ${idx + 1}**: ${day.theme}\n`;
          day.activities.forEach(act => {
            response += `  • ${act.time}: ${act.activity}\n`;
          });
          response += '\n';
        });
        
        response += `💡 **Tip**: This is a suggested itinerary. You can customize it based on your interests!\n\n` +
          `Would you like me to add this to your planner or make changes?`;
        suggestions = { type: 'itinerary', data: itinerary, destination };
        quickReplies = ['Add to planner', 'Modify itinerary', 'View attractions', 'Get packing list'];
      } else {
        response = "I'd be happy to create an itinerary! First, tell me:\n\n" +
          "• Which destination? (e.g., Jaipur, Ooty, Maldives, Paris)\n" +
          "• How many days?\n" +
          "• Your interests (sightseeing, adventure, relaxation, etc.)";
        quickReplies = ['Jaipur 3 days', 'Ooty 4 days', 'Maldives 5 days', 'Paris 7 days'];
      }
      break;

    case INTENTS.BUDGET:
      if (destination) {
        const dest = DESTINATIONS[destination];
        const days = context.days || 3;
        const budget = dest.budget[budgetRange];
        const dailyBudget = Math.round(budget / days);
        
        response = `💰 **Budget Estimate for ${dest.name} (${days} days, ${budgetRange} range)**:\n\n` +
          `**Total**: ₹${budget.toLocaleString()}\n` +
          `**Per Day**: ₹${dailyBudget.toLocaleString()}\n\n` +
          `**Breakdown**:\n` +
          `  • Accommodation (${Math.round(budget * 0.4)}): ₹${Math.round(budget * 0.4).toLocaleString()}\n` +
          `  • Food & Dining (${Math.round(budget * 0.3)}): ₹${Math.round(budget * 0.3).toLocaleString()}\n` +
          `  • Activities & Sightseeing (${Math.round(budget * 0.2)}): ₹${Math.round(budget * 0.2).toLocaleString()}\n` +
          `  • Transport (${Math.round(budget * 0.1)}): ₹${Math.round(budget * 0.1).toLocaleString()}\n\n` +
          `💡 *Note: These are estimated costs. Actual prices may vary based on season, bookings, and personal preferences.*`;
        quickReplies = ['Create itinerary', 'Compare destinations', 'Money-saving tips'];
      } else {
        response = "I can help with budget planning! Tell me:\n\n" +
          "• Your destination\n" +
          "• Budget range (low/mid/high)\n" +
          "• Number of days\n\n" +
          "I'll give you a detailed cost breakdown!";
        quickReplies = ['Low budget trip', 'Mid-range trip', 'Luxury trip'];
      }
      break;

    case INTENTS.WEATHER:
      if (destination) {
        const dest = DESTINATIONS[destination];
        response = `🌤️ **Weather in ${dest.name}**:\n\n` +
          `${dest.weather}\n\n` +
          `📅 **Best Time to Visit**: ${dest.bestTime}\n\n` +
          `💡 **Packing Tips**:\n`;
        
        if (destination === 'jaipur' || destination === 'paris') {
          response += `  • Light layers for day, warmer clothes for evening\n` +
            `  • Comfortable walking shoes\n` +
            `  • Sunscreen and hat\n`;
        } else if (destination === 'ooty') {
          response += `  • Warm layers (sweaters, jackets)\n` +
            `  • Waterproof jacket (monsoon season)\n` +
            `  • Comfortable walking shoes\n`;
        } else if (destination === 'maldives') {
          response += `  • Light, breathable clothes\n` +
            `  • Swimwear and beach essentials\n` +
            `  • Sunscreen SPF 50+\n` +
            `  • Light rain jacket (wet season)\n`;
        }
        
        quickReplies = ['Packing list', 'Best time to visit', 'Seasonal tips'];
      } else {
        response = "I can provide weather insights! Which destination are you planning to visit?";
        quickReplies = ['Jaipur', 'Ooty', 'Maldives', 'Paris'];
      }
      break;

    case INTENTS.PACKING:
      const travelType = context.travelType || 
        (message.toLowerCase().match(/beach|coast|island/) ? 'beach' :
         message.toLowerCase().match(/mountain|hill|trek/) ? 'mountain' :
         message.toLowerCase().match(/city|urban/) ? 'city' :
         message.toLowerCase().match(/desert|sandy/) ? 'desert' : 'city');
      
      const packingList = PACKING_LISTS[travelType] || PACKING_LISTS.city;
      
      response = `🎒 **Packing List for ${travelType.charAt(0).toUpperCase() + travelType.slice(1)} Travel**:\n\n`;
      packingList.forEach((item, idx) => {
        response += `${idx + 1}. ${item}\n`;
      });
      
      response += `\n💡 **Pro Tips**:\n` +
        `  • Roll clothes to save space\n` +
        `  • Pack versatile items that can be mixed and matched\n` +
        `  • Keep important documents in a waterproof pouch\n` +
        `  • Check airline baggage restrictions\n`;
      
      quickReplies = ['Beach packing', 'Mountain packing', 'City packing', 'Desert packing'];
      break;

    case INTENTS.ATTRACTIONS:
      if (destination) {
        const dest = DESTINATIONS[destination];
        response = `🏛️ **Must-Visit Attractions in ${dest.name}**:\n\n` +
          `**Popular Spots**:\n`;
        dest.attractions.forEach((attr, idx) => {
          response += `${idx + 1}. ${attr}\n`;
        });
        
        response += `\n**Hidden Gems** (Lesser-known but amazing!):\n`;
        dest.hiddenGems.forEach((gem, idx) => {
          response += `${idx + 1}. ${gem}\n`;
        });
        
        response += `\n💡 Want me to create an itinerary that includes these places?`;
        quickReplies = ['Create itinerary', 'Route optimization', 'Best time to visit'];
      } else {
        response = "I can suggest amazing attractions! Which destination are you interested in?";
        quickReplies = ['Jaipur', 'Ooty', 'Maldives', 'Paris'];
      }
      break;

    case INTENTS.ROUTE:
      response = `🗺️ **Route Optimization Tips**:\n\n` +
        `For efficient route planning:\n` +
        `1. **Group nearby attractions** - Visit places in the same area on the same day\n` +
        `2. **Start early** - Begin with places that open early\n` +
        `3. **Avoid backtracking** - Plan a logical sequence\n` +
        `4. **Consider traffic** - Factor in local rush hours\n` +
        `5. **Use maps** - Google Maps or local transport apps help\n\n` +
        `Tell me your destination and I can suggest an optimized route!`;
      quickReplies = ['Jaipur route', 'Ooty route', 'Paris route'];
      break;

    case INTENTS.COST:
      if (destination) {
        const dest = DESTINATIONS[destination];
        const days = parseInt(message.match(/\d+/)?.[0]) || context.days || 3;
        const budget = dest.budget[budgetRange];
        
        response = `💰 **Estimated Cost for ${dest.name} (${days} days)**:\n\n` +
          `**Total Budget**: ₹${budget.toLocaleString()}\n` +
          `**Per Person**: ₹${Math.round(budget / 2).toLocaleString()} (assuming 2 people)\n` +
          `**Per Day**: ₹${Math.round(budget / days).toLocaleString()}\n\n` +
          `*Prices are estimates and may vary based on season, booking timing, and personal choices.*`;
        quickReplies = ['Detailed breakdown', 'Money-saving tips', 'Compare destinations'];
      } else {
        response = "I can estimate trip costs! Tell me:\n\n" +
          "• Destination\n" +
          "• Number of days\n" +
          "• Budget preference (low/mid/high)";
        quickReplies = ['3 days', '5 days', '7 days'];
      }
      break;

    case INTENTS.FAQ:
      const faqTopic = 
        message.toLowerCase().match(/visa|passport/) ? 'visa' :
        message.toLowerCase().match(/insurance/) ? 'insurance' :
        message.toLowerCase().match(/currency|money|exchange/) ? 'currency' :
        message.toLowerCase().match(/safety|safe|danger/) ? 'safety' :
        message.toLowerCase().match(/book|booking|reserve/) ? 'booking' : null;
      
      if (faqTopic && FAQ_ANSWERS[faqTopic]) {
        response = `❓ **${faqTopic.charAt(0).toUpperCase() + faqTopic.slice(1)}**:\n\n${FAQ_ANSWERS[faqTopic]}`;
      } else {
        response = `I can help with travel FAQs! Common topics:\n\n` +
          `• Visa requirements\n` +
          `• Travel insurance\n` +
          `• Currency exchange\n` +
          `• Safety tips\n` +
          `• Booking advice\n\n` +
          `What would you like to know?`;
        quickReplies = ['Visa info', 'Insurance', 'Currency', 'Safety tips'];
      }
      break;

    default:
      response = "I'm here to help with your travel planning! I can assist with:\n\n" +
        "• Creating itineraries\n" +
        "• Destination suggestions\n" +
        "• Budget planning\n" +
        "• Weather insights\n" +
        "• Packing lists\n" +
        "• Attractions and routes\n\n" +
        "What would you like to know?";
      quickReplies = ['Plan a trip', 'Suggest destination', 'Budget help', 'Weather info'];
  }

  // Extract days from message if mentioned
  const daysMatch = message.match(/(\d+)\s*days?/i);
  if (daysMatch) {
    newContext.days = parseInt(daysMatch[1]);
  }

  return {
    response,
    quickReplies,
    context: newContext,
    suggestions,
  };
}

// Generate itinerary structure
function generateItinerary(destination, days) {
  const dest = DESTINATIONS[destination];
  if (!dest) return [];

  const itineraries = {
    jaipur: [
      { theme: 'Heritage & Culture', activities: [
        { time: '9:00 AM', activity: 'Visit Amber Fort' },
        { time: '12:00 PM', activity: 'Lunch at local restaurant' },
        { time: '2:00 PM', activity: 'Explore City Palace' },
        { time: '5:00 PM', activity: 'Hawa Mahal photo session' },
      ]},
      { theme: 'Markets & Temples', activities: [
        { time: '10:00 AM', activity: 'Jantar Mantar Observatory' },
        { time: '1:00 PM', activity: 'Shopping at Johari Bazaar' },
        { time: '4:00 PM', activity: 'Visit Galtaji Temple' },
      ]},
      { theme: 'Hidden Gems', activities: [
        { time: '9:00 AM', activity: 'Panna Meena Ka Kund' },
        { time: '11:00 AM', activity: 'Anokhi Museum' },
        { time: '2:00 PM', activity: 'Nahargarh Fort sunset' },
      ]},
    ],
    ooty: [
      { theme: 'Nature & Scenic Views', activities: [
        { time: '8:00 AM', activity: 'Doddabetta Peak sunrise' },
        { time: '10:00 AM', activity: 'Botanical Gardens' },
        { time: '2:00 PM', activity: 'Ooty Lake boating' },
        { time: '4:00 PM', activity: 'Rose Garden' },
      ]},
      { theme: 'Adventure & Wildlife', activities: [
        { time: '9:00 AM', activity: 'Mudumalai National Park safari' },
        { time: '1:00 PM', activity: 'Pykara Falls visit' },
        { time: '4:00 PM', activity: 'Emerald Lake' },
      ]},
    ],
    maldives: [
      { theme: 'Island Hopping', activities: [
        { time: '9:00 AM', activity: 'Snorkeling session' },
        { time: '12:00 PM', activity: 'Beach relaxation' },
        { time: '3:00 PM', activity: 'Island tour' },
        { time: '6:00 PM', activity: 'Sunset cruise' },
      ]},
      { theme: 'Water Activities', activities: [
        { time: '8:00 AM', activity: 'Diving expedition' },
        { time: '2:00 PM', activity: 'Water sports' },
        { time: '5:00 PM', activity: 'Beach dinner' },
      ]},
    ],
    paris: [
      { theme: 'Iconic Landmarks', activities: [
        { time: '9:00 AM', activity: 'Eiffel Tower visit' },
        { time: '12:00 PM', activity: 'Lunch in Montmartre' },
        { time: '2:00 PM', activity: 'Louvre Museum' },
        { time: '5:00 PM', activity: 'Arc de Triomphe' },
      ]},
      { theme: 'Culture & History', activities: [
        { time: '10:00 AM', activity: 'Notre-Dame Cathedral' },
        { time: '1:00 PM', activity: 'Sainte-Chapelle' },
        { time: '3:00 PM', activity: 'Seine River cruise' },
        { time: '6:00 PM', activity: 'Canal Saint-Martin walk' },
      ]},
    ],
  };

  const baseItinerary = itineraries[destination] || [];
  return baseItinerary.slice(0, Math.min(days, baseItinerary.length));
}

