/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import React, { useEffect, useRef } from 'react';

import { createIntl, createIntlCache } from 'react-intl';

import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { act } from '@atlassian/testing-library/act';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';

import { messages } from '../../../../messages';
import { CloseButton } from '../../CloseButton';

// Messages
const cache = createIntlCache();
const intl = createIntl(
	{
		locale: 'en',
		messages: {},
	},
	cache,
);
const messageClose = intl.formatMessage(messages.help_panel_header_close);

const mockOnClick = jest.fn();
const analyticsSpy = jest.fn();

describe('BackButton', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<AnalyticsListener channel="help" onEvent={analyticsSpy}>
				<CloseButton intl={intl} onClick={mockOnClick} />,
			</AnalyticsListener>,
		);

		await expect(container).toBeAccessible();
	});

	it('Should render correctly', async () => {
		render(<CloseButton intl={intl} onClick={mockOnClick} />);

		expect(screen.getByLabelText(messageClose)).toBeInTheDocument();
	});

	it('Should execute the prop function "mockOnClick" when the close button is clicked', async () => {
		render(
			<AnalyticsListener channel="help" onEvent={analyticsSpy}>
				<CloseButton intl={intl} onClick={mockOnClick} />,
			</AnalyticsListener>,
		);

		const buttonClose = screen.getByLabelText(messageClose).closest('button');

		expect(buttonClose).not.toBeNull();

		if (buttonClose) {
			await userEvent.click(buttonClose);
			expect(mockOnClick).toHaveBeenCalledTimes(1);
		}
	});
});

describe('CloseButton initial focus when the panel opens', () => {
	const INITIAL_FOCUS_GATE = 'jfp_a11y_fix_help_panel_initial_focus';

	/**
	 * Mimics an embedding application: a focusable wrapper around the panel that focuses itself
	 * in an effect. Parent effects run after child effects, so this focuses after CloseButton mounts.
	 */
	function FocusedWrapperHost({ children }: { children: React.ReactNode }) {
		const wrapperRef = useRef<HTMLDivElement>(null);

		useEffect(() => {
			wrapperRef.current?.focus();
		}, []);

		return (
			<div ref={wrapperRef} tabIndex={0} data-testid="host-wrapper">
				{children}
			</div>
		);
	}

	const getCloseButton = (): HTMLElement => screen.getByRole('button', { name: messageClose });

	// Runs the deferred focus move deterministically instead of waiting on wall-clock time
	const flushTimers = () => act(() => jest.runAllTimers());

	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should focus the Close button when focus is left on the host wrapper', () => {
		passGate(INITIAL_FOCUS_GATE);
		render(
			<FocusedWrapperHost>
				<CloseButton intl={intl} onClick={mockOnClick} />
			</FocusedWrapperHost>,
		);
		expect(screen.getByTestId('host-wrapper')).toHaveFocus();

		flushTimers();

		expect(getCloseButton()).toHaveFocus();
	});

	it('should focus the Close button when nothing has focus', () => {
		passGate(INITIAL_FOCUS_GATE);
		render(<CloseButton intl={intl} onClick={mockOnClick} />);

		flushTimers();

		expect(getCloseButton()).toHaveFocus();
	});

	it('should not take focus from a control that already has it', () => {
		passGate(INITIAL_FOCUS_GATE);
		render(
			<>
				<button type="button">Other control</button>
				<CloseButton intl={intl} onClick={mockOnClick} />
			</>,
		);
		const otherControl = screen.getByRole('button', { name: 'Other control' });
		otherControl.focus();

		flushTimers();

		expect(otherControl).toHaveFocus();
	});

	it('should leave focus on the host wrapper when the feature gate is off', () => {
		failGate(INITIAL_FOCUS_GATE);
		render(
			<FocusedWrapperHost>
				<CloseButton intl={intl} onClick={mockOnClick} />
			</FocusedWrapperHost>,
		);

		flushTimers();

		expect(screen.getByTestId('host-wrapper')).toHaveFocus();
	});

	it('should not move focus if the panel closes before the deferred focus runs', () => {
		passGate(INITIAL_FOCUS_GATE);
		const { unmount } = render(<CloseButton intl={intl} onClick={mockOnClick} />);

		unmount();
		flushTimers();

		expect(document.body).toHaveFocus();
	});
});
