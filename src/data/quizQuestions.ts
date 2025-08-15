import type { CourseQuiz, QuizQuestion } from '../types';

const generateQuizId = (courseId: string) => `quiz-${courseId}`;

// Digital Art Quiz Questions
const digitalArtQuestions: QuizQuestion[] = [
  {
    id: 'da-1',
    question: 'What is the primary advantage of using layers in digital art?',
    options: [
      'To make files larger',
      'To organize elements and enable non-destructive editing',
      'To slow down the computer',
      'To make colors brighter'
    ],
    correctAnswer: 1,
    explanation: 'Layers allow artists to organize different elements of their artwork and make changes without affecting other parts, enabling non-destructive editing workflows.',
    category: 'Fundamentals'
  },
  {
    id: 'da-2',
    question: 'Which brush type is best for creating smooth gradients?',
    options: [
      'Hard round brush',
      'Texture brush',
      'Soft round brush',
      'Pattern brush'
    ],
    correctAnswer: 2,
    explanation: 'Soft round brushes have feathered edges that blend smoothly, making them ideal for creating gradients and soft transitions.',
    category: 'Tools'
  },
  {
    id: 'da-3',
    question: 'What does RGB stand for in digital color?',
    options: [
      'Red, Green, Blue',
      'Red, Grey, Black',
      'Really Good Brightness',
      'Radical Graphics Base'
    ],
    correctAnswer: 0,
    explanation: 'RGB stands for Red, Green, Blue - the three primary colors of light used in digital displays.',
    category: 'Color Theory'
  },
  {
    id: 'da-4',
    question: 'What is the recommended resolution for web graphics?',
    options: [
      '300 DPI',
      '150 DPI',
      '72 DPI',
      '600 DPI'
    ],
    correctAnswer: 2,
    explanation: '72 DPI is the standard resolution for web graphics as it provides good quality while keeping file sizes manageable for web use.',
    category: 'Technical'
  },
  {
    id: 'da-5',
    question: 'Which file format preserves transparency?',
    options: [
      'JPEG',
      'PNG',
      'BMP',
      'GIF only'
    ],
    correctAnswer: 1,
    explanation: 'PNG format supports transparency, making it ideal for logos and graphics that need transparent backgrounds.',
    category: 'File Formats'
  },
  {
    id: 'da-6',
    question: 'What is the rule of thirds in composition?',
    options: [
      'Dividing canvas into three equal parts',
      'Using only three colors',
      'Drawing three main subjects',
      'Placing key elements along grid lines that divide the image into thirds'
    ],
    correctAnswer: 3,
    explanation: 'The rule of thirds involves placing important elements along imaginary lines that divide the image into nine equal sections, creating more dynamic compositions.',
    category: 'Composition'
  },
  {
    id: 'da-7',
    question: 'What is a vector graphic?',
    options: [
      'A photo-realistic image',
      'An image made of pixels',
      'An image made of mathematical paths and shapes',
      'A 3D model'
    ],
    correctAnswer: 2,
    explanation: 'Vector graphics are created using mathematical paths and shapes, allowing them to be scaled infinitely without losing quality.',
    category: 'Graphics Types'
  },
  {
    id: 'da-8',
    question: 'Which color mode is best for print design?',
    options: [
      'RGB',
      'CMYK',
      'HSB',
      'LAB'
    ],
    correctAnswer: 1,
    explanation: 'CMYK (Cyan, Magenta, Yellow, Key/Black) is the standard color mode for print design as it matches how printers create colors.',
    category: 'Color Theory'
  },
  {
    id: 'da-9',
    question: 'What is a clipping mask used for?',
    options: [
      'To cut objects from the canvas',
      'To hide parts of a layer based on another layer\'s shape',
      'To copy and paste elements',
      'To change colors'
    ],
    correctAnswer: 1,
    explanation: 'A clipping mask uses the shape of one layer to define the visible area of another layer, effectively masking or hiding parts that fall outside the shape.',
    category: 'Advanced Techniques'
  },
  {
    id: 'da-10',
    question: 'What does DPI stand for?',
    options: [
      'Digital Pixel Information',
      'Dots Per Inch',
      'Design Print Index',
      'Dynamic Picture Intelligence'
    ],
    correctAnswer: 1,
    explanation: 'DPI stands for Dots Per Inch, measuring the resolution or density of pixels/dots in a digital image or print.',
    category: 'Technical'
  },
  {
    id: 'da-11',
    question: 'Which blend mode darkens the image?',
    options: [
      'Screen',
      'Multiply',
      'Overlay',
      'Normal'
    ],
    correctAnswer: 1,
    explanation: 'Multiply blend mode darkens the image by multiplying the base color with the blend color, similar to overlaying transparent ink.',
    category: 'Blend Modes'
  },
  {
    id: 'da-12',
    question: 'What is the purpose of a style guide in digital art?',
    options: [
      'To make art look complicated',
      'To maintain consistency in visual elements',
      'To slow down the creative process',
      'To copy other artists\' work'
    ],
    correctAnswer: 1,
    explanation: 'A style guide helps maintain consistency in colors, fonts, shapes, and other visual elements across a project or brand.',
    category: 'Design Process'
  },
  {
    id: 'da-13',
    question: 'What is digital sculpting?',
    options: [
      'Drawing with digital tools',
      'Creating 3D models by manipulating digital clay',
      'Editing photographs',
      'Making vector illustrations'
    ],
    correctAnswer: 1,
    explanation: 'Digital sculpting involves creating 3D models by manipulating virtual clay-like material, similar to traditional sculpting but in a digital environment.',
    category: '3D Art'
  },
  {
    id: 'da-14',
    question: 'Which shortcut typically undoes the last action?',
    options: [
      'Ctrl+S',
      'Ctrl+C',
      'Ctrl+Z',
      'Ctrl+V'
    ],
    correctAnswer: 2,
    explanation: 'Ctrl+Z (Cmd+Z on Mac) is the universal shortcut for undoing the last action in most digital art software.',
    category: 'Workflow'
  },
  {
    id: 'da-15',
    question: 'What is color temperature in digital art?',
    options: [
      'How hot colors make you feel',
      'The warmth or coolness of colors',
      'The brightness of colors',
      'The saturation level'
    ],
    correctAnswer: 1,
    explanation: 'Color temperature refers to the warmth (reds, oranges, yellows) or coolness (blues, greens, purples) of colors, affecting the mood and atmosphere of artwork.',
    category: 'Color Theory'
  },
  {
    id: 'da-16',
    question: 'What is anti-aliasing?',
    options: [
      'A drawing technique',
      'A method to smooth jagged edges in digital images',
      'A type of brush',
      'A color correction tool'
    ],
    correctAnswer: 1,
    explanation: 'Anti-aliasing is a technique that smooths jagged edges in digital images by adding intermediate colored pixels along edges.',
    category: 'Technical'
  },
  {
    id: 'da-17',
    question: 'Which principle involves varying sizes to create visual interest?',
    options: [
      'Repetition',
      'Scale and proportion',
      'Alignment',
      'Proximity'
    ],
    correctAnswer: 1,
    explanation: 'Scale and proportion involve varying the sizes of elements to create hierarchy, emphasis, and visual interest in a composition.',
    category: 'Design Principles'
  },
  {
    id: 'da-18',
    question: 'What is a mood board used for?',
    options: [
      'Checking emotions',
      'Collecting visual inspiration and references',
      'Testing software',
      'Measuring progress'
    ],
    correctAnswer: 1,
    explanation: 'A mood board is a collection of visual references, colors, textures, and inspiration used to establish the visual direction of a project.',
    category: 'Design Process'
  },
  {
    id: 'da-19',
    question: 'What does opacity control in digital art?',
    options: [
      'The size of the brush',
      'The color of the stroke',
      'The transparency level of a layer or brush',
      'The speed of drawing'
    ],
    correctAnswer: 2,
    explanation: 'Opacity controls how transparent or opaque a layer, brush stroke, or element appears, with 0% being completely transparent and 100% being completely opaque.',
    category: 'Tools'
  },
  {
    id: 'da-20',
    question: 'What is the difference between raster and vector graphics?',
    options: [
      'Raster is for web, vector is for print',
      'Raster uses pixels, vector uses mathematical paths',
      'There is no difference',
      'Raster is older technology'
    ],
    correctAnswer: 1,
    explanation: 'Raster graphics are made of pixels and can lose quality when scaled, while vector graphics use mathematical paths and can be scaled infinitely without quality loss.',
    category: 'Graphics Types'
  }
];

// Programming Quiz Questions
const programmingQuestions: QuizQuestion[] = [
  {
    id: 'prog-1',
    question: 'What does HTML stand for?',
    options: [
      'HyperText Markup Language',
      'High Tech Modern Language',
      'Home Tool Markup Language',
      'Hyperlink and Text Markup Language'
    ],
    correctAnswer: 0,
    explanation: 'HTML stands for HyperText Markup Language, the standard markup language for creating web pages.',
    category: 'Web Development'
  },
  {
    id: 'prog-2',
    question: 'Which of the following is NOT a programming language?',
    options: [
      'Python',
      'JavaScript',
      'CSS',
      'Java'
    ],
    correctAnswer: 2,
    explanation: 'CSS (Cascading Style Sheets) is a stylesheet language used for styling web pages, not a programming language.',
    category: 'Fundamentals'
  },
  {
    id: 'prog-3',
    question: 'What is a variable in programming?',
    options: [
      'A function that changes',
      'A container for storing data values',
      'A type of loop',
      'An error in code'
    ],
    correctAnswer: 1,
    explanation: 'A variable is a container for storing data values that can be referenced and manipulated in a program.',
    category: 'Fundamentals'
  },
  {
    id: 'prog-4',
    question: 'What does API stand for?',
    options: [
      'Advanced Programming Interface',
      'Application Programming Interface',
      'Automated Program Integration',
      'Applied Programming Intelligence'
    ],
    correctAnswer: 1,
    explanation: 'API stands for Application Programming Interface, a set of protocols and tools for building software applications.',
    category: 'Software Development'
  },
  {
    id: 'prog-5',
    question: 'Which symbol is typically used for comments in JavaScript?',
    options: [
      '#',
      '//',
      '<!--',
      '%'
    ],
    correctAnswer: 1,
    explanation: 'In JavaScript, // is used for single-line comments, while /* */ is used for multi-line comments.',
    category: 'JavaScript'
  },
  {
    id: 'prog-6',
    question: 'What is the purpose of version control systems like Git?',
    options: [
      'To make code run faster',
      'To track changes and collaborate on code',
      'To debug programs',
      'To compile code'
    ],
    correctAnswer: 1,
    explanation: 'Version control systems like Git track changes in code over time and enable multiple developers to collaborate on projects.',
    category: 'Development Tools'
  },
  {
    id: 'prog-7',
    question: 'What is a function in programming?',
    options: [
      'A type of variable',
      'A reusable block of code that performs a specific task',
      'An error message',
      'A programming language'
    ],
    correctAnswer: 1,
    explanation: 'A function is a reusable block of code that performs a specific task and can be called multiple times in a program.',
    category: 'Fundamentals'
  },
  {
    id: 'prog-8',
    question: 'Which of these is a database management system?',
    options: [
      'HTML',
      'CSS',
      'MySQL',
      'JavaScript'
    ],
    correctAnswer: 2,
    explanation: 'MySQL is a popular relational database management system used to store and manage data.',
    category: 'Databases'
  },
  {
    id: 'prog-9',
    question: 'What does CSS stand for?',
    options: [
      'Computer Style Sheets',
      'Creative Style Sheets',
      'Cascading Style Sheets',
      'Colorful Style Sheets'
    ],
    correctAnswer: 2,
    explanation: 'CSS stands for Cascading Style Sheets, used to style and layout web pages.',
    category: 'Web Development'
  },
  {
    id: 'prog-10',
    question: 'What is debugging?',
    options: [
      'Adding bugs to code',
      'Finding and fixing errors in code',
      'Writing new code',
      'Deleting old code'
    ],
    correctAnswer: 1,
    explanation: 'Debugging is the process of finding and fixing errors or bugs in computer code.',
    category: 'Development Process'
  },
  {
    id: 'prog-11',
    question: 'What is responsive web design?',
    options: [
      'Fast-loading websites',
      'Websites that respond to user input',
      'Websites that adapt to different screen sizes',
      'Websites with quick customer service'
    ],
    correctAnswer: 2,
    explanation: 'Responsive web design ensures websites adapt and display properly on various devices and screen sizes.',
    category: 'Web Development'
  },
  {
    id: 'prog-12',
    question: 'What is an algorithm?',
    options: [
      'A programming language',
      'A step-by-step procedure for solving a problem',
      'A type of computer',
      'An error in code'
    ],
    correctAnswer: 1,
    explanation: 'An algorithm is a step-by-step procedure or formula for solving a problem or completing a task.',
    category: 'Computer Science'
  },
  {
    id: 'prog-13',
    question: 'What does SQL stand for?',
    options: [
      'Structured Query Language',
      'Simple Query Language',
      'Standard Quality Language',
      'System Query Logic'
    ],
    correctAnswer: 0,
    explanation: 'SQL stands for Structured Query Language, used to communicate with and manipulate databases.',
    category: 'Databases'
  },
  {
    id: 'prog-14',
    question: 'What is the purpose of a framework in programming?',
    options: [
      'To make code slower',
      'To provide a foundation and tools for development',
      'To add bugs to programs',
      'To make programming harder'
    ],
    correctAnswer: 1,
    explanation: 'A framework provides a foundation and set of tools that simplify and accelerate the development process.',
    category: 'Software Development'
  },
  {
    id: 'prog-15',
    question: 'What is object-oriented programming?',
    options: [
      'Programming with physical objects',
      'A programming paradigm based on objects and classes',
      'Programming graphics only',
      'Old-fashioned programming'
    ],
    correctAnswer: 1,
    explanation: 'Object-oriented programming is a paradigm that uses objects and classes to structure and organize code.',
    category: 'Programming Paradigms'
  },
  {
    id: 'prog-16',
    question: 'What is the cloud in computing?',
    options: [
      'Weather-related computing',
      'A white fluffy thing in the sky',
      'Remote servers accessed over the internet',
      'A type of software'
    ],
    correctAnswer: 2,
    explanation: 'In computing, the cloud refers to remote servers accessed over the internet to store, manage, and process data.',
    category: 'Cloud Computing'
  },
  {
    id: 'prog-17',
    question: 'What is machine learning?',
    options: [
      'Teaching machines to be faster',
      'AI that enables computers to learn without explicit programming',
      'Fixing broken machines',
      'A type of hardware'
    ],
    correctAnswer: 1,
    explanation: 'Machine learning is a branch of AI that enables computers to learn and improve from experience without being explicitly programmed.',
    category: 'Artificial Intelligence'
  },
  {
    id: 'prog-18',
    question: 'What is agile development?',
    options: [
      'Very fast coding',
      'An iterative approach to software development',
      'Programming while exercising',
      'A programming language'
    ],
    correctAnswer: 1,
    explanation: 'Agile development is an iterative approach that emphasizes collaboration, flexibility, and rapid delivery of working software.',
    category: 'Development Methodology'
  },
  {
    id: 'prog-19',
    question: 'What is open source software?',
    options: [
      'Software that costs money',
      'Software with publicly available source code',
      'Software that\'s always broken',
      'Software only for businesses'
    ],
    correctAnswer: 1,
    explanation: 'Open source software has publicly available source code that anyone can view, modify, and distribute.',
    category: 'Software Development'
  },
  {
    id: 'prog-20',
    question: 'What is cybersecurity?',
    options: [
      'Security for robots',
      'Protection of digital systems from cyber threats',
      'A type of programming',
      'Internet shopping safety'
    ],
    correctAnswer: 1,
    explanation: 'Cybersecurity involves protecting digital systems, networks, and data from cyber threats and attacks.',
    category: 'Security'
  }
];

// Finance Quiz Questions
const financeQuestions: QuizQuestion[] = [
  {
    id: 'fin-1',
    question: 'What is compound interest?',
    options: [
      'Interest paid only on the principal',
      'Interest paid on both principal and previously earned interest',
      'A type of savings account',
      'Interest that decreases over time'
    ],
    correctAnswer: 1,
    explanation: 'Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods.',
    category: 'Investment Basics'
  },
  {
    id: 'fin-2',
    question: 'What does ROI stand for?',
    options: [
      'Rate of Interest',
      'Return on Investment',
      'Risk of Inflation',
      'Revenue of Income'
    ],
    correctAnswer: 1,
    explanation: 'ROI stands for Return on Investment, a measure of the efficiency of an investment.',
    category: 'Investment Metrics'
  },
  {
    id: 'fin-3',
    question: 'What is diversification in investing?',
    options: [
      'Putting all money in one stock',
      'Spreading investments across different assets',
      'Only investing in bonds',
      'Avoiding all investments'
    ],
    correctAnswer: 1,
    explanation: 'Diversification involves spreading investments across different assets to reduce risk.',
    category: 'Risk Management'
  },
  {
    id: 'fin-4',
    question: 'What is a bull market?',
    options: [
      'A market where animals are traded',
      'A rising market with increasing prices',
      'A falling market with decreasing prices',
      'A market that doesn\'t move'
    ],
    correctAnswer: 1,
    explanation: 'A bull market is characterized by rising prices and investor optimism.',
    category: 'Market Conditions'
  },
  {
    id: 'fin-5',
    question: 'What is a bear market?',
    options: [
      'A market where animals are traded',
      'A rising market',
      'A falling market with declining prices',
      'A stable market'
    ],
    correctAnswer: 2,
    explanation: 'A bear market is characterized by falling prices and investor pessimism.',
    category: 'Market Conditions'
  },
  {
    id: 'fin-6',
    question: 'What is inflation?',
    options: [
      'Decrease in prices over time',
      'Increase in prices over time',
      'Stable prices',
      'Interest rates going up'
    ],
    correctAnswer: 1,
    explanation: 'Inflation is the general increase in prices of goods and services over time.',
    category: 'Economic Concepts'
  },
  {
    id: 'fin-7',
    question: 'What is a stock dividend?',
    options: [
      'A loan from a company',
      'A payment made to shareholders from company profits',
      'The price of a stock',
      'A type of bond'
    ],
    correctAnswer: 1,
    explanation: 'A dividend is a payment made by companies to shareholders, typically from profits.',
    category: 'Stocks'
  },
  {
    id: 'fin-8',
    question: 'What is a bond?',
    options: [
      'A type of stock',
      'A debt security where you lend money to an entity',
      'A bank account',
      'A type of currency'
    ],
    correctAnswer: 1,
    explanation: 'A bond is a debt security where investors lend money to entities for a defined period at a fixed interest rate.',
    category: 'Fixed Income'
  },
  {
    id: 'fin-9',
    question: 'What is the P/E ratio?',
    options: [
      'Price to Earnings ratio',
      'Profit to Expense ratio',
      'Principal to Equity ratio',
      'Performance to Efficiency ratio'
    ],
    correctAnswer: 0,
    explanation: 'P/E ratio is Price to Earnings ratio, comparing a company\'s stock price to its earnings per share.',
    category: 'Financial Ratios'
  },
  {
    id: 'fin-10',
    question: 'What is dollar-cost averaging?',
    options: [
      'Buying stocks only when prices are low',
      'Investing the same amount regularly regardless of price',
      'Averaging the cost of all your stocks',
      'Only investing in dollar-denominated assets'
    ],
    correctAnswer: 1,
    explanation: 'Dollar-cost averaging involves investing a fixed amount regularly, regardless of market conditions.',
    category: 'Investment Strategies'
  },
  {
    id: 'fin-11',
    question: 'What is market capitalization?',
    options: [
      'The total value of a company\'s shares',
      'The amount of capital a company has',
      'The market\'s closing price',
      'The number of shares outstanding'
    ],
    correctAnswer: 0,
    explanation: 'Market capitalization is the total value of a company\'s outstanding shares.',
    category: 'Valuation'
  },
  {
    id: 'fin-12',
    question: 'What is a mutual fund?',
    options: [
      'A fund owned by friends',
      'A pooled investment vehicle managed by professionals',
      'A government savings program',
      'A type of bank account'
    ],
    correctAnswer: 1,
    explanation: 'A mutual fund pools money from many investors to purchase a diversified portfolio of stocks, bonds, or other securities.',
    category: 'Investment Vehicles'
  },
  {
    id: 'fin-13',
    question: 'What is an ETF?',
    options: [
      'Electronic Trading Fund',
      'Exchange-Traded Fund',
      'Equity Transfer Fund',
      'Emergency Trading Fund'
    ],
    correctAnswer: 1,
    explanation: 'ETF stands for Exchange-Traded Fund, which trades on exchanges like individual stocks but holds a diversified portfolio.',
    category: 'Investment Vehicles'
  },
  {
    id: 'fin-14',
    question: 'What is liquidity in finance?',
    options: [
      'How much water an investment contains',
      'How easily an asset can be converted to cash',
      'The profitability of an investment',
      'The risk level of an investment'
    ],
    correctAnswer: 1,
    explanation: 'Liquidity refers to how quickly and easily an asset can be converted into cash without affecting its market price.',
    category: 'Financial Concepts'
  },
  {
    id: 'fin-15',
    question: 'What is a credit score?',
    options: [
      'Your bank account balance',
      'A numerical representation of your creditworthiness',
      'The number of credit cards you have',
      'Your monthly income'
    ],
    correctAnswer: 1,
    explanation: 'A credit score is a numerical representation of your creditworthiness based on your credit history.',
    category: 'Personal Finance'
  },
  {
    id: 'fin-16',
    question: 'What is the Federal Reserve?',
    options: [
      'A federal savings account',
      'The central banking system of the United States',
      'A government investment fund',
      'A type of bond'
    ],
    correctAnswer: 1,
    explanation: 'The Federal Reserve is the central banking system of the United States that conducts monetary policy.',
    category: 'Economic Institutions'
  },
  {
    id: 'fin-17',
    question: 'What is volatility in investing?',
    options: [
      'How quickly prices change',
      'The measure of price fluctuations over time',
      'The volume of trading',
      'The value of investments'
    ],
    correctAnswer: 1,
    explanation: 'Volatility measures the degree of variation in a trading price series over time.',
    category: 'Risk Metrics'
  },
  {
    id: 'fin-18',
    question: 'What is a 401(k)?',
    options: [
      'A type of loan',
      'An employer-sponsored retirement savings plan',
      'A government bond',
      'A tax form'
    ],
    correctAnswer: 1,
    explanation: 'A 401(k) is an employer-sponsored retirement savings plan that allows employees to save and invest for retirement.',
    category: 'Retirement Planning'
  },
  {
    id: 'fin-19',
    question: 'What is the difference between stocks and bonds?',
    options: [
      'Stocks are debt, bonds are equity',
      'Stocks represent ownership, bonds represent debt',
      'There is no difference',
      'Stocks are safer than bonds'
    ],
    correctAnswer: 1,
    explanation: 'Stocks represent ownership in a company, while bonds represent debt that companies or governments owe to investors.',
    category: 'Investment Types'
  },
  {
    id: 'fin-20',
    question: 'What is an emergency fund?',
    options: [
      'Money for emergencies only',
      'A savings account for unexpected expenses',
      'Investment money',
      'Money for vacations'
    ],
    correctAnswer: 1,
    explanation: 'An emergency fund is money set aside in a savings account to cover unexpected expenses or financial emergencies.',
    category: 'Personal Finance'
  }
];

// Language Learning Quiz Questions
const languageQuestions: QuizQuestion[] = [
  {
    id: 'lang-1',
    question: 'What are the basic components of grammar in most languages?',
    options: [
      'Words and sentences',
      'Nouns, verbs, adjectives, and other parts of speech',
      'Speaking and writing',
      'Vocabulary and pronunciation'
    ],
    correctAnswer: 1,
    explanation: 'Grammar consists of parts of speech like nouns, verbs, adjectives, pronouns, adverbs, prepositions, conjunctions, and interjections.',
    category: 'Grammar Fundamentals'
  },
  {
    id: 'lang-2',
    question: 'What is a cognate in language learning?',
    options: [
      'A difficult word to pronounce',
      'A word that sounds and means the same in different languages',
      'A grammar rule',
      'A type of verb tense'
    ],
    correctAnswer: 1,
    explanation: 'Cognates are words that have the same or similar meaning and spelling in different languages, often sharing a common origin.',
    category: 'Vocabulary'
  },
  {
    id: 'lang-3',
    question: 'What is the best way to improve pronunciation?',
    options: [
      'Reading silently',
      'Listening to native speakers and practicing speaking',
      'Memorizing vocabulary',
      'Learning grammar rules'
    ],
    correctAnswer: 1,
    explanation: 'Listening to native speakers and actively practicing speaking helps develop proper pronunciation and accent.',
    category: 'Pronunciation'
  },
  {
    id: 'lang-4',
    question: 'What is immersion in language learning?',
    options: [
      'Swimming while studying',
      'Surrounding yourself with the target language',
      'Learning underwater',
      'Taking intensive classes'
    ],
    correctAnswer: 1,
    explanation: 'Language immersion involves surrounding yourself with the target language through media, conversation, and daily life.',
    category: 'Learning Methods'
  },
  {
    id: 'lang-5',
    question: 'What is the difference between formal and informal language?',
    options: [
      'Formal is harder, informal is easier',
      'Formal is used in professional settings, informal in casual settings',
      'Formal uses bigger words',
      'There is no difference'
    ],
    correctAnswer: 1,
    explanation: 'Formal language is used in professional, academic, or official contexts, while informal language is used in casual, everyday situations.',
    category: 'Register and Style'
  },
  {
    id: 'lang-6',
    question: 'What is syntax in language?',
    options: [
      'The study of word meanings',
      'The arrangement of words to create sentences',
      'Pronunciation rules',
      'Vocabulary building'
    ],
    correctAnswer: 1,
    explanation: 'Syntax refers to the rules governing the arrangement of words to form grammatically correct sentences.',
    category: 'Grammar Fundamentals'
  },
  {
    id: 'lang-7',
    question: 'What is the most effective way to build vocabulary?',
    options: [
      'Memorizing word lists',
      'Learning words in context through reading and conversation',
      'Using flashcards only',
      'Translating everything'
    ],
    correctAnswer: 1,
    explanation: 'Learning vocabulary in context through reading, listening, and conversation helps with retention and proper usage.',
    category: 'Vocabulary'
  },
  {
    id: 'lang-8',
    question: 'What are false friends in language learning?',
    options: [
      'People who don\'t help you learn',
      'Words that look similar but have different meanings',
      'Difficult grammar concepts',
      'Words that are hard to pronounce'
    ],
    correctAnswer: 1,
    explanation: 'False friends are words that appear similar between languages but have different meanings, often causing confusion.',
    category: 'Common Pitfalls'
  },
  {
    id: 'lang-9',
    question: 'What is the Critical Period Hypothesis?',
    options: [
      'The best time to take language tests',
      'The idea that language learning is easier at younger ages',
      'A study method',
      'A grammar rule'
    ],
    correctAnswer: 1,
    explanation: 'The Critical Period Hypothesis suggests there\'s an optimal age range for language acquisition, typically before puberty.',
    category: 'Language Acquisition'
  },
  {
    id: 'lang-10',
    question: 'What is pragmatics in language?',
    options: [
      'Practical grammar rules',
      'The study of language use in context',
      'Speaking practice',
      'Writing exercises'
    ],
    correctAnswer: 1,
    explanation: 'Pragmatics studies how context influences the meaning and interpretation of language in real communication.',
    category: 'Advanced Concepts'
  },
  {
    id: 'lang-11',
    question: 'What is code-switching?',
    options: [
      'Learning programming languages',
      'Alternating between two or more languages in conversation',
      'Changing your accent',
      'Using formal language'
    ],
    correctAnswer: 1,
    explanation: 'Code-switching is the practice of alternating between two or more languages or dialects within a conversation.',
    category: 'Bilingualism'
  },
  {
    id: 'lang-12',
    question: 'What is phonetics?',
    options: [
      'The study of phone usage',
      'The study of speech sounds',
      'Learning vocabulary',
      'Grammar rules'
    ],
    correctAnswer: 1,
    explanation: 'Phonetics is the branch of linguistics that studies the physical properties of speech sounds.',
    category: 'Linguistics'
  },
  {
    id: 'lang-13',
    question: 'What is the difference between fluency and accuracy?',
    options: [
      'Fluency is speed, accuracy is correctness',
      'They are the same thing',
      'Fluency is harder than accuracy',
      'Accuracy only matters in writing'
    ],
    correctAnswer: 0,
    explanation: 'Fluency refers to the smoothness and speed of communication, while accuracy refers to the correctness of grammar and vocabulary usage.',
    category: 'Language Skills'
  },
  {
    id: 'lang-14',
    question: 'What is metalinguistic awareness?',
    options: [
      'Knowing about language and how it works',
      'Speaking multiple languages',
      'Using formal language',
      'Learning vocabulary quickly'
    ],
    correctAnswer: 0,
    explanation: 'Metalinguistic awareness is the ability to think about and discuss language as an object of inquiry.',
    category: 'Language Awareness'
  },
  {
    id: 'lang-15',
    question: 'What is the difference between acquisition and learning?',
    options: [
      'Acquisition is natural, learning is formal',
      'They are exactly the same',
      'Acquisition is faster',
      'Learning is more effective'
    ],
    correctAnswer: 0,
    explanation: 'Language acquisition occurs naturally through exposure, while language learning involves conscious study of rules and structures.',
    category: 'Language Acquisition'
  },
  {
    id: 'lang-16',
    question: 'What is communicative competence?',
    options: [
      'Being competitive in communication',
      'The ability to use language effectively in social contexts',
      'Speaking loudly and clearly',
      'Knowing perfect grammar'
    ],
    correctAnswer: 1,
    explanation: 'Communicative competence is the ability to use language appropriately and effectively in various social and cultural contexts.',
    category: 'Communication Skills'
  },
  {
    id: 'lang-17',
    question: 'What is discourse in language studies?',
    options: [
      'Disagreeing with someone',
      'Language use beyond the sentence level',
      'Speaking practice',
      'Vocabulary learning'
    ],
    correctAnswer: 1,
    explanation: 'Discourse refers to language use beyond individual sentences, including conversation, texts, and communication patterns.',
    category: 'Advanced Concepts'
  },
  {
    id: 'lang-18',
    question: 'What is scaffolding in language education?',
    options: [
      'Building structures for learning',
      'Temporary support provided to help learners achieve goals',
      'Physical classroom setup',
      'Advanced grammar concepts'
    ],
    correctAnswer: 1,
    explanation: 'Scaffolding involves providing temporary support and guidance to help learners achieve language learning goals they couldn\'t reach independently.',
    category: 'Teaching Methods'
  },
  {
    id: 'lang-19',
    question: 'What is interlanguage?',
    options: [
      'Translation between languages',
      'The learner\'s developing language system',
      'International languages',
      'Computer programming languages'
    ],
    correctAnswer: 1,
    explanation: 'Interlanguage is the dynamic language system that learners develop as they progress toward full proficiency in a target language.',
    category: 'Language Development'
  },
  {
    id: 'lang-20',
    question: 'What is the role of motivation in language learning?',
    options: [
      'It doesn\'t matter much',
      'It significantly affects learning success and persistence',
      'Only extrinsic motivation works',
      'Motivation only helps beginners'
    ],
    correctAnswer: 1,
    explanation: 'Motivation plays a crucial role in language learning success, affecting both the effort learners invest and their persistence through challenges.',
    category: 'Learning Psychology'
  }
];

// Marketing Quiz Questions (continue with similar pattern for other categories)
const marketingQuestions: QuizQuestion[] = [
  {
    id: 'mark-1',
    question: 'What are the 4 Ps of marketing?',
    options: [
      'Product, Price, Place, Promotion',
      'People, Process, Physical, Performance',
      'Planning, Pricing, Positioning, Profit',
      'Product, People, Price, Performance'
    ],
    correctAnswer: 0,
    explanation: 'The 4 Ps of marketing are Product, Price, Place (distribution), and Promotion - the fundamental elements of the marketing mix.',
    category: 'Marketing Mix'
  },
  {
    id: 'mark-2',
    question: 'What is a target market?',
    options: [
      'A place to practice archery',
      'A specific group of consumers a business aims to reach',
      'A marketing goal',
      'A type of advertisement'
    ],
    correctAnswer: 1,
    explanation: 'A target market is a specific group of consumers that a business has identified as the focus of its marketing efforts.',
    category: 'Market Segmentation'
  },
  {
    id: 'mark-3',
    question: 'What is brand positioning?',
    options: [
      'Where you place your logo',
      'How a brand is perceived in consumers\' minds relative to competitors',
      'The physical location of stores',
      'The order of products on shelves'
    ],
    correctAnswer: 1,
    explanation: 'Brand positioning refers to how a brand occupies a distinct position in the minds of consumers relative to competing brands.',
    category: 'Branding'
  },
  {
    id: 'mark-4',
    question: 'What is SEO in digital marketing?',
    options: [
      'Social Entertainment Online',
      'Search Engine Optimization',
      'Selling Everything Online',
      'Strategic Engagement Operations'
    ],
    correctAnswer: 1,
    explanation: 'SEO stands for Search Engine Optimization, the practice of increasing the quantity and quality of traffic to a website through organic search results.',
    category: 'Digital Marketing'
  },
  {
    id: 'mark-5',
    question: 'What is a conversion rate?',
    options: [
      'The rate at which money is exchanged',
      'The percentage of visitors who complete a desired action',
      'How fast a website loads',
      'The rate of customer complaints'
    ],
    correctAnswer: 1,
    explanation: 'Conversion rate is the percentage of visitors to a website who complete a desired goal (conversion) out of the total number of visitors.',
    category: 'Analytics'
  },
  {
    id: 'mark-6',
    question: 'What is content marketing?',
    options: [
      'Selling content online',
      'Creating valuable content to attract and engage customers',
      'Marketing only through videos',
      'Copying other companies\' content'
    ],
    correctAnswer: 1,
    explanation: 'Content marketing involves creating and sharing valuable, relevant content to attract and engage a target audience.',
    category: 'Content Strategy'
  },
  {
    id: 'mark-7',
    question: 'What is a sales funnel?',
    options: [
      'A tool for selling funnels',
      'The process customers go through from awareness to purchase',
      'A type of advertisement',
      'A sales training method'
    ],
    correctAnswer: 1,
    explanation: 'A sales funnel represents the customer journey from initial awareness of a product to making a purchase decision.',
    category: 'Sales Process'
  },
  {
    id: 'mark-8',
    question: 'What is ROI in marketing?',
    options: [
      'Return on Investment',
      'Rate of Income',
      'Reach of Influence',
      'Revenue of Interest'
    ],
    correctAnswer: 0,
    explanation: 'ROI (Return on Investment) measures the profitability of marketing campaigns by comparing the revenue generated to the cost invested.',
    category: 'Marketing Metrics'
  },
  {
    id: 'mark-9',
    question: 'What is A/B testing?',
    options: [
      'Testing two different versions to see which performs better',
      'Grading tests from A to B',
      'Testing alphabetical order',
      'Advanced/Basic testing levels'
    ],
    correctAnswer: 0,
    explanation: 'A/B testing compares two versions of a webpage, email, or ad to determine which one performs better with the target audience.',
    category: 'Testing and Optimization'
  },
  {
    id: 'mark-10',
    question: 'What is customer lifetime value (CLV)?',
    options: [
      'How long a customer lives',
      'The total revenue expected from a customer over their relationship',
      'The time a customer spends on your website',
      'The age of your average customer'
    ],
    correctAnswer: 1,
    explanation: 'Customer Lifetime Value is the total amount of revenue a business can expect from a single customer over the course of their relationship.',
    category: 'Customer Metrics'
  },
  {
    id: 'mark-11',
    question: 'What is viral marketing?',
    options: [
      'Marketing during virus outbreaks',
      'Content that spreads rapidly through social sharing',
      'Marketing for antivirus software',
      'Infectious disease awareness campaigns'
    ],
    correctAnswer: 1,
    explanation: 'Viral marketing refers to content that spreads rapidly and widely through social networks and word-of-mouth sharing.',
    category: 'Social Media Marketing'
  },
  {
    id: 'mark-12',
    question: 'What is remarketing/retargeting?',
    options: [
      'Changing your target market',
      'Showing ads to people who previously visited your website',
      'Selling the same product again',
      'Improving your marketing strategy'
    ],
    correctAnswer: 1,
    explanation: 'Remarketing involves showing targeted ads to people who have previously visited your website or interacted with your brand.',
    category: 'Digital Advertising'
  },
  {
    id: 'mark-13',
    question: 'What is influencer marketing?',
    options: [
      'Marketing to influential people only',
      'Using people with social influence to promote products',
      'Marketing that influences behavior',
      'Political campaign marketing'
    ],
    correctAnswer: 1,
    explanation: 'Influencer marketing involves partnering with individuals who have social influence to promote products or services to their followers.',
    category: 'Social Media Marketing'
  },
  {
    id: 'mark-14',
    question: 'What is email marketing automation?',
    options: [
      'Sending emails automatically without thinking',
      'Using software to send targeted emails based on triggers',
      'Robot-written emails',
      'Scheduling all emails for the same time'
    ],
    correctAnswer: 1,
    explanation: 'Email marketing automation uses software to send personalized, targeted emails to subscribers based on specific triggers or behaviors.',
    category: 'Email Marketing'
  },
  {
    id: 'mark-15',
    question: 'What is omnichannel marketing?',
    options: [
      'Marketing on all TV channels',
      'Providing seamless customer experience across all channels',
      'Using only one marketing channel',
      'Marketing only online'
    ],
    correctAnswer: 1,
    explanation: 'Omnichannel marketing provides customers with a seamless, integrated experience across all touchpoints and channels.',
    category: 'Multi-Channel Strategy'
  },
  {
    id: 'mark-16',
    question: 'What is programmatic advertising?',
    options: [
      'Advertising computer programs',
      'Automated buying of digital advertising space',
      'Programming advertisements manually',
      'Creating TV programming'
    ],
    correctAnswer: 1,
    explanation: 'Programmatic advertising uses automated technology to buy digital advertising space in real-time, optimizing for specific audiences.',
    category: 'Digital Advertising'
  },
  {
    id: 'mark-17',
    question: 'What is customer acquisition cost (CAC)?',
    options: [
      'The cost of acquiring a new customer',
      'The cost customers pay to acquire products',
      'The cost of customer service',
      'The cost of losing customers'
    ],
    correctAnswer: 0,
    explanation: 'Customer Acquisition Cost is the cost associated with convincing a potential customer to buy a product or service.',
    category: 'Marketing Metrics'
  },
  {
    id: 'mark-18',
    question: 'What is native advertising?',
    options: [
      'Advertising to native populations',
      'Ads that match the form and function of the platform',
      'Advertising in local languages',
      'Traditional print advertising'
    ],
    correctAnswer: 1,
    explanation: 'Native advertising refers to ads that match the form, feel, and function of the media format in which they appear.',
    category: 'Advertising Types'
  },
  {
    id: 'mark-19',
    question: 'What is marketing attribution?',
    options: [
      'Giving credit to marketing teams',
      'Determining which touchpoints contribute to conversions',
      'Attributing quotes to marketers',
      'Copyright attribution in marketing'
    ],
    correctAnswer: 1,
    explanation: 'Marketing attribution is the process of determining which marketing touchpoints contribute to conversions and sales.',
    category: 'Analytics'
  },
  {
    id: 'mark-20',
    question: 'What is growth hacking?',
    options: [
      'Illegally hacking for growth',
      'Creative, low-cost strategies to grow a business rapidly',
      'Growing plants for marketing',
      'Hacking growth hormones'
    ],
    correctAnswer: 1,
    explanation: 'Growth hacking involves using creative, analytical, and low-cost strategies to rapidly grow a business, typically in startups.',
    category: 'Growth Strategy'
  }
];

// Function to generate quiz data for a course
export const generateCourseQuiz = (course: any): CourseQuiz => {
  let questions: QuizQuestion[] = [];
  
  // Select questions based on course category
  switch (course.category.toLowerCase()) {
    case 'digital art':
      questions = digitalArtQuestions;
      break;
    case 'programming':
      questions = programmingQuestions;
      break;
    case 'finance':
      questions = financeQuestions;
      break;
    case 'languages':
      questions = languageQuestions;
      break;
    case 'marketing':
      questions = marketingQuestions;
      break;
    default:
      // Use a mix of questions for other categories
      questions = [
        ...digitalArtQuestions.slice(0, 4),
        ...programmingQuestions.slice(0, 4),
        ...financeQuestions.slice(0, 4),
        ...languageQuestions.slice(0, 4),
        ...marketingQuestions.slice(0, 4)
      ];
  }

  return {
    id: generateQuizId(course.id),
    courseId: course.id,
    questions: questions,
    passingScore: 70, // 70% to pass
    timeLimit: 45 // 45 minutes
  };
};

export default {
  generateCourseQuiz,
  digitalArtQuestions,
  programmingQuestions,
  financeQuestions,
  languageQuestions,
  marketingQuestions
};