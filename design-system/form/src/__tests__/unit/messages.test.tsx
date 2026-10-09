import React from 'react';

import TextField from '@atlaskit/textfield/text-field';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { act } from '@atlassian/testing-library/act';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import { ErrorMessage } from '../../error-message';
import Field from '../../field';
import { FieldId } from '../../field-id-context';
import Form from '../../form';
import { HelperMessage } from '../../helper-message';
import { MessageWrapperContext } from '../../message-context';
import { MessageWrapper } from '../../message-wrapper';
import { ValidMessage } from '../../valid-message';

const props = {
	testId: 'testId',
	children: ['test'],
};

const inputMotionGate = 'platform-dst-motion-uplift-input';
const enterAnimation =
	'var(--ds-form-message-enter,.15s cubic-bezier(.4,1,.6,1) SlideInBottom2px,.15s cubic-bezier(.4,1,.6,1) FadeIn0to100)';
const exitAnimation =
	'var(--ds-form-message-exit,.1s cubic-bezier(.6,0,.8,.6) SlideOutBottom2px,.1s cubic-bezier(.6,0,.8,.6) FadeOut100to0)';
const expandAnimation = `${enterAnimation},kaq7wke var(--ds-duration-short,.15s) var(--ds-easing-out-practical,cubic-bezier(.4,1,.6,1)) backwards`;
const collapseAnimation = `${exitAnimation},k1pp1wpp var(--ds-duration-xshort,.1s) var(--ds-easing-in-practical,cubic-bezier(.6,0,.8,.6)) forwards`;

const mockAnimationDurations = () =>
	jest.spyOn(window, 'getComputedStyle').mockImplementation(
		(element) =>
			({
				animationDelay: '0s',
				animationDuration: element.getAttribute('aria-hidden') === 'true' ? '0.1s' : '0.15s',
				animationName: 'FormErrorMotion',
				getPropertyValue: (property: string) =>
					element instanceof HTMLElement ? element.style.getPropertyValue(property) : '',
			}) as CSSStyleDeclaration,
	);

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Messages', () => {
	describe('wrapper', () => {
		it('should have an aria-live attribute', () => {
			render(
				<MessageWrapper>
					<ErrorMessage testId="error-test">Error Test</ErrorMessage>
				</MessageWrapper>,
			);
			expect(screen.getByTestId('message-wrapper')).toHaveAttribute('aria-live', 'polite');
		});

		it("should not contain a child 'aria-live' attribute on ErrorMessage", () => {
			render(
				<MessageWrapper>
					<ErrorMessage testId="error-test">Error Test</ErrorMessage>
				</MessageWrapper>,
			);
			expect(screen.getByTestId('error-test')).not.toHaveAttribute('aria-live');
		});

		it("should not contain a child 'aria-live' attribute on ValidMessage", () => {
			render(
				<MessageWrapper>
					<ValidMessage testId="valid-test">Valid Test</ValidMessage>
				</MessageWrapper>,
			);
			expect(screen.getByTestId('valid-test')).not.toHaveAttribute('aria-live');
		});

		it("should not contain a child 'aria-live' attribute on HelperMessage", () => {
			render(
				<MessageWrapper>
					<HelperMessage testId="helper-test">Helper Test</HelperMessage>
				</MessageWrapper>,
			);
			expect(screen.getByTestId('helper-test')).not.toHaveAttribute('aria-live');
		});
	});

	describe('aria-live without wrapper', () => {
		it("ErrorMessage should have 'aria-live' attribute", () => {
			render(<ErrorMessage {...props} testId="error-test" />);
			expect(screen.getByTestId('error-test')).toHaveAttribute('aria-live', 'polite');
		});

		it("ValidMessage should have 'aria-live' attribute", () => {
			render(<ValidMessage testId="valid-test">Valid Test</ValidMessage>);
			expect(screen.getByTestId('valid-test')).toHaveAttribute('aria-live', 'polite');
		});

		it("HelperMessage should have 'aria-live' attribute", () => {
			render(<HelperMessage testId="helper-test">Helper Test</HelperMessage>);
			expect(screen.getByTestId('helper-test')).toHaveAttribute('aria-live', 'polite');
		});
	});

	describe('icon rendering', () => {
		it('ErrorMessage should render an error icon', () => {
			render(<ErrorMessage {...props} />);
			expect(screen.getByRole('img', { name: 'error' })).toBeInTheDocument();
		});

		it('ValidMessage should render a success icon', () => {
			render(<ValidMessage {...props} />);
			expect(screen.getByRole('img', { name: 'success' })).toBeInTheDocument();
		});

		it('HelperMessage should not render any icon', () => {
			render(<HelperMessage {...props} />);
			expect(screen.queryByRole('img', { name: 'error' })).not.toBeInTheDocument();
			expect(screen.queryByRole('img', { name: 'success' })).not.toBeInTheDocument();
		});
	});

	describe('content rendering', () => {
		it('should render string content correctly', () => {
			render(<ErrorMessage testId="error-test">Simple string message</ErrorMessage>);
			expect(screen.getByTestId('error-test')).toHaveTextContent('Simple string message');
		});

		it('should render JSX content correctly', () => {
			render(
				<ErrorMessage testId="error-test">
					<strong>Bold</strong> message
				</ErrorMessage>,
			);
			expect(screen.getByTestId('error-test')).toHaveTextContent('Bold message');
			expect(screen.getByText('Bold')).toBeInTheDocument();
		});
	});

	describe('FieldId context integration', () => {
		it('ErrorMessage should have id with -error suffix when FieldId is provided', () => {
			render(
				<FieldId.Provider value="my-field">
					<ErrorMessage testId="error-test">Error message</ErrorMessage>
				</FieldId.Provider>,
			);
			expect(screen.getByTestId('error-test')).toHaveAttribute('id', 'my-field-error');
		});

		it('ValidMessage should have id with -valid suffix when FieldId is provided', () => {
			render(
				<FieldId.Provider value="my-field">
					<ValidMessage testId="valid-test">Valid message</ValidMessage>
				</FieldId.Provider>,
			);
			expect(screen.getByTestId('valid-test')).toHaveAttribute('id', 'my-field-valid');
		});

		it('HelperMessage should have id with -helper suffix when FieldId is provided', () => {
			render(
				<FieldId.Provider value="my-field">
					<HelperMessage testId="helper-test">Helper message</HelperMessage>
				</FieldId.Provider>,
			);
			expect(screen.getByTestId('helper-test')).toHaveAttribute('id', 'my-field-helper');
		});

		it('ErrorMessage should not have id attribute when FieldId is not provided', () => {
			render(<ErrorMessage testId="error-test">Error message</ErrorMessage>);
			expect(screen.getByTestId('error-test')).not.toHaveAttribute('id');
		});

		it('ValidMessage should not have id attribute when FieldId is not provided', () => {
			render(<ValidMessage testId="valid-test">Valid message</ValidMessage>);
			expect(screen.getByTestId('valid-test')).not.toHaveAttribute('id');
		});

		it('HelperMessage should not have id attribute when FieldId is not provided', () => {
			render(<HelperMessage testId="helper-test">Helper message</HelperMessage>);
			expect(screen.getByTestId('helper-test')).not.toHaveAttribute('id');
		});
	});

	describe('all message types render correctly', () => {
		[ErrorMessage, ValidMessage, HelperMessage].forEach((Component) => {
			it(`${Component.name} should render content immediately`, () => {
				render(<Component testId={`${Component.name}-test`}>Test Message</Component>);
				expect(screen.getByTestId(`${Component.name}-test`)).toHaveTextContent('Test Message');
			});
		});
	});

	describe('ErrorMessage motion', () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});

		afterEach(() => {
			jest.restoreAllMocks();
			jest.useRealTimers();
		});

		it('preserves immediate removal when the gate is off', () => {
			failGate(inputMotionGate);
			const { rerender } = render(
				<MessageWrapper>
					<ErrorMessage key="error" testId="error-test">
						Error Test
					</ErrorMessage>
				</MessageWrapper>,
			);

			rerender(<MessageWrapper>{null}</MessageWrapper>);

			expect(screen.queryByTestId('error-test')).not.toBeInTheDocument();
		});

		it('preserves an immediate error-to-valid swap when the gate is off', () => {
			failGate(inputMotionGate);
			const { rerender } = render(
				<MessageWrapper>
					<ErrorMessage key="error" testId="error-test">
						Error Test
					</ErrorMessage>
				</MessageWrapper>,
			);

			rerender(
				<MessageWrapper>
					<ValidMessage key="valid" testId="valid-test">
						Valid Test
					</ValidMessage>
				</MessageWrapper>,
			);

			expect(screen.queryByTestId('error-test')).not.toBeInTheDocument();
			expect(screen.getByTestId('valid-test')).toBeVisible();
			expect(screen.getByTestId('message-wrapper')).not.toHaveAttribute('style');
		});

		it('keeps the motion context stable when its values do not change', () => {
			passGate(inputMotionGate);
			mockAnimationDurations();
			const observedContexts: object[] = [];
			const ContextObserver = () => {
				observedContexts.push(React.useContext(MessageWrapperContext));
				return null;
			};
			const renderMessages = () => (
				<MessageWrapper>
					<HelperMessage>
						<ContextObserver />
					</HelperMessage>
				</MessageWrapper>
			);
			const { rerender } = render(renderMessages());

			rerender(renderMessages());

			expect(observedContexts.length).toBeGreaterThan(1);
			expect(observedContexts.every((context) => context === observedContexts[0])).toBe(true);
		});

		it('applies enter motion and completes exit before removal when the gate is on', () => {
			passGate(inputMotionGate);
			mockAnimationDurations();
			const { rerender } = render(
				<MessageWrapper>
					<ErrorMessage key="error" testId="error-test">
						Error Test
					</ErrorMessage>
				</MessageWrapper>,
			);

			act(() => {
				jest.advanceTimersByTime(150);
			});
			rerender(<MessageWrapper>{null}</MessageWrapper>);

			const exitingTrack = screen.getByTestId('error-test-motion');
			expect(exitingTrack).toHaveAttribute('aria-hidden', 'true');
			expect(exitingTrack).toHaveCompiledCss('animation', collapseAnimation);
			expect(screen.getByTestId('message-wrapper').getAttribute('style') ?? '').toBe('');

			act(() => {
				jest.advanceTimersByTime(99);
			});
			expect(screen.getByTestId('error-test')).toBeInTheDocument();

			act(() => {
				jest.advanceTimersByTime(1);
			});
			expect(screen.queryByTestId('error-test')).not.toBeInTheDocument();
			expect(screen.queryByTestId('error-test-motion')).not.toBeInTheDocument();
		});

		it('enters an unkeyed conditional error in an empty wrapper with expand motion', () => {
			passGate(inputMotionGate);
			mockAnimationDurations();
			const renderMessages = (error?: string) => (
				<MessageWrapper>
					{error && <ErrorMessage testId="error-test">{error}</ErrorMessage>}
				</MessageWrapper>
			);
			const { rerender } = render(renderMessages());

			rerender(renderMessages('Error Test'));

			const track = screen.getByTestId('error-test-motion');
			expect(screen.getByTestId('message-wrapper')).toContainElement(track);
			expect(track).toHaveCompiledCss('animation', expandAnimation);
		});

		it('keeps an exiting error mounted across a parent rerender', () => {
			passGate(inputMotionGate);
			mockAnimationDurations();
			const renderMessages = (isVisible: boolean) => (
				<MessageWrapper>
					<HelperMessage testId="helper-test">Helper Test</HelperMessage>
					{isVisible ? (
						<ErrorMessage key="error" testId="error-test">
							Error Test
						</ErrorMessage>
					) : null}
				</MessageWrapper>
			);
			const { rerender } = render(renderMessages(true));

			act(() => {
				jest.advanceTimersByTime(150);
			});
			rerender(renderMessages(false));
			expect(screen.getByTestId('error-test-motion')).toHaveAttribute('aria-hidden', 'true');

			act(() => {
				jest.advanceTimersByTime(30);
			});
			rerender(renderMessages(false));

			expect(screen.getByTestId('error-test')).toHaveAttribute('aria-hidden', 'true');
			act(() => {
				jest.advanceTimersByTime(69);
			});
			expect(screen.getByTestId('error-test')).toBeInTheDocument();
			act(() => {
				jest.advanceTimersByTime(1);
			});
			expect(screen.queryByTestId('error-test')).not.toBeInTheDocument();
		});

		it('does not remove a message that reappears while exiting', () => {
			passGate(inputMotionGate);
			mockAnimationDurations();
			const renderMessages = (isVisible: boolean) => (
				<MessageWrapper>
					{isVisible ? (
						<ErrorMessage key="error" testId="error-test">
							Error Test
						</ErrorMessage>
					) : null}
				</MessageWrapper>
			);
			const { rerender } = render(renderMessages(true));

			act(() => {
				jest.advanceTimersByTime(150);
			});
			rerender(renderMessages(false));
			act(() => {
				jest.advanceTimersByTime(50);
			});
			rerender(renderMessages(true));
			act(() => {
				jest.advanceTimersByTime(100);
			});

			expect(screen.getByTestId('error-test')).toHaveTextContent('Error Test');
		});

		it('keeps the current error ID unique during a rapid replacement', () => {
			passGate(inputMotionGate);
			mockAnimationDurations();
			const renderError = (message: string) => (
				<FieldId.Provider value="project">
					<MessageWrapper>
						<ErrorMessage key={message} testId="error-test">
							{message}
						</ErrorMessage>
					</MessageWrapper>
				</FieldId.Provider>
			);
			const { rerender } = render(renderError('Choose a project'));

			act(() => {
				jest.advanceTimersByTime(150);
			});
			rerender(renderError('Choose another project'));

			const messages = screen.getAllByTestId('error-test');
			expect(messages).toHaveLength(2);
			expect(messages[0]).not.toHaveAttribute('id');
			expect(messages[1]).toHaveAttribute('id', 'project-error');
			expect(screen.getByText('Choose a project')).toHaveAttribute('aria-hidden', 'true');
			expect(screen.getByText('Choose another project')).toBeInTheDocument();

			act(() => {
				jest.advanceTimersByTime(100);
			});
			expect(screen.getAllByTestId('error-test')).toHaveLength(1);
			expect(screen.getByText('Choose another project')).toHaveAttribute('id', 'project-error');
		});

		it('shows submit errors instantly and keeps motion for later single changes', async () => {
			passGate(inputMotionGate);
			mockAnimationDurations();
			render(
				<Form onSubmit={jest.fn()}>
					{({ formProps }) => (
						<form {...formProps}>
							{['first', 'second'].map((name) => (
								<Field
									key={name}
									name={name}
									label={name}
									defaultValue=""
									validate={(value?: string) => (value ? undefined : 'Required')}
								>
									{({ fieldProps, error }) => (
										<>
											<TextField {...fieldProps} testId={`${name}-input`} />
											<MessageWrapper>
												{error && <ErrorMessage testId={`${name}-error`}>{error}</ErrorMessage>}
											</MessageWrapper>
										</>
									)}
								</Field>
							))}
							<button type="submit">Submit</button>
						</form>
					)}
				</Form>,
			);

			const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
			await user.click(screen.getByRole('button', { name: 'Submit' }));

			for (const name of ['first', 'second']) {
				const track = screen.getByTestId(`${name}-error-motion`);
				expect(track).not.toHaveCompiledCss('animation', expandAnimation);
				expect(track).not.toHaveCompiledCss('visibility', 'hidden');
			}

			await user.type(screen.getByTestId('first-input'), 'Filled');

			expect(screen.getByTestId('first-error-motion')).toHaveCompiledCss(
				'animation',
				collapseAnimation,
			);
			expect(screen.getByTestId('second-error-motion')).not.toHaveAttribute('aria-hidden');
		});

		it('grows one shared space when several messages enter or exit together', () => {
			passGate(inputMotionGate);
			mockAnimationDurations();
			const renderMessages = (hasMessages: boolean) => (
				<MessageWrapper>
					{hasMessages && <HelperMessage testId="helper-test">Use 8 characters</HelperMessage>}
					{hasMessages && <ErrorMessage testId="error-test">Password is too short</ErrorMessage>}
				</MessageWrapper>
			);
			const { rerender } = render(renderMessages(false));

			rerender(renderMessages(true));

			const group = screen.getByTestId('message-wrapper-motion');
			expect(group).toHaveCompiledCss(
				'animation',
				'kaq7wke var(--ds-duration-short,.15s) var(--ds-easing-out-practical,cubic-bezier(.4,1,.6,1)) backwards',
			);
			expect(screen.getByTestId('helper-test-motion')).toHaveCompiledCss(
				'animation',
				enterAnimation,
			);
			expect(screen.getByTestId('error-test-motion')).toHaveCompiledCss(
				'animation',
				enterAnimation,
			);

			act(() => {
				jest.advanceTimersByTime(150);
			});
			rerender(renderMessages(false));

			expect(screen.getByTestId('message-wrapper-motion')).toHaveCompiledCss(
				'animation',
				'k1pp1wpp var(--ds-duration-xshort,.1s) var(--ds-easing-in-practical,cubic-bezier(.6,0,.8,.6)) forwards',
			);
			expect(screen.getByTestId('helper-test-motion')).toHaveCompiledCss(
				'animation',
				exitAnimation,
			);
			expect(screen.getByTestId('error-test-motion')).toHaveCompiledCss('animation', exitAnimation);

			act(() => {
				jest.advanceTimersByTime(100);
			});
			expect(screen.queryByTestId('helper-test')).not.toBeInTheDocument();
			expect(screen.queryByTestId('error-test')).not.toBeInTheDocument();
		});

		it('switches an error-to-valid swap instantly without remounting the helper or live region', () => {
			passGate(inputMotionGate);
			jest.spyOn(window, 'getComputedStyle').mockImplementation(
				() =>
					({
						animationDelay: '0s',
						animationDuration: '0s',
						animationName: 'none',
						getPropertyValue: () => '',
					}) as unknown as CSSStyleDeclaration,
			);
			const renderMessages = (status: 'error' | 'valid') => (
				<FieldId.Provider value="project">
					<MessageWrapper>
						<HelperMessage testId="helper-test">Choose a project</HelperMessage>
						{status === 'error' && (
							<ErrorMessage testId="error-test">Project is required</ErrorMessage>
						)}
						{status === 'valid' && (
							<ValidMessage testId="valid-test">Project is valid</ValidMessage>
						)}
					</MessageWrapper>
				</FieldId.Provider>
			);
			const { rerender } = render(renderMessages('error'));
			const helper = screen.getByTestId('helper-test');
			const liveRegion = screen.getByTestId('message-wrapper');

			act(() => {
				jest.advanceTimersByTime(150);
			});
			rerender(renderMessages('valid'));

			expect(screen.getByTestId('error-test-motion')).toHaveCompiledCss('display', 'none');
			expect(screen.getByTestId('error-test-motion')).not.toHaveCompiledCss(
				'animation',
				collapseAnimation,
			);
			expect(screen.getByTestId('error-test')).not.toHaveAttribute('id');
			expect(screen.getByTestId('valid-test')).toHaveAttribute('id', 'project-valid');
			expect(screen.getByTestId('valid-test-motion')).not.toHaveCompiledCss(
				'animation',
				expandAnimation,
			);
			expect(screen.getByTestId('valid-test-motion')).not.toHaveCompiledCss('visibility', 'hidden');
			expect(screen.getByTestId('helper-test')).toBe(helper);
			expect(screen.getByTestId('message-wrapper')).toBe(liveRegion);

			act(() => {
				jest.advanceTimersByTime(0);
			});

			expect(screen.queryByTestId('error-test')).not.toBeInTheDocument();
			expect(screen.getByTestId('valid-test')).toHaveAttribute('id', 'project-valid');
			expect(screen.getByTestId('helper-test')).toBe(helper);
			expect(screen.getByTestId('message-wrapper')).toBe(liveRegion);
		});

		it('switches Checking... and error instantly during rapid async validation changes', () => {
			passGate(inputMotionGate);
			mockAnimationDurations();
			const renderMessages = (status: 'error' | 'checking') => (
				<MessageWrapper>
					{status === 'error' ? (
						<ErrorMessage key="error" testId="error-test">
							Invalid description
						</ErrorMessage>
					) : (
						<HelperMessage key="checking" testId="checking-test">
							Checking...
						</HelperMessage>
					)}
				</MessageWrapper>
			);
			const { rerender } = render(renderMessages('error'));

			act(() => {
				jest.advanceTimersByTime(150);
			});
			rerender(renderMessages('checking'));
			expect(screen.getByTestId('checking-test')).toBeInTheDocument();

			act(() => {
				jest.advanceTimersByTime(50);
			});
			rerender(renderMessages('error'));
			expect(screen.getByTestId('error-test')).not.toHaveAttribute('aria-hidden');

			rerender(renderMessages('checking'));
			act(() => {
				jest.advanceTimersByTime(100);
			});
			expect(screen.queryByTestId('error-test')).not.toBeInTheDocument();
			expect(screen.getByTestId('checking-test')).toHaveTextContent('Checking...');

			act(() => {
				jest.advanceTimersByTime(150);
			});
			rerender(renderMessages('error'));
			expect(screen.getByTestId('checking-test')).toHaveAttribute('aria-hidden', 'true');
			expect(screen.getByTestId('error-test')).toBeInTheDocument();

			act(() => {
				jest.advanceTimersByTime(100);
			});
			expect(screen.queryByTestId('checking-test')).not.toBeInTheDocument();
			expect(screen.getByTestId('error-test')).toHaveTextContent('Invalid description');
		});

		it('removes message motion under reduced motion', () => {
			passGate(inputMotionGate);
			mockAnimationDurations();
			const { rerender } = render(
				<MessageWrapper>
					<ErrorMessage key="error" testId="error-test">
						Error Test
					</ErrorMessage>
				</MessageWrapper>,
			);

			expect(screen.getByTestId('error-test-motion')).toHaveCompiledCss('animation', 'none', {
				media: '(prefers-reduced-motion: reduce)',
			});

			act(() => {
				jest.advanceTimersByTime(150);
			});
			rerender(<MessageWrapper>{null}</MessageWrapper>);

			expect(screen.getByTestId('error-test-motion')).toHaveCompiledCss('animation', 'none', {
				media: '(prefers-reduced-motion: reduce)',
			});
		});

		it('removes an exiting message immediately when reduced motion is preferred', () => {
			passGate(inputMotionGate);
			jest.spyOn(window, 'matchMedia').mockImplementation(
				(query) =>
					({
						matches: query === '(prefers-reduced-motion: reduce)',
						media: query,
						addEventListener: jest.fn(),
						removeEventListener: jest.fn(),
					}) as unknown as MediaQueryList,
			);
			const { rerender } = render(
				<MessageWrapper>
					<ErrorMessage key="error" testId="error-test">
						Error Test
					</ErrorMessage>
				</MessageWrapper>,
			);

			rerender(<MessageWrapper>{null}</MessageWrapper>);

			expect(screen.queryByTestId('error-test')).not.toBeInTheDocument();
		});

		it('applies shared message motion to helper and valid messages when the gate is on', () => {
			passGate(inputMotionGate);
			render(
				<MessageWrapper>
					<HelperMessage testId="helper-test">Helper Test</HelperMessage>
					<ValidMessage testId="valid-test">Valid Test</ValidMessage>
				</MessageWrapper>,
			);

			expect(screen.getByTestId('helper-test-motion')).toHaveCompiledCss(
				'animation',
				expandAnimation,
			);
			expect(screen.getByTestId('valid-test-motion')).toHaveCompiledCss(
				'animation',
				expandAnimation,
			);
		});
	});
});
