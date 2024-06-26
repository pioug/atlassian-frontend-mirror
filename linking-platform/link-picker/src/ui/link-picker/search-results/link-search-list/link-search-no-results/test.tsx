import React from 'react';

import { screen } from '@testing-library/react';

import { HeadingContextProvider } from '@atlaskit/heading';
import { renderWithIntl } from '@atlaskit/link-test-helpers';

import { NoResults } from './index';

describe('NoResults', () => {
	it('should support control of heading via heading context', () => {
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
	});
});
