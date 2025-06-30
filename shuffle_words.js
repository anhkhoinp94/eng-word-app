const fs = require('fs');

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
  const originalItems = readJSON('src\\assets\\det\\words.json');
  // Check duplicated
  const duplicates = originalItems
    .map(item => item.en1)
    .filter((word, index, self) => self.indexOf(word) !== index);

  if (duplicates.length > 0) {
    console.log("Duplicated en1 words:", duplicates);
  } else {
    console.log("No duplicates in en1.");
  }

  // Check sample sentences
  const notIncluded = originalItems.filter(item => {
    const word = item.en1.toLowerCase();
    const sentence = item.en2.toLowerCase();
    return !sentence.includes(word);
  });
  if (notIncluded.length > 0) {
    console.log("en1 not found in en2 for items:", notIncluded);
  } else {
    console.log("All en1 words are included in en2.");
  }

  // Shuffle words
  let shuffledItems = shuffleItems(originalItems);
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
