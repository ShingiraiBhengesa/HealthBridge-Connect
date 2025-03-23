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
  icon?: string; // Added icon property for visual identification
}

export interface SymptomTree {
  [key: string]: SymptomNode;
}

// Helper function to navigate the symptom tree
export function navigateSymptomTree(nodeId: string): SymptomNode {
  return symptomTree[nodeId] || { id: 'not-found', text: 'Symptom not found' };
}

// Helper function to get severity color
export function getSeverityColor(severity?: string): string {
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

// Helper function to get severity background color
export function getSeverityBgColor(severity?: string): string {
  switch (severity) {
    case 'severe':
      return 'bg-red-100';
    case 'moderate':
      return 'bg-amber-100';
    case 'mild':
      return 'bg-green-100';
    default:
      return 'bg-blue-100';
  }
}

// Simple symptom decision tree
export const symptomTree: SymptomTree = {
  // Root nodes - main symptom categories
  'root': {
    id: 'root',
    text: 'What is your main symptom?',
    children: [
      'fever', 
      'pain', 
      'respiratory', 
      'digestive', 
      'skin', 
      'neurological', 
      'mental', 
      'cardiovascular', 
      'urinary', 
      'eyes', 
      'ears', 
      'other'
    ],
  },
  
  // Fever branch
  'fever': {
    id: 'fever',
    text: 'Do you have a fever?',
    children: ['fever-high', 'fever-low'],
    icon: 'Thermometer',
  },
  'fever-high': {
    id: 'fever-high',
    text: 'Is your fever high (over 103°F or 39.4°C)?',
    children: ['fever-high-symptoms', 'fever-emergency'],
  },
  'fever-low': {
    id: 'fever-low',
    text: 'Is your fever low (below 103°F or 39.4°C)?',
    children: ['fever-low-symptoms', 'fever-home'],
  },
  'fever-high-symptoms': {
    id: 'fever-high-symptoms',
    text: 'Do you have other severe symptoms like stiff neck, confusion, or difficulty breathing?',
    children: ['fever-emergency', 'fever-severe'],
  },
  'fever-low-symptoms': {
    id: 'fever-low-symptoms',
    text: 'Do you have mild symptoms like cough, fatigue, or body aches?',
    children: ['fever-mild', 'fever-moderate'],
  },
  'fever-emergency': {
    id: 'fever-emergency',
    text: 'This could be a medical emergency.',
    isLeaf: true,
    recommendation: 'Seek immediate medical attention. High fever with severe symptoms can be dangerous.',
    severity: 'severe',
    followUpRequired: true,
  },
  'fever-severe': {
    id: 'fever-severe',
    text: 'This appears to be a severe fever.',
    isLeaf: true,
    recommendation: 'Consult a healthcare provider as soon as possible. A severe fever may require medical intervention.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'fever-mild': {
    id: 'fever-mild',
    text: 'This appears to be a mild fever.',
    isLeaf: true,
    recommendation: 'Rest, stay hydrated, and take over-the-counter fever reducers as directed. If symptoms worsen, consult a healthcare provider.',
    severity: 'mild',
    followUpRequired: false,
  },
  'fever-moderate': {
    id: 'fever-moderate',
    text: 'This appears to be a moderate fever.',
    isLeaf: true,
    recommendation: 'Rest, stay hydrated, and monitor your symptoms. If symptoms persist for more than 3 days, consult a healthcare provider.',
    severity: 'moderate',
    followUpRequired: false,
  },
  'fever-home': {
    id: 'fever-home',
    text: 'This appears to be manageable at home.',
    isLeaf: true,
    recommendation: 'Rest, stay hydrated, and take over-the-counter fever reducers as directed.',
    severity: 'mild',
    followUpRequired: false,
  },
  
  // Pain branch
  'pain': {
    id: 'pain',
    text: 'Where is your pain located?',
    children: ['pain-head', 'pain-chest', 'pain-abdomen', 'pain-joint', 'pain-back', 'pain-extremities'],
    icon: 'HeartPulse',
  },
  'pain-head': {
    id: 'pain-head',
    text: 'Do you have a headache?',
    children: ['pain-head-severe', 'pain-head-mild'],
  },
  'pain-head-severe': {
    id: 'pain-head-severe',
    text: 'Is your headache severe, sudden, or accompanied by fever, stiff neck, or vision changes?',
    children: ['pain-head-emergency', 'pain-head-migraine'],
  },
  'pain-head-mild': {
    id: 'pain-head-mild',
    text: 'Is your headache mild to moderate without other concerning symptoms?',
    children: ['pain-head-tension', 'pain-head-cluster'],
  },
  'pain-head-emergency': {
    id: 'pain-head-emergency',
    text: 'This could be a medical emergency.',
    isLeaf: true,
    recommendation: 'Seek immediate medical attention. Severe headache with these symptoms can indicate a serious condition.',
    severity: 'severe',
    followUpRequired: true,
  },
  'pain-head-migraine': {
    id: 'pain-head-migraine',
    text: 'This appears to be a migraine.',
    isLeaf: true,
    recommendation: 'Rest in a dark, quiet room, and take migraine-specific medications if prescribed. Consult a healthcare provider for ongoing management.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'pain-head-tension': {
    id: 'pain-head-tension',
    text: 'This appears to be a tension headache.',
    isLeaf: true,
    recommendation: 'Rest, stay hydrated, and take over-the-counter pain relievers as directed. If headaches become frequent, consult a healthcare provider.',
    severity: 'mild',
    followUpRequired: false,
  },
  'pain-head-cluster': {
    id: 'pain-head-cluster',
    text: 'This appears to be a cluster headache.',
    isLeaf: true,
    recommendation: 'Consult a healthcare provider for diagnosis and treatment options. Cluster headaches often require specialized care.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'pain-chest': {
    id: 'pain-chest',
    text: 'Are you experiencing chest pain?',
    children: ['pain-chest-severe', 'pain-chest-mild'],
  },
  'pain-chest-severe': {
    id: 'pain-chest-severe',
    text: 'Is your chest pain severe, crushing, or accompanied by shortness of breath, sweating, or nausea?',
    children: ['pain-chest-emergency', 'pain-chest-angina'],
  },
  'pain-chest-mild': {
    id: 'pain-chest-mild',
    text: 'Is your chest pain mild, possibly related to heartburn or muscle strain?',
    children: ['pain-chest-heartburn', 'pain-chest-muscle'],
  },
  'pain-chest-emergency': {
    id: 'pain-chest-emergency',
    text: 'This could be a medical emergency.',
    isLeaf: true,
    recommendation: 'Seek immediate medical attention. Chest pain with these symptoms can indicate a heart attack.',
    severity: 'severe',
    followUpRequired: true,
  },
  'pain-chest-angina': {
    id: 'pain-chest-angina',
    text: 'This appears to be angina.',
    isLeaf: true,
    recommendation: 'Consult a healthcare provider for evaluation. Angina requires medical management to prevent heart problems.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'pain-chest-heartburn': {
    id: 'pain-chest-heartburn',
    text: 'This appears to be heartburn.',
    isLeaf: true,
    recommendation: 'Take over-the-counter antacids and avoid trigger foods. If symptoms persist, consult a healthcare provider.',
    severity: 'mild',
    followUpRequired: false,
  },
  'pain-chest-muscle': {
    id: 'pain-chest-muscle',
    text: 'This appears to be muscle strain.',
    isLeaf: true,
    recommendation: 'Rest, apply ice, and take over-the-counter pain relievers as directed. If pain worsens, consult a healthcare provider.',
    severity: 'mild',
    followUpRequired: false,
  },
  'pain-abdomen': {
    id: 'pain-abdomen',
    text: 'Are you experiencing abdominal pain?',
    children: ['pain-abdomen-severe', 'pain-abdomen-mild'],
  },
  'pain-abdomen-severe': {
    id: 'pain-abdomen-severe',
    text: 'Is your abdominal pain severe, constant, or accompanied by fever, vomiting, or bloody stools?',
    children: ['pain-abdomen-emergency', 'pain-abdomen-appendicitis'],
  },
  'pain-abdomen-mild': {
    id: 'pain-abdomen-mild',
    text: 'Is your abdominal pain mild, possibly related to gas or indigestion?',
    children: ['pain-abdomen-gas', 'pain-abdomen-indigestion'],
  },
  'pain-abdomen-emergency': {
    id: 'pain-abdomen-emergency',
    text: 'This could be a medical emergency.',
    isLeaf: true,
    recommendation: 'Seek immediate medical attention. Severe abdominal pain with these symptoms can indicate a serious condition.',
    severity: 'severe',
    followUpRequired: true,
  },
  'pain-abdomen-appendicitis': {
    id: 'pain-abdomen-appendicitis',
    text: 'This could be appendicitis.',
    isLeaf: true,
    recommendation: 'Seek immediate medical attention. Appendicitis usually requires surgery.',
    severity: 'severe',
    followUpRequired: true,
  },
  'pain-abdomen-gas': {
    id: 'pain-abdomen-gas',
    text: 'This appears to be gas pain.',
    isLeaf: true,
    recommendation: 'Take over-the-counter gas relief medications and avoid gas-producing foods. If symptoms persist, consult a healthcare provider.',
    severity: 'mild',
    followUpRequired: false,
  },
  'pain-abdomen-indigestion': {
    id: 'pain-abdomen-indigestion',
    text: 'This appears to be indigestion.',
    isLeaf: true,
    recommendation: 'Take over-the-counter antacids and avoid trigger foods. If symptoms persist, consult a healthcare provider.',
    severity: 'mild',
    followUpRequired: false,
  },
  'pain-joint': {
    id: 'pain-joint',
    text: 'Are you experiencing joint pain?',
    children: ['pain-joint-severe', 'pain-joint-mild'],
  },
  'pain-joint-severe': {
    id: 'pain-joint-severe',
    text: 'Is your joint pain severe, sudden, or accompanied by swelling, redness, or fever?',
    children: ['pain-joint-emergency', 'pain-joint-arthritis'],
  },
  'pain-joint-mild': {
    id: 'pain-joint-mild',
    text: 'Is your joint pain mild, possibly related to overuse or minor injury?',
    children: ['pain-joint-overuse', 'pain-joint-injury'],
  },
  'pain-joint-emergency': {
    id: 'pain-joint-emergency',
    text: 'This could be a medical emergency.',
    isLeaf: true,
    recommendation: 'Seek immediate medical attention. Severe joint pain with these symptoms can indicate a serious condition.',
    severity: 'severe',
    followUpRequired: true,
  },
  'pain-joint-arthritis': {
    id: 'pain-joint-arthritis',
    text: 'This appears to be arthritis.',
    isLeaf: true,
    recommendation: 'Consult a healthcare provider for diagnosis and management. Arthritis often requires ongoing care.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'pain-joint-overuse': {
    id: 'pain-joint-overuse',
    text: 'This appears to be overuse pain.',
    isLeaf: true,
    recommendation: 'Rest the affected area, apply ice, and take over-the-counter pain relievers as directed. If pain persists, consult a healthcare provider.',
    severity: 'mild',
    followUpRequired: false,
  },
  'pain-joint-injury': {
    id: 'pain-joint-injury',
    text: 'This appears to be injury-related pain.',
    isLeaf: true,
    recommendation: 'Rest, apply ice, and take over-the-counter pain relievers as directed. If pain worsens or doesn\'t improve, consult a healthcare provider.',
    severity: 'mild',
    followUpRequired: false,
  },
  'pain-back': {
    id: 'pain-back',
    text: 'Do you have back pain?',
    children: ['pain-back-severe', 'pain-back-moderate'],
  },
  'pain-back-severe': {
    id: 'pain-back-severe',
    text: 'Is your back pain severe, sudden, or accompanied by numbness, tingling or weakness in the legs?',
    children: ['pain-back-emergency', 'pain-back-features'],
  },
  'pain-back-moderate': {
    id: 'pain-back-moderate',
    text: 'Have you had this back pain for more than 6 weeks?',
    children: ['pain-back-chronic', 'pain-back-features'],
  },
  'pain-back-features': {
    id: 'pain-back-features',
    text: 'Does the pain worsen with certain movements or activities?',
    children: ['pain-back-mechanical', 'pain-back-common'],
  },
  'pain-back-emergency': {
    id: 'pain-back-emergency',
    text: 'This could be a medical emergency.',
    isLeaf: true,
    recommendation: 'Seek immediate medical attention. These symptoms could indicate a serious spinal condition that requires urgent care.',
    severity: 'severe',
    followUpRequired: true,
  },
  'pain-back-chronic': {
    id: 'pain-back-chronic',
    text: 'This appears to be chronic back pain.',
    isLeaf: true,
    recommendation: 'Make an appointment with a healthcare provider for evaluation. Chronic back pain can be managed with proper treatment.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'pain-back-mechanical': {
    id: 'pain-back-mechanical',
    text: 'This appears to be mechanical back pain.',
    isLeaf: true,
    recommendation: 'Rest the affected area, apply ice for inflammation, and take over-the-counter pain relievers as directed. If pain persists for more than 2 weeks, consult a healthcare provider.',
    severity: 'moderate',
    followUpRequired: false,
  },
  'pain-back-common': {
    id: 'pain-back-common',
    text: 'This appears to be common back pain.',
    isLeaf: true,
    recommendation: 'Rest, maintain good posture, and take over-the-counter pain relievers as directed. If pain worsens or doesn\'t improve in a week, consult a healthcare provider.',
    severity: 'mild',
    followUpRequired: false,
  },
  
  'pain-extremities': {
    id: 'pain-extremities',
    text: 'Do you have pain in your arms or legs?',
    children: ['pain-extremities-severe', 'pain-extremities-moderate'],
  },
  'pain-extremities-severe': {
    id: 'pain-extremities-severe',
    text: 'Is the pain severe, sudden, or accompanied by swelling, redness, or inability to bear weight?',
    children: ['pain-extremities-emergency', 'pain-extremities-features'],
  },
  'pain-extremities-moderate': {
    id: 'pain-extremities-moderate',
    text: 'Have you had this pain for more than 2 weeks?',
    children: ['pain-extremities-persistent', 'pain-extremities-features'],
  },
  'pain-extremities-features': {
    id: 'pain-extremities-features',
    text: 'Is the pain worse after activity or at the end of the day?',
    children: ['pain-extremities-mechanical', 'pain-extremities-common'],
  },
  'pain-extremities-emergency': {
    id: 'pain-extremities-emergency',
    text: 'This could be a medical emergency.',
    isLeaf: true,
    recommendation: 'Seek immediate medical attention. These symptoms could indicate a fracture, infection, or other serious condition.',
    severity: 'severe',
    followUpRequired: true,
  },
  'pain-extremities-persistent': {
    id: 'pain-extremities-persistent',
    text: 'This appears to be persistent extremity pain.',
    isLeaf: true,
    recommendation: 'Make an appointment with a healthcare provider for evaluation. Persistent pain can indicate an underlying condition that needs proper diagnosis.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'pain-extremities-mechanical': {
    id: 'pain-extremities-mechanical',
    text: 'This appears to be activity-related pain.',
    isLeaf: true,
    recommendation: 'Rest the affected area, apply ice for inflammation or heat for stiffness, and take over-the-counter pain relievers as directed. If pain persists for more than 2 weeks, consult a healthcare provider.',
    severity: 'moderate',
    followUpRequired: false,
  },
  'pain-extremities-common': {
    id: 'pain-extremities-common',
    text: 'This appears to be common muscle or joint pain.',
    isLeaf: true,
    recommendation: 'Rest, apply ice for inflammation or heat for stiffness, and take over-the-counter pain relievers as directed. If pain worsens or doesn\'t improve in a week, consult a healthcare provider.',
    severity: 'mild',
    followUpRequired: false,
  },
  
  // Respiratory symptoms branch
  'respiratory': {
    id: 'respiratory',
    text: 'Are you having difficulty breathing?',
    children: ['respiratory-severe', 'respiratory-moderate'],
    icon: 'Lungs',
  },
  'respiratory-severe': {
    id: 'respiratory-severe',
    text: 'Are you having severe difficulty breathing, chest pain, or bluish lips or face?',
    children: ['respiratory-emergency', 'respiratory-asthma'],
  },
  'respiratory-moderate': {
    id: 'respiratory-moderate',
    text: 'Are you having moderate difficulty breathing, wheezing, or persistent cough?',
    children: ['respiratory-cold', 'respiratory-bronchitis'],
  },
  'respiratory-emergency': {
    id: 'respiratory-emergency',
    text: 'This could be a medical emergency.',
    isLeaf: true,
    recommendation: 'Seek immediate medical attention. Severe respiratory symptoms can be life-threatening.',
    severity: 'severe',
    followUpRequired: true,
  },
  'respiratory-asthma': {
    id: 'respiratory-asthma',
    text: 'This appears to be an asthma exacerbation.',
    isLeaf: true,
    recommendation: 'Use your prescribed inhaler and seek medical attention if symptoms do not improve. Asthma can be serious if not managed properly.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'respiratory-cold': {
    id: 'respiratory-cold',
    text: 'This appears to be a common cold.',
    isLeaf: true,
    recommendation: 'Rest, stay hydrated, and take over-the-counter cold medications as directed. If symptoms worsen, consult a healthcare provider.',
    severity: 'mild',
    followUpRequired: false,
  },
  'respiratory-bronchitis': {
    id: 'respiratory-bronchitis',
    text: 'This appears to be bronchitis.',
    isLeaf: true,
    recommendation: 'Rest, stay hydrated, and consult a healthcare provider if symptoms persist or worsen. Bronchitis may require medical treatment.',
    severity: 'moderate',
    followUpRequired: true,
  },
  
  // Digestive symptoms branch
  'digestive': {
    id: 'digestive',
    text: 'Are you experiencing digestive issues?',
    children: ['digestive-severe', 'digestive-moderate'],
    icon: 'Droplet',
  },
  'digestive-severe': {
    id: 'digestive-severe',
    text: 'Are you experiencing severe abdominal pain, bloody stools, or persistent vomiting?',
    children: ['digestive-emergency', 'digestive-infection'],
  },
  'digestive-moderate': {
    id: 'digestive-moderate',
    text: 'Are you experiencing persistent diarrhea, constipation, or nausea?',
    children: ['digestive-ibs', 'digestive-gerd'],
  },
  'digestive-emergency': {
    id: 'digestive-emergency',
    text: 'This could be a medical emergency.',
    isLeaf: true,
    recommendation: 'Seek immediate medical attention. Severe digestive symptoms can indicate a serious condition.',
    severity: 'severe',
    followUpRequired: true,
  },
  'digestive-infection': {
    id: 'digestive-infection',
    text: 'This could be a digestive infection.',
    isLeaf: true,
    recommendation: 'Consult a healthcare provider for diagnosis and treatment. Digestive infections may require antibiotics.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'digestive-ibs': {
    id: 'digestive-ibs',
    text: 'This could be irritable bowel syndrome (IBS).',
    isLeaf: true,
    recommendation: 'Consult a healthcare provider for diagnosis and management. IBS often requires dietary and lifestyle changes.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'digestive-gerd': {
    id: 'digestive-gerd',
    text: 'This could be gastroesophageal reflux disease (GERD).',
    isLeaf: true,
    recommendation: 'Avoid trigger foods, eat smaller meals, and take over-the-counter antacids. If symptoms persist, consult a healthcare provider.',
    severity: 'moderate',
    followUpRequired: true,
  },
  
  // Skin symptoms branch
  'skin': {
    id: 'skin',
    text: 'Are you experiencing skin issues?',
    children: ['skin-severe', 'skin-moderate'],
    icon: 'FlaskConical',
  },
  'skin-severe': {
    id: 'skin-severe',
    text: 'Are you experiencing a widespread rash, blistering, or signs of infection?',
    children: ['skin-emergency', 'skin-allergy'],
  },
  'skin-moderate': {
    id: 'skin-moderate',
    text: 'Are you experiencing localized itching, redness, or minor rash?',
    children: ['skin-eczema', 'skin-hives'],
  },
  'skin-emergency': {
    id: 'skin-emergency',
    text: 'This could be a medical emergency.',
    isLeaf: true,
    recommendation: 'Seek immediate medical attention. Severe skin symptoms can indicate a serious allergic reaction or infection.',
    severity: 'severe',
    followUpRequired: true,
  },
  'skin-allergy': {
    id: 'skin-allergy',
    text: 'This could be an allergic reaction.',
    isLeaf: true,
    recommendation: 'Avoid the allergen, take antihistamines, and consult a healthcare provider if symptoms worsen. Severe allergic reactions may require epinephrine.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'skin-eczema': {
    id: 'skin-eczema',
    text: 'This could be eczema.',
    isLeaf: true,
    recommendation: 'Use moisturizers, avoid irritants, and consult a healthcare provider for prescription treatments if needed. Eczema often requires ongoing management.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'skin-hives': {
    id: 'skin-hives',
    text: 'This could be hives.',
    isLeaf: true,
    recommendation: 'Take antihistamines and avoid known triggers. If hives persist or worsen, consult a healthcare provider.',
    severity: 'moderate',
    followUpRequired: true,
  },
  
  // Neurological symptoms branch (NEW)
  'neurological': {
    id: 'neurological',
    text: 'Are you experiencing neurological symptoms?',
    children: ['neurological-severe', 'neurological-moderate'],
    icon: 'Brain',
  },
  'neurological-severe': {
    id: 'neurological-severe',
    text: 'Are you experiencing sudden weakness, numbness, confusion, difficulty speaking, or severe headache?',
    children: ['neurological-emergency', 'neurological-features'],
  },
  'neurological-moderate': {
    id: 'neurological-moderate',
    text: 'Have you experienced persistent headaches, dizziness, or memory issues?',
    children: ['neurological-persistent', 'neurological-features'],
  },
  'neurological-features': {
    id: 'neurological-features',
    text: 'Are your symptoms affecting your daily activities or quality of life?',
    children: ['neurological-disruptive', 'neurological-mild'],
  },
  'neurological-emergency': {
    id: 'neurological-emergency',
    text: 'This could be a medical emergency.',
    isLeaf: true,
    recommendation: 'Seek immediate medical attention. These symptoms could indicate a stroke or other serious neurological condition.',
    severity: 'severe',
    followUpRequired: true,
  },
  'neurological-persistent': {
    id: 'neurological-persistent',
    text: 'These persistent neurological symptoms should be evaluated.',
    isLeaf: true,
    recommendation: 'Make an appointment with a healthcare provider. Persistent neurological symptoms can indicate conditions that need proper diagnosis.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'neurological-disruptive': {
    id: 'neurological-disruptive',
    text: 'These disruptive neurological symptoms should be evaluated.',
    isLeaf: true,
    recommendation: 'Make an appointment with a healthcare provider. Neurological symptoms that affect daily functioning can be managed with proper care.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'neurological-mild': {
    id: 'neurological-mild',
    text: 'These appear to be mild neurological symptoms.',
    isLeaf: true,
    recommendation: 'Monitor your symptoms, ensure you\'re getting adequate rest and staying hydrated. If symptoms persist for more than a week or worsen, consult a healthcare provider.',
    severity: 'mild',
    followUpRequired: false,
  },
  
  // Mental health symptoms branch (NEW)
  'mental': {
    id: 'mental',
    text: 'Are you experiencing mental health concerns?',
    children: ['mental-severe', 'mental-moderate'],
    icon: 'BrainCircuit',
  },
  'mental-severe': {
    id: 'mental-severe',
    text: 'Are you having thoughts of harming yourself or others, or experiencing severe changes in mood or behavior?',
    children: ['mental-emergency', 'mental-features'],
  },
  'mental-moderate': {
    id: 'mental-moderate',
    text: 'Have you been experiencing persistent feelings of sadness, anxiety, or changes in sleep or appetite?',
    children: ['mental-persistent', 'mental-features'],
  },
  'mental-features': {
    id: 'mental-features',
    text: 'Are these feelings affecting your daily activities or relationships?',
    children: ['mental-disruptive', 'mental-mild'],
  },
  'mental-emergency': {
    id: 'mental-emergency',
    text: 'This could be a mental health emergency.',
    isLeaf: true,
    recommendation: 'Seek immediate help. Call a mental health crisis line or go to your local emergency room.',
    severity: 'severe',
    followUpRequired: true,
  },
  'mental-persistent': {
    id: 'mental-persistent',
    text: 'These persistent mental health symptoms should be evaluated.',
    isLeaf: true,
    recommendation: 'Make an appointment with a mental health professional. Persistent symptoms can be managed with proper care.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'mental-disruptive': {
    id: 'mental-disruptive',
    text: 'These disruptive mental health symptoms should be evaluated.',
    isLeaf: true,
    recommendation: 'Make an appointment with a mental health professional. Symptoms that affect daily functioning can be managed with proper care.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'mental-mild': {
    id: 'mental-mild',
    text: 'These appear to be mild mental health concerns.',
    isLeaf: true,
    recommendation: 'Practice self-care, including regular exercise, adequate sleep, and stress management. If symptoms persist for more than two weeks or worsen, consult a mental health professional.',
    severity: 'mild',
    followUpRequired: false,
  },
  
  // Cardiovascular symptoms branch (NEW)
  'cardiovascular': {
    id: 'cardiovascular',
    text: 'Are you experiencing heart-related symptoms?',
    children: ['cardiovascular-severe', 'cardiovascular-moderate'],
    icon: 'Heart',
  },
  'cardiovascular-severe': {
    id: 'cardiovascular-severe',
    text: 'Are you experiencing chest pain, pressure, or discomfort, especially with shortness of breath, nausea, or sweating?',
    children: ['cardiovascular-emergency', 'cardiovascular-features'],
  },
  'cardiovascular-moderate': {
    id: 'cardiovascular-moderate',
    text: 'Have you noticed irregular heartbeats, palpitations, or persistent fatigue?',
    children: ['cardiovascular-arrhythmia', 'cardiovascular-features'],
  },
  'cardiovascular-features': {
    id: 'cardiovascular-features',
    text: 'Do you also have swelling in your ankles or feet, or shortness of breath with activity?',
    children: ['cardiovascular-fluid', 'cardiovascular-mild'],
  },
  'cardiovascular-emergency': {
    id: 'cardiovascular-emergency',
    text: 'This could be a cardiac emergency.',
    isLeaf: true,
    recommendation: 'Seek immediate medical attention. These symptoms could indicate a heart attack or other serious cardiac condition.',
    severity: 'severe',
    followUpRequired: true,
  },
  'cardiovascular-arrhythmia': {
    id: 'cardiovascular-arrhythmia',
    text: 'These symptoms could indicate a heart rhythm issue.',
    isLeaf: true,
    recommendation: 'Make an appointment with a healthcare provider. Heart rhythm issues should be properly evaluated.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'cardiovascular-fluid': {
    id: 'cardiovascular-fluid',
    text: 'These symptoms could indicate a fluid balance issue.',
    isLeaf: true,
    recommendation: 'Make an appointment with a healthcare provider. These symptoms could indicate heart failure or other cardiac conditions.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'cardiovascular-mild': {
    id: 'cardiovascular-mild',
    text: 'These appear to be mild cardiovascular symptoms.',
    isLeaf: true,
    recommendation: 'Monitor your symptoms, maintain a heart-healthy lifestyle, and schedule a routine check-up with your healthcare provider.',
    severity: 'mild',
    followUpRequired: false,
  },
  
  // Urinary symptoms branch (NEW)
  'urinary': {
    id: 'urinary',
    text: 'Are you experiencing urinary issues?',
    children: ['urinary-severe', 'urinary-moderate'],
    icon: 'CircleDot',
  },
  'urinary-severe': {
    id: 'urinary-severe',
    text: 'Do you have severe pain in your back or side, fever, or blood in your urine?',
    children: ['urinary-emergency', 'urinary-features'],
  },
  'urinary-moderate': {
    id: 'urinary-moderate',
    text: 'Are you experiencing painful urination, urgency, or increased frequency?',
    children: ['urinary-infection', 'urinary-features'],
  },
  'urinary-features': {
    id: 'urinary-features',
    text: 'Have you noticed changes in the color or smell of your urine, or difficulty starting or maintaining urine flow?',
    children: ['urinary-changes', 'urinary-mild'],
  },
  'urinary-emergency': {
    id: 'urinary-emergency',
    text: 'This could be a urinary tract emergency.',
    isLeaf: true,
    recommendation: 'Seek immediate medical attention. These symptoms could indicate a kidney infection or kidney stones.',
    severity: 'severe',
    followUpRequired: true,
  },
  'urinary-infection': {
    id: 'urinary-infection',
    text: 'These symptoms could indicate a urinary tract infection.',
    isLeaf: true,
    recommendation: 'Make an appointment with a healthcare provider. Urinary tract infections usually require antibiotic treatment.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'urinary-changes': {
    id: 'urinary-changes',
    text: 'These urinary changes should be evaluated.',
    isLeaf: true,
    recommendation: 'Make an appointment with a healthcare provider. Changes in urination can indicate various conditions that need proper diagnosis.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'urinary-mild': {
    id: 'urinary-mild',
    text: 'These appear to be mild urinary issues.',
    isLeaf: true,
    recommendation: 'Ensure adequate hydration and avoid bladder irritants like caffeine and alcohol. If symptoms persist for more than a few days, consult a healthcare provider.',
    severity: 'mild',
    followUpRequired: false,
  },
  
  // Eye symptoms branch (NEW)
  'eyes': {
    id: 'eyes',
    text: 'Are you experiencing eye issues?',
    children: ['eyes-severe', 'eyes-moderate'],
    icon: 'AlertTriangle',
  },
  'eyes-severe': {
    id: 'eyes-severe',
    text: 'Do you have sudden vision changes, severe eye pain, or injury to the eye?',
    children: ['eyes-emergency', 'eyes-features'],
  },
  'eyes-moderate': {
    id: 'eyes-moderate',
    text: 'Are you experiencing redness, irritation, discharge, or mild pain?',
    children: ['eyes-infection', 'eyes-features'],
  },
  'eyes-features': {
    id: 'eyes-features',
    text: 'Have you noticed blurry vision, sensitivity to light, or difficulty focusing?',
    children: ['eyes-vision', 'eyes-mild'],
  },
  'eyes-emergency': {
    id: 'eyes-emergency',
    text: 'This could be an eye emergency.',
    isLeaf: true,
    recommendation: 'Seek immediate medical attention. These symptoms could indicate a serious condition requiring urgent care.',
    severity: 'severe',
    followUpRequired: true,
  },
  'eyes-infection': {
    id: 'eyes-infection',
    text: 'These symptoms could indicate an eye infection.',
    isLeaf: true,
    recommendation: 'Make an appointment with a healthcare provider. Eye infections often require prescription medications.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'eyes-vision': {
    id: 'eyes-vision',
    text: 'These vision changes should be evaluated.',
    isLeaf: true,
    recommendation: 'Make an appointment with an eye care professional. Vision changes can indicate various conditions that need proper diagnosis.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'eyes-mild': {
    id: 'eyes-mild',
    text: 'These appear to be mild eye issues.',
    isLeaf: true,
    recommendation: 'Rest your eyes, use lubricating eye drops if needed, and avoid eye strain. If symptoms persist for more than a few days, consult an eye care professional.',
    severity: 'mild',
    followUpRequired: false,
  },
  
  // Ear symptoms branch (NEW)
  'ears': {
    id: 'ears',
    text: 'Are you experiencing ear issues?',
    children: ['ears-severe', 'ears-moderate'],
    icon: 'Ear',
  },
  'ears-severe': {
    id: 'ears-severe',
    text: 'Do you have severe ear pain, sudden hearing loss, or discharge from the ear?',
    children: ['ears-emergency', 'ears-features'],
  },
  'ears-moderate': {
    id: 'ears-moderate',
    text: 'Are you experiencing ear fullness, pressure, or mild discomfort?',
    children: ['ears-infection', 'ears-features'],
  },
  'ears-features': {
    id: 'ears-features',
    text: 'Have you noticed ringing in the ears, dizziness, or gradual hearing changes?',
    children: ['ears-tinnitus', 'ears-mild'],
  },
  'ears-emergency': {
    id: 'ears-emergency',
    text: 'This could be an ear emergency.',
    isLeaf: true,
    recommendation: 'Seek immediate medical attention. These symptoms could indicate a serious condition requiring urgent care.',
    severity: 'severe',
    followUpRequired: true,
  },
  'ears-infection': {
    id: 'ears-infection',
    text: 'These symptoms could indicate an ear infection.',
    isLeaf: true,
    recommendation: 'Make an appointment with a healthcare provider. Ear infections often require prescription medications.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'ears-tinnitus': {
    id: 'ears-tinnitus',
    text: 'These symptoms could indicate tinnitus or inner ear issues.',
    isLeaf: true,
    recommendation: 'Make an appointment with a healthcare provider. Persistent ear symptoms should be properly evaluated.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'ears-mild': {
    id: 'ears-mild',
    text: 'These appear to be mild ear issues.',
    isLeaf: true,
    recommendation: 'Keep your ears dry, avoid inserting objects in them, and consider over-the-counter ear drops if appropriate. If symptoms persist for more than a few days, consult a healthcare provider.',
    severity: 'mild',
    followUpRequired: false,
  },
  
  // Other symptoms branch
  'other': {
    id: 'other',
    text: 'Are you experiencing other symptoms not listed above?',
    children: ['other-severe', 'other-moderate'],
    icon: 'HelpCircle',
  },
  'other-severe': {
    id: 'other-severe',
    text: 'Are your symptoms severe, concerning, or worsening rapidly?',
    children: ['other-emergency', 'other-features'],
  },
  'other-moderate': {
    id: 'other-moderate',
    text: 'Have you had these symptoms for more than a week?',
    children: ['other-persistent', 'other-features'],
  },
  'other-features': {
    id: 'other-features',
    text: 'Are your symptoms affecting your daily activities or quality of life?',
    children: ['other-disruptive', 'other-mild'],
  },
  'other-emergency': {
    id: 'other-emergency',
    text: 'This could be a medical emergency.',
    isLeaf: true,
    recommendation: 'Seek immediate medical attention. Severe symptoms can indicate serious conditions that require urgent care.',
    severity: 'severe',
    followUpRequired: true,
  },
  'other-persistent': {
    id: 'other-persistent',
    text: 'These persistent symptoms should be evaluated.',
    isLeaf: true,
    recommendation: 'Make an appointment with a healthcare provider. Persistent symptoms should be properly evaluated.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'other-disruptive': {
    id: 'other-disruptive',
    text: 'These disruptive symptoms should be evaluated.',
    isLeaf: true,
    recommendation: 'Make an appointment with a healthcare provider. Symptoms that affect daily functioning should be properly evaluated.',
    severity: 'moderate',
    followUpRequired: true,
  },
  'other-mild': {
    id: 'other-mild',
    text: 'These appear to be mild symptoms.',
    isLeaf: true,
    recommendation: 'Monitor your symptoms and practice healthy lifestyle habits. If symptoms persist for more than a week or worsen, consult a healthcare provider.',
    severity: 'mild',
    followUpRequired: false,
  }
};
