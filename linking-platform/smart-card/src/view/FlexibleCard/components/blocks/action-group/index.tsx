/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useMemo, useState } from 'react';

import { css, jsx } from '@compiled/react';
import { FormattedMessage } from 'react-intl';
import { di } from 'react-magnetic-di';

import { type Appearance } from '@atlaskit/button';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import DropdownMenu from '@atlaskit/dropdown-menu';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { ActionName, CardDisplay, SmartLinkSize } from '../../../../../constants';
import { messages } from '../../../../../messages';
import {
	useFlexibleUiContext,
	useFlexibleUiOptionContext,
} from '../../../../../state/flexible-ui-context';
import { isBlockCardRovoActionExperimentEnabled } from '../../../../../state/hooks/use-block-card-rovo-action-experiment';
import useRovoConfig from '../../../../../state/hooks/use-rovo-config';
import { RovoChatPromptKey } from '../../../../common/rovo-chat-utils';
import { sizeToButtonSpacing } from '../../utils';
import type { ActionItem } from '../types';
import { filterActionItems } from '../utils';

import ActionGroupItem from './action-group-item';
import { type ActionGroupProps } from './types';

const styles = css({
	display: 'inline-flex',
	'> div': {
		alignItems: 'center',
		'button:focus-visible': {
			outlineOffset: token('space.negative.025'),
		},
	},
});

const FULL_ACTIONS_SIZE = 450;
const REDUCED_ACTIONS_SIZE = 360;
const ICON_ONLY_ACTIONS_SIZE = 200;
const OVERFLOW_ONLY_ACTIONS_SIZE = 100;

const renderActionItems = (
	items: ActionItem[] = [],
	size: SmartLinkSize = SmartLinkSize.Medium,
	appearance?: Appearance,
	asDropDownItems?: boolean,
	onActionItemClick?: () => void,
): React.ReactElement[] | undefined =>
	items.map((item, idx) => (
		<ActionGroupItem
			item={item}
			key={idx}
			size={size}
			appearance={appearance}
			asDropDownItems={asDropDownItems}
			onActionItemClick={onActionItemClick}
		/>
	));

/**
 * Creates a group of Action components. Accepts an array of Actions, in addition to some styling
 * preferences.
 * @internal
 * @param {ActionGroupProps} ActionGroupProps
 * @see Action
 */
const ActionGroup = ({
	items = [],
	size = SmartLinkSize.Medium,
	appearance,
	visibleButtonsNum = 2,
	onDropdownOpenChange,
	containerWidth = Infinity,
}: ActionGroupProps): JSX.Element | null => {
	di(DropdownMenu);

	const context = useFlexibleUiContext();
	const ui = useFlexibleUiOptionContext();
	const { product } = useRovoConfig();

	const [isOpen, setIsOpen] = useState(false);

	const renderableActionItems = useMemo(
		() => filterActionItems(items, context, product),
		[context, items, product],
	);
	const isMoreThenTwoItems = renderableActionItems.length > visibleButtonsNum;
	const rovoChatAction = context?.actions?.[ActionName.RovoChatAction];
	const is3PBlockExperimentEnabled = isBlockCardRovoActionExperimentEnabled(
		rovoChatAction?.product,
	);

	const onOpenChange = useCallback(
		(attrs: { isOpen: boolean }) => {
			setIsOpen(attrs.isOpen);
			if (onDropdownOpenChange) {
				onDropdownOpenChange(attrs.isOpen);
			}
		},
		[onDropdownOpenChange],
	);

	const onActionItemClick = useCallback(() => {
		if (isOpen) {
			onOpenChange({ isOpen: false });
		}
	}, [isOpen, onOpenChange]);

	const actionButtons = useMemo(() => {
		if (!!rovoChatAction && is3PBlockExperimentEnabled) {
			const rovoActions = [
				...(containerWidth >= REDUCED_ACTIONS_SIZE
					? renderableActionItems.slice(0, visibleButtonsNum - 1)
					: []),
				...(containerWidth >= OVERFLOW_ONLY_ACTIONS_SIZE
					? [
							{
								name: ActionName.RovoChatAction,
								prompts: [RovoChatPromptKey.ASK_ROVO_ANYTHING],
								iconSize: 'small',
								cardAppearance: CardDisplay.Block,
								hideContent:
									(containerWidth < FULL_ACTIONS_SIZE && containerWidth >= REDUCED_ACTIONS_SIZE) ||
									(containerWidth < ICON_ONLY_ACTIONS_SIZE &&
										containerWidth >= OVERFLOW_ONLY_ACTIONS_SIZE),
							} as ActionItem,
							{
								name: ActionName.CopyLinkAction,
								hideContent: true,
								iconSize: 'small',
							} as ActionItem,
							{
								name: ActionName.PreviewAction,
								hideContent: true,
								iconSize: 'small',
							} as ActionItem,
						]
					: []),
			];
			return renderActionItems(rovoActions, size, appearance, false, onActionItemClick);
		}

		const actionItems = isMoreThenTwoItems
			? renderableActionItems.slice(0, visibleButtonsNum - 1)
			: renderableActionItems;

		return renderActionItems(actionItems, size, appearance, false, onActionItemClick);
	}, [
		appearance,
		isMoreThenTwoItems,
		onActionItemClick,
		renderableActionItems,
		size,
		visibleButtonsNum,
		rovoChatAction,
		is3PBlockExperimentEnabled,
		containerWidth,
	]);

	const moreActionDropdown = useMemo(() => {
		let actionItems: ActionItem[];
		if (
			!!rovoChatAction &&
			is3PBlockExperimentEnabled &&
			containerWidth < OVERFLOW_ONLY_ACTIONS_SIZE
		) {
			actionItems = [
				...renderableActionItems,
				{
					name: ActionName.RovoChatAction,
					prompts: [RovoChatPromptKey.ASK_ROVO_ANYTHING],
					iconSize: 'small',
					cardAppearance: CardDisplay.Block,
				} as ActionItem,
				{ name: ActionName.CopyLinkAction, iconSize: 'small' },
				{ name: ActionName.PreviewAction, iconSize: 'small' },
			];
		} else if (
			!!rovoChatAction &&
			is3PBlockExperimentEnabled &&
			containerWidth < REDUCED_ACTIONS_SIZE
		) {
			actionItems = renderableActionItems;
		} else {
			actionItems = isMoreThenTwoItems ? renderableActionItems.slice(visibleButtonsNum - 1) : [];
		}

		if (actionItems.length > 0) {
			const spacing = sizeToButtonSpacing[size];
			const moreIcon = <MoreIcon label="more" color="currentColor" />;
			const formatMessage = <FormattedMessage {...messages.more_actions} />;

			return (
				<DropdownMenu
					isOpen={isOpen}
					onOpenChange={onOpenChange}
					trigger={({ triggerRef, ...props }) => (
						<Tooltip
							content={formatMessage}
							hideTooltipOnClick={true}
							testId="action-group-more-button-tooltip"
							tag="span"
						>
							<Button
								{...props}
								spacing={
									!!rovoChatAction && is3PBlockExperimentEnabled
										? size === SmartLinkSize.XLarge
											? 'default'
											: 'compact'
										: spacing
								}
								testId="action-group-more-button"
								iconBefore={moreIcon}
								ref={triggerRef}
								{...(is3PBlockExperimentEnabled ? { appearance } : {})}
							/>
						</Tooltip>
					)}
					testId="action-group-dropdown"
					zIndex={ui?.zIndex}
				>
					{renderActionItems(actionItems, size, appearance, true, onActionItemClick)}
				</DropdownMenu>
			);
		}
		return null;
	}, [
		appearance,
		isMoreThenTwoItems,
		isOpen,
		onActionItemClick,
		onOpenChange,
		renderableActionItems,
		size,
		ui?.zIndex,
		visibleButtonsNum,
		rovoChatAction,
		is3PBlockExperimentEnabled,
		containerWidth,
	]);

	return renderableActionItems.length > 0 ? (
		<div
			css={[styles]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="actions-button-group"
			data-action-open={isOpen}
		>
			<ButtonGroup>
				{actionButtons}
				{moreActionDropdown}
			</ButtonGroup>
		</div>
	) : null;
};

export default ActionGroup;
