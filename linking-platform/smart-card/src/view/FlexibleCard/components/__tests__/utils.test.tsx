import { SmartLinkSize } from '../../../../constants';
import { getPrimitivesInlineSpaceBySize, hasWhiteSpace } from '../utils';

describe('getPrimitivesInlineSpaceBySize', () => {
	it.each([
		[SmartLinkSize.XLarge, 'space.250'],
		[SmartLinkSize.Large, 'space.200'],
		[SmartLinkSize.Medium, 'space.100'],
		[SmartLinkSize.Small, 'space.050'],
	])('renders space in %s size', (size: SmartLinkSize, expected: string) => {
		const space = getPrimitivesInlineSpaceBySize(size);
		expect(space).toBe(expected);
	});

	it('returns small space.050 by default', () => {
		// @ts-ignore For testing purpose
		const space = getPrimitivesInlineSpaceBySize();
		expect(space).toBe('space.050');
	});
});

describe('hasWhiteSpace', () => {
	it('returns true when string contains whitespace', () => {
		expect(hasWhiteSpace('This is a sentence.')).toBeTruthy();
	});

	it('returns true when string is a whitespace', () => {
		expect(hasWhiteSpace(' ')).toBeTruthy();
	});

	it('returns true when string contains a tab', () => {
		expect(hasWhiteSpace('Indent\tTab')).toBeTruthy();
	});

	it('returns true when string contains a unicode tab', () => {
		expect(hasWhiteSpace('Indent\u0009Tab')).toBeTruthy();
	});

	it('returns true when string contains next line', () => {
		expect(hasWhiteSpace('Next\nLine')).toBeTruthy();
	});

	it('returns true when string contains unicode next line', () => {
		expect(hasWhiteSpace('Next\u000ALine')).toBeTruthy();
	});

	it('returns true when string contains vertical tab', () => {
		expect(hasWhiteSpace('Vertical\vTab')).toBeTruthy();
	});

	it('returns true when string contains unicode vertical tab', () => {
		expect(hasWhiteSpace('Vertical\u000BTab')).toBeTruthy();
	});

	it('returns true when string contains form feed', () => {
		expect(hasWhiteSpace('Form\fFeed')).toBeTruthy();
	});

	it('returns true when string contains unicode form feed', () => {
		expect(hasWhiteSpace('Form\u000CFeed')).toBeTruthy();
	});

	it('returns true when string contains carriage return', () => {
		expect(hasWhiteSpace('Carriage\rReturn')).toBeTruthy();
	});

	it('returns true when string contains unicode carriage return', () => {
		expect(hasWhiteSpace('Carriage\u000DReturn')).toBeTruthy();
	});

	it('returns true when string contains unicode non-break space', () => {
		expect(hasWhiteSpace('Non\u00A0Break')).toBeTruthy();
	});

	it('returns false when string does not contain whitespace', () => {
		expect(hasWhiteSpace('https://product-fabric.atlassian.net/browse/EDM-3050')).toBeFalsy();
	});

	it('returns false when string is empty', () => {
		expect(hasWhiteSpace('')).toBeFalsy();
	});
});
