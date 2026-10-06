import React from 'react';

import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { InsetViewerProvider } from '../insetViewerContext/insetViewerProvider';
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

describe('withInsetViewer', () => {
	const Probe = ({ isInsetViewer }: { isInsetViewer?: boolean }) => (
		<span data-testid="flag">{String(isInsetViewer)}</span>
	);
	const WrappedProbe = withInsetViewer(Probe);

	it('should inject false when there is no provider', () => {
		render(<WrappedProbe />);

		expect(screen.getByTestId('flag')).toHaveTextContent('false');
	});

	it('should inject true inside a provider given true', () => {
		render(
			<InsetViewerProvider isInsetViewer>
				<WrappedProbe />
			</InsetViewerProvider>,
		);

		expect(screen.getByTestId('flag')).toHaveTextContent('true');
	});

	it('should name the wrapper after the wrapped component', () => {
		expect(WrappedProbe.displayName).toBe('WithInsetViewer(Probe)');
	});

	it('should fall back to a generic name for anonymous components', () => {
		const Anonymous = withInsetViewer((() => null) as React.ComponentType<object>);

		expect(Anonymous.displayName).toBe('WithInsetViewer(Component)');
	});
});
