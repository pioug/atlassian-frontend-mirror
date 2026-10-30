import React from 'react';

import { IntlProvider } from 'react-intl';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers/intersection-observer';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import SmartLinkCustomClient from '../../../../examples-helpers/smartLinkCustomClient';
import { LINK_TYPE_TEST_ID } from './link';
import { OBJECT_REFERENCE_TYPE_TEST_ID } from './object-reference';
import { renderType } from './renderType';

mockSimpleIntersectionObserver(); // required to mock smart link internals

describe('renderType', () => {
	const smartLinkCustomClient = new SmartLinkCustomClient();

	const setup = (node: React.ReactNode) =>
		render(
			<IntlProvider locale="en">
				<SmartCardProvider client={smartLinkCustomClient}>{node}</SmartCardProvider>
			</IntlProvider>,
		);

	describe('objectReference', () => {
		const values = [
			{
				url: 'https://www.atlassian.com/',
				text: 'Design System Team',
				avatarUrl: 'https://example.com/avatar.png',
			},
		];

		it('renders the avatar tag when astral_assets_macro_table_ui_uplift is enabled', () => {
			passGate('astral_assets_macro_table_ui_uplift');

			setup(renderType({ type: 'objectReference', values }));

			expect(screen.getByTestId(OBJECT_REFERENCE_TYPE_TEST_ID)).toBeInTheDocument();
			expect(screen.queryByTestId(LINK_TYPE_TEST_ID)).not.toBeInTheDocument();
			expect(screen.getByRole('link')).toHaveAttribute('href', 'https://www.atlassian.com/');
			expect(screen.getByRole('link')).toHaveTextContent('Design System Team');
		});

		it('falls back to the link render type when astral_assets_macro_table_ui_uplift is disabled', () => {
			failGate('astral_assets_macro_table_ui_uplift');

			setup(renderType({ type: 'objectReference', values }));

			expect(screen.getByTestId(LINK_TYPE_TEST_ID)).toBeInTheDocument();
			expect(screen.queryByTestId(OBJECT_REFERENCE_TYPE_TEST_ID)).not.toBeInTheDocument();
			expect(screen.getByRole('link')).toHaveAttribute('href', 'https://www.atlassian.com/');
			expect(screen.getByRole('link')).toHaveTextContent('Design System Team');
		});

		it('should capture and report a11y violations', async () => {
			passGate('astral_assets_macro_table_ui_uplift');

			const { container } = setup(renderType({ type: 'objectReference', values }));

			await expect(container).toBeAccessible();
		});
	});
});
