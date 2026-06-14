export const ADULT_LESSONS = [
  {
    id: 'budgeting-basics',
    title: 'Budgeting Basics',
    emoji: '📊',
    duration: '5 min',
    points: 50,
    content: `A budget is a plan for how you will spend your money each month.

The 50/30/20 rule is one of the most popular budgeting methods:
• 50% of your income goes to NEEDS (rent, food, utilities)
• 30% goes to WANTS (entertainment, dining out, hobbies)
• 20% goes to SAVINGS and debt repayment

Start by listing all your monthly income, then all your expenses. Subtract expenses from income to see if you're in the positive or negative.

Tip: Review your budget every month and adjust as needed.`,
    quiz: {
      question: 'In the 50/30/20 rule, what percentage should go to savings?',
      options: ['10%', '20%', '30%', '50%'],
      answer: 1,
    },
  },
  {
    id: 'emergency-fund',
    title: 'Emergency Fund',
    emoji: '🆘',
    duration: '5 min',
    points: 50,
    content: `An emergency fund is money set aside for unexpected events like job loss, medical bills, or car repairs.

Why you need one:
• Prevents going into debt when emergencies happen
• Gives you peace of mind
• Allows you to take risks (like changing jobs)

How much to save:
• Starter goal: 1 month of expenses
• Ideal goal: 3–6 months of expenses

Keep your emergency fund in a separate savings account so you're not tempted to spend it.`,
    quiz: {
      question: 'How many months of expenses should an ideal emergency fund cover?',
      options: ['1 month', '2 months', '3–6 months', '12 months'],
      answer: 2,
    },
  },
  {
    id: 'needs-vs-wants',
    title: 'Needs vs Wants',
    emoji: '🛒',
    duration: '4 min',
    points: 40,
    content: `Understanding the difference between needs and wants is the foundation of good financial decisions.

NEEDS are things you must have to survive and function:
• Food, water, shelter
• Basic clothing
• Transportation to work
• Healthcare

WANTS are things that are nice to have but not essential:
• New gadgets
• Streaming subscriptions
• Eating out
• Luxury items

Before every purchase, ask yourself: "Is this a need or a want?" This simple question can save you thousands.`,
    quiz: {
      question: 'Which of these is a NEED?',
      options: ['New shoes for fashion', 'Rent payment', 'Netflix subscription', 'Eating at a restaurant'],
      answer: 1,
    },
  },
  {
    id: 'impulse-spending',
    title: 'Avoiding Impulse Spending',
    emoji: '🛑',
    duration: '5 min',
    points: 50,
    content: `Impulse spending is buying things without planning — and it's one of the biggest budget busters.

Common triggers:
• Sales and discounts ("it's 50% off!")
• Boredom or stress
• Social media influence
• Peer pressure

How to stop impulse buying:
1. Use the 24-hour rule: wait a day before buying anything over a set amount
2. Unsubscribe from promotional emails
3. Delete shopping apps
4. Shop with a list and stick to it
5. Pay with cash — it feels more "real" than a card

Remember: Every impulse buy is money NOT in your savings.`,
    quiz: {
      question: 'What is the "24-hour rule" for impulse spending?',
      options: [
        'Shop only during 24-hour sales',
        'Wait 24 hours before buying to think it over',
        'Budget 24% of income for shopping',
        'Shop once every 24 days',
      ],
      answer: 1,
    },
  },
  {
    id: 'pay-yourself-first',
    title: 'Pay Yourself First',
    emoji: '💰',
    duration: '4 min',
    points: 40,
    content: `"Pay yourself first" means saving money before you spend on anything else.

Most people save what's LEFT after spending. That usually means saving nothing.

Instead:
1. Decide how much to save (even 5% is a great start)
2. Transfer that amount to savings the moment you get paid
3. Live on the rest

This is called "reverse budgeting" — and it works because you automate the most important habit.

Set up an automatic transfer to your savings account on payday. You'll be amazed how quickly you adapt to living on the remaining amount.`,
    quiz: {
      question: 'What does "Pay Yourself First" mean?',
      options: [
        'Spend on yourself before bills',
        'Save money before spending on anything else',
        'Pay your own salary',
        'Treat yourself every paycheck',
      ],
      answer: 1,
    },
  },
  {
    id: 'understanding-debt',
    title: 'Understanding Debt',
    emoji: '💳',
    duration: '7 min',
    points: 70,
    content: `Not all debt is bad — but most of the debt most people carry is.

Good debt increases your earning power or net worth:
• Student loans (invest in your future income)
• Mortgage (building equity)
• Business loan (to grow income)

Bad debt costs you without building wealth:
• High-interest credit cards
• Payday loans (extremely high interest)
• Buy now, pay later schemes for luxuries

The key metric: interest rate. Good debt usually has low interest (<10%). Bad debt often charges 20–400%.

Strategy: Pay off high-interest debt first (avalanche method), then tackle lower-interest debt.`,
    quiz: {
      question: 'Which is generally considered GOOD debt?',
      options: ['Payday loan', 'Education loan', 'High-interest credit card', 'Buy-now-pay-later for clothes'],
      answer: 1,
    },
  },
  {
    id: 'track-every-spend',
    title: 'Track Every Spend',
    emoji: '📝',
    duration: '4 min',
    points: 40,
    content: `You can't manage what you don't measure.

Tracking every expense — even small ones — reveals your true spending habits and shows you exactly where your money goes.

How to track:
• Use a budgeting app (like SavvyMoney!)
• Keep receipts for a week
• Review bank statements monthly

What to track:
• Every purchase, no matter how small
• Subscriptions (many people forget recurring charges)
• Cash spending (easily forgotten)

After 1 month of tracking, most people are surprised to find 2–3 categories where they're overspending.`,
    quiz: {
      question: 'Why is tracking small purchases important?',
      options: [
        'Small purchases never matter',
        'Small purchases add up and reveal spending habits',
        'Only big purchases affect your budget',
        'Banks track them automatically',
      ],
      answer: 1,
    },
  },
];

export const KIDS_LESSONS = [
  {
    id: 'what-is-money',
    title: 'What is Money?',
    emoji: '🪙',
    duration: '3 min',
    points: 30,
    content: `Money is something we use to buy things we need and want!

Long ago, people traded things directly — like swapping a chicken for some vegetables. This is called "barter." But bartering was tricky because you had to find someone who wanted exactly what you had.

So people invented money! Money makes it easy to:
🛒 Buy food, clothes, and toys
📚 Pay for school
🏠 Pay for a home

Money comes in coins and paper notes (bills). In the digital age, money can also exist on cards and phones!

Remember: Money is a tool. It's not good or bad by itself — it's how you use it that matters!`,
    quiz: {
      question: 'What did people do BEFORE money was invented?',
      options: ['Used credit cards', 'Traded (bartered) things directly', 'Worked for free', 'Used the internet'],
      answer: 1,
    },
  },
  {
    id: 'needs-vs-wants-kids',
    title: 'Needs vs Wants',
    emoji: '🛒',
    duration: '3 min',
    points: 30,
    content: `Some things are NEEDS — we must have them to live.
Other things are WANTS — they're nice but we don't NEED them.

NEEDS: 🍎 Food · 🏠 A home · 👕 Basic clothes · 💊 Medicine

WANTS: 🎮 Video games · 🍦 Ice cream · 🧸 Toys · 📱 Latest phone

Can you tell which is which?

It's okay to have wants! But we should always make sure our needs are covered first.

A smart saver asks: "Do I NEED this, or do I just WANT it?"`,
    quiz: {
      question: 'Which is a NEED?',
      options: ['Ice cream', 'Food to eat', 'New toy', 'Video game'],
      answer: 1,
    },
  },
  {
    id: 'why-saving-matters',
    title: 'Why Saving is Important',
    emoji: '🐷',
    duration: '4 min',
    points: 40,
    content: `Saving money means keeping some of your money for later instead of spending it all now.

Why save? Because great things take time and money:
🎮 Want a new game? Save up for it!
🎒 Need a new school bag? Save up!
🎂 Want to buy a birthday gift for your friend? Save up!

The Piggy Bank Rule: Every time you get money (allowance, birthday gift), put some in your piggy bank before you spend any.

Even saving a small amount adds up! If you save a little every week, after a few months you'll have enough for something big!

Saving is like a superpower. 💪`,
    quiz: {
      question: 'What does saving money mean?',
      options: [
        'Spending all your money quickly',
        'Keeping some money for later',
        'Giving your money away',
        'Hiding money from parents',
      ],
      answer: 1,
    },
  },
  {
    id: 'piggy-bank-rule',
    title: 'The Piggy Bank Rule',
    emoji: '🏦',
    duration: '3 min',
    points: 30,
    content: `The Piggy Bank Rule is simple: Save FIRST, spend LATER!

When you get money:
1. 💰 Put at least 20% in savings FIRST
2. 🎁 Maybe give a little to charity or someone who needs it
3. 🛒 Spend the rest on things you want

Example: If you get 100 for your birthday:
• Save 20 🐷
• Give 5 to charity (optional) ❤️  
• Spend 75 on what you like 🎉

The secret? The money you save keeps growing. One day you'll have saved up enough for something really big — like a trip or a special gift!`,
    quiz: {
      question: 'In the Piggy Bank Rule, what should you do FIRST with your money?',
      options: ['Spend it all on sweets', 'Save some first', 'Give it all away', 'Lose it'],
      answer: 1,
    },
  },
  {
    id: 'dont-spend-everything',
    title: "Don't Spend Everything!",
    emoji: '🚫',
    duration: '3 min',
    points: 30,
    content: `It can be really tempting to spend ALL your money right away. But smart savers know better!

Imagine you get 500 allowance. You spend it all on snacks and stickers. The next day, your friend invites you to a cool event that costs 300. Uh oh — you have no money left!

That's why we should NEVER spend everything:
✅ Always keep some saved "just in case"
✅ Think before you buy
✅ Ask yourself: "Will I regret this tomorrow?"

The best feeling is having money saved for when you really need or want something special.

Future-you will thank present-you for saving! 🌟`,
    quiz: {
      question: 'Why should you NOT spend all your money at once?',
      options: [
        'Money is heavy to carry',
        'You might need money later for something important',
        'Shops prefer cards',
        'Your parents will take it',
      ],
      answer: 1,
    },
  },
];

export const DAILY_CHALLENGES = [
  { icon: '🚫', title: 'No-Spend Day', desc: "Don't spend any money today! Challenge yourself." },
  { icon: '📝', title: 'Track Everything', desc: 'Write down every single expense today, even small ones.' },
  { icon: '💰', title: 'Save Something', desc: 'Set aside a small amount for your savings goal today.' },
  { icon: '📚', title: 'Learn Something', desc: 'Complete a financial lesson and earn your points.' },
  { icon: '🍳', title: 'Cook at Home', desc: "Make your meals at home today instead of eating out." },
  { icon: '🔍', title: 'Review Budget', desc: 'Check your budget and see where you stand this month.' },
  { icon: '🎯', title: 'Set a Goal', desc: 'Create or update a savings goal today.' },
];
