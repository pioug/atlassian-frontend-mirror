import React from 'react';

import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import { Text } from '@atlaskit/primitives/compiled';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { ffTest } from '@atlassian/feature-flags-test-utils/test-runner';
import { screen } from '@atlassian/testing-library/screen';
import {
	act,
	fireEvent,
	render as rtlRender,
} from '@atlassian/testing-library/testing-library/react';

import { colorMapping } from '../../../tag-new/color-mapping';
import { default as TagNew } from '../../../tag-new/tag-new';
import { default as SimpleTag } from '../../internal/simple';

const render = (component: React.ReactNode) => {
	return rtlRender(<React.StrictMode>{component}</React.StrictMode>);
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('TagNew component (UI uplift)', () => {
	const testId = 'test-tag-new';

	describe('new color names', () => {
		it('should render with "teal" color', () => {
			render(<TagNew color="teal" text="Teal Tag" testId={testId} />);
			const tag = screen.getByTestId(testId);
			expect(tag).toBeInTheDocument();
			expect(tag).toHaveTextContent('Teal Tag');
		});

		it('should default to "gray" color', () => {
			render(<TagNew text="Default Tag" testId={testId} />);
			const tag = screen.getByTestId(testId);
			expect(tag).toBeInTheDocument();
			expect(tag).toHaveTextContent('Default Tag');
		});

		it('should normalize string arrays into a single rendered string', () => {
			render(<TagNew text={['hello', ' ', 'world']} testId={testId} isRemovable={false} />);
			const tag = screen.getByTestId(testId);
			expect(tag).toHaveTextContent('hello world');
		});
	});

	describe('color mapping (old to new)', () => {
		it('should map "standard" to "gray"', () => {
			expect(colorMapping.standard).toBe('gray');
		});

		it('should map "grey" to "gray"', () => {
			expect(colorMapping.grey).toBe('gray');
		});

		it('should map "blueLight" to "blue"', () => {
			expect(colorMapping.blueLight).toBe('blue');
		});
	});

	describe('slots and elements', () => {
		it('should render with elemBefore', () => {
			render(
				<TagNew
					text="Tag with before"
					elemBefore={<Text testId="before-element">🚀</Text>}
					testId={testId}
				/>,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
			expect(screen.getByTestId('before-element')).toBeInTheDocument();
		});
	});

	describe('maxWidth prop', () => {
		it('should apply custom maxWidth as string', () => {
			render(<TagNew text="Custom width tag" maxWidth="200px" testId={testId} />);
			const tag = screen.getByTestId(testId);
			expect(tag).toHaveStyle({ maxWidth: '200px' });
		});

		it('should apply custom maxWidth as number', () => {
			render(<TagNew text="Custom width tag" maxWidth={300} testId={testId} />);
			const tag = screen.getByTestId(testId);
			expect(tag).toHaveStyle({ maxWidth: '300px' });
		});

		it('should not apply inline style when maxWidth is not provided', () => {
			render(<TagNew text="Default width tag" testId={testId} isRemovable={false} />);
			const tag = screen.getByTestId(testId);
			expect(tag).not.toHaveAttribute('style');
		});
	});

	describe('trailingMetric', () => {
		it('should render a badge when trailingMetric is provided', () => {
			render(<TagNew text="Comments" trailingMetric={24} testId={testId} isRemovable={false} />);
			expect(screen.getByTestId(`${testId}--metric`)).toBeInTheDocument();
			expect(screen.getByText('24')).toBeInTheDocument();
		});

		it('should render a badge with string trailingMetric', () => {
			render(<TagNew text="Updates" trailingMetric="99+" testId={testId} isRemovable={false} />);
			expect(screen.getByTestId(`${testId}--metric`)).toBeInTheDocument();
			expect(screen.getByText('99+')).toBeInTheDocument();
		});

		it('should not render a badge when trailingMetric is undefined', () => {
			render(
				<TagNew text="No Metric" trailingMetric={undefined} testId={testId} isRemovable={false} />,
			);
			expect(screen.queryByTestId(`${testId}--metric`)).not.toBeInTheDocument();
		});

		it('should not render a badge when trailingMetric is an empty string', () => {
			render(<TagNew text="No Metric" trailingMetric="" testId={testId} isRemovable={false} />);
			expect(screen.queryByTestId(`${testId}--metric`)).not.toBeInTheDocument();
		});

		it('should render a badge alongside the remove button when removable', () => {
			render(
				<TagNew
					text="Removable with metric"
					trailingMetric={5}
					testId={testId}
					removeButtonLabel="Remove"
				/>,
			);
			expect(screen.getByTestId(`${testId}--metric`)).toBeInTheDocument();
			expect(screen.getByText('5')).toBeInTheDocument();
			expect(screen.getByTestId(`close-button-${testId}`)).toBeInTheDocument();
		});
	});

	describe('removable behavior', () => {
		it('should render with remove button by default', () => {
			render(<TagNew text="Removable Tag" removeButtonLabel="Remove" testId={testId} />);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
			expect(screen.getByTestId(`close-button-${testId}`)).toBeInTheDocument();
		});

		it('should not render remove button when isRemovable is false', () => {
			render(<TagNew text="Non-removable Tag" isRemovable={false} testId={testId} />);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
			expect(screen.queryByTestId(`close-button-${testId}`)).not.toBeInTheDocument();
		});

		it('should render as interactive when href is provided', () => {
			render(
				<TagNew text="Link Tag" testId={testId} href="https://atlassian.com" isRemovable={false} />,
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
			const getComputedStyleSpy = jest.spyOn(window, 'getComputedStyle');
			const onAfterRemoveAction = jest.fn();
			const { container } = render(
				<TagNew
					text="Motion tag"
					removeButtonLabel="Remove"
					testId={testId}
					onAfterRemoveAction={onAfterRemoveAction}
				/>,
			);
			const tag = screen.getByTestId(testId);
			// eslint-disable-next-line testing-library/no-node-access
			const motionWrapper = tag.parentElement?.parentElement;
			const removeButton = screen.getByTestId(`close-button-${testId}`);
			const tagText = screen.getByText('Motion tag');

			// The animated tag sits inside a tag-sized wrapper so percentage widths resolve locally.
			// eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
			expect(container.firstElementChild).toContainElement(tag);
			expect(tag).toContainElement(removeButton);
			expect(tag).toHaveStyle({ animation: '' });
			const visibleClassName = tag.className;
			const visibleTextClassName = tagText.className;

			act(() => {
				removeButton.click();
			});

			expect(screen.queryByTestId(`close-button-${testId}`)).not.toBeInTheDocument();
			// eslint-disable-next-line jest-dom/prefer-to-have-class -- comparing complete atomic class sets verifies the compiled variant changed
			expect(tag.className).not.toBe(visibleClassName);
			// Persistence reads timing from the wrapper that owns the grid exit animation.
			expect(getComputedStyleSpy).toHaveBeenCalledWith(motionWrapper);
			// Fitting text switches to the measured clip style for exit motion and remains clipped.
			expect(tagText).not.toHaveClass(visibleTextClassName, { exact: true });

			act(() => {
				jest.runAllTimers();
			});

			expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
			expect(screen.queryByTestId(`close-button-${testId}`)).not.toBeInTheDocument();
			expect(onAfterRemoveAction).toHaveBeenCalledWith('Motion tag');
		});

		it('applies enter motion when added after its presence boundary mounts', () => {
			passGate('platform-dst-motion-uplift-labels');
			const MotionTag = ({ isVisible }: { isVisible: boolean }) => (
				<ExitingPersistence>
					{isVisible ? <TagNew key="motion-tag" text="Motion tag" testId={testId} /> : null}
				</ExitingPersistence>
			);
			const { rerender } = render(<MotionTag isVisible={false} />);

			rerender(
				<React.StrictMode>
					<MotionTag isVisible />
				</React.StrictMode>,
			);

			const tag = screen.getByTestId(testId);
			// eslint-disable-next-line testing-library/no-node-access
			const motionWrapper = tag.parentElement?.parentElement;
			expect(motionWrapper).toBeInTheDocument();
			const enteringClassName = tag.className;
			const tagText = screen.getByText('Motion tag');
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

		it('keeps ellipsis during exit when text truncates at its settled width', () => {
			passGate('platform-dst-motion-uplift-labels');
			jest.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(100);
			jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(50);
			render(<TagNew text="Truncated motion tag" testId={testId} />);
			const tagText = screen.getByText('Truncated motion tag');
			const settledClassName = tagText.className;

			act(() => {
				screen.getByTestId('close-button-test-tag-new').click();
			});

			// The settled layout truncates, so ellipsis remains stable throughout motion.
			expect(tagText).toHaveClass(settledClassName, { exact: true });
		});

		it('removes immediately and completes the callback when reduced motion is preferred', () => {
			passGate('platform-dst-motion-uplift-labels');
			jest.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);
			const onAfterRemoveAction = jest.fn();
			render(
				<TagNew
					text="Reduced motion tag"
					testId={testId}
					onAfterRemoveAction={onAfterRemoveAction}
				/>,
			);

			expect(screen.getByTestId(testId)).toHaveStyle({ animation: '' });
			act(() => {
				screen.getByTestId(`close-button-${testId}`).click();
			});

			expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
			expect(onAfterRemoveAction).toHaveBeenCalledWith('Reduced motion tag');
		});
	});
});

describe('swatch a11y attributes', () => {
	const testId = 'test-tag-swatch';

	it('should set aria-label and role on the swatch span', () => {
		render(
			<TagNew
				aria-label="Epic"
				color="purple"
				isRemovable={false}
				swatchBefore
				swatchBeforeLabel="Epic"
				swatchBeforeRole="img"
				testId={testId}
				text="Epic Tag"
			/>,
		);
		const swatch = screen.getByRole('img', { name: 'Epic' });
		expect(swatch).toBeInTheDocument();
	});
});

describe('SimpleTag with feature flag', () => {
	const testId = 'test-simple-tag';

	ffTest.off(
		'platform-dst-lozenge-tag-badge-visual-uplifts',
		'uses original SimpleTag implementation when flag is off',
		() => {
			it('should render original SimpleTag component', () => {
				render(<SimpleTag color="blue" text="Original Tag" testId={testId} />);
				const tag = screen.getByTestId(testId);
				expect(tag).toBeInTheDocument();
				expect(tag).toHaveTextContent('Original Tag');
			});
		},
	);

	ffTest.on(
		'platform-dst-lozenge-tag-badge-visual-uplifts',
		'uses TagNew implementation when flag is on',
		() => {
			it('should render TagNew component', () => {
				render(<SimpleTag color="blue" text="New Tag" testId={testId} />);
				const tag = screen.getByTestId(testId);
				expect(tag).toBeInTheDocument();
				expect(tag).toHaveTextContent('New Tag');
			});

			it('should map all color appearances correctly', () => {
				const colors: Array<'standard' | 'blue' | 'red' | 'green' | 'yellow' | 'purple'> = [
					'standard',
					'blue',
					'red',
					'green',
					'yellow',
					'purple',
				];

				colors.forEach((color) => {
					const { unmount } = render(
						<SimpleTag color={color} text={color} testId={`${testId}-${color}`} />,
					);
					expect(screen.getByTestId(`${testId}-${color}`)).toBeInTheDocument();
					unmount();
				});
			});
		},
	);
});
