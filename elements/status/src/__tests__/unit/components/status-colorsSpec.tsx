import { failGate } from '@atlassian/feature-flags-test-utils/mock-gates';

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

	// Graceful degradation: an older client without the gate must fall back rather than
	// break. Nothing else covers this — the VR suites all run with the gate on.
	it('leaves hex on the neutral fallback when the gate is off', () => {
		failGate('platform_editor_gracefully_render_status_color');
		expect(getLozengeAppearance('#B3F5FF')).toBe(DEFAULT_LOZENGE_APPEARANCE);
	});
});
