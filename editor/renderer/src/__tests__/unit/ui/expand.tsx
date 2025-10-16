import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import ExpandWithInt from '../../../ui/Expand';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';

jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

import { fg } from '@atlaskit/platform-feature-flags';

const mockFg = fg as jest.MockedFunction<typeof fg>;

describe('Expand', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		// Default mock values
		mockFg.mockReturnValue(false);
	});

	it('should render with a tooltip in web', () => {
		const { queryByTestId } = renderWithIntl(
			<ExpandWithInt
				title={'Expand test title'}
				nodeType={'expand'}
				// eslint-disable-next-line react/no-children-prop
				children={<p>Text inside expand</p>}
				rendererAppearance={'full-page'}
			/>,
		);

		expect(queryByTestId('tooltip--container')).toBeInTheDocument();
	});

	describe('hot-121622_lazy_load_expand_content feature flag', () => {
		const TestChildren = () => <div data-testid="expand-children">Test children content</div>;

		describe('when feature flag is enabled', () => {
			beforeEach(() => {
				mockFg.mockReturnValue(true);
			});

			it('should not render children before expand is opened when FG is enabled', () => {
				const { queryByTestId } = renderWithIntl(
					<ExpandWithInt
						title={'Expand test title'}
						nodeType={'expand'}
						rendererAppearance={'full-page'}
					>
						<TestChildren />
					</ExpandWithInt>,
				);

				// Children should not be rendered initially
				expect(queryByTestId('expand-children')).not.toBeInTheDocument();
			});

			it('should render children after expanding for the first time when FG is enabled', async () => {
				const { getByRole, queryByTestId } = renderWithIntl(
					<ExpandWithInt
						title={'Expand test title'}
						nodeType={'expand'}
						rendererAppearance={'full-page'}
					>
						<TestChildren />
					</ExpandWithInt>,
				);

				// Children should not be rendered initially
				expect(queryByTestId('expand-children')).not.toBeInTheDocument();

				// Click to expand
				const expandButton = getByRole('button');
				fireEvent.click(expandButton);

				// Children should be rendered after expanding
				await waitFor(() => {
					expect(queryByTestId('expand-children')).toBeInTheDocument();
				});
			});

			it('should keep children rendered after expanding and then closing when FG is enabled', async () => {
				const { getByRole, queryByTestId } = renderWithIntl(
					<ExpandWithInt
						title={'Expand test title'}
						nodeType={'expand'}
						rendererAppearance={'full-page'}
					>
						<TestChildren />
					</ExpandWithInt>,
				);

				// Children should not be rendered initially
				expect(queryByTestId('expand-children')).not.toBeInTheDocument();

				// Click to expand
				const expandButton = getByRole('button');
				fireEvent.click(expandButton);
				await waitFor(() => {
					expect(queryByTestId('expand-children')).toBeInTheDocument();
				});

				// Click to collapse -- Children should still be in the DOM
				fireEvent.click(expandButton);
				expect(queryByTestId('expand-children')).toBeInTheDocument();
			});
		});

		describe('when feature flag is disabled', () => {
			beforeEach(() => {
				mockFg.mockReturnValue(false);
			});

			it('should render children on initial load when FG is disabled', () => {
				const { queryByTestId } = renderWithIntl(
					<ExpandWithInt
						title={'Expand test title'}
						nodeType={'expand'}
						rendererAppearance={'full-page'}
					>
						<TestChildren />
					</ExpandWithInt>,
				);

				// Children should be rendered by default when feature flag is off
				expect(queryByTestId('expand-children')).toBeInTheDocument();
			});
		});
	});
});
