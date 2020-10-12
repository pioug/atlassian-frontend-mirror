#!/usr/local/bin/node

// Samples 10 emoji from each category for use as test data
// Usage:
//  curl -s http://localhost:7788/emoji/standard | ./sample-emoji-test-data.ts > test-emoji-standard.json

const inputChunks: any[] = [];

const reservedEmojis = new Map([
  // :grin: used to test exact match ranking
  // :smiley: used to test ascii representations
  // :thumbsup: has skin variations need for testing
  // :thumbsdown: used to verify order against :thumbsup:
  // :police_officer: is for testing non-searchable emoji
  // :raised_hand: used for tone selector testing
  // :sweat_smile: used in editor-core for ascii emoji test
  [
    'PEOPLE',
    [
      ':grin:',
      ':smiley:',
      ':thumbsup:',
      ':thumbsdown:',
      ':open_mouth:',
      ':police_officer:',
      ':raised_hand:',
      ':sweat_smile:',
    ],
  ],
  ['FLAGS', [':flag_black:', ':flag_cg:', ':flag_al:', ':flag_dz:']],
  // :heart: and :green_heart: are used to test sorting by usage
  ['SYMBOLS', [':heart:', ':green_heart:']],
  // :boom: is used for testing duplicate shortName between standard and atlassian
  ['NATURE', [':boom:']],
  ['ATLASSIAN', [':boom:', ':evilburns:']],
]);

function isReservedEmoji(category: string, shortName: string) {
  const emojis = reservedEmojis.get(category);
  return emojis && emojis.indexOf(shortName) !== -1;
}

function initCountByCategory() {
  const count = new Map(); // Map<string, number>
  reservedEmojis.forEach((emojis, category) =>
    count.set(category, emojis.length),
  );
  return count;
}

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk: string) => {
  inputChunks.push(chunk);
});

process.stdin.on('end', () => {
  const inputJSON = inputChunks.join('');
  const parsedData = JSON.parse(inputJSON);

  const emojis = parsedData.emojis;
  const meta = parsedData.meta;
  const countByCategory = initCountByCategory();

  const filteredEmojis = emojis.filter(
    (emoji: { category: string; shortName: string }) => {
      const category = emoji.category;
      const shortName = emoji.shortName;
      const count = countByCategory.get(category) || 0;

      if (isReservedEmoji(category, shortName)) {
        return true;
      }

      if (count < 10) {
        countByCategory.set(category, count + 1);
        return true;
      }
      return false;
    },
  );

  const outputJSON = JSON.stringify({ emojis: filteredEmojis, meta }, null, 2);
  process.stdout.write(outputJSON);
  process.stdout.write('\n');
});
