const fs = require('fs');
const { concat } = require('rxjs');

// Read JSON from file and return an array of items
function readJSON(filename) {
  const data = fs.readFileSync(filename, 'utf-8');
  return JSON.parse(data);
}

// Write JSON to a file
function writeJSON(filename, items) {
  const jsonData = JSON.stringify(items, null, 2); // Pretty print with 2 spaces
  fs.writeFileSync(filename, jsonData, 'utf-8');
}

// Shuffle the array of items
function shuffleItems(items) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]]; // Swap items
  }

  // Assign new IDs to shuffled items
  items.forEach((item, index) => {
    item.id = index + 1;
  });

  return items;
}

// Main process
function main() {
  let words1 = readJSON('src\\assets\\det\\words1.json');
  words1.forEach(i => {
    i.speakSentenceCountMax = 1;
    i.speakWordCountMax = 1;
    i.page = 1;
  });

  let words2 = readJSON('src\\assets\\det\\words2.json');
  words2.forEach(i => {
    i.speakSentenceCountMax = 1;
    i.speakWordCountMax = 1;
    i.page = 2;
  });

  let words3 = readJSON('src\\assets\\det\\words3.json');
  words3.forEach(i => {
    i.speakSentenceCountMax = 1;
    i.speakWordCountMax = 1;
    i.page = 3;
  });

  let words4 = readJSON('src\\assets\\det\\words4.json');
  words4.forEach(i => {
    i.speakSentenceCountMax = 2;
    i.speakWordCountMax = 1;
    i.page = 4;
  });

  let words5 = readJSON('src\\assets\\det\\words5.json');
  words5.forEach(i => {
    i.speakSentenceCountMax = 3;
    i.speakWordCountMax = 1;
    i.page = 5;
  });

  let words6 = readJSON('src\\assets\\det\\words6.json');
  words6.forEach(i => {
    i.speakSentenceCountMax = 3;
    i.speakWordCountMax = 1;
    i.page = 6;
  });

  let words7 = readJSON('src\\assets\\det\\words7.json');
  words7.forEach(i => {
    i.speakSentenceCountMax = 3;
    i.speakWordCountMax = 1;
    i.page = 7;
  });

  let words8 = readJSON('src\\assets\\det\\words8.json');
  words8.forEach(i => {
    i.speakSentenceCountMax = 3;
    i.speakWordCountMax = 1;
    i.page = 8;
  });

  let words = readJSON('src\\assets\\det\\words.json');
  words.forEach(i => {
    i.speakSentenceCountMax = 3;
    i.speakWordCountMax = 1;
    i.page = 9;
  });
  words.shift();

  let items = words;
  items = items.concat(words1);
  items = items.concat(words2);
  items = items.concat(words3);
  items = items.concat(words4);
  items = items.concat(words5);
  items = items.concat(words6);
  items = items.concat(words7);
  items = items.concat(words8);
  console.log(`We have totally ${items.length} words.`);

  // Check duplicated
  const duplicates = items
    .map(item => item.en1)
    .filter((word, index, self) => self.indexOf(word) !== index);

  if (duplicates.length > 0) {
    console.log("Duplicated words:", duplicates);
  } else {
    console.log("No duplicates.");
  }

  // Check sample sentences
  const notIncluded = items.filter(item => {
    const word = item.en1.toLowerCase();
    const sentence = item.en2.toLowerCase();
    return !sentence.includes(word);
  });
  if (notIncluded.length > 0) {
    console.log("Words don't have correct sentences:", notIncluded);
  } else {
    console.log("All sentences are correct with words.");
  }

  // Shuffle words
  let shuffledItems = shuffleItems(items);
  const randomNumber = Math.floor(Math.random() * (100 - 5 + 1)) + 5;
  for (let i = 0; i < randomNumber; i++) {
    console.log(`the ${i} time`);
    shuffledItems = shuffleItems(shuffledItems);
  }
  writeJSON('src\\assets\\det\\output.json', shuffledItems);
  console.log('Shuffled items have been written to output.json');

  const tnow = new Date().toLocaleString()
  writeJSON('src\\assets\\det\\deploy_time.json', { time: tnow });
  console.log('Write deploy time to deploy_time.json');
}

// Run the program
main();
