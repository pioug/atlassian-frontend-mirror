import {
	DEFAULT_LOZENGE_APPEARANCE,
	getColorLabelKey,
	getLozengeAppearance,
	normalizeColor,
} from '../../../components/status-colors';

describe('status-colors', () => {
	it('normalizes hex ids to uppercase and leaves named colours unchanged', () => {
		expect(normalizeColor('#b3f5ff')).toBe('#B3F5FF');
		expect(normalizeColor('blue')).toBe('blue');
	});

	it('maps persist hex ids to i18n keys', () => {
		expect(getColorLabelKey('#B3F5FF')).toBe('tealColor');
		expect(getColorLabelKey('#fdd0ec')).toBe('magentaColor');
		expect(getColorLabelKey('neutral')).toBe('neutralColor');
	});

	it('falls back to a real message key for an unregistered colour', () => {
		// Must never build a key from the colour: `messages` would not have it, and
		// spreading the resulting `undefined` into `FormattedMessage` throws.
		expect(getColorLabelKey('#123ABC')).toBe('neutralColor');
		expect(getColorLabelKey('chartreuse')).toBe('neutralColor');
	});

	it('renders persisted hex ids with their accent appearance', () => {
		expect(getLozengeAppearance('#B3F5FF')).toBe('accent-teal');
		expect(getLozengeAppearance('#fdd0ec')).toBe('accent-magenta');
	});

	it('falls back to the neutral appearance for an unregistered colour', () => {
		expect(getLozengeAppearance('#123ABC')).toBe(DEFAULT_LOZENGE_APPEARANCE);
	});
});
