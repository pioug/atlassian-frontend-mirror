import React from 'react';

import { IntlProvider } from 'react-intl';

import { iconGoogleDrive } from '@atlaskit/link-test-helpers';
import { act, render, fireEvent, screen } from '@atlassian/testing-library';

import { _resetFlagsForTesting } from '../../../../view/Flag';
import useActionFlags from '../index';

type ConsumerProps = Parameters<ReturnType<typeof useActionFlags>['showConnectFlag']>[0];

const Consumer = (props?: ConsumerProps) => {
	const { showConnectFlag } = useActionFlags();

	return (
		<button type="button" onClick={() => showConnectFlag(props)}>
			show
		</button>
	);
};

describe('useActionFlags', () => {
	const setup = (args?: ConsumerProps) => {
		const renderResult = render(
			<IntlProvider locale="en">
				<Consumer {...args} />
			</IntlProvider>,
		);

		const button = screen.getByText('show');
		fireEvent.click(button);

		return renderResult;
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		// Reset the module-level flag singleton so flags don't leak between tests.
		act(() => {
			_resetFlagsForTesting();
		});
		jest.restoreAllMocks();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = setup();

		await expect(container).toBeAccessible();
	});

	it('shows a connect flag with provider text and string icon rendered as an image icon', async () => {
		setup({ provider: { text: 'Google Drive', icon: iconGoogleDrive } });

		expect(await screen.findByText('Google Drive is connected')).toBeInTheDocument();
		expect(await screen.findByText('Shared links now display rich previews.')).toBeInTheDocument();
		expect(await screen.findByTestId('sl-flag-image')).toBeInTheDocument();
	});

	it('falls back to the default title context when provider text is missing', async () => {
		setup();

		expect(await screen.findByText('Smart Link is connected')).toBeInTheDocument();
	});

	it('preserves a React node provider icon and explicit flag overrides', async () => {
		const icon = <span data-testid="provider-icon" />;
		setup({ provider: { icon, text: 'Figma' } });

		expect(await screen.findByTestId('provider-icon')).toBeInTheDocument();
	});

	it('does not throw and does not show a flag when IntlProvider is absent', () => {
		const args = { provider: { text: 'Google Drive' } };
		render(<Consumer {...args} />);

		const button = screen.getByRole('button');
		expect(() => fireEvent.click(button)).not.toThrow();
		expect(screen.queryByText('Google Drive')).not.toBeInTheDocument();
	});
});
