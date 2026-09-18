jest.mock('../../CardBase');
jest.mock('../../card');
jest.mock('../../cardWithMediaClient', () => ({
	__esModule: true,
	CardWithMediaClient: () => <div data-testid="mock-card" />,
}));
import React from 'react';
import { act } from 'react';

import { IntlProvider } from 'react-intl';

import { type FileIdentifier } from '@atlaskit/media-client';
import { fakeMediaClient, nextTick } from '@atlaskit/media-test-helpers';
import { render, screen } from '@atlassian/testing-library';

import CardLoader from '../../cardLoader';

const mediaClient = fakeMediaClient();

jest.mock('@atlaskit/media-common', () => ({
	...jest.requireActual<object>('@atlaskit/media-common'),
}));

const identifier: FileIdentifier = {
	id: '123',
	mediaItemType: 'file',
	collectionName: 'some-name',
};

const props = {
	dimensions: {
		width: 10,
		height: 10,
	},
	mediaClientConfig: mediaClient.config,
	identifier,
};

// The loading state renders `LoadingBar`, which localises its aria-label via `useIntl`.
const renderWithIntl = (ui: React.ReactElement) =>
	render(<IntlProvider locale="en">{ui}</IntlProvider>);

describe('Async Card Loader', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = renderWithIntl(<CardLoader {...props} />);
		await expect(container).toBeAccessible();
	});

	// FIXME: Jest upgrade
	// import mock throws Error: Forcing async import error
	describe.skip('When the async import returns with error', () => {
		beforeEach(() => {
			jest.mock('../../card', () => {
				throw new Error('Forcing async import error');
			});
		});

		it('should pass dimensions to the loading component if the async components were NOT resolved', async () => {
			renderWithIntl(<CardLoader {...props} />);
			await act(async () => {
				await nextTick();
			});
			// Loading state should still show while import is rejected
			expect(screen.getByTestId('media-card-loading')).toBeInTheDocument();
		});

		it('should NOT render MediaCard component', async () => {
			renderWithIntl(<CardLoader {...props} />);
			await act(async () => {
				await nextTick();
			});
			expect(screen.queryByTestId('mock-card')).not.toBeInTheDocument();
		});
	});

	describe('When the async import returns with success', () => {
		it('should render Card component', async () => {
			renderWithIntl(<CardLoader {...props} />);
			await act(async () => {
				await nextTick();
				await nextTick();
			});
			// The loader initially shows the loading card while async import resolves
			// CardLoader with react-loadable shows loading state on first tick
			expect(screen.queryByTestId('mock-card')).toBeInTheDocument();
		});

		it('should render Error boundary component', async () => {
			renderWithIntl(<CardLoader {...props} />);
			await act(async () => {
				await nextTick();
			});
			// CardLoader is wrapped in error boundary; component renders without crashing
			expect(screen.queryByTestId('unhandled-error-card')).not.toBeInTheDocument();
		});

		it('should contain preload static function', () => {
			expect(CardLoader.preload).toBeDefined();
		});
	});

	// FIXME: Jest upgrade
	// import mock throws Error: Forcing async import error
	describe.skip('When the async import for Error Boundary returns with error', () => {
		beforeEach(() => {
			jest.unmock('../../card');
			jest.mock('../../../card/media-card-analytics-error-boundary', () => {
				throw new Error('Forcing error boundary async import error');
			});
		});

		it('should render CardLoading component', async () => {
			renderWithIntl(<CardLoader {...props} />);
			await act(async () => {
				await nextTick();
			});
			expect(screen.getByTestId('media-card-loading')).toBeInTheDocument();
		});
	});
});
