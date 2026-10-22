import React from 'react';

import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
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
	it('adds the open media viewer focus indicator style when the gate is enabled', () => {
		passGate('platform_media_card_focus_indicator_fix');
		renderWrapper();

		const classNames = Array.from(screen.getByTestId('media-card-wrapper').classList.values());
		const compiledCss = Array.from(document.querySelectorAll('style'))
			.map((style) => style.textContent)
			.join('');

		expect(
			classNames.some((className) =>
				new RegExp(`span:focus-within\\s*\\+\\s*\\.${className}`).test(compiledCss),
			),
		).toBe(true);
	});

	it('should capture and report a11y violations', async () => {
		passGate('platform_media_card_focus_indicator_fix');
		const { container } = renderWrapper();

		await expect(container).toBeAccessible();
	});
});
