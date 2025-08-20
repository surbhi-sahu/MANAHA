export function detectCrisis(text: string): boolean {
  const lowerText = text.toLowerCase();
  
  const crisisKeywords = [
    // Direct self-harm expressions
    'kill myself',
    'end my life',
    'commit suicide',
    'want to die',
    'hurt myself',
    'harm myself',
    'end it all',
    'don\'t want to live',
    'better off dead',
    'can\'t go on',
    'no point in living',
    
    // Indirect but concerning expressions
    'everyone would be better without me',
    'i\'m a burden',
    'nothing matters anymore',
    'i can\'t take it anymore',
    'i give up',
    
    // Planning or method-related
    'plan to',
    'thinking about ending',
    'how to kill',
    'ways to die'
  ];
  
  // Check for crisis keywords
  for (const keyword of crisisKeywords) {
    if (lowerText.includes(keyword)) {
      return true;
    }
  }
  
  // Check for multiple concerning phrases together
  const concerningPhrases = ['hopeless', 'worthless', 'pointless', 'unbearable', 'too much'];
  const concerningCount = concerningPhrases.filter(phrase => lowerText.includes(phrase)).length;
  
  if (concerningCount >= 2) {
    return true;
  }
  
  return false;
}