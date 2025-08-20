// Simple sentiment analysis utility
export function analyzeSentiment(text: string): string {
  const lowerText = text.toLowerCase();
  
  // Crisis keywords (handled separately)
  const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'hurt myself', 'don\'t want to live'];
  if (crisisKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'crisis';
  }
  
  // Positive sentiment keywords
  const positiveWords = [
    'happy', 'joy', 'excited', 'great', 'amazing', 'wonderful', 'fantastic',
    'love', 'grateful', 'thankful', 'blessed', 'content', 'peaceful', 'optimistic',
    'confident', 'proud', 'accomplished', 'successful', 'thrilled', 'delighted'
  ];
  
  // Negative sentiment keywords
  const negativeWords = [
    'sad', 'depressed', 'anxious', 'worried', 'stressed', 'upset', 'angry',
    'frustrated', 'disappointed', 'hurt', 'pain', 'terrible', 'awful', 'horrible',
    'lonely', 'isolated', 'helpless', 'hopeless', 'overwhelmed', 'exhausted'
  ];
  
  // Neutral/mixed sentiment keywords
  const neutralWords = [
    'okay', 'fine', 'alright', 'mixed', 'confused', 'uncertain', 'tired',
    'busy', 'normal', 'average', 'meh', 'whatever'
  ];
  
  let positiveScore = 0;
  let negativeScore = 0;
  let neutralScore = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveScore++;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeScore++;
  });
  
  neutralWords.forEach(word => {
    if (lowerText.includes(word)) neutralScore++;
  });
  
  // Determine sentiment based on scores
  if (positiveScore > negativeScore && positiveScore > neutralScore) {
    return 'positive';
  } else if (negativeScore > positiveScore && negativeScore > neutralScore) {
    return 'negative';
  } else if (neutralScore > 0) {
    return 'neutral';
  } else if (positiveScore === negativeScore && positiveScore > 0) {
    return 'mixed';
  } else {
    return 'neutral';
  }
}

export function generateResponse(userInput: string, sentiment: string): string {
  const responses = {
    positive: [
      "I'm so glad to hear that you're feeling positive! It's wonderful when we can find moments of joy and happiness. What's been contributing to these good feelings?",
      "That's amazing! Your positive energy is really coming through. It's important to acknowledge and celebrate these good moments. How can you carry this feeling forward?",
      "I love hearing about your positive experiences! When we're feeling good, it's a great time to reflect on what's working well in our lives. What are you most grateful for today?"
    ],
    negative: [
      "I hear that you're going through a difficult time right now, and I want you to know that your feelings are completely valid. It's okay to not be okay. Can you tell me more about what's weighing on your heart?",
      "Thank you for sharing something so personal with me. It takes courage to open up about difficult feelings. Remember that experiencing tough emotions is part of being human, and you don't have to face this alone.",
      "I'm sorry you're struggling right now. These feelings can be really overwhelming, but please know that they won't last forever. You've gotten through difficult times before, and you have the strength to get through this too."
    ],
    mixed: [
      "It sounds like you're experiencing a mix of emotions right now, which is completely normal. Life can be complicated, and our feelings often reflect that complexity. What's feeling most prominent for you today?",
      "I can sense that you're processing different emotions, and that's okay. Sometimes we feel multiple things at once, and it can be confusing. Take your time to work through these feelings.",
      "Mixed feelings can be challenging to navigate. It's like having different parts of yourself pulling in different directions. Which emotion feels strongest right now?"
    ],
    neutral: [
      "Thank you for sharing with me. Sometimes we need a safe space just to express what's on our minds. I'm here to listen and support you. How are you feeling in this moment?",
      "I appreciate you taking the time to reach out. Even when things feel neutral or unclear, it's valuable to check in with yourself. What would be helpful for you right now?",
      "It's perfectly okay to feel neutral or unsure sometimes. Not every day has to be filled with intense emotions. How can I support you today?"
    ]
  };

  const sentimentResponses = responses[sentiment as keyof typeof responses] || responses.neutral;
  const randomIndex = Math.floor(Math.random() * sentimentResponses.length);
  
  return sentimentResponses[randomIndex];
}