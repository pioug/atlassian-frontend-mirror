import React from 'react';

import { renderToStaticMarkup } from 'react-dom/server';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { LoomAttributionLogoCS } from '../../artifacts/logo-components/loom-attribution/logo-cs';
import { LoomIcon } from '../../artifacts/logo-components/loom/icon';
import { LoomLogo } from '../../artifacts/logo-components/loom/logo';
import { LoomLogoCS } from '../../artifacts/logo-components/loom/logo-cs';

const gate = 'platform_dst_loom_logo_refresh';

describe.each([false, true])('Loom refresh gate enabled: %s', (enabled) => {
	it.each([
		['standard', LoomLogo, '0 0 69 24', '0 0 85 24'],
		['Charlie Sans', LoomLogoCS, '0 0 103 32', '0 0 85 24'],
		['attribution', LoomAttributionLogoCS, '0 0 100 32', '0 0 98.987 32'],
	] as const)('renders the expected %s wordmark', (_, Logo, before, after) => {
		if (enabled) {
			passGate(gate);
		} else {
			failGate(gate);
		}
		expect(renderToStaticMarkup(<Logo />)).toContain(`viewBox="${enabled ? after : before}"`);
	});

	it('renders the expected icon artwork', () => {
		if (enabled) {
			passGate(gate);
		} else {
			failGate(gate);
		}
		const view = renderToStaticMarkup(<LoomIcon />);
		expect(view).toContain(enabled ? 'M19.031 11.482' : 'M19.083 11.212');
		expect(view).toContain('viewBox="0 0 24 24"');
		expect(view).toContain('aria-label="Loom"');
	});
});

it.each([LoomIcon, LoomLogo, LoomLogoCS, LoomAttributionLogoCS])(
	'preserves decorative and custom labels with the refreshed artwork',
	(Logo) => {
		passGate(gate);
		expect(renderToStaticMarkup(<Logo label="" />)).toContain('aria-hidden="true"');
		expect(renderToStaticMarkup(<Logo label="Video recording" />)).toContain(
			'aria-label="Video recording" role="img"',
		);
	},
);
