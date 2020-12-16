// djb2 hashing algorithm www.cse.yorku.ca/~oz/hash.html
export const hash = (input: string): string => {
  let result = 5381;
  let index = input.length;

  while (index > 0) {
    result = (result * 33) ^ input.charCodeAt(--index);
  }

  return (result >>> 0).toString();
};
