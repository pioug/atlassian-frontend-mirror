import React from 'react';

import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { InsetFullscreenContext } from '../insetViewerContext/insetFullscreenContext';
import { InsetViewerProvider } from '../insetViewerContext/insetViewerProvider';
import { useIsInsetFullscreen } from '../insetViewerContext/useIsInsetFullscreen';
import { useIsInsetViewer } from '../insetViewerContext/useIsInsetViewer';
import { withInsetViewer } from '../insetViewerContext/withInsetViewer';

const FlagProbe = () => <span data-testid="flag">{String(useIsInsetViewer())}</span>;

describe('useIsInsetViewer', () => {
	it('should read false when there is no provider', async () => {
		render(<FlagProbe />);

		expect(screen.getByTestId('flag')).toHaveTextContent('false');

		await expect(document.body).toBeAccessible();
	});

	it('should read false when the provider is not given the flag', () => {
		render(
			<InsetViewerProvider>
				<FlagProbe />
			</InsetViewerProvider>,
		);

		expect(screen.getByTestId('flag')).toHaveTextContent('false');
	});

	it('should read true when the provider is given true', () => {
		render(
			<InsetViewerProvider isInsetViewer>
				<FlagProbe />
			</InsetViewerProvider>,
		);

		expect(screen.getByTestId('flag')).toHaveTextContent('true');
	});
});

describe('useIsInsetFullscreen', () => {
	const FullscreenProbe = () => (
		<span data-testid="fullscreen">{String(useIsInsetFullscreen())}</span>
	);

	it('should read false when there is no provider', () => {
		render(<FullscreenProbe />);

		expect(screen.getByTestId('fullscreen')).toHaveTextContent('false');
	});

	it('should read true when the context is given true, independently of the inset viewer flag', () => {
		render(
			<InsetFullscreenContext.Provider value>
				<FullscreenProbe />
				<FlagProbe />
			</InsetFullscreenContext.Provider>,
		);

		expect(screen.getByTestId('fullscreen')).toHaveTextContent('true');
		expect(screen.getByTestId('flag')).toHaveTextContent('false');
	});
});

describe('withInsetViewer', () => {
	const Probe = ({
		isInsetViewer,
		isInsetFullscreen,
	}: {
		isInsetViewer?: boolean;
		isInsetFullscreen?: boolean;
	}) => (
		<React.Fragment>
			<span data-testid="flag">{String(isInsetViewer)}</span>
			<span data-testid="fullscreen">{String(isInsetFullscreen)}</span>
		</React.Fragment>
	);
	const WrappedProbe = withInsetViewer(Probe);

	it('should inject false for both flags when there is no provider', () => {
		render(<WrappedProbe />);

		expect(screen.getByTestId('flag')).toHaveTextContent('false');
		expect(screen.getByTestId('fullscreen')).toHaveTextContent('false');
	});

	it('should inject isInsetFullscreen from the fullscreen context on its own', () => {
		render(
			<InsetFullscreenContext.Provider value>
				<WrappedProbe />
			</InsetFullscreenContext.Provider>,
		);

		expect(screen.getByTestId('flag')).toHaveTextContent('false');
		expect(screen.getByTestId('fullscreen')).toHaveTextContent('true');
	});

	it('should inject true inside a provider given true', () => {
		render(
			<InsetViewerProvider isInsetViewer>
				<WrappedProbe />
			</InsetViewerProvider>,
		);

		expect(screen.getByTestId('flag')).toHaveTextContent('true');
		expect(screen.getByTestId('fullscreen')).toHaveTextContent('false');
	});

	it('should name the wrapper after the wrapped component', () => {
		expect(WrappedProbe.displayName).toBe('WithInsetViewer(Probe)');
	});

	it('should fall back to a generic name for anonymous components', () => {
		const Anonymous = withInsetViewer((() => null) as React.ComponentType<object>);

		expect(Anonymous.displayName).toBe('WithInsetViewer(Component)');
	});
});
