import padStart from 'lodash/padStart';

export const getPrintableChar: any = (char: string) => {
	const hex = char.charCodeAt(0).toString(16).toUpperCase();
	return `U+${padStart(hex, 4, '0')}`;
};
