import React, { useLayoutEffect } from 'react';

import { render, screen } from '@testing-library/react';

import {
	InsetViewerProvider,
	useHasMediaFooterPlayerControls,
	useSetMediaFooterControls,
} from '../../../../insetViewerContext';
import { InsetAudioFrame } from '../../../../viewers/inset-audio-frame';

const footerElement = document.createElement('div');

const FooterControlsSetter = () => {
	const setMediaFooterControls = useSetMediaFooterControls();
	useLayoutEffect(() => {
		setMediaFooterControls(footerElement);
	}, [setMediaFooterControls]);
	return null;
};

const HasPlayerControlsProbe = () => (
	<span data-testid="has-player-controls">{String(useHasMediaFooterPlayerControls())}</span>
);

describe('InsetAudioFrame', () => {
	const renderPlayer = jest.fn();

	beforeEach(() => {
		renderPlayer.mockReset();
		renderPlayer.mockReturnValue(<div data-testid="player" />);
	});

	const setup = (cover?: React.ReactNode, isFrameShown = true) => {
		const tree = (showFrame: boolean) => (
			<InsetViewerProvider isInsetViewer>
				<FooterControlsSetter />
				<HasPlayerControlsProbe />
				{showFrame && <InsetAudioFrame cover={cover} renderPlayer={renderPlayer} />}
			</InsetViewerProvider>
		);
		const { rerender } = render(tree(isFrameShown));
		return { showFrame: (show: boolean) => rerender(tree(show)) };
	};

	it('should render the given cover and the player with the footer controls element', () => {
		setup(<div data-testid="custom-cover" />);

		expect(screen.getByTestId('custom-cover')).toBeInTheDocument();
		expect(screen.queryByLabelText('cover')).not.toBeInTheDocument();
		expect(screen.getByTestId('player')).toBeInTheDocument();
		expect(renderPlayer).toHaveBeenLastCalledWith({ controlsPortalElement: footerElement });
	});

	it('should render the default cover when no cover is given', () => {
		setup();

		expect(screen.getByLabelText('cover')).toBeInTheDocument();
	});

	it('should tell the media footer it has player controls while mounted and not once unmounted', () => {
		const { showFrame } = setup(undefined, false);

		expect(screen.getByTestId('has-player-controls')).toHaveTextContent('false');

		showFrame(true);

		expect(screen.getByTestId('has-player-controls')).toHaveTextContent('true');

		showFrame(false);

		expect(screen.getByTestId('has-player-controls')).toHaveTextContent('false');
	});

	it('should be accessible', async () => {
		setup();

		await expect(document.body).toBeAccessible();
	});
});
