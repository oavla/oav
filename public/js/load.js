document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('searchInput');
  const gitHub = document.getElementById('gitHub');
  const engineDropdown = document.getElementById('searchEngine');
  setTimeout(() => searchInput.classList.add('expanded'), 200);
  setTimeout(() => engineDropdown.classList.add('expanded'), 200);
  setTimeout(() => gitHub.classList.add('spin'), 200);

  const sloganElement = document.getElementById('slogan');
  const quotes = [
    '"The more that you read, the more things you will know. The more that you learn, the more places you\'ll go." - Dr. Seuss',
    '"You are braver than you believe, stronger than you seem, and smarter than you think." - A.A. Milne',
    '"It always seems impossible until it’s done." - Nelson Mandela',
    '"The only way to do great work is to love what you do." - Steve Jobs',
    '"Success is not the key to happiness. Happiness is the key to success." - Albert Schweitzer',
    '"Believe you can and you’re halfway there." - Theodore Roosevelt',
    '"Dream big and dare to fail." - Norman Vaughan',
    '"The beautiful thing about learning is that no one can take it away from you." - B.B. King',
    '"Don’t be afraid to start over. It’s a brand new opportunity to rebuild what you want." - Anonymous',
    '"Education is the most powerful weapon which you can use to change the world." - Nelson Mandela',
    '"The future belongs to those who believe in the beauty of their dreams." - Eleanor Roosevelt',
    '"You miss 100% of the shots you don’t take." - Wayne Gretzky',
    '"Do what you can, with what you have, where you are." - Theodore Roosevelt',
    '"Everything is hard before it is easy." - Goethe',
    '"It’s not whether you get knocked down, it’s whether you get up." - Vince Lombardi',
    '"What we learn becomes a part of who we are." - Anonymous',
    '"The road to success is dotted with many tempting parking spaces." - Will Rogers',
    '"Strive for progress, not perfection." - Anonymous',
    '"Do your best and forget the rest." - Anonymous',
    '"Success is how high you bounce when you hit bottom." - George S. Patton',
    '"You can learn something new every day if you listen." - Jackson Brown Jr.',
    '"The harder you work for something, the greater you’ll feel when you achieve it." - Anonymous',
    '"Success usually comes to those who are too busy to be looking for it." - Henry David Thoreau',
    '"The way to get started is to quit talking and begin doing." - Walt Disney',
    '"Believe in yourself and all that you are." - Christian D. Larson',
    '"Don’t let what you cannot do interfere with what you can do." - John Wooden',
    '"Start where you are. Use what you have. Do what you can." - Arthur Ashe',
    '"You are never too old to set another goal or to dream a new dream." - C.S. Lewis',
    '"If you can dream it, you can do it." - Walt Disney',
    '"Mistakes are proof that you are trying." - Jennifer Lim',
    '"Success is not in what you have, but who you are." - Bo Bennett',
    '"You don’t have to be great to start, but you have to start to be great." - Zig Ziglar',
    '"Don’t wait for the perfect moment. Take the moment and make it perfect." - Anonymous',
    '"It does not matter how slowly you go as long as you do not stop." - Confucius',
    '"Your positive action combined with positive thinking results in success." - Shiv Khera',
    '"Happiness is not by chance, but by choice." - Jim Rohn',
    '"Be the change that you wish to see in the world." - Mahatma Gandhi',
    '"The only limit to our realization of tomorrow is our doubts of today." - Franklin D. Roosevelt',
    '"Success is the sum of small efforts, repeated day in and day out." - Robert Collier',
    '"The difference between who you are and who you want to be is what you do." - Anonymous',
    '"The best way to predict the future is to create it." - Abraham Lincoln',
    '"Everything you can imagine is real." - Pablo Picasso',
    '"You don’t have to be the best, but you have to try your best." - Anonymous',
    '"Keep going. Each step may get harder, but don’t stop. The view at the top is beautiful." - Anonymous'
  ];
  let i = 0;
  let isDeleting = false;
  let currentQuote = quotes[Math.floor(Math.random() * quotes.length)];

  function typeWriter() {
    if (!isDeleting && i < currentQuote.length) {
      sloganElement.innerHTML = currentQuote.substring(0, i + 1);
      i++;
      setTimeout(typeWriter, 60);
    } else if (isDeleting && i > 0) {
      sloganElement.innerHTML = currentQuote.substring(0, i - 1);
      i--;
      setTimeout(typeWriter, 15);
    } else if (!isDeleting && i === currentQuote.length) {
      setTimeout(() => {
        isDeleting = true;
        typeWriter();
      }, 1000);
    } else if (isDeleting && i === 0) {
      isDeleting = false;
      currentQuote = quotes[Math.floor(Math.random() * quotes.length)];
      typeWriter();
    }
  }

  typeWriter();
});