import React from 'react';

import { act } from '@atlassian/testing-library/act';
import { fireEvent } from '@atlassian/testing-library/fire-event';
import { render as rtlRender } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import Avatar from '@atlaskit/avatar/avatar';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import TeamAvatar from '@atlaskit/teams-avatar/teams-avatar';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { default as AvatarTag } from '../../../tag-new/avatar-tag';

const render = (component: React.ReactNode) => {
	return rtlRender(<React.StrictMode>{component}</React.StrictMode>);
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('AvatarTag component', () => {
	const testId = 'test-avatar-tag';

	describe('maxWidth prop', () => {
		it('should apply custom maxWidth as string', () => {
			render(
				<AvatarTag
					type="user"
					text="Custom width user"
					avatar={Avatar}
					maxWidth="250px"
					testId={testId}
					isRemovable={false}
				/>,
			);
			const tag = screen.getByTestId(testId);
			expect(tag).toHaveStyle({ maxWidth: '250px' });
		});

		it('should apply custom maxWidth as number', () => {
			render(
				<AvatarTag
					type="other"
					text="Custom width team"
					avatar={TeamAvatar}
					maxWidth={350}
					testId={testId}
					isRemovable={false}
				/>,
			);
			const tag = screen.getByTestId(testId);
			expect(tag).toHaveStyle({ maxWidth: '350px' });
		});

		it('should not apply inline style when maxWidth is not provided', () => {
			render(
				<AvatarTag
					type="user"
					text="Default width user"
					avatar={Avatar}
					testId={testId}
					isRemovable={false}
				/>,
			);
			const tag = screen.getByTestId(testId);
			expect(tag).not.toHaveAttribute('style');
		});
	});

	describe('type="user" (circular avatar)', () => {
		it('should render with circular avatar', () => {
			render(
				<AvatarTag
					type="user"
					text="Jane Smith"
					avatar={Avatar}
					testId={testId}
					isRemovable={false}
				/>,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
			// Avatar also renders the name for accessibility, so use getAllByText
			expect(screen.getAllByText('Jane Smith').length).toBeGreaterThan(0);
		});

		it('should render with remove button by default', () => {
			render(
				<AvatarTag
					type="user"
					text="Alice Williams"
					avatar={Avatar}
					removeButtonLabel="Remove"
					testId={testId}
				/>,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
			expect(screen.getByTestId(`close-button-${testId}`)).toBeInTheDocument();
		});

		it('should not render remove button when isRemovable is false', () => {
			render(
				<AvatarTag
					type="user"
					text="Charlie Brown"
					avatar={Avatar}
					isRemovable={false}
					testId={testId}
				/>,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
			expect(screen.queryByTestId(`close-button-${testId}`)).not.toBeInTheDocument();
		});

		it('should render as interactive when href is provided', () => {
			render(
				<AvatarTag
					type="user"
					text="Link Person"
					avatar={Avatar}
					href="https://atlassian.com/user/123"
					isRemovable={false}
					testId={testId}
				/>,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
		});
	});

	describe('type="other" (square avatar)', () => {
		it('should render with square avatar', () => {
			render(
				<AvatarTag
					type="other"
					text="Design System Team"
					avatar={TeamAvatar}
					testId={testId}
					isRemovable={false}
				/>,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
			expect(screen.getByText('Design System Team')).toBeInTheDocument();
		});

		it('should render with remove button', () => {
			render(
				<AvatarTag
					type="other"
					text="Engineering Team"
					avatar={TeamAvatar}
					removeButtonLabel="Remove Team"
					testId={testId}
				/>,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
			expect(screen.getByTestId(`close-button-${testId}`)).toBeInTheDocument();
		});

		it('should accept isVerified prop', () => {
			render(
				<AvatarTag
					type="other"
					text="Verified Team"
					avatar={TeamAvatar}
					isVerified={true}
					testId={testId}
					isRemovable={false}
				/>,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
			// isVerified is accepted but not visually rendered yet
		});

		it('should render as interactive when href is provided', () => {
			render(
				<AvatarTag
					type="other"
					text="Linked Team"
					avatar={TeamAvatar}
					href="https://atlassian.com/team/123"
					isRemovable={false}
					testId={testId}
				/>,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
		});
	});

	describe('type="agent" (hexagonal avatar)', () => {
		it('should render with hexagonal avatar', () => {
			render(
				<AvatarTag type="agent" text="Rovo" avatar={Avatar} testId={testId} isRemovable={false} />,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
			// Avatar also renders the name for accessibility, so use getAllByText
			expect(screen.getAllByText('Rovo').length).toBeGreaterThan(0);
		});

		it('should render with remove button', () => {
			render(
				<AvatarTag
					type="agent"
					text="AI Assistant"
					avatar={Avatar}
					removeButtonLabel="Remove Agent"
					testId={testId}
				/>,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
			expect(screen.getByTestId(`close-button-${testId}`)).toBeInTheDocument();
		});

		it('should render as interactive when href is provided', () => {
			render(
				<AvatarTag
					type="agent"
					text="Linked Agent"
					avatar={Avatar}
					href="https://atlassian.com/agent/123"
					isRemovable={false}
					testId={testId}
				/>,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
		});
	});

	describe('motion uplift', () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});

		afterEach(() => {
			act(() => {
				jest.runOnlyPendingTimers();
			});
			jest.useRealTimers();
			jest.restoreAllMocks();
		});

		it('does not animate on initial render and applies exit motion when removed', () => {
			passGate('platform-dst-motion-uplift-labels');
			render(<AvatarTag type="user" text="Motion avatar" avatar={Avatar} testId={testId} />);

			const tag = screen.getByTestId(testId);
			const tagText = screen.getByText('Motion avatar');
			expect(tag).toHaveStyle({ animation: '' });
			const visibleClassName = tag.className;
			const visibleTextClassName = tagText.className;

			act(() => {
				screen.getByTestId(`close-button-${testId}`).click();
			});

			expect(screen.queryByTestId(`close-button-${testId}`)).not.toBeInTheDocument();
			// eslint-disable-next-line jest-dom/prefer-to-have-class -- comparing complete atomic class sets verifies the compiled variant changed
			expect(tag.className).not.toBe(visibleClassName);
			// Fitting text switches to the measured clip style for exit motion and remains clipped.
			expect(tagText).not.toHaveClass(visibleTextClassName, { exact: true });

			act(() => {
				jest.runAllTimers();
			});
			expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
		});

		it('keeps ellipsis during exit when text truncates at its settled width', () => {
			passGate('platform-dst-motion-uplift-labels');
			jest.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(100);
			jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(50);
			render(
				<AvatarTag type="user" text="Truncated motion avatar" avatar={Avatar} testId={testId} />,
			);
			const tagText = screen.getByText('Truncated motion avatar');
			const settledClassName = tagText.className;

			act(() => {
				screen.getByTestId('close-button-test-avatar-tag').click();
			});

			// The settled layout truncates, so ellipsis remains stable throughout motion.
			expect(tagText).toHaveClass(settledClassName, { exact: true });
		});

		it('applies enter motion when added after its presence boundary mounts', () => {
			passGate('platform-dst-motion-uplift-labels');
			const MotionAvatarTag = ({ isVisible }: { isVisible: boolean }) => (
				<ExitingPersistence>
					{isVisible ? (
						<AvatarTag
							key="motion-avatar"
							type="user"
							text="Motion avatar"
							avatar={Avatar}
							testId={testId}
						/>
					) : null}
				</ExitingPersistence>
			);
			const { rerender } = render(<MotionAvatarTag isVisible={false} />);

			rerender(
				<React.StrictMode>
					<MotionAvatarTag isVisible />
				</React.StrictMode>,
			);

			const tag = screen.getByTestId(testId);
			// eslint-disable-next-line testing-library/no-node-access
			const motionWrapper = tag.parentElement?.parentElement;
			expect(motionWrapper).toBeInTheDocument();
			const enteringClassName = tag.className;
			const tagText = screen.getByText('Motion avatar');
			expect(tagText).not.toHaveStyle({ textOverflow: 'ellipsis' });
			const enteringTextClassName = tagText.className;

			act(() => {
				jest.runAllTimers();
			});

			// The motion timer can finish before the browser animation when playback is slowed.
			// Keep the entering and clipping styles until the wrapper animation actually ends.
			expect(tag).toHaveClass(enteringClassName, { exact: true });
			expect(tagText).toHaveClass(enteringTextClassName, { exact: true });

			fireEvent.animationEnd(motionWrapper!);

			expect(tag).not.toHaveClass(enteringClassName, { exact: true });
			expect(tagText).toHaveClass(enteringTextClassName, { exact: true });
		});
	});
});
