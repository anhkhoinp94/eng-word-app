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
  // Read the original JSON file
  const originalItems = readJSON('src\\assets\\ielts\\ielts.json');

  // Shuffle the items and assign new IDs
  const shuffledItems = shuffleItems(originalItems);

  // Write the shuffled items with new IDs to a new JSON file
  writeJSON('src\\assets\\ielts\\output.json', shuffledItems);

  console.log('Shuffled items have been written to output.json');
}

// Run the program
main();
