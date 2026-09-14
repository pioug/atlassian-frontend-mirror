import padStart from 'lodash/padStart';

export const getJavaCodeFromChar: any = (char: string) => {
	const hex = char.charCodeAt(0).toString(16);
	return `\\u${padStart(hex, 4, '0')}`;
};
