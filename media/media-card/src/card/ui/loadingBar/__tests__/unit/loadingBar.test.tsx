import React from 'react';

import { render } from '@atlassian/testing-library';
import { IntlProvider } from 'react-intl';

import InteractionContext, { type InteractionContextType } from '@atlaskit/interaction-context';

import { LoadingBar } from '../../loadingBar';

const renderWithIntl = (ui: React.ReactElement) =>
	render(<IntlProvider locale="en">{ui}</IntlProvider>);

describe('LoadingBar', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = renderWithIntl(<LoadingBar />);
		await expect(container).toBeAccessible();
	});

	describe('UFO hold', () => {
		it('holds the interaction with the given name while mounted and releases it on unmount', () => {
			const release = jest.fn();
			const hold = jest.fn(() => release);
			const context: InteractionContextType = { hold, tracePress: jest.fn() };

			const { unmount } = renderWithIntl(
				<InteractionContext.Provider value={context}>
					<LoadingBar interactionName="media-card-loading" />
				</InteractionContext.Provider>,
			);

			expect(hold).toHaveBeenCalledWith('media-card-loading');
			expect(release).not.toHaveBeenCalled();

			unmount();
			expect(release).toHaveBeenCalledTimes(1);
		});

		it('does not throw when rendered without an InteractionContext provider', () => {
			expect(() =>
				renderWithIntl(<LoadingBar interactionName="media-card-loading" />),
			).not.toThrow();
		});
	});
});
