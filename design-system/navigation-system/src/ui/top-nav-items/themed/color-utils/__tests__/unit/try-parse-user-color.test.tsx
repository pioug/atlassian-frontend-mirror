import { parseUserColor } from '../../parse-user-color';

describe('parseUserColor', () => {
	it('should parse hex values', () => {
		const result = parseUserColor('#A24');
		expect(result).toEqual({
			r: 0xaa,
			g: 0x22,
			b: 0x44,
		});
	});

	it('should parse rgb values', () => {
		const result = parseUserColor('rgb(0,100,200)');
		expect(result).toEqual({
			r: 0,
			g: 100,
			b: 200,
		});
	});

	it('should parse hsl values', () => {
		const result = parseUserColor('hsl(123,17,29)');
		expect(result).toEqual({
			r: 61,
			g: 87,
			b: 63,
		});
	});

	it('should return null on failure', () => {
		const result = parseUserColor('fakeColorValue');
		expect(result).toBeNull();
	});
});
