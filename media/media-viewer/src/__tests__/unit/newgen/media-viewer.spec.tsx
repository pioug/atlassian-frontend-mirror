import React from 'react';
import { mount } from 'enzyme';
import { Shortcut } from '@atlaskit/media-ui';
import {
	type Identifier,
	createMediaSubscribable,
	createMediaSubject,
} from '@atlaskit/media-client';
import { KeyboardEventWithKeyCode, fakeMediaClient, asMock } from '@atlaskit/media-test-helpers';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import EditorPanelIcon from '@atlaskit/icon/core/migration/information--editor-panel';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MediaViewer } from '../../../media-viewer';
import { CloseButtonWrapper, SidebarWrapper, Blanket } from '../../../styleWrappers';
import Header from '../../../header';
import { type MediaViewerProps, type MediaViewerExtensions } from '../../../components/types';
function createFixture(
	items: Identifier[],
	identifier: Identifier,
	overrides?: Partial<MediaViewerProps>,
) {
	const subject = createMediaSubject();
	const mediaClient = fakeMediaClient();
	asMock(mediaClient.file.getFileState).mockReturnValue(createMediaSubscribable());
	const onClose = jest.fn();
	const onEvent = jest.fn();
	const el = mount(
		<AnalyticsListener channel="media" onEvent={onEvent}>
			<MediaViewer
				selectedItem={identifier}
				items={items}
				mediaClient={mediaClient}
				onClose={onClose}
				{...overrides}
			/>
		</AnalyticsListener>,
	);
	return { subject, el, onClose, onEvent };
}

function createFixtureRTL(
	items: Identifier[],
	identifier: Identifier,
	overrides?: Partial<MediaViewerProps>,
) {
	const subject = createMediaSubject();
	const mediaClient = fakeMediaClient();
	asMock(mediaClient.file.getFileState).mockReturnValue(createMediaSubscribable());
	const onClose = jest.fn();
	const onEvent = jest.fn();
	const el = render(
		<AnalyticsListener channel="media" onEvent={onEvent}>
			<MediaViewer
				selectedItem={identifier}
				items={items}
				mediaClient={mediaClient}
				onClose={onClose}
				{...overrides}
			/>
		</AnalyticsListener>,
	);
	return { subject, el, onClose, onEvent };
}

describe('<MediaViewer />', () => {
	const user = userEvent.setup();
	const identifier: Identifier = {
		id: 'some-id',
		occurrenceKey: 'some-custom-occurrence-key',
		mediaItemType: 'file',
	};
	const identifier2: Identifier = {
		id: 'some-id-2',
		occurrenceKey: 'some-custom-occurrence-key-2',
		mediaItemType: 'file',
	};

	it.skip('should close Media Viewer on ESC shortcut', () => {
		const { onClose } = createFixture([identifier], identifier);
		const e = new KeyboardEventWithKeyCode('keyup', {
			bubbles: true,
			cancelable: true,
			keyCode: 27,
		});
		document.dispatchEvent(e);
		expect(onClose).toHaveBeenCalled();
	});

	it('should not close Media Viewer when clicking on the Header', () => {
		const { el, onClose } = createFixture([identifier], identifier);
		el.find(Header).simulate('click');
		expect(onClose).not.toHaveBeenCalled();
	});

	it('should always render the close button', () => {
		const { el, onClose } = createFixture([identifier], identifier);

		expect(el.find(CloseButtonWrapper)).toHaveLength(1);
		el.find(CloseButtonWrapper).find('button').simulate('click');
		expect(onClose).toHaveBeenCalled();
	});

	// We need this to help Jira prevent to go into edit mode when "something" is clicked in Media Viewer
	// Remove by solving this ticket: https://product-fabric.atlassian.net/browse/MPT-15
	it('should attach data-testid to the blanket', () => {
		const { el } = createFixture([identifier], identifier);
		const blanket = el.find(Blanket);
		expect(blanket).toHaveLength(1);
		expect(blanket.prop('data-testid')).toEqual('media-viewer-popup');
	});

	describe('Analytics', () => {
		it('should trigger the screen event when the component loads', () => {
			const { onEvent } = createFixture([identifier], identifier);
			const mediaViewerModalEvent = onEvent.mock.calls[0][0].payload;
			expect(mediaViewerModalEvent).toEqual({
				action: 'viewed',
				actionSubject: 'mediaViewerModal',
				eventType: 'screen',
				name: 'mediaViewerModal',
			});
		});

		it('should send analytics when closed with button', () => {
			const { el, onEvent } = createFixture([identifier], identifier);

			expect(el.find(CloseButtonWrapper)).toHaveLength(1);
			el.find(CloseButtonWrapper).find('button').simulate('click');
			expect(onEvent).toHaveBeenCalled();
			const closeEvent: any = onEvent.mock.calls[onEvent.mock.calls.length - 1][0];
			expect(closeEvent.payload.attributes.input).toEqual('button');
		});

		it('should send analytics when closed with esc key', () => {
			const { el, onEvent } = createFixture([identifier], identifier);

			expect(el.find(Shortcut)).toHaveLength(1);
			const handler: any = el.find(Shortcut).prop('handler');
			handler({
				keyCode: 27,
			});
			expect(onEvent).toHaveBeenCalled();
			const closeEvent: any = onEvent.mock.calls[onEvent.mock.calls.length - 1][0];
			expect(closeEvent.payload.attributes.input).toEqual('escKey');
		});
	});

	describe('Sidebar integration', () => {
		const mockSidebarRenderer = jest.fn().mockImplementation(() => <div>Sidebar Content</div>);

		const extensions: MediaViewerExtensions = {
			sidebar: {
				icon: <EditorPanelIcon color="currentColor" spacing="spacious" label="sidebar" />,
				renderer: mockSidebarRenderer,
			},
		};
		const items = [identifier, identifier2];

		describe('renderer', () => {
			it('should not be visible by default', () => {
				const { el } = createFixture(items, identifier, { extensions });
				expect(el.find(SidebarWrapper).exists()).toBe(false);
			});

			it('should render sidebar with selected identifier in state', async () => {
				createFixtureRTL(items, identifier, { extensions, selectedItem: identifier2 });
				const sidebarButton = screen.getByLabelText('sidebar');
				await user.click(sidebarButton);
				expect(screen.queryByText('Sidebar Content')).toBeInTheDocument();
				expect(mockSidebarRenderer).toHaveBeenLastCalledWith(identifier2, {
					close: expect.any(Function),
				});
			});

			it('should render sidebar with default selected identifier if not set in state', async () => {
				createFixtureRTL(items, identifier, { extensions });
				const sidebarButton = screen.getByLabelText('sidebar');
				await user.click(sidebarButton);
				expect(screen.queryByText('Sidebar Content')).toBeInTheDocument();
				expect(mockSidebarRenderer).toHaveBeenLastCalledWith(identifier, {
					close: expect.any(Function),
				});
			});

			it('should not show sidebar if extensions prop is not defined', async () => {
				createFixtureRTL(items, identifier, {
					extensions: undefined,
					selectedItem: identifier2,
				});

				expect(screen.queryByText('sidebar')).not.toBeInTheDocument();
			});

			it('should not show sidebar if sidebarRenderer is not defined within the extensions prop', () => {
				createFixtureRTL(items, identifier, {
					extensions: {},
					selectedItem: identifier2,
				});

				expect(screen.queryByText('sidebar')).not.toBeInTheDocument();
			});
		});
	});
});
