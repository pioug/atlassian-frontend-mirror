/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Children, createRef, type KeyboardEvent, type ReactNode, useCallback } from 'react';

import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { B400, B500, N30, N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { useTabList } from '../hooks';
import { TabContext } from '../internal/context';
import { type TabListProps } from '../types';

const baseStyles = css({
	display: 'flex',
	padding: token('space.0', '0px'),
	position: 'relative',
});

const tabListStyles = css({
	fontWeight: token('font.weight.medium', '500'),
	marginInlineStart: token('space.negative.100', '-8px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/design-system/no-nested-styles
	'& [role="tab"]': {
		margin: 0,
		padding: `${token('space.075', '6px')} ${token('space.100', '8px')}`,
		position: 'relative',
		color: token('color.text.subtle', N500),
		cursor: 'pointer',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		'&:hover': {
			// TODO: interaction states will be reviewed in DSP-1438
			color: token('color.text.subtle', B400),
			'&::after': {
				width: 'inherit',
				height: 0,
				margin: 0,
				position: 'absolute',
				borderBlockEnd: `${token('border.width.indicator')} solid ${token('color.border', 'transparent')}`,
				content: '""',
				insetBlockEnd: 0,
				insetInlineEnd: token('space.100', '8px'),
				insetInlineStart: token('space.100', '8px'),
			},
		},
		'&:active': {
			// TODO: interaction states will be reviewed in DSP-1438
			color: token('color.text', B500),
			'&::after': {
				width: 'inherit',
				height: 0,
				margin: 0,
				position: 'absolute',
				borderBlockEnd: `${token('border.width.indicator')} solid ${token('color.border', 'transparent')}`,
				content: '""',
				insetBlockEnd: 0,
				insetInlineEnd: token('space.100', '8px'),
				insetInlineStart: token('space.100', '8px'),
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/design-system/no-nested-styles
		'&[aria-selected="true"]': {
			color: token('color.text.selected', B400),
			'&::after': {
				width: 'inherit',
				height: 0,
				margin: 0,
				position: 'absolute',
				// This line is a border so it is visible in high contrast mode
				borderBlockEnd: `${token('border.width.indicator')} solid ${token('color.border.selected', B400)}`,
				content: '""',
				insetBlockEnd: 0,
				insetInlineEnd: token('space.100', '8px'),
				insetInlineStart: token('space.100', '8px'),
			},
		},
	},
	'&::before': {
		width: 'inherit',
		height: token('border.width'),
		margin: 0,
		position: 'absolute',
		// This line is not a border so the selected line is visible in high contrast mode
		backgroundColor: token('color.border', N30),
		content: '""',
		insetBlockEnd: 0,
		insetInlineEnd: 0,
		insetInlineStart: token('space.100', '8px'),
	},
});

const tabListStylesOld = css({
	fontWeight: token('font.weight.medium', '500'),
	marginInlineStart: token('space.negative.100', '-8px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/design-system/no-nested-styles
	'& [role="tab"]': {
		margin: 0,
		padding: `${token('space.075', '6px')} ${token('space.100', '8px')}`,
		position: 'relative',
		color: token('color.text.subtle', N500),
		cursor: 'pointer',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		'&:hover': {
			// TODO: interaction states will be reviewed in DSP-1438
			color: token('color.text.subtle', B400),
			'&::after': {
				width: 'inherit',
				height: 0,
				margin: 0,
				position: 'absolute',
				borderBlockEnd: `${token('border.width.outline', '2px')} solid ${token('color.border', 'transparent')}`,
				borderRadius: token('border.radius.050', '2px'),
				content: '""',
				insetBlockEnd: 0,
				insetInlineEnd: token('space.100', '8px'),
				insetInlineStart: token('space.100', '8px'),
			},
		},
		'&:active': {
			// TODO: interaction states will be reviewed in DSP-1438
			color: token('color.text', B500),
			'&::after': {
				width: 'inherit',
				height: 0,
				margin: 0,
				position: 'absolute',
				borderBlockEnd: `${token('border.width.outline', '2px')} solid ${token('color.border', 'transparent')}`,
				borderRadius: token('border.radius.050', '2px'),
				content: '""',
				insetBlockEnd: 0,
				insetInlineEnd: token('space.100', '8px'),
				insetInlineStart: token('space.100', '8px'),
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/design-system/no-nested-styles
		'&[aria-selected="true"]': {
			color: token('color.text.selected', B400),
			'&::after': {
				width: 'inherit',
				height: 0,
				margin: 0,
				position: 'absolute',
				// This line is a border so it is visible in high contrast mode
				borderBlockEnd: `${token('border.width.outline', '2px')} solid ${token('color.border.selected', B400)}`,
				borderRadius: token('border.radius.050', '2px'),
				content: '""',
				insetBlockEnd: 0,
				insetInlineEnd: token('space.100', '8px'),
				insetInlineStart: token('space.100', '8px'),
			},
		},
	},
	'&::before': {
		width: 'inherit',
		height: token('border.width.outline', '2px'),
		margin: 0,
		position: 'absolute',
		// This line is not a border so the selected line is visible in high contrast mode
		backgroundColor: token('color.border', N30),
		borderRadius: token('border.radius.050', '2px'),
		content: '""',
		insetBlockEnd: 0,
		insetInlineEnd: 0,
		insetInlineStart: token('space.100', '8px'),
	},
});

/**
 * __TabList__
 *
 * A TabList groups `Tab` components together.
 *
 * - [Examples](https://atlassian.design/components/tabs/examples)
 * - [Code](https://atlassian.design/components/tabs/code)
 * - [Usage](https://atlassian.design/components/tabs/usage)
 */
const TabList = ({ children }: TabListProps) => {
	const { tabsId, selected, onChange } = useTabList();

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

	return (
		// Only styles that affect the TabList itself have been applied via primitives.
		// The other styles applied through the CSS prop are there for styling children
		// through inheritance. This is important for custom cases that use the useTab(),
		// which applies accessibility atributes that we use as a styling hook.
		<div
			role="tablist"
			ref={ref}
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
			css={[baseStyles, fg('platform-component-visual-refresh') ? tabListStyles : tabListStylesOld]}
		>
			{childrenArray.map((child, index) =>
				getTabWithContext({
					tab: child,
					index,
					isSelected: index === selected,
				}),
			)}
		</div>
	);
};

export default TabList;
