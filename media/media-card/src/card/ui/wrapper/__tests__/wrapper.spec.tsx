import React from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { Breakpoint } from '../../common';
import { Wrapper } from '../wrapper';

const renderWrapper = () =>
	render(
		<Wrapper
			testId="media-card-wrapper"
			breakpoint={Breakpoint.SMALL}
			disableOverlay={false}
			displayBackground={false}
			selected={false}
			isPlayButtonClickable={false}
			isTickBoxSelectable={false}
			shouldDisplayTooltip={false}
		>
			<span />
		</Wrapper>,
	);

describe('Wrapper', () => {
	it('keeps the outline focus indicator when the inset focus indicator gate is disabled', () => {
		failGate('platform_media_card_focus_indicator_inset_fix');
		renderWrapper();

		const classNames = Array.from(screen.getByTestId('media-card-wrapper').classList.values());
		const compiledCss = Array.from(document.querySelectorAll('style'))
			.map((style) => style.textContent)
			.join('');

		expect(
			classNames.some((className) =>
				new RegExp(`span:focus-within\\s*\\+\\s*\\.${className}\\s*\\{[^}]*outline:`).test(
					compiledCss,
				),
			),
		).toBe(true);
	});

	it('adds an inset focus indicator when the gate is enabled', () => {
		passGate('platform_media_card_focus_indicator_inset_fix');
		renderWrapper();

		const classNames = Array.from(screen.getByTestId('media-card-wrapper').classList.values());
		const compiledCss = Array.from(document.querySelectorAll('style'))
			.map((style) => style.textContent)
			.join('');

		expect(
			classNames.some((className) =>
				new RegExp(
					`span:focus-within\\s*\\+\\s*\\.${className}:{1,2}after\\s*\\{[^}]*box-shadow:\\s*inset`,
				).test(compiledCss),
			),
		).toBe(true);
	});

	it('should capture and report a11y violations', async () => {
		const { container } = renderWrapper();

		await expect(container).toBeAccessible();
	});
});
