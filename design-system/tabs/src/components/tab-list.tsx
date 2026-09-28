/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type AnimationEventHandler,
	Children,
	createRef,
	type KeyboardEvent,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';

import { css, jsx } from '@compiled/react';

import { useIsReducedMotion } from '@atlaskit/motion/use-is-reduced-motion';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';

import { TabContext } from '../internal/tab-context';
import {
	TabMotionContext,
	type TabMotionDirection,
	type TabMotionState,
} from '../internal/tab-motion-context';
import { type TabListProps } from '../types';
import useTabList from '../use-tab-list';

const baseStyles = css({
	display: 'flex',
	position: 'relative',
	paddingBlockEnd: token('space.0'),
	paddingBlockStart: token('space.0'),
	paddingInlineEnd: token('space.0'),
	paddingInlineStart: token('space.0'),
});

const tabListStyles = css({
	fontWeight: token('font.weight.medium'),
	marginInlineStart: token('space.negative.100'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/design-system/no-nested-styles
	'& [role="tab"]': {
		margin: 0,
		position: 'relative',
		borderRadius: token('radius.medium', '6px'),
		color: token('color.text.subtle'),
		cursor: 'pointer',
		overflow: 'hidden',
		paddingBlockEnd: token('space.075'),
		paddingBlockStart: token('space.075'),
		paddingInlineEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		'&:hover': {
			// TODO: interaction states will be reviewed in DSP-1438
			color: token('color.text.subtle'),
			'&::after': {
				width: 'inherit',
				height: 0,
				margin: 0,
				position: 'absolute',
				borderBlockEnd: `${token('border.width.selected')} solid ${token('color.border')}`,
				content: '""',
				insetBlockEnd: 0,
				insetInlineEnd: token('space.100'),
				insetInlineStart: token('space.100'),
			},
		},
		'&:active': {
			// TODO: interaction states will be reviewed in DSP-1438
			color: token('color.text'),
			'&::after': {
				width: 'inherit',
				height: 0,
				margin: 0,
				position: 'absolute',
				borderBlockEnd: `${token('border.width.selected')} solid ${token('color.border')}`,
				content: '""',
				insetBlockEnd: 0,
				insetInlineEnd: token('space.100'),
				insetInlineStart: token('space.100'),
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/design-system/no-nested-styles
		'&[aria-selected="true"]': {
			color: token('color.text.selected'),
			'&::after': {
				width: 'inherit',
				height: 0,
				margin: 0,
				position: 'absolute',
				// This line is a border so it is visible in high contrast mode
				borderBlockEnd: `${token('border.width.selected')} solid ${token('color.border.selected')}`,
				content: '""',
				insetBlockEnd: 0,
				insetInlineEnd: token('space.100'),
				insetInlineStart: token('space.100'),
			},
			'&:hover': {
				color: token('color.text.selected'),
				'&::after': {
					borderBlockEnd: `${token('border.width.selected')} solid ${token(
						'color.border.selected',
					)}`,
				},
			},
		},
	},
	'&::before': {
		width: 'inherit',
		height: token('border.width'),
		margin: 0,
		position: 'absolute',
		// This line is not a border so the selected line is visible in high contrast mode
		backgroundColor: token('color.border'),
		content: '""',
		insetBlockEnd: 0,
		insetInlineEnd: 0,
		insetInlineStart: token('space.100'),
	},
});

const tabListMotionStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/design-system/no-nested-styles
	'& [role="tab"]': {
		transition: token('motion.tab'),
		'&::before': {
			width: 'inherit',
			height: 0,
			margin: 0,
			position: 'absolute',
			borderBlockEnd: `${token('border.width.selected')} solid ${token('color.border')}`,
			content: '""',
			insetBlockEnd: 0,
			insetInlineEnd: token('space.100'),
			insetInlineStart: token('space.100'),
			opacity: 0,
			pointerEvents: 'none',
			transition: token('motion.tab'),
		},
		'&:hover::before': {
			opacity: 1,
		},
		'&:active::before': {
			opacity: 1,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&[aria-selected="false"]:not([data-motion-state="exiting"]):hover::after, &[aria-selected="false"]:not([data-motion-state="exiting"]):active::after':
			{
				content: 'none',
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&[aria-selected="true"]:active': {
			color: token('color.text.selected'),
			'&::after': {
				borderBlockEnd: `${token('border.width.selected')} solid ${token('color.border.selected')}`,
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&[data-motion-state]::after': {
			width: 'inherit',
			height: 0,
			margin: 0,
			position: 'absolute',
			zIndex: 1,
			borderBlockEnd: `${token('border.width.selected')} solid ${token('color.border.selected')}`,
			content: '""',
			insetBlockEnd: 0,
			insetInlineEnd: token('space.100'),
			insetInlineStart: token('space.100'),
			pointerEvents: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&[data-motion-state="entering"][data-motion-direction="right"]::after': {
			animation: token('motion.tab.indicator.enter.left'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&[data-motion-state="entering"][data-motion-direction="left"]::after': {
			animation: token('motion.tab.indicator.enter.right'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&[data-motion-state="exiting"][data-motion-direction="right"]::after': {
			animation: token('motion.tab.indicator.exit.right'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&[data-motion-state="exiting"][data-motion-direction="left"]::after': {
			animation: token('motion.tab.indicator.exit.left'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Direction-aware motion requires matching the inherited writing direction
		'&:dir(rtl)[data-motion-state="entering"][data-motion-direction="right"]::after': {
			animation: token('motion.tab.indicator.enter.right'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Direction-aware motion requires matching the inherited writing direction
		'&:dir(rtl)[data-motion-state="entering"][data-motion-direction="left"]::after': {
			animation: token('motion.tab.indicator.enter.left'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Direction-aware motion requires matching the inherited writing direction
		'&:dir(rtl)[data-motion-state="exiting"][data-motion-direction="right"]::after': {
			animation: token('motion.tab.indicator.exit.left'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Direction-aware motion requires matching the inherited writing direction
		'&:dir(rtl)[data-motion-state="exiting"][data-motion-direction="left"]::after': {
			animation: token('motion.tab.indicator.exit.right'),
		},
	},
	'@media (prefers-reduced-motion: reduce)': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& [role="tab"]': {
			transition: 'none',
			'&::before': {
				transition: 'none',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&[data-motion-state][data-motion-direction]::after': {
				animationName: 'none',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Direction-aware motion requires matching the inherited writing direction
			'&:dir(rtl)[data-motion-state][data-motion-direction]::after': {
				animationName: 'none',
			},
		},
	},
});

type TabMotionSelection = {
	direction: TabMotionDirection;
	exits: ReadonlyMap<number, TabMotionDirection>;
	isReducedMotion: boolean;
	selected: number;
	selectedState: Exclude<TabMotionState, 'exiting'>;
};

const getSelectionDirection = (previous: number, next: number): TabMotionDirection =>
	next > previous ? 'right' : 'left';

const getInitialMotionSelection = (
	selected: number,
	isReducedMotion: boolean,
): TabMotionSelection => ({
	direction: 'right',
	exits: new Map(),
	isReducedMotion,
	selected,
	selectedState: isReducedMotion ? 'visible' : 'entering',
});

const reconcileMotionSelection = (
	motionSelection: TabMotionSelection,
	selected: number,
	isReducedMotion: boolean,
): TabMotionSelection => {
	if (isReducedMotion) {
		if (
			motionSelection.isReducedMotion &&
			motionSelection.selected === selected &&
			motionSelection.selectedState === 'visible' &&
			motionSelection.exits.size === 0
		) {
			return motionSelection;
		}

		return {
			direction:
				motionSelection.selected === selected
					? motionSelection.direction
					: getSelectionDirection(motionSelection.selected, selected),
			exits: new Map(),
			isReducedMotion: true,
			selected,
			selectedState: 'visible',
		};
	}

	let currentSelection = motionSelection;
	if (currentSelection.isReducedMotion) {
		currentSelection = {
			...currentSelection,
			isReducedMotion: false,
		};
	}

	if (currentSelection.selected === selected) {
		return currentSelection;
	}

	const direction = getSelectionDirection(currentSelection.selected, selected);
	const exits = new Map(currentSelection.exits);
	exits.set(currentSelection.selected, direction);
	exits.delete(selected);

	return {
		direction,
		exits,
		isReducedMotion: false,
		selected,
		selectedState: 'entering',
	};
};

const isTabMotionDirection = (value: string | null): value is TabMotionDirection =>
	value === 'left' || value === 'right';

const isTabMotionState = (value: string | null): value is TabMotionState =>
	value === 'entering' || value === 'exiting' || value === 'visible';

const isMatchingMotion = (
	motionSelection: TabMotionSelection,
	index: number,
	state: TabMotionState,
	direction: TabMotionDirection,
): boolean => {
	if (index === motionSelection.selected) {
		return state === motionSelection.selectedState && direction === motionSelection.direction;
	}

	return state === 'exiting' && motionSelection.exits.get(index) === direction;
};

const TabMotionProvider = ({
	children,
	length,
	selected,
}: {
	children: (onAnimationEndCapture: AnimationEventHandler<HTMLDivElement>) => ReactNode;
	length: number;
	selected: number;
}) => {
	const prefersReducedMotion = useIsReducedMotion();
	const [canUseReducedMotion, setCanUseReducedMotion] = useState(false);
	useEffect(() => {
		if (prefersReducedMotion) {
			setCanUseReducedMotion(true);
		}
	}, [prefersReducedMotion]);
	const isReducedMotion = canUseReducedMotion && prefersReducedMotion;
	const [motionSelection, setMotionSelection] = useState<TabMotionSelection>(() =>
		getInitialMotionSelection(selected, isReducedMotion),
	);
	const renderedMotionSelection = reconcileMotionSelection(
		motionSelection,
		selected,
		isReducedMotion,
	);

	if (renderedMotionSelection !== motionSelection) {
		setMotionSelection(renderedMotionSelection);
	}

	const getTabMotionAttributes = useCallback(
		(index: number) => {
			if (index === renderedMotionSelection.selected) {
				return {
					'data-motion-capable': 'true' as const,
					'data-motion-direction': renderedMotionSelection.direction,
					'data-motion-state': renderedMotionSelection.selectedState,
				};
			}

			const exitDirection = renderedMotionSelection.exits.get(index);
			if (exitDirection !== undefined) {
				return {
					'data-motion-capable': 'true' as const,
					'data-motion-direction': exitDirection,
					'data-motion-state': 'exiting' as const,
				};
			}

			return { 'data-motion-capable': 'true' as const };
		},
		[renderedMotionSelection],
	);
	const motionContextValue = useMemo(() => ({ getTabMotionAttributes }), [getTabMotionAttributes]);
	const onAnimationEndCapture = useCallback<AnimationEventHandler<HTMLDivElement>>(
		(event) => {
			const target = event.target;
			if (
				!(target instanceof HTMLElement) ||
				!target.matches('[role="tab"]') ||
				event.pseudoElement !== '::after'
			) {
				return;
			}

			const position = Number(target.getAttribute('aria-posinset'));
			const state = target.getAttribute('data-motion-state');
			const direction = target.getAttribute('data-motion-direction');
			if (
				!Number.isInteger(position) ||
				position < 1 ||
				position > length ||
				!isTabMotionState(state) ||
				!isTabMotionDirection(direction)
			) {
				return;
			}

			const index = position - 1;
			if (!isMatchingMotion(renderedMotionSelection, index, state, direction)) {
				return;
			}

			setMotionSelection((currentSelection) => {
				const reconciledSelection = reconcileMotionSelection(
					currentSelection,
					selected,
					isReducedMotion,
				);
				if (!isMatchingMotion(reconciledSelection, index, state, direction)) {
					return reconciledSelection;
				}

				if (state === 'entering') {
					return {
						...reconciledSelection,
						selectedState: 'visible',
					};
				}

				if (state === 'exiting') {
					const exits = new Map(reconciledSelection.exits);
					exits.delete(index);
					return {
						...reconciledSelection,
						exits,
					};
				}

				return reconciledSelection;
			});
		},
		[isReducedMotion, length, renderedMotionSelection, selected],
	);

	return (
		<TabMotionContext.Provider value={motionContextValue}>
			{children(onAnimationEndCapture)}
		</TabMotionContext.Provider>
	);
};

/**
 * __TabList__
 *
 * A TabList groups `Tab` components together.
 *
 * - [Examples](https://atlassian.design/components/tabs/examples)
 * - [Code](https://atlassian.design/components/tabs/code)
 * - [Usage](https://atlassian.design/components/tabs/usage)
 */
const TabList: ({ children }: TabListProps) => JSX.Element = ({ children }: TabListProps) => {
	const { tabsId, selected, onChange } = useTabList();
	const isMotionUpliftEnabled = fg('platform-dst-motion-uplift-tab');

	const ref = createRef<HTMLDivElement>();

	// Don't include any conditional children
	const childrenArray = Children.toArray(children).filter(Boolean);
	const length = childrenArray.length;

	const selectTabByIndex = useCallback(
		(index: number) => {
			const newSelectedNode: HTMLElement | undefined | null = ref.current?.querySelector(
				`[id='${tabsId}-${index}']`,
			);

			if (newSelectedNode) {
				newSelectedNode.focus();
			}
			onChange(index);
		},
		[tabsId, ref, onChange],
	);

	const onKeyDown = useCallback(
		(e: KeyboardEvent<HTMLElement>) => {
			if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) {
				return;
			}

			// preventing horizontal or vertical scroll
			e.preventDefault();
			const lastTabIndex = length - 1;

			if (['Home', 'End'].includes(e.key)) {
				const newSelected = e.key === 'Home' ? 0 : lastTabIndex;
				selectTabByIndex(newSelected);
				return;
			}

			// We use aria-posinset so we don't rely on the selected variable
			// If we used the selected variable this would regenerate each time
			// and create an unstable reference
			const selectedIndex = parseInt(e.currentTarget.getAttribute('aria-posinset') || '0') - 1;

			const modifier = e.key === 'ArrowRight' ? 1 : -1;
			let newSelected = selectedIndex + modifier;

			if (newSelected < 0 || newSelected >= length) {
				// Cycling focus to move from last to first and from first to last
				newSelected = newSelected < 0 ? lastTabIndex : 0;
			}

			selectTabByIndex(newSelected);
		},
		[length, selectTabByIndex],
	);

	// Memoized so the function isn't recreated each time
	const getTabWithContext = useCallback(
		({ tab, isSelected, index }: { tab: ReactNode; isSelected: boolean; index: number }) => (
			<TabContext.Provider
				value={{
					onClick: () => onChange(index),
					onKeyDown,
					'aria-setsize': length,
					role: 'tab',
					id: `${tabsId}-${index}`,
					'aria-posinset': index + 1,
					'aria-selected': isSelected,
					'aria-controls': `${tabsId}-${index}-tab`,
					tabIndex: isSelected ? 0 : -1,
				}}
				key={index}
			>
				{tab}
			</TabContext.Provider>
		),
		[length, onKeyDown, onChange, tabsId],
	);

	const tabs = childrenArray.map((child, index) =>
		getTabWithContext({
			tab: child,
			index,
			isSelected: index === selected,
		}),
	);

	if (!isMotionUpliftEnabled) {
		return (
			<div role="tablist" ref={ref} css={[baseStyles, tabListStyles]}>
				{tabs}
			</div>
		);
	}

	return (
		// Only styles that affect the TabList itself have been applied via primitives.
		// The other styles applied through the CSS prop are there for styling children
		// through inheritance. This is important for custom cases that use the useTab(),
		// which applies accessibility atributes that we use as a styling hook.
		<TabMotionProvider length={length} selected={selected}>
			{(onAnimationEndCapture) => (
				<div
					role="tablist"
					ref={ref}
					css={[baseStyles, tabListStyles, tabListMotionStyles]}
					onAnimationEndCapture={onAnimationEndCapture}
				>
					{tabs}
				</div>
			)}
		</TabMotionProvider>
	);
};

export default TabList;
