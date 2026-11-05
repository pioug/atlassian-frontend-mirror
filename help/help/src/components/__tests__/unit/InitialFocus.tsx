import React, { useEffect, useRef } from 'react';

import { act, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { ARTICLE_TYPE } from '../../../model/Help';
import { getMockArticle } from '../../../util/testing/mock';
import { SLIDEIN_OVERLAY_TRANSITION_DURATION_MS } from '../../constants';
import { Help } from '../../Help';

const INITIAL_FOCUS_GATE = 'jfp_a11y_fix_help_panel_initial_focus';
const ARTICLE_API_DELAY_MS = 100;

/**
 * Mimics an embedding application: a focusable wrapper around the panel that focuses itself in an
 * effect when the panel opens. Parent effects run after child effects.
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

function getHelpUi(articleId: string) {
	const onGetHelpArticle = jest.fn().mockImplementation(
		() =>
			new Promise((resolve) => {
				setTimeout(() => resolve(getMockArticle(articleId)), ARTICLE_API_DELAY_MS);
			}),
	);

	return (
		<IntlProvider locale="en">
			<FocusedWrapperHost>
				<Help
					header={{ onCloseButtonClick: jest.fn() }}
					navigation={{
						navigationData: {
							articleId: { id: articleId, type: ARTICLE_TYPE.HELP_ARTICLE },
							history: [],
						},
						setNavigationData: jest.fn(),
					}}
					helpArticle={{ onGetHelpArticle }}
				>
					<div>Default content</div>
				</Help>
			</FocusedWrapperHost>
		</IntlProvider>
	);
}

function renderHelp(articleId: string) {
	return render(getHelpUi(articleId));
}

const getCloseButton = (): HTMLElement => screen.getByRole('button', { name: 'Close' });

const TIMER_STEP_MS = 50;

// Advances time in small steps, flushing React updates and resolved promises after each step.
// The panel chains state updates and timers (view change -> transition -> focus timer), and React
// only applies those updates between steps.
async function advance(ms: number): Promise<void> {
	for (let elapsed = 0; elapsed < ms; elapsed += TIMER_STEP_MS) {
		await act(async () => {
			jest.advanceTimersByTime(TIMER_STEP_MS);
		});
	}
	// Also run timers due at the current time, so `advance(0)` still flushes zero-delay timers
	await act(async () => {
		jest.advanceTimersByTime(0);
	});
}

describe('Help initial focus when the panel opens', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.clearAllTimers();
		jest.useRealTimers();
	});

	it('should capture and report a11y violations once focus is on the Close button', async () => {
		passGate(INITIAL_FOCUS_GATE);
		const { container } = renderHelp('');

		await advance(0);

		await expect(container).toBeAccessible();
	});

	it('should keep focus on the Close button after the home view finishes loading', async () => {
		passGate(INITIAL_FOCUS_GATE);
		renderHelp('');

		await advance(0);
		expect(getCloseButton()).toHaveFocus();

		await advance(ARTICLE_API_DELAY_MS + SLIDEIN_OVERLAY_TRANSITION_DURATION_MS + 100);

		expect(getCloseButton()).toHaveFocus();
	});

	it('should keep focus on the Close button after an article opened on load finishes loading', async () => {
		passGate(INITIAL_FOCUS_GATE);
		renderHelp('1');

		await advance(0);
		expect(getCloseButton()).toHaveFocus();

		await advance(ARTICLE_API_DELAY_MS + SLIDEIN_OVERLAY_TRANSITION_DURATION_MS + 100);

		expect(await screen.findByText('mockArticle title')).toBeInTheDocument();
		expect(getCloseButton()).toHaveFocus();
	});

	it('should still move focus into an article the host opens after the panel is already open', async () => {
		passGate(INITIAL_FOCUS_GATE);
		const { rerender } = renderHelp('');
		await advance(0);
		expect(getCloseButton()).toHaveFocus();

		rerender(getHelpUi('1'));
		await advance(ARTICLE_API_DELAY_MS + 2 * SLIDEIN_OVERLAY_TRANSITION_DURATION_MS + 100);

		expect(document.activeElement).toHaveAttribute('tabindex', '-1');
		expect(document.activeElement).toContainElement(screen.getByText('mockArticle title'));
	});

	it('should keep the existing behaviour, focusing the article container after load, when the feature gate is off', async () => {
		failGate(INITIAL_FOCUS_GATE);
		renderHelp('1');

		await advance(ARTICLE_API_DELAY_MS + SLIDEIN_OVERLAY_TRANSITION_DURATION_MS + 100);

		// The article container is the only `tabIndex=-1` element that wraps the article content
		expect(document.activeElement).toHaveAttribute('tabindex', '-1');
		expect(document.activeElement).toContainElement(screen.getByText('mockArticle title'));
	});
});
