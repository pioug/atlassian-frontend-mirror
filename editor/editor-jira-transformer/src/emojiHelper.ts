const emojiMap: { [key: string]: string } = {
  'smile.png': '🙂',
  'sad.png': '☹️',
  'tongue.png': '😛',
  'biggrin.png': '😁',
  'wink.png': '😉',
  'thumbs_up.png': '👍',
  'thumbs_down.png': '👎',
  'information.png': 'ℹ️',
  'check.png': '✅',
  'error.png': '❌',
  'warning.png': '⚠️',
  'add.png': '➕',
  'forbidden.png': '➖',
  'help_16.png': '❓',
  'lightbulb_on.png': '💡',
  'lightbulb.png': '⛔️',
  'star_yellow.png': '💛',
  'star_red.png': '❤️',
  'star_green.png': '💚',
  'star_blue.png': '💙',
  'flag.png': '🚩',
  'flag_gray.png': '🏳',
};

export function mapImageToEmoji(imageElement: HTMLImageElement) {
  let src = imageElement.src;
  let slashIndex = src.lastIndexOf('/');
  src = src.substr(slashIndex + 1);
  return emojiMap[src] || null;
}
