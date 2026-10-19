import React from 'react';

import { IntlProvider } from 'react-intl';

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import Button from '@atlaskit/button/default/button';
import MediaButton from '@atlaskit/media-ui/MediaButton';
import Tooltip from '@atlaskit/tooltip/Tooltip';
import { render } from '@atlassian/testing-library/render';

import { fireAnalytics } from '../../../analytics/fireAnalytics';
import { DownloadButton } from '../../../DownloadButton';
import type { DownloadButtonProps } from '../../../DownloadButtonProps';
import { ViewerIconButton } from '../../../viewer-icon-button';

jest.mock('@atlaskit/button/default/button', () => ({
	__esModule: true,
	default: jest.fn(() => null),
}));

jest.mock('@atlaskit/media-ui/MediaButton', () => ({
	__esModule: true,
	default: jest.fn(() => null),
}));

jest.mock('@atlaskit/tooltip/Tooltip', () => ({
	__esModule: true,
	default: jest.fn(({ children }) => children),
}));

jest.mock('../../../analytics/fireAnalytics', () => ({
	fireAnalytics: jest.fn(),
}));

jest.mock('../../../viewer-icon-button', () => ({
	ViewerIconButton: jest.fn(() => null),
}));

const analyticspayload = {} as DownloadButtonProps['analyticspayload'];

const renderDownloadButton = (props: Partial<DownloadButtonProps>) =>
	render(
		<IntlProvider locale="en">
			<DownloadButton testId="download" analyticspayload={analyticspayload} {...props} />
		</IntlProvider>,
	);

describe('DownloadButton', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should render the viewer icon button for the insetIcon variant', () => {
		renderDownloadButton({ variant: 'insetIcon' });

		expect(ViewerIconButton).toHaveBeenCalledWith(
			expect.objectContaining({ testId: 'download', label: 'Download' }),
			expect.anything(),
		);
		expect(Button).not.toHaveBeenCalled();
		expect(MediaButton).not.toHaveBeenCalled();
	});

	it('should render the themed primary button with the text for the insetText variant', () => {
		renderDownloadButton({ variant: 'insetText', children: 'Download' });

		expect(Button).toHaveBeenCalledWith(
			expect.objectContaining({ testId: 'download', appearance: 'primary', children: 'Download' }),
			expect.anything(),
		);
		expect(ViewerIconButton).not.toHaveBeenCalled();
		expect(MediaButton).not.toHaveBeenCalled();
	});

	it.each([{ variant: 'default' as const }, { variant: undefined }])(
		'should render the media button for the $variant variant',
		({ variant }) => {
			renderDownloadButton({ variant, children: 'Download' });

			expect(MediaButton).toHaveBeenCalledWith(
				expect.objectContaining({ testId: 'download', children: 'Download' }),
				expect.anything(),
			);
			expect(Button).not.toHaveBeenCalled();
			expect(ViewerIconButton).not.toHaveBeenCalled();
		},
	);

	it.each([
		{ variant: 'default' as const, component: MediaButton },
		{ variant: 'insetIcon' as const, component: ViewerIconButton },
		{ variant: 'insetText' as const, component: Button },
	])(
		'should fire the analytics payload, then call onClick, and pass isDisabled on for the $variant variant',
		({ variant, component }) => {
			const onClick = jest.fn();
			renderDownloadButton({ variant, onClick, isDisabled: true });

			const props = jest.mocked(component as jest.Mock).mock.lastCall?.[0];
			expect(props.isDisabled).toBe(true);

			const event = {} as React.MouseEvent<HTMLElement>;
			const analyticsEvent = {} as UIAnalyticsEvent;
			props.onClick(event, analyticsEvent);

			expect(fireAnalytics).toHaveBeenCalledWith(analyticspayload, expect.any(Function));
			expect(onClick).toHaveBeenCalledWith(event, analyticsEvent);
			expect(jest.mocked(fireAnalytics).mock.invocationCallOrder[0]).toBeLessThan(
				onClick.mock.invocationCallOrder[0],
			);
		},
	);

	it('should wrap the button in a tooltip with the tooltip text', () => {
		renderDownloadButton({ tooltip: 'Downloads are blocked' });

		expect(Tooltip).toHaveBeenCalledWith(
			expect.objectContaining({ content: 'Downloads are blocked', position: 'bottom' }),
			expect.anything(),
		);
		expect(MediaButton).toHaveBeenCalled();
	});

	it('should not render a tooltip without tooltip text', async () => {
		renderDownloadButton({});

		expect(Tooltip).not.toHaveBeenCalled();
		expect(MediaButton).toHaveBeenCalled();
		await expect(document.body).toBeAccessible();
	});
});
