// This works only by calling before importing Popup
// eslint-disable-next-line import/order
import mockPopper from '../_mockPopper';
mockPopper();

import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mount, type ReactWrapper } from 'enzyme';

import Popup from '@atlaskit/popup';
import Tooltip from '@atlaskit/tooltip';

import {
	CopyLinkButtonInner as CopyLinkButton,
	HiddenInput,
	type Props,
	type State,
} from '../../../components/CopyLinkButton';
import Button from '../../../components/styles';
import { messages } from '../../../i18n';

const mockLink = 'link';
const mockFormatMessage = (descriptor: any) => descriptor.defaultMessage;
const mockIntl = { formatMessage: mockFormatMessage };

jest.mock('react-intl-next', () => {
	return {
		...(jest.requireActual('react-intl-next') as any),
		FormattedMessage: (descriptor: any) => <span>{descriptor.defaultMessage}</span>,
		injectIntl: (Node: any) => (props: any) => <Node {...props} intl={mockIntl} />,
	};
});

const props = {
	link: mockLink,
	copyLinkButtonText: mockIntl.formatMessage(messages.copyLinkButtonText),
	copiedToClipboardText: mockIntl.formatMessage(messages.copiedToClipboardMessage),
};

describe('CopyLinkButton', () => {
	let originalExecCommand: (commandId: string, showUI?: boolean, value?: string) => boolean;
	let mockLink: string = 'link';
	let mockTooltipText: string = 'tooltip text';
	const spiedExecCommand: jest.Mock = jest.fn();

	beforeAll(() => {
		originalExecCommand = document.execCommand;
		document.execCommand = spiedExecCommand;
	});

	afterEach(() => {
		spiedExecCommand.mockReset();
	});

	afterAll(() => {
		document.execCommand = originalExecCommand;
	});

	it('should render', () => {
		const wrapper: ReactWrapper<Props, State, any> = mount<Props, State>(
			<CopyLinkButton {...props} />,
		);

		expect(wrapper.text()).toContain('Copy link');

		const inlineDialog = wrapper.find(Popup);
		expect(inlineDialog).toHaveLength(1);
		expect(inlineDialog.prop('placement')).toEqual('top-start');

		const button = wrapper.find(Button);
		expect(button).toHaveLength(1);
		expect(button.prop('appearance')).toEqual('subtle-link');

		const hiddenInput = wrapper.find(HiddenInput);
		expect(hiddenInput).toHaveLength(1);
		expect(hiddenInput.prop('text')).toEqual(mockLink);

		expect(wrapper.find(Tooltip)).toHaveLength(0);

		expect(
			// @ts-ignore accessing private property just for testing purpose
			wrapper.instance().inputRef.current instanceof HTMLInputElement,
		).toBeTruthy();
	});

	it('should render when isDisabled is true', () => {
		const wrapper: ReactWrapper<Props, State, any> = mount<Props, State>(
			<CopyLinkButton {...props} isDisabled={true} />,
		);

		expect(wrapper.text()).toContain('Copy link');

		const inlineDialog = wrapper.find(Popup);
		expect(inlineDialog).toHaveLength(1);
		expect(inlineDialog.prop('placement')).toEqual('top-start');

		const button = wrapper.find(Button);
		expect(button).toHaveLength(1);
		expect(button.prop('appearance')).toEqual('subtle-link');
		expect(button.prop('isDisabled')).toEqual(true);

		const hiddenInput = wrapper.find(HiddenInput);
		expect(hiddenInput).toHaveLength(1);
		expect(hiddenInput.prop('text')).toEqual(mockLink);

		expect(
			// @ts-ignore accessing private property just for testing purpose
			wrapper.instance().inputRef.current instanceof HTMLInputElement,
		).toBeTruthy();
	});

	it('should render a copy link tooltip if copyTooltipText prop exists', () => {
		const wrapper: ReactWrapper<Props, State, any> = mount<Props, State>(
			<CopyLinkButton {...props} link={mockLink} copyTooltipText={mockTooltipText} />,
		);

		const tooltip = wrapper.find(Tooltip);
		expect(tooltip).toHaveLength(1);
		expect(tooltip.prop('content')).toEqual(mockTooltipText);
	});

	it('should replace copyLinkButtonText if children exists', () => {
		const wrapper: ReactWrapper<Props, State, any> = mount<Props, State>(
			<CopyLinkButton {...props} link={mockLink} copyTooltipText={mockTooltipText}>
				<div>Styled Text</div>
			</CopyLinkButton>,
		);

		expect(wrapper.text()).toContain('Styled Text');
	});

	describe('componentWillUnmount', () => {
		it('should clear this.autoDismiss', () => {
			const wrapper: ReactWrapper<Props, State, any> = mount<Props, State>(
				<CopyLinkButton {...props} />,
			);
			wrapper.find('button').simulate('click');
			expect(wrapper.instance().autoDismiss).not.toBeUndefined();
			wrapper.instance().componentWillUnmount();
			expect(wrapper.instance().autoDismiss).toBeUndefined();
		});
	});

	describe('shouldShowCopiedMessage state', () => {
		it('should rtl render the copied to clip board message, and dismiss the message when click outside the Inline Dialog', async () => {
			const spiedOnLinkCopy: jest.Mock = jest.fn();

			render(<CopyLinkButton {...props} onLinkCopy={spiedOnLinkCopy} />);

			// Click the button
			const button = screen.getByRole('button');
			expect(button).toBeInTheDocument();
			await userEvent.click(button);

			// Message should be displayed
			const container = await screen.findByTestId('message-container');
			expect(container).toBeVisible();
			const msgs = await screen.findAllByText(messages.copiedToClipboardMessage.defaultMessage);
			expect(msgs.length).toEqual(2);
			expect(msgs[0]).toBeInTheDocument();
			expect(msgs[1]).toBeInTheDocument();

			// Wait until message should be dismissed
			await waitFor(
				() => {
					expect(screen.queryByTestId('message-container')).not.toBeInTheDocument();
				},
				{ timeout: 10000 },
			);
			expect(spiedExecCommand).toHaveBeenCalledTimes(1);
			expect(spiedOnLinkCopy).toHaveBeenCalledTimes(1);
			expect(spiedOnLinkCopy.mock.calls[0][0]).toEqual(mockLink);
		});
	});

	describe('handleClick', () => {
		beforeEach(() => {
			jest.useFakeTimers();
			jest.clearAllTimers();
		});

		it('should have the correct aria attributes on the popup once the button is clicked', () => {
			const wrapper: ReactWrapper<Props, State, any> = mount<Props, State>(
				<CopyLinkButton {...props} copiedToClipboardText="Copied to clipboard" />,
			);

			expect(wrapper.find('input').props()).toHaveProperty('aria-label', 'Copied to clipboard');
		});
	});
});
