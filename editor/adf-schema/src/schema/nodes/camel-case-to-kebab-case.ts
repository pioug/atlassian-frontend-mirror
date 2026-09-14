export const camelCaseToKebabCase = (str: string): string =>
	str.replace(/([^A-Z]+)([A-Z])/gu, (_, x, y) => `${x}-${y.toLowerCase()}`);
