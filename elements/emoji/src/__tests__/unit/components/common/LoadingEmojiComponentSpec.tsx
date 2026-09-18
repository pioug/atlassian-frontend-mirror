/* eslint-disable @atlassian/testing-library/prefer-atlassian-testing-library -- Emoji tests use the package's existing RTL dependency. */

import React, { Component } from 'react';

import { render, screen } from '@testing-library/react';

import type { EmojiProvider } from '../../../../api/EmojiResource';
import LoadingEmojiComponent, {
	type Props,
	type State as LoadingState,
} from '../../../../components/common/LoadingEmojiComponent';

const asyncLoadMock = jest.fn();

class TestComponent extends Component<Props> {
	render() {
		return null;
	}
}

class TestLoadingComponent extends LoadingEmojiComponent<Props, LoadingState> {
	state: LoadingState = {};

	renderLoaded(_provider: EmojiProvider, _asyncComponent: React.ComponentType<any>) {
		return <div>Loaded</div>;
	}

	asyncLoadComponent() {
		this.setState({
			asyncLoadedComponent: TestComponent,
		});
		asyncLoadMock();
	}
}

describe('<LoadingEmojiComponent />', () => {
	beforeEach(() => {
		asyncLoadMock.mockReset();
	});

	describe('#render', () => {
		it('renders nothing if the provider Promise has not resolved', () => {
			const providerPromise = new Promise<EmojiProvider>(() => {});
			const { container } = render(<TestLoadingComponent emojiProvider={providerPromise} />);

			expect(container.children).toHaveLength(0);
		});

		it('renders once the provider Promise resolves', async () => {
			const providerPromise = Promise.resolve({} as EmojiProvider);
			render(<TestLoadingComponent emojiProvider={providerPromise} />);

			expect(await screen.findByText('Loaded')).toBeInTheDocument();
			await expect(document.body).toBeAccessible();
		});

		it('calls asyncLoadComponent on initial load', async () => {
			const providerPromise = Promise.resolve({} as EmojiProvider);
			render(<TestLoadingComponent emojiProvider={providerPromise} />);

			await screen.findByText('Loaded');

			expect(asyncLoadMock).toHaveBeenCalledTimes(1);
		});

		it('only calls asyncLoadComponent on the first render', async () => {
			const providerPromise = Promise.resolve({} as EmojiProvider);
			const { rerender } = render(<TestLoadingComponent emojiProvider={providerPromise} />);

			await screen.findByText('Loaded');
			expect(asyncLoadMock).toHaveBeenCalledTimes(1);

			rerender(<TestLoadingComponent emojiProvider={providerPromise} />);
			await screen.findByText('Loaded');

			expect(asyncLoadMock).toHaveBeenCalledTimes(1);
		});
	});
});
