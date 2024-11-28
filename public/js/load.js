document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const gitHub = document.getElementById('gitHub');
  const engineDropdown = document.getElementById('searchEngine');
  setTimeout(() => {
    searchInput.classList.add('expanded');
  }, 200);
  setTimeout(() => {
    engineDropdown.classList.add('expanded');
  }, 200);
  setTimeout(() => {
    gitHub.classList.add('spin');
  }, 200);

  const sloganElement = document.getElementById('slogan');
  
  const quotes = [
    { text: '"The only way to do great work is to love what you do." - Steve Jobs', author: 'Steve Jobs' },
    { text: '"Success is not the key to happiness. Happiness is the key to success." - Albert Schweitzer', author: 'Albert Schweitzer' },
    { text: '"The future belongs to those who believe in the beauty of their dreams." - Eleanor Roosevelt', author: 'Eleanor Roosevelt' },
    { text: '"It does not matter how slowly you go as long as you do not stop." - Confucius', author: 'Confucius' },
    { text: '"In the end, we will remember not the words of our enemies, but the silence of our friends." - Martin Luther King Jr.', author: 'Martin Luther King Jr.' },
    { text: '"You miss 100% of the shots you don’t take." - Wayne Gretzky', author: 'Wayne Gretzky' },
    { text: '"The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate, to have it make some difference that you have lived and lived well." - Ralph Waldo Emerson', author: 'Ralph Waldo Emerson' },
    { text: '"Don’t watch the clock; do what it does. Keep going." - Sam Levenson', author: 'Sam Levenson' },
    { text: '"What lies behind us and what lies before us are tiny matters compared to what lies within us." - Ralph Waldo Emerson', author: 'Ralph Waldo Emerson' },
    { text: '"The only limit to our realization of tomorrow is our doubts of today." - Franklin D. Roosevelt', author: 'Franklin D. Roosevelt' },
    { text: '"Happiness depends upon ourselves." - Aristotle', author: 'Aristotle' },
    { text: '"The best way to predict the future is to create it." - Peter Drucker', author: 'Peter Drucker' },
    { text: '"Life is what happens when you’re busy making other plans." - John Lennon', author: 'John Lennon' },
    { text: '"Everything you can imagine is real." - Pablo Picasso', author: 'Pablo Picasso' },
    { text: '"Do one thing every day that scares you." - Eleanor Roosevelt', author: 'Eleanor Roosevelt' },
    { text: '"You only live once, but if you do it right, once is enough." - Mae West', author: 'Mae West' },
    { text: '"We do not remember days; we remember moments." - Cesare Pavese', author: 'Cesare Pavese' },
    { text: '"Good things come to those who wait, but better things come to those who go out and get them." - Unknown', author: 'Unknown' },
    { text: '"Success is not final, failure is not fatal: It is the courage to continue that counts." - Winston Churchill', author: 'Winston Churchill' },
    { text: '"The mind is everything. What you think you become." - Buddha', author: 'Buddha' },
    { text: '"The best revenge is massive success." - Frank Sinatra', author: 'Frank Sinatra' },
    { text: '"Success usually comes to those who are too busy to be looking for it." - Henry David Thoreau', author: 'Henry David Thoreau' },
    { text: '"Don’t be afraid to give up the good to go for the great." - John D. Rockefeller', author: 'John D. Rockefeller' },
    { text: '"The only way to achieve the impossible is to believe it is possible." - Charles Kingsleigh', author: 'Charles Kingsleigh' },
    { text: '"Everything has beauty, but not everyone sees it." - Confucius', author: 'Confucius' },
    { text: '"Success is not how high you have climbed, but how you make a positive difference to the world." - Roy T. Bennett', author: 'Roy T. Bennett' },
    { text: '"You can never cross the ocean until you have the courage to lose sight of the shore." - Christopher Columbus', author: 'Christopher Columbus' },
    { text: '"Success is to be measured not so much by the position that one has reached in life as by the obstacles which he has overcome." - Booker T. Washington', author: 'Booker T. Washington' },
    { text: '"In three words I can sum up everything I’ve learned about life: It goes on." - Robert Frost', author: 'Robert Frost' },
    { text: '"Believe you can and you’re halfway there." - Theodore Roosevelt', author: 'Theodore Roosevelt' },
    { text: '"Act as if what you do makes a difference. It does." - William James', author: 'William James' },
    { text: '"Perfection is not attainable, but if we chase perfection we can catch excellence." - Vince Lombardi', author: 'Vince Lombardi' },
    { text: '"The best way out is always through." - Robert Frost', author: 'Robert Frost' },
    { text: '"You are never too old to set another goal or to dream a new dream." - C.S. Lewis', author: 'C.S. Lewis' },
    { text: '"Hardships often prepare ordinary people for an extraordinary destiny." - C.S. Lewis', author: 'C.S. Lewis' },
    { text: '"The difference between who you are and who you want to be is what you do." - Unknown', author: 'Unknown' },
    { text: '"Success is not measured by what you accomplish, but by the opposition you have encountered, and the courage with which you have maintained the struggle against overwhelming odds." - Orison Swett Marden', author: 'Orison Swett Marden' },
    { text: '"To live a creative life, we must lose our fear of being wrong." - Joseph Chilton Pearce', author: 'Joseph Chilton Pearce' },
    { text: '"You don’t have to be great to start, but you have to start to be great." - Zig Ziglar', author: 'Zig Ziglar' },
    { text: '"You have as many hours in a day as Beyoncé." - Unknown', author: 'Unknown' },
    { text: '"You must be the change you wish to see in the world." - Mahatma Gandhi', author: 'Mahatma Gandhi' },
    { text: '"Everything you’ve ever wanted is on the other side of fear." - George Addair', author: 'George Addair' },
    { text: '"If you want to achieve greatness stop asking for permission." - Anonymous', author: 'Anonymous' },
    { text: '"Hardships often prepare ordinary people for an extraordinary destiny." - C.S. Lewis', author: 'C.S. Lewis' },
    { text: '"Believe you can and you’re halfway there." - Theodore Roosevelt', author: 'Theodore Roosevelt' },
    { text: '"What we achieve inwardly will change outer reality." - Plutarch', author: 'Plutarch' },
    { text: '"Success is the sum of small efforts, repeated day in and day out." - Robert Collier', author: 'Robert Collier' },
    { text: '"Opportunities don’t happen, you create them." - Chris Grosser', author: 'Chris Grosser' },
    { text: '"The secret of getting ahead is getting started." - Mark Twain', author: 'Mark Twain' },
    { text: '"Your time is limited, so don’t waste it living someone else’s life." - Steve Jobs', author: 'Steve Jobs' },
    { text: '"Strive not to be a success, but rather to be of value." - Albert Einstein', author: 'Albert Einstein' },
    { text: '"Do what you can, with what you have, where you are." - Theodore Roosevelt', author: 'Theodore Roosevelt' },
    { text: '"You are enough just as you are." - Meghan Markle', author: 'Meghan Markle' },
    { text: '"Do not wait to strike till the iron is hot, but make it hot by striking." - William Butler Yeats', author: 'William Butler Yeats' },
    { text: '"The best time to plant a tree was 20 years ago. The second best time is now." - Chinese Proverb', author: 'Chinese Proverb' },
    { text: '"In the middle of every difficulty lies opportunity." - Albert Einstein', author: 'Albert Einstein' },
    { text: '"Nothing is impossible, the word itself says 'I\'m possible!'" - Audrey Hepburn', author: 'Audrey Hepburn' },
    { text: '"You can never plan the future by the past." - Edmund Burke', author: 'Edmund Burke' },
    { text: '"The only impossible journey is the one you never begin." - Tony Robbins', author: 'Tony Robbins' },
    { text: '"Keep your face always toward the sunshine—and shadows will fall behind you." - Walt Whitman', author: 'Walt Whitman' }
  ];

  let quoteIndex = 0;
  let i = 0;
  const sloganText = quotes[quoteIndex].text;
  
  function typeWriter() {
    if (i < sloganText.length) {
      sloganElement.innerHTML += sloganText.charAt(i);
      i++;
      setTimeout(typeWriter, 60);
    } else {
      setTimeout(() => {
        sloganElement.classList.add('cursor-fade-out');
      }, 1000);
    }
  }

  function changeQuote() {
    const quote = quotes[quoteIndex];
    sloganElement.innerHTML = ''; 
    i = 0; 
    typeWriter();
    quoteIndex = (quoteIndex + 1) % quotes.length;
  }
  
  setInterval(changeQuote, 5000);
  changeQuote(); 
});