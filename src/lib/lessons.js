export const lessons = [
  {
    id: 'budgeting-101',
    title: 'Budgeting 101',
    description: 'Learn the basics of creating and sticking to a budget',
    category: 'budgeting',
    difficulty: 'beginner',
    duration: '5 min',
    icon: '📊',
    content: [
      { type: 'text', value: 'A budget is a plan for how you will spend your money each month.' },
      { type: 'text', value: 'The 50/30/20 rule: 50% needs, 30% wants, 20% savings.' },
      { type: 'quiz', question: 'What percentage should go to savings in the 50/30/20 rule?', options: ['10%', '20%', '30%', '50%'], answer: 1 },
    ],
  },
  {
    id: 'saving-strategies',
    title: 'Smart Saving Strategies',
    description: 'Discover effective ways to grow your savings',
    category: 'saving',
    difficulty: 'beginner',
    duration: '5 min',
    icon: '💰',
    content: [
      { type: 'text', value: 'Pay yourself first — set aside savings before spending on anything else.' },
      { type: 'text', value: 'An emergency fund should cover 3-6 months of expenses.' },
      { type: 'quiz', question: 'How many months of expenses should an emergency fund cover?', options: ['1-2 months', '3-6 months', '12 months', '24 months'], answer: 1 },
    ],
  },
  {
    id: 'understanding-debt',
    title: 'Understanding Debt',
    description: 'Learn the difference between good and bad debt',
    category: 'debt',
    difficulty: 'intermediate',
    duration: '7 min',
    icon: '💳',
    content: [
      { type: 'text', value: 'Good debt (like education loans) can increase your earning power.' },
      { type: 'text', value: 'Bad debt (like high-interest credit cards) costs you money over time.' },
      { type: 'quiz', question: 'Which is typically considered good debt?', options: ['Credit card debt', 'Education loan', 'Payday loan', 'Car title loan'], answer: 1 },
    ],
  },
  {
    id: 'investing-basics',
    title: 'Investing Basics',
    description: 'Introduction to growing your money through investments',
    category: 'investing',
    difficulty: 'intermediate',
    duration: '8 min',
    icon: '📈',
    content: [
      { type: 'text', value: 'Investing means putting your money to work so it grows over time.' },
      { type: 'text', value: 'Diversification means spreading investments across different assets to reduce risk.' },
      { type: 'quiz', question: 'What does diversification help reduce?', options: ['Returns', 'Risk', 'Savings', 'Income'], answer: 1 },
    ],
  },
  {
    id: 'kids-money-basics',
    title: 'Money Basics for Kids',
    description: 'Learn what money is and how to use it wisely',
    category: 'kids',
    difficulty: 'beginner',
    duration: '3 min',
    icon: '🪙',
    content: [
      { type: 'text', value: 'Money is something we use to buy things we need and want.' },
      { type: 'text', value: 'Saving money means keeping some for later instead of spending it all now.' },
      { type: 'quiz', question: 'What does saving money mean?', options: ['Spending it all', 'Keeping some for later', 'Giving it away', 'Hiding it'], answer: 1 },
    ],
  },
  {
    id: 'kids-earning',
    title: 'Ways Kids Can Earn',
    description: 'Fun ways to earn your own money',
    category: 'kids',
    difficulty: 'beginner',
    duration: '3 min',
    icon: '⭐',
    content: [
      { type: 'text', value: 'You can earn money by doing chores, helping neighbors, or selling crafts.' },
      { type: 'text', value: 'Setting a goal helps you stay motivated to earn and save.' },
      { type: 'quiz', question: 'What helps you stay motivated to save?', options: ['Spending everything', 'Setting a goal', 'Ignoring money', 'Borrowing'], answer: 1 },
    ],
  },
];

export function getLessonById(id) {
  return lessons.find(l => l.id === id);
}

export function getLessonsByCategory(category) {
  return lessons.filter(l => l.category === category);
}
