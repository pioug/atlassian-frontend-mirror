import React from 'react';

import { render, screen } from '@testing-library/react';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { getFlexibleCardTestWrapper } from '../../../../../../__tests__/__utils__/unit-testing-library-helpers';
import Preview from '../index';

describe('Element: Preview', () => {
	const testId = 'smart-element-media';

	ffTest.both('platform-linking-flexible-card-context', 'with fg', () => {
		it('renders media element with overrideUrl', async () => {
			render(<Preview overrideUrl="src-loaded" />);

			const element = await screen.findByTestId(testId);
			const image = await screen.findByTestId(`${testId}-image-image`);

			expect(element).toBeTruthy();
			expect(element.getAttribute('data-smart-element-media')).toBeTruthy();
			expect(image).toBeTruthy();
			expect(image).toHaveAttribute('src', 'src-loaded');
		});

		it('renders media element with context', async () => {
			render(<Preview />, { wrapper: getFlexibleCardTestWrapper(context) });

			const element = await screen.findByTestId(testId);
			const image = await screen.findByTestId(`${testId}-image-image`);

			expect(element).toBeTruthy();
			expect(element.getAttribute('data-smart-element-media')).toBeTruthy();
			expect(image).toBeTruthy();
			expect(image).toHaveAttribute('src', 'image-url');
		});
	});
});
