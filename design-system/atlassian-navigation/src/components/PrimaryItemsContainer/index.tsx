/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { useCallback, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Popup from '@atlaskit/popup';
import { type TriggerProps } from '@atlaskit/popup/types';
import { N700 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { WidthObserver } from '@atlaskit/width-detector';

import { OverflowProvider, useOverflowController } from '../../controllers/overflow';
import { type NavigationTheme } from '../../theme';
import { PrimaryDropdownButton } from '../PrimaryDropdownButton';

import { type PrimaryItemsContainerProps } from './types';

const containerStyles = css({
	display: 'flex',
	height: '100%',
	position: 'relative',
	alignItems: 'stretch',
	flexBasis: 0,
	flexGrow: 1,
	flexShrink: 0,
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > *': {
		margin: `0 ${token('space.050', '4px')}`,
		flexShrink: 0,
	},
});

const widthObserverContainerStyles = css({
	width: '100%',
	minWidth: '1px',
	margin: '0px',
	position: 'relative',
	flexShrink: 1,
});

const overflowItemsStyles = css({
	color: token('color.text', N700),
});

// Internal only
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const PrimaryItemsContainer = ({
	moreLabel,
	items,
	create: Create,
	theme,
	testId,
}: PrimaryItemsContainerProps & { theme: NavigationTheme }) => {
	const [isMoreOpen, setIsMoreOpen] = useState(false);
	const { updateWidth, visibleItems, overflowItems } = useOverflowController(items);

	const onMoreClick = useCallback(() => {
		setIsMoreOpen(!isMoreOpen);
	}, [isMoreOpen, setIsMoreOpen]);

	const onMoreClose = useCallback(() => {
		setIsMoreOpen(false);
	}, []);

	const openOverflowMenu = useCallback(() => {
		setIsMoreOpen(true);
	}, []);

	const trigger = useCallback(
		(triggerProps: TriggerProps) => (
			<PrimaryDropdownButton
				onClick={onMoreClick}
				isSelected={isMoreOpen}
				testId={testId ? `${testId}-overflow-menu-trigger` : 'overflow-menu-trigger'}
				{...triggerProps}
			>
				{moreLabel}
			</PrimaryDropdownButton>
		),
		[moreLabel, onMoreClick, isMoreOpen, testId],
	);

	const content = useCallback(
		() => (
			<OverflowProvider
				isVisible={false}
				openOverflowMenu={openOverflowMenu}
				closeOverflowMenu={onMoreClose}
			>
				<div css={overflowItemsStyles}>{overflowItems}</div>
			</OverflowProvider>
		),
		// Overflow items has an unstable reference - so we will only recalculate
		// content if `overflowItems` length changes.
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[overflowItems.length, openOverflowMenu, onMoreClose],
	);

	return (
		<div css={containerStyles} data-testid={testId && `${testId}-primary-actions`} role="list">
			<OverflowProvider
				isVisible
				openOverflowMenu={openOverflowMenu}
				closeOverflowMenu={onMoreClose}
			>
				{visibleItems}
			</OverflowProvider>

			{overflowItems.length > 0 && (
				<Popup
					shouldRenderToParent
					placement="bottom-start"
					content={content}
					isOpen={isMoreOpen}
					onClose={onMoreClose}
					trigger={trigger}
					testId={testId ? `${testId}-overflow-menu-popup` : 'overflow-menu-popup'}
				/>
			)}

			{Create && <Create />}

			<div css={widthObserverContainerStyles}>
				<WidthObserver offscreen={true} setWidth={updateWidth} />
			</div>
		</div>
	);
};
