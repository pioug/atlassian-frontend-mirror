export default function truncate(text: string, maxLength: number): string {
  if (!text || !maxLength) {
    return text;
  }

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength) + '...';
}
