
interface RemedyInfo {
  condition: string[];
  remedies: string[];
  prevention: string[];
  whenToSeekHelp: string[];
}

// App information for the chatbot to reference
const appInfo = {
  general: [
    "HealthBridge is a comprehensive healthcare application that connects patients with healthcare services.",
    "The app includes features like telemedicine, symptom checking, health records, and access to healthcare workers.",
    "You can use the app on both mobile and desktop devices.",
    "The app is designed to be user-friendly and accessible to all users."
  ],
  features: [
    "Telemedicine: Connect with healthcare providers through video or voice calls.",
    "Symptom Checker: Assess your symptoms and get preliminary guidance.",
    "Health Records: Store and access your medical information securely.",
    "Home Remedies: Get advice for managing common health conditions at home.",
    "Healthcare Worker Network: Find and connect with healthcare professionals in your area.",
    "Secure Messaging: Communicate with your healthcare providers safely."
  ],
  usage: [
    "Create an account or log in to access all features.",
    "Update your profile with relevant health information for better service.",
    "Use the symptom checker for initial assessment of health concerns.",
    "Schedule telemedicine appointments with healthcare providers.",
    "Upload and manage your health documents in the records section.",
    "Contact support if you encounter any issues with the app."
  ],
  privacy: [
    "Your health information is encrypted and stored securely.",
    "We comply with healthcare privacy regulations.",
    "Your chat conversations with the assistant are processed locally.",
    "You can manage your data privacy settings in your profile.",
    "We don't share your personal health information with third parties without your consent."
  ]
};

// Enhanced database of home remedies for common conditions
const remediesDatabase: Record<string, RemedyInfo> = {
  headache: {
    condition: ['headache', 'migraine', 'head pain', 'head ache'],
    remedies: [
      'Stay hydrated by drinking plenty of water',
      'Apply a cold or warm compress to your forehead or neck',
      'Rest in a quiet, dark room',
      'Practice relaxation techniques like deep breathing',
      'Try over-the-counter pain relievers like acetaminophen if appropriate'
    ],
    prevention: [
      'Maintain a regular sleep schedule',
      'Stay hydrated throughout the day',
      'Manage stress through meditation or yoga',
      'Avoid known triggers like certain foods or strong scents',
      'Take regular breaks when working on screens'
    ],
    whenToSeekHelp: [
      'Headache is severe or described as "the worst headache of your life"',
      'Headache is accompanied by fever, stiff neck, confusion, seizures, double vision, weakness, numbness or difficulty speaking',
      'Headache gets worse despite rest and pain medication',
      'Headaches wake you from sleep',
      'You experience new or different headaches than you typically experience'
    ]
  },
  
  soreThroat: {
    condition: ['sore throat', 'throat pain', 'strep', 'sore throat'],
    remedies: [
      'Gargle with warm salt water (1/2 teaspoon of salt in a cup of warm water)',
      'Drink warm liquids like herbal tea with honey',
      'Use throat lozenges or hard candies to soothe irritation',
      'Stay hydrated with plenty of fluids',
      'Use a humidifier to add moisture to the air'
    ],
    prevention: [
      'Wash hands regularly, especially during cold and flu season',
      'Avoid close contact with people who are sick',
      'Don\'t share utensils, cups, or food with others',
      'Regularly clean frequently touched surfaces',
      'Avoid irritants like smoking or exposure to pollutants'
    ],
    whenToSeekHelp: [
      'Sore throat lasts more than a week',
      'Difficulty swallowing or breathing',
      'Unusual drooling (especially in children)',
      'Temperature higher than 101°F (38.3°C)',
      'Blood in saliva or phlegm',
      'Rash, joint pain, or earache'
    ]
  },
  
  stomachPain: {
    condition: ['stomach pain', 'stomach ache', 'abdominal pain', 'digestive issues', 'indigestion', 'upset stomach'],
    remedies: [
      'Try sipping clear liquids or ginger tea',
      'Eat bland foods like rice, toast, or bananas',
      'Apply a warm compress to your stomach',
      'Rest and avoid strenuous activity',
      'Avoid spicy, greasy, or acidic foods until feeling better'
    ],
    prevention: [
      'Eat smaller, more frequent meals',
      'Avoid known trigger foods',
      'Stay hydrated throughout the day',
      'Practice stress reduction techniques',
      'Maintain a food diary to identify patterns'
    ],
    whenToSeekHelp: [
      'Severe pain that doesn\'t go away or comes in intense waves',
      'Vomiting blood or dark material resembling coffee grounds',
      'Blood in stool or black, tarry stools',
      'Inability to keep fluids down for more than 24 hours',
      'Fever above 101°F (38.3°C)',
      'Symptoms of dehydration (excessive thirst, dry mouth, little or no urination, severe weakness)'
    ]
  },
  
  cold: {
    condition: ['cold', 'flu', 'cough', 'runny nose', 'stuffy nose', 'congestion', 'common cold'],
    remedies: [
      'Rest and get plenty of sleep',
      'Stay hydrated with water, tea, and clear broths',
      'Use a humidifier to add moisture to the air',
      'Try saline nasal sprays to relieve congestion',
      'Gargle with salt water to soothe a sore throat',
      'Take honey for cough (not for children under 1 year)'
    ],
    prevention: [
      'Wash hands frequently and thoroughly',
      'Avoid close contact with people who are sick',
      'Don\'t touch your face, especially your eyes, nose, and mouth',
      'Clean frequently touched surfaces',
      'Maintain a healthy lifestyle with good nutrition and exercise'
    ],
    whenToSeekHelp: [
      'Fever above 101.3°F (38.5°C) for adults or any fever in infants',
      'Symptoms that worsen after 7-10 days or don\'t improve',
      'Severe or persistent cough',
      'Shortness of breath or difficulty breathing',
      'Persistent chest or abdominal pain',
      'Severe headache or confusion'
    ]
  },
  
  fever: {
    condition: ['fever', 'temperature', 'high temperature', 'feeling hot'],
    remedies: [
      'Rest and get plenty of sleep',
      'Stay cool with light clothing and a comfortable room temperature',
      'Stay hydrated by drinking plenty of fluids',
      'Take a lukewarm bath or apply cool compresses',
      'Consider appropriate over-the-counter fever reducers like acetaminophen if needed'
    ],
    prevention: [
      'Practice good hygiene including regular handwashing',
      'Avoid close contact with people who are sick',
      'Keep your immune system strong with proper nutrition and sleep',
      'Stay up to date on recommended vaccines',
      'Keep your environment clean'
    ],
    whenToSeekHelp: [
      'Adult temperature higher than 103°F (39.4°C)',
      'Fever in an infant younger than 3 months with temperature of 100.4°F (38°C) or higher',
      'Fever lasting more than three days',
      'Fever with severe headache, stiff neck, confusion, or difficulty breathing',
      'Fever with rash',
      'Fever with unusual irritability or lethargy'
    ]
  },
  
  backPain: {
    condition: ['back pain', 'backache', 'lower back pain', 'spine pain', 'back ache'],
    remedies: [
      'Apply ice for the first 48-72 hours, then switch to heat',
      'Over-the-counter pain relievers like ibuprofen can help reduce inflammation',
      'Stay active with gentle movement, avoiding bed rest for extended periods',
      'Practice good posture and ergonomics when sitting and standing',
      'Try gentle stretches for the back and hamstrings'
    ],
    prevention: [
      'Maintain a healthy weight to reduce strain on your back',
      'Strengthen your core muscles with appropriate exercises',
      'Use proper lifting techniques - bend at the knees, not the waist',
      'Set up an ergonomic workspace with proper chair height and monitor position',
      'Take frequent breaks from sitting or standing in one position'
    ],
    whenToSeekHelp: [
      'Pain is severe or worsening',
      'Pain extends down one or both legs, especially if it extends below the knee',
      'You experience numbness, tingling, or weakness in your legs',
      'You have unexplained weight loss along with back pain',
      'You develop problems with bladder or bowel control'
    ]
  },
  
  insomnia: {
    condition: ['insomnia', 'can\'t sleep', 'difficulty sleeping', 'trouble sleeping', 'sleep problems', 'sleeplessness'],
    remedies: [
      'Maintain a regular sleep schedule, going to bed and waking up at the same time daily',
      'Create a relaxing bedtime routine - reading, gentle stretching, or meditation',
      'Make your bedroom dark, quiet, and cool for optimal sleeping conditions',
      'Avoid screens (phones, computers, TV) at least 1 hour before bedtime',
      'Try relaxation techniques like deep breathing or progressive muscle relaxation'
    ],
    prevention: [
      'Avoid caffeine, alcohol, and large meals close to bedtime',
      'Exercise regularly, but not within a few hours of bedtime',
      'Manage stress through meditation, yoga, or other relaxation practices',
      'Limit daytime naps to 30 minutes or less',
      'Create a comfortable sleep environment with a good mattress and pillows'
    ],
    whenToSeekHelp: [
      'Insomnia persists for more than a few weeks despite home remedies',
      'Sleep problems significantly affect your daily functioning or mood',
      'You experience breathing irregularities during sleep (like sleep apnea)',
      'Insomnia occurs with other concerning symptoms like chest pain',
      'You find yourself relying on sleep aids (over-the-counter or prescription) for more than a few weeks'
    ]
  },
  
  allergies: {
    condition: ['allergies', 'allergy', 'allergic reaction', 'hay fever', 'seasonal allergies'],
    remedies: [
      'Try over-the-counter antihistamines to relieve symptoms',
      'Use a saline nasal spray to flush out allergens',
      'Apply a cold compress to reduce swelling and itching',
      'Keep windows closed during high pollen seasons',
      'Shower after being outdoors to wash away allergens'
    ],
    prevention: [
      'Identify and avoid your specific allergen triggers when possible',
      'Use air purifiers with HEPA filters in your home',
      'Wash bedding weekly in hot water to reduce allergens',
      'Vacuum regularly with a HEPA filter vacuum',
      'Consider wearing a mask when doing outdoor activities during high pollen counts'
    ],
    whenToSeekHelp: [
      'You experience severe allergic reactions with difficulty breathing',
      'Over-the-counter medications don\'t adequately control your symptoms',
      'Your allergies significantly impact your quality of life',
      'You develop a skin rash, hives, or eczema that doesn\'t improve',
      'You experience allergic asthma symptoms like wheezing or shortness of breath'
    ]
  },
  
  anxiety: {
    condition: ['anxiety', 'stress', 'panic attack', 'anxious feelings', 'worried', 'nervousness'],
    remedies: [
      'Practice deep breathing exercises (breathe in for 4 counts, hold for 2, exhale for 6)',
      'Try progressive muscle relaxation by tensing and relaxing each muscle group',
      'Engage in regular physical activity like walking, swimming, or yoga',
      'Limit caffeine and alcohol which can worsen anxiety',
      'Practice mindfulness meditation for 10-15 minutes daily'
    ],
    prevention: [
      'Develop a regular sleep schedule and prioritize quality sleep',
      'Maintain a balanced diet rich in omega-3 fatty acids, antioxidants, and complex carbohydrates',
      'Build a support network of friends, family, or support groups',
      'Set realistic goals and expectations for yourself',
      'Practice time management and break large tasks into smaller, manageable steps'
    ],
    whenToSeekHelp: [
      'Anxiety interferes with daily activities or relationships',
      'You experience panic attacks that are severe or frequent',
      'You find yourself avoiding situations due to anxiety',
      'You use alcohol or drugs to cope with anxiety',
      'You have thoughts of harming yourself or feelings of hopelessness'
    ]
  }
};

// Context tracking for more intelligent responses
interface ChatContext {
  recentTopics: string[];
  lastResponseTime: number;
  conversationStartTime: number;
}

let chatContext: ChatContext = {
  recentTopics: [],
  lastResponseTime: 0,
  conversationStartTime: 0
};

/**
 * Initializes or resets the chat context
 */
export function initChatContext() {
  chatContext = {
    recentTopics: [],
    lastResponseTime: Date.now(),
    conversationStartTime: Date.now()
  };
}

/**
 * Returns home remedy suggestions based on user input with improved context awareness
 */
export function getHomeRemedySuggestions(userInput: string): string {
  // Initialize context if this is the first message
  if (chatContext.conversationStartTime === 0) {
    initChatContext();
  }
  
  const input = userInput.toLowerCase();
  
  // Check for app-related questions first
  if (input.includes('app') || 
      input.includes('healthbridge') || 
      input.includes('feature') || 
      input.includes('how to use') || 
      input.includes('what can') || 
      input.includes('help me with')) {
    return handleAppQuestions(input);
  }
  
  let matchedCondition = '';
  let matchedInfo: RemedyInfo | null = null;
  
  // Update timestamps
  const now = Date.now();
  const timeSinceLastResponse = now - chatContext.lastResponseTime;
  chatContext.lastResponseTime = now;
  
  // Check if input matches any condition in our database
  for (const [condition, info] of Object.entries(remediesDatabase)) {
    if (info.condition.some(keyword => input.includes(keyword))) {
      matchedCondition = condition;
      matchedInfo = info;
      
      // Update context with this topic
      if (!chatContext.recentTopics.includes(condition)) {
        chatContext.recentTopics.unshift(condition);
        if (chatContext.recentTopics.length > 3) {
          chatContext.recentTopics.pop();
        }
      }
      break;
    }
  }
  
  // If no direct match found, check for partial matches
  if (!matchedInfo) {
    for (const [condition, info] of Object.entries(remediesDatabase)) {
      if (info.condition.some(keyword => 
        keyword.split(' ').some(word => input.includes(word) && word.length > 3)
      )) {
        matchedCondition = condition;
        matchedInfo = info;
        
        // Update context with this topic
        if (!chatContext.recentTopics.includes(condition)) {
          chatContext.recentTopics.unshift(condition);
          if (chatContext.recentTopics.length > 3) {
            chatContext.recentTopics.pop();
          }
        }
        break;
      }
    }
  }
  
  // Handle follow-up questions
  if (!matchedInfo && (input.includes('what') || input.includes('how') || input.includes('why') || 
                        input.includes('when') || input.includes('more') || input.includes('prevention'))) {
    // Check if we're continuing a previous topic
    if (chatContext.recentTopics.length > 0 && timeSinceLastResponse < 5 * 60 * 1000) { // 5 minutes
      const lastTopic = chatContext.recentTopics[0];
      const info = remediesDatabase[lastTopic];
      
      if (input.includes('prevent') || input.includes('avoid')) {
        return `Here are prevention tips for ${lastTopic}:\n\n${info.prevention.map(tip => `• ${tip}`).join('\n')}\n\nIs there anything else you'd like to know about ${lastTopic}?`;
      }
      
      if (input.includes('doctor') || input.includes('medical') || input.includes('help') || input.includes('serious')) {
        return `For ${lastTopic}, you should seek medical help if:\n\n${info.whenToSeekHelp.map(warning => `• ${warning}`).join('\n')}\n\nAlways consult a healthcare professional if you're concerned about your symptoms.`;
      }
      
      if (input.includes('more') || input.includes('else') || input.includes('additional')) {
        return `Here's additional information about ${lastTopic}:\n\n${formatAdditionalInfo(lastTopic, info)}\n\nIs there anything specific you'd like to know about ${lastTopic}?`;
      }
      
      // General follow-up
      return `We were discussing ${lastTopic}. What would you like to know more about? You can ask about remedies, prevention, or when to seek medical help.`;
    }
  }

  // Handle greetings and general questions
  if ((input.includes('hello') || input.includes('hi') || input.includes('hey')) && input.length < 10) {
    return "Hello! I'm your HealthBridge Assistant. How can I help you today? You can ask about common health conditions, home remedies, or how to use the HealthBridge app.";
  }
  
  if (input.includes('thank') || input.includes('thanks')) {
    return "You're welcome! Is there anything else I can help you with regarding your health concerns or using the HealthBridge app?";
  }
  
  if (input.includes('bye') || input.includes('goodbye')) {
    return "Take care of your health! Remember, I'm here anytime you need health advice or help with the app. Have a great day!";
  }
  
  // If we found a match, return formatted response
  if (matchedInfo) {
    return formatResponse(matchedCondition, matchedInfo);
  }
  
  // Suggest options if no match found
  return generateNoMatchResponse(input);
}

/**
 * Handle app-related questions
 */
function handleAppQuestions(input: string): string {
  if (input.includes('what is') || input.includes('about')) {
    return `${appInfo.general[0]}\n\n${appInfo.general[1]}\n\nHow can I help you use HealthBridge today?`;
  }
  
  if (input.includes('feature') || input.includes('what can') || input.includes('do for me')) {
    const featuresText = appInfo.features.map(feature => `• ${feature}`).join('\n');
    return `HealthBridge offers these key features:\n\n${featuresText}\n\nWhich feature would you like to know more about?`;
  }
  
  if (input.includes('how to') || input.includes('use') || input.includes('start')) {
    const usageText = appInfo.usage.map(tip => `• ${tip}`).join('\n');
    return `Here's how to get started with HealthBridge:\n\n${usageText}\n\nDo you need help with a specific feature?`;
  }
  
  if (input.includes('privacy') || input.includes('secure') || input.includes('data')) {
    const privacyText = appInfo.privacy.map(info => `• ${info}`).join('\n');
    return `Regarding your privacy in HealthBridge:\n\n${privacyText}\n\nYour health data security is our priority.`;
  }
  
  if (input.includes('telemedicine')) {
    return "HealthBridge's telemedicine feature allows you to connect with healthcare providers remotely through video or voice calls. You can schedule appointments, have consultations, and receive medical advice without leaving your home. To use this feature, go to the Telemedicine section and select 'Schedule New Appointment'.";
  }
  
  if (input.includes('symptom') || input.includes('checker')) {
    return "The Symptom Checker helps you assess your health concerns by answering questions about your symptoms. It provides preliminary guidance and suggests whether you should seek professional medical care. This tool is for informational purposes only and doesn't replace professional medical advice.";
  }
  
  if (input.includes('health record') || input.includes('medical record')) {
    return "HealthBridge allows you to securely store and access your health records. You can upload documents, track medications, store test results, and share this information with your healthcare providers. Your data is encrypted and only accessible to you and the providers you authorize.";
  }
  
  if (input.includes('healthcare worker') || input.includes('find doctor')) {
    return "The Healthcare Worker Network helps you find medical professionals in your area. You can search by specialty, read reviews, check availability, and connect directly through the app. This feature makes it easier to find the right healthcare provider for your specific needs.";
  }
  
  // General app information if no specific topic matched
  return "HealthBridge is your comprehensive healthcare companion app. You can use it for telemedicine consultations, checking symptoms, storing health records, finding healthcare workers, and getting reliable home remedy information. What specific aspect of the app would you like to learn more about?";
}

function formatResponse(condition: string, info: RemedyInfo): string {
  const conditionName = condition.charAt(0).toUpperCase() + condition.slice(1);
  
  let response = `Here are some home remedies for ${conditionName}:\n\n`;
  
  response += info.remedies.map(remedy => `• ${remedy}`).join('\n');
  
  response += '\n\nPrevention tips:\n';
  response += info.prevention.slice(0, 3).map(tip => `• ${tip}`).join('\n');
  
  response += '\n\nWhen to seek medical help:\n';
  response += info.whenToSeekHelp.slice(0, 3).map(warning => `• ${warning}`).join('\n');
  
  // Fix the syntax error by escaping the apostrophe
  response += '\n\nRemember: This information is not a substitute for professional medical advice. If you\'re concerned about your symptoms, please consult a healthcare provider.';
  
  return response;
}

function generateNoMatchResponse(input: string): string {
  // Attempt to provide helpful direction
  if (input.includes('pain')) {
    return "I notice you mentioned pain, but I need more details to provide specific advice. Could you specify where you're experiencing pain (like head, stomach, back, joints) and any other symptoms?";
  }
  
  if (input.includes('sick') || input.includes('ill')) {
    return "I'm sorry to hear you're not feeling well. To better help you, could you share more specific symptoms you're experiencing? For example, do you have fever, cough, headache, or stomach issues?";
  }
  
  // Default response with suggestions
  return `I don't have specific information about "${input}". I can provide home remedies for common conditions like:\n\n` +
    `• Headaches and migraines\n` +
    `• Colds and fever\n` +
    `• Sore throat\n` +
    `• Stomach issues\n` +
    `• Back pain\n` +
    `• Sleep problems\n` +
    `• Allergies\n` +
    `• Anxiety and stress\n\n` +
    `Or I can help you with using the HealthBridge app. Could you provide more details about what you'd like help with?`;
}

function formatAdditionalInfo(condition: string, info: RemedyInfo): string {
  switch(condition) {
    case 'headache':
      return "There are different types of headaches including tension headaches, migraines, and cluster headaches. Each may respond differently to treatments. For persistent headaches, keeping a headache diary can help identify triggers.";
    case 'soreThroat':
      return "Most sore throats are caused by viruses and resolve within a week. Bacterial infections like strep throat may require antibiotics. Voice rest can help with healing if you're experiencing hoarseness along with your sore throat.";
    case 'stomachPain':
      return "Stomach pain can be caused by various factors including indigestion, food poisoning, or gas. Paying attention to when pain occurs (before or after eating) can help identify the cause. A food journal might help identify trigger foods.";
    case 'cold':
      return "The common cold typically lasts 7-10 days. Antibiotics are not effective for colds as they're caused by viruses. Getting plenty of rest and staying hydrated are crucial for recovery.";
    case 'fever':
      return "Fever is a natural defense mechanism that helps your body fight infection. Adults typically can handle a fever up to 103°F (39.4°C) without serious concern. Sweating as fever breaks is normal and helps cool the body.";
    case 'backPain':
      return "Back pain affects approximately 80% of adults at some point in their lives. Most acute back pain resolves within 6 weeks. Maintaining good posture and a healthy weight are important for back health.";
    case 'insomnia':
      return "Chronic insomnia can impact immune function, mood, and cognitive abilities. Establishing a consistent sleep and wake schedule can help regulate your body's internal clock over time.";
    case 'allergies':
      return "Allergies occur when your immune system reacts to a foreign substance. Seasonal allergies may change in severity from year to year. Allergy testing can help identify specific allergens to avoid.";
    case 'anxiety':
      return "Occasional anxiety is a normal part of life. However, anxiety disorders involve excessive worry that interferes with daily activities. Cognitive behavioral therapy (CBT) is one of the most effective treatments for anxiety disorders.";
    default:
      return `${condition.charAt(0).toUpperCase() + condition.slice(1)} symptoms can vary in severity. It's important to monitor your symptoms and seek professional medical advice if they worsen or persist.`;
  }
}
