
interface RemedyInfo {
  condition: string[];
  remedies: string[];
  prevention: string[];
  whenToSeekHelp: string[];
}

// Database of home remedies for common conditions
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
  }
};

/**
 * Returns home remedy suggestions based on user input
 */
export function getHomeRemedySuggestions(userInput: string): string {
  const input = userInput.toLowerCase();
  
  // Check if input matches any condition in our database
  for (const [condition, info] of Object.entries(remediesDatabase)) {
    if (info.condition.some(keyword => input.includes(keyword))) {
      return formatResponse(condition, info);
    }
  }
  
  // If no direct match found, check for partial matches
  for (const [condition, info] of Object.entries(remediesDatabase)) {
    if (info.condition.some(keyword => 
      keyword.split(' ').some(word => input.includes(word) && word.length > 3)
    )) {
      return formatResponse(condition, info);
    }
  }
  
  // If no match found
  return `I don't have specific information about "${userInput}". I can provide home remedies for common conditions like headaches, sore throats, stomach pain, colds, and fever. Could you provide more details about your symptoms?`;
}

function formatResponse(condition: string, info: RemedyInfo): string {
  const conditionName = condition.charAt(0).toUpperCase() + condition.slice(1);
  
  let response = `Here are some home remedies for ${conditionName}:\n\n`;
  
  response += info.remedies.map(remedy => `• ${remedy}`).join('\n');
  
  response += '\n\nPrevention tips:\n';
  response += info.prevention.slice(0, 3).map(tip => `• ${tip}`).join('\n');
  
  response += '\n\nWhen to seek medical help:\n';
  response += info.whenToSeekHelp.slice(0, 3).map(warning => `• ${warning}`).join('\n');
  
  response += '\n\nRemember: This information is not a substitute for professional medical advice. If you\'re concerned about your symptoms, please consult a healthcare provider.';
  
  return response;
}
