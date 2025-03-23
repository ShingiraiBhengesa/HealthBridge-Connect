// This file contains data for the symptom checker decision tree
// In a production app, this would be more comprehensive and developed with medical professionals

export interface SymptomNode {
  id: string;
  text: string;
  children?: string[];
  isLeaf?: boolean;
  recommendation?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  followUpRequired?: boolean;
}

export interface SymptomTree {
  [key: string]: SymptomNode;
}

// Simple symptom decision tree
export const symptomTree: SymptomTree = {
  // Root nodes - main symptom categories
  'root': {
    id: 'root',
    text: 'What is your main symptom?',
    children: ['fever', 'pain', 'respiratory', 'digestive', 'skin', 'other'],
  },
  
  // Fever branch
  'fever': {
    id: 'fever',
    text: 'Do you have a fever?',
    children: ['fever-high', 'fever-low'],
  },
  'fever-high': {
    id: 'fever-high',
    text: 'Is your temperature above 39°C/102°F?',
    children: ['fever-high-other', 'fever-moderate-other'],
  },
  'fever-low': {
    id: 'fever-low',
    text: 'Is your temperature between 37.5-38.9°C/99.5-102°F?',
    children: ['fever-moderate-other', 'fever-low-duration'],
  },
  'fever-high-other': {
    id: 'fever-high-other',
    text: 'Do you also have a severe headache, stiff neck, or confusion?',
    children: ['fever-emergency', 'fever-high-duration'],
  },
  'fever-moderate-other': {
    id: 'fever-moderate-other',
    text: 'Do you also have a rash or difficulty breathing?',
    children: ['fever-urgent', 'fever-moderate-duration'],
  },
  'fever-low-duration': {
    id: 'fever-low-duration',
    text: 'Has the fever lasted more than 3 days?',
    children: ['fever-moderate-duration', 'fever-mild'],
  },
  'fever-high-duration': {
    id: 'fever-high-duration',
    text: 'Has the high fever lasted more than 24 hours?',
    children: ['fever-urgent', 'fever-moderate'],
  },
  'fever-moderate-duration': {
    id: 'fever-moderate-duration',
    text: 'Has the fever lasted more than 5 days?',
    children: ['fever-urgent', 'fever-moderate'],
  },
  'fever-emergency': {
    id: 'fever-emergency',
    text: 'This could be a medical emergency.',
    isLeaf: true,
    recommendation: 'Seek medical attention immediately. These symptoms could indicate a serious condition such as meningitis.',
    severity: 'severe',
    followUpRequired: true,
  },
  'fever-urgent': {
    id: 'fever-urgent',
    text: 'This requires urgent medical attention.',
    isLeaf: true,
    recommendation: 'You should see a healthcare provider within 24 hours. Until then, take fever reducers as directed, rest, and drink plenty of fluids.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'fever-moderate': {
    id: 'fever-moderate',
    text: 'This requires attention but is not an emergency.',
    isLeaf: true,
    recommendation: 'Take fever reducers as directed, rest, and drink plenty of fluids. If symptoms worsen or don\'t improve in 48 hours, seek medical attention.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'fever-mild': {
    id: 'fever-mild',
    text: 'This appears to be a mild fever.',
    isLeaf: true,
    recommendation: 'Rest, stay hydrated, and take over-the-counter fever reducers as directed. Monitor for any changes in symptoms.',
    severity: 'mild',
    followUpRequired: false,
  },
  
  // Pain branch
  'pain': {
    id: 'pain',
    text: 'Where is your pain located?',
    children: ['pain-head', 'pain-chest', 'pain-abdomen', 'pain-joint'],
  },
  'pain-head': {
    id: 'pain-head',
    text: 'Do you have a headache?',
    children: ['pain-head-severe', 'pain-head-moderate'],
  },
  'pain-head-severe': {
    id: 'pain-head-severe',
    text: 'Is your headache the worst you\'ve ever experienced, or did it come on suddenly and severely?',
    children: ['pain-head-emergency', 'pain-head-features'],
  },
  'pain-head-moderate': {
    id: 'pain-head-moderate',
    text: 'Have you had this headache for more than 3 days?',
    children: ['pain-head-persistent', 'pain-head-features'],
  },
  'pain-head-features': {
    id: 'pain-head-features',
    text: 'Do you also have fever, stiff neck, or sensitivity to light?',
    children: ['pain-head-urgent', 'pain-head-common'],
  },
  'pain-head-emergency': {
    id: 'pain-head-emergency',
    text: 'This could be a medical emergency.',
    isLeaf: true,
    recommendation: 'Seek immediate medical attention. A sudden, severe headache could indicate a serious condition such as a stroke or aneurysm.',
    severity: 'severe',
    followUpRequired: true,
  },
  'pain-head-urgent': {
    id: 'pain-head-urgent',
    text: 'This requires urgent medical attention.',
    isLeaf: true,
    recommendation: 'You should see a healthcare provider within 24 hours. These symptoms could indicate an infection or other serious condition.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'pain-head-persistent': {
    id: 'pain-head-persistent',
    text: 'This persistent headache should be evaluated.',
    isLeaf: true,
    recommendation: 'Make an appointment with a healthcare provider. In the meantime, you can try over-the-counter pain relievers and rest in a quiet, dark room.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'pain-head-common': {
    id: 'pain-head-common',
    text: 'This appears to be a common headache.',
    isLeaf: true,
    recommendation: 'Rest, stay hydrated, and take over-the-counter pain relievers as directed. If the headache worsens or doesn\'t improve in 48 hours, consult a healthcare provider.',
    severity: 'mild',
    followUpRequired: false,
  },
  
  // Chest pain branch
  'pain-chest': {
    id: 'pain-chest',
    text: 'Are you experiencing chest pain?',
    children: ['pain-chest-severe', 'pain-chest-moderate'],
  },
  'pain-chest-severe': {
    id: 'pain-chest-severe',
    text: 'Is the pain crushing, squeezing, or accompanied by shortness of breath, sweating, or nausea?',
    children: ['pain-chest-emergency', 'pain-chest-features'],
  },
  'pain-chest-moderate': {
    id: 'pain-chest-moderate',
    text: 'Does the pain get worse when you take a deep breath or cough?',
    children: ['pain-chest-respiratory', 'pain-chest-features'],
  },
  'pain-chest-features': {
    id: 'pain-chest-features',
    text: 'Have you had this pain for more than 24 hours?',
    children: ['pain-chest-persistent', 'pain-chest-new'],
  },
  'pain-chest-emergency': {
    id: 'pain-chest-emergency',
    text: 'This could be a medical emergency.',
    isLeaf: true,
    recommendation: 'Seek immediate medical attention. These symptoms could indicate a heart attack or other life-threatening condition.',
    severity: 'severe',
    followUpRequired: true,
  },
  'pain-chest-respiratory': {
    id: 'pain-chest-respiratory',
    text: 'This could be related to respiratory issues.',
    isLeaf: true,
    recommendation: 'You should see a healthcare provider within 24 hours. In the meantime, rest and avoid strenuous activities.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'pain-chest-persistent': {
    id: 'pain-chest-persistent',
    text: 'This persistent chest pain should be evaluated.',
    isLeaf: true,
    recommendation: 'Make an appointment with a healthcare provider. Persistent chest pain can indicate various conditions that need proper diagnosis.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'pain-chest-new': {
    id: 'pain-chest-new',
    text: 'This new chest pain should be evaluated.',
    isLeaf: true,
    recommendation: 'If the pain is mild and not accompanied by other serious symptoms, monitor it closely. If it worsens or doesn\'t improve in 24 hours, consult a healthcare provider.',
    severity: 'moderate',
    followUpRequired: true,
  },
  
  // Respiratory symptoms branch
  'respiratory': {
    id: 'respiratory',
    text: 'Are you having difficulty breathing?',
    children: ['respiratory-severe', 'respiratory-moderate'],
  },
  'respiratory-severe': {
    id: 'respiratory-severe',
    text: 'Are you struggling to catch your breath, or are your lips or face turning blue?',
    children: ['respiratory-emergency', 'respiratory-features'],
  },
  'respiratory-moderate': {
    id: 'respiratory-moderate',
    text: 'Are you feeling short of breath with minimal exertion?',
    children: ['respiratory-urgent', 'respiratory-mild'],
  },
  'respiratory-features': {
    id: 'respiratory-features',
    text: 'Do you also have a fever, cough, or chest pain?',
    children: ['respiratory-urgent', 'respiratory-mild'],
  },
  'respiratory-emergency': {
    id: 'respiratory-emergency',
    text: 'This could be a medical emergency.',
    isLeaf: true,
    recommendation: 'Seek immediate medical attention. Severe breathing difficulties can be life-threatening.',
    severity: 'severe',
    followUpRequired: true,
  },
  'respiratory-urgent': {
    id: 'respiratory-urgent',
    text: 'This requires urgent medical attention.',
    isLeaf: true,
    recommendation: 'You should see a healthcare provider within 24 hours. These symptoms could indicate an infection or other serious respiratory condition.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'respiratory-mild': {
    id: 'respiratory-mild',
    text: 'This appears to be a mild respiratory issue.',
    isLeaf: true,
    recommendation: 'Rest, stay hydrated, and monitor your symptoms. If they worsen or don\'t improve in 48 hours, consult a healthcare provider.',
    severity: 'mild',
    followUpRequired: false,
  },
  
  // Digestive symptoms branch
  'digestive': {
    id: 'digestive',
    text: 'Are you experiencing digestive issues?',
    children: ['digestive-severe', 'digestive-moderate'],
  },
  'digestive-severe': {
    id: 'digestive-severe',
    text: 'Are you experiencing severe abdominal pain, persistent vomiting, or blood in your stool?',
    children: ['digestive-emergency', 'digestive-features'],
  },
  'digestive-moderate': {
    id: 'digestive-moderate',
    text: 'Have you had diarrhea or vomiting for more than 24 hours?',
    children: ['digestive-dehydration', 'digestive-mild'],
  },
  'digestive-features': {
    id: 'digestive-features',
    text: 'Do you also have a fever or are you unable to keep fluids down?',
    children: ['digestive-urgent', 'digestive-mild'],
  },
  'digestive-emergency': {
    id: 'digestive-emergency',
    text: 'This could be a medical emergency.',
    isLeaf: true,
    recommendation: 'Seek immediate medical attention. These symptoms could indicate a serious digestive condition.',
    severity: 'severe',
    followUpRequired: true,
  },
  'digestive-dehydration': {
    id: 'digestive-dehydration',
    text: 'You may be at risk of dehydration.',
    isLeaf: true,
    recommendation: 'Try to drink clear fluids with electrolytes. If you\'re unable to keep fluids down or if symptoms persist, consult a healthcare provider.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'digestive-urgent': {
    id: 'digestive-urgent',
    text: 'This requires urgent medical attention.',
    isLeaf: true,
    recommendation: 'You should see a healthcare provider within 24 hours. These symptoms could indicate an infection or other serious condition.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'digestive-mild': {
    id: 'digestive-mild',
    text: 'This appears to be a mild digestive issue.',
    isLeaf: true,
    recommendation: 'Rest, stay hydrated, and consider a bland diet. If symptoms worsen or don\'t improve in 48 hours, consult a healthcare provider.',
    severity: 'mild',
    followUpRequired: false,
  },
  
  // Skin symptoms branch
  'skin': {
    id: 'skin',
    text: 'Are you experiencing skin issues?',
    children: ['skin-severe', 'skin-moderate'],
  },
  'skin-severe': {
    id: 'skin-severe',
    text: 'Do you have a widespread rash that came on suddenly with fever or difficulty breathing?',
    children: ['skin-emergency', 'skin-features'],
  },
  'skin-moderate': {
    id: 'skin-moderate',
    text: 'Is the rash painful, blistering, or spreading rapidly?',
    children: ['skin-urgent', 'skin-mild'],
  },
  'skin-features': {
    id: 'skin-features',
    text: 'Is the affected area red, warm, swollen, or increasingly painful?',
    children: ['skin-infection', 'skin-mild'],
  },
  'skin-emergency': {
    id: 'skin-emergency',
    text: 'This could be a medical emergency.',
    isLeaf: true,
    recommendation: 'Seek immediate medical attention. These symptoms could indicate a severe allergic reaction or other serious condition.',
    severity: 'severe',
    followUpRequired: true,
  },
  'skin-urgent': {
    id: 'skin-urgent',
    text: 'This requires urgent medical attention.',
    isLeaf: true,
    recommendation: 'You should see a healthcare provider within 24 hours. These symptoms could indicate an infection or other serious skin condition.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'skin-infection': {
    id: 'skin-infection',
    text: 'This could be a skin infection.',
    isLeaf: true,
    recommendation: 'Make an appointment with a healthcare provider. In the meantime, keep the area clean and avoid scratching or irritating it further.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'skin-mild': {
    id: 'skin-mild',
    text: 'This appears to be a mild skin issue.',
    isLeaf: true,
    recommendation: 'Keep the area clean and dry. Avoid potential irritants like harsh soaps. If the condition worsens or doesn\'t improve in 48 hours, consult a healthcare provider.',
    severity: 'mild',
    followUpRequired: false,
  },
  
  // Other symptoms (catch-all)
  'other': {
    id: 'other',
    text: 'Are you experiencing other concerning symptoms?',
    children: ['other-severe', 'other-moderate'],
  },
  'other-severe': {
    id: 'other-severe',
    text: 'Are your symptoms severe, or have they come on suddenly?',
    children: ['other-urgent', 'other-duration'],
  },
  'other-moderate': {
    id: 'other-moderate',
    text: 'Have your symptoms been persistent or gradually worsening?',
    children: ['other-duration', 'other-mild'],
  },
  'other-duration': {
    id: 'other-duration',
    text: 'Have you had these symptoms for more than 7 days?',
    children: ['other-persistent', 'other-new'],
  },
  'other-urgent': {
    id: 'other-urgent',
    text: 'These symptoms require medical attention.',
    isLeaf: true,
    recommendation: 'You should see a healthcare provider within 24 hours to evaluate these concerning symptoms.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'other-persistent': {
    id: 'other-persistent',
    text: 'These persistent symptoms should be evaluated.',
    isLeaf: true,
    recommendation: 'Make an appointment with a healthcare provider to evaluate these ongoing symptoms.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'other-new': {
    id: 'other-new',
    text: 'These new symptoms should be monitored.',
    isLeaf: true,
    recommendation: 'Monitor your symptoms closely. If they worsen or don\'t improve in the next few days, consult a healthcare provider.',
    severity: 'mild',
    followUpRequired: false,
  },
  'other-mild': {
    id: 'other-mild',
    text: 'These appear to be mild symptoms.',
    isLeaf: true,
    recommendation: 'Rest and monitor your symptoms. If they worsen or don\'t improve in 48 hours, consult a healthcare provider.',
    severity: 'mild',
    followUpRequired: false,
  },
};

// Function to navigate the symptom tree
export function navigateSymptomTree(nodeId: string): SymptomNode {
  return symptomTree[nodeId] || symptomTree['root'];
}

// Function to get leaf node by traversing choices
export function getLeafNode(choices: string[]): SymptomNode | null {
  let currentNode = symptomTree['root'];
  
  for (const choice of choices) {
    if (!currentNode.children || !currentNode.children.includes(choice)) {
      return null; // Invalid choice path
    }
    
    currentNode = symptomTree[choice];
    
    if (!currentNode) {
      return null; // Node not found
    }
  }
  
  return currentNode;
}

// Function to get severity color
export function getSeverityColor(severity: string | undefined): string {
  switch (severity) {
    case 'severe':
      return 'text-red-600';
    case 'moderate':
      return 'text-amber-600';
    case 'mild':
      return 'text-green-600';
    default:
      return 'text-blue-600';
  }
}

// Function to get severity background color
export function getSeverityBgColor(severity: string | undefined): string {
  switch (severity) {
    case 'severe':
      return 'bg-red-100 border-red-200';
    case 'moderate':
      return 'bg-amber-100 border-amber-200';
    case 'mild':
      return 'bg-green-100 border-green-200';
    default:
      return 'bg-blue-100 border-blue-200';
  }
}
