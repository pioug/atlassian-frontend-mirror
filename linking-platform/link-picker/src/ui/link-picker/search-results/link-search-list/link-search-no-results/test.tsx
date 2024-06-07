import React from 'react';

import { screen } from '@testing-library/react';

import { HeadingContextProvider } from '@atlaskit/heading';
import { renderWithIntl } from '@atlaskit/link-test-helpers';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { NoResults } from './index';

describe('NoResults', () => {
	describe('should support control of heading via heading context', () => {
		ffTest(
			'platform.linking-platform.link-picker.remove-dst-empty-state',
			() => {
				renderWithIntl(
					<HeadingContextProvider>
						<HeadingContextProvider>
							<NoResults />
						</HeadingContextProvider>
					</HeadingContextProvider>,
				);

				expect(screen.queryByRole('heading', { level: 2 })).toHaveTextContent(
					'We couldn’t find anything matching your search.',
				);
			},
			() => {
				renderWithIntl(
					<HeadingContextProvider>
						<HeadingContextProvider>
							<NoResults />
						</HeadingContextProvider>
					</HeadingContextProvider>,
				);

				expect(screen.queryByRole('heading', { level: 3 })).toHaveTextContent(
					'We couldn’t find anything matching your search.',
				);
			},
		);
	});
});
