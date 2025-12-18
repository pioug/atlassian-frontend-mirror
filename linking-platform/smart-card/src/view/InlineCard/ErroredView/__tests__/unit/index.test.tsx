import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import WarningIcon from '@atlaskit/icon/core/status-warning';
import { SmartCardProvider as Provider } from '@atlaskit/link-provider';

import { InlineCardErroredView } from '../../index';

jest.mock('@atlaskit/platform-feature-flags');

const URL =
	'http://product.example.com/lorem/ipsum/dolor/sit/amet/consectetur/adipiscing/volutpat/';

describe('Errored view', () => {
	it('should do click if try again clicked', async () => {
		const onRetrySpy = jest.fn();
		render(
			<IntlProvider locale={'en'}>
				<InlineCardErroredView url={URL} message="Error" onRetry={onRetrySpy} />
			</IntlProvider>,
		);
		fireEvent.click(await screen.findByRole('button', { name: 'Try again' }));
		expect(onRetrySpy).toHaveBeenCalledTimes(1);
	});

	it('should accept custom icon', async () => {
		const onRetrySpy = jest.fn();
		render(
			<IntlProvider locale={'en'}>
				<InlineCardErroredView
					url={URL}
					message="Error"
					onRetry={onRetrySpy}
					icon={<WarningIcon spacing="spacious" label="my-icon" testId="warning-icon" />}
				/>
			</IntlProvider>,
		);
		fireEvent.click(await screen.findByRole('button', { name: 'Try again' }));
		expect(onRetrySpy).toHaveBeenCalledTimes(1);
		expect(await screen.findByTestId('warning-icon')).toBeVisible();
	});

	it('should render error icon by default', async () => {
		const onRetrySpy = jest.fn();
		render(
			<IntlProvider locale={'en'}>
				<InlineCardErroredView url={URL} message="Error" onRetry={onRetrySpy} />
			</IntlProvider>,
		);
		fireEvent.click(await screen.findByRole('button', { name: 'Try again' }));
		expect(onRetrySpy).toHaveBeenCalledTimes(1);
		expect(await screen.findByTestId('errored-view-default-icon')).toBeVisible();
	});

	it('should not call onClick if onRetry was triggered', async () => {
		const onClickSpy = jest.fn();
		const onRetrySpy = jest.fn();
		render(
			<IntlProvider locale={'en'}>
				<InlineCardErroredView
					url={URL}
					onRetry={onRetrySpy}
					message="Error"
					onClick={onClickSpy}
				/>
			</IntlProvider>,
		);
		fireEvent.click(await screen.findByRole('button', { name: 'Try again' }));
		expect(onRetrySpy).toHaveBeenCalledTimes(1);
		expect(onClickSpy).not.toHaveBeenCalled();
	});

	it('should render a hover card when showHoverPreview prop is enabled', async () => {
		render(
			<IntlProvider locale="en">
				<Provider>
					<InlineCardErroredView message="Error" showHoverPreview={true} url="www.test.com" />
				</Provider>
			</IntlProvider>,
		);
		expect(await screen.findByTestId('hover-card-trigger-wrapper')).toBeInTheDocument();
	});

	it('should not render a hover card when showHoverPreview prop is disabled', async () => {
		render(<InlineCardErroredView message="Error" url="www.test.com" />);
		expect(screen.queryByTestId('hover-card-trigger-wrapper')).not.toBeInTheDocument();
	});
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<IntlProvider locale={'en'}>
				<InlineCardErroredView url={URL} message="Error" onRetry={jest.fn()} />
			</IntlProvider>,
		);
		await expect(container).toBeAccessible();
	});
});
