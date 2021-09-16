export const isToken = (value: string, tokens: Record<string, string>) => {
  const tokenValues = Object.entries(tokens);

  for (let i = 0; i < tokenValues.length; i++) {
    const [tokenKey, tokenValue] = tokenValues[i];
    if (value.includes(tokenValue)) {
      return tokenKey;
    }
  }
};
