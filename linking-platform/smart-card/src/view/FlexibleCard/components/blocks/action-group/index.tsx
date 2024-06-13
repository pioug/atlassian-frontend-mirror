/** @jsx jsx */
import { token } from '@atlaskit/tokens';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl-next';
import { css, jsx } from '@emotion/react';

import { type Appearance } from '@atlaskit/button';
import ButtonGroup from '@atlaskit/button/button-group';
import Tooltip from '@atlaskit/tooltip';
import { type ActionGroupProps } from './types';
import DropdownMenu from '@atlaskit/dropdown-menu';

import { SmartLinkSize } from '../../../../../constants';
import Button from '@atlaskit/button/standard-button';
import MoreIcon from '@atlaskit/icon/glyph/more';
import { sizeToButtonSpacing } from '../../utils';
import { messages } from '../../../../../messages';
import {
	useFlexibleUiContext,
	useFlexibleUiOptionContext,
} from '../../../../../state/flexible-ui-context';
import ActionGroupItem from './action-group-item';
import { filterActionItems } from '../utils';
import { di } from 'react-magnetic-di';
import type { ActionItem } from '../types';

const styles = css({
	display: 'inline-flex',
	lineHeight: '1rem',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> div': {
		alignItems: 'center',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'button:focus-visible': {
			outlineOffset: token('space.negative.025', '-2px'),
		},
	},
});

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
const ActionGroup: React.FC<ActionGroupProps> = ({
	items = [],
	size = SmartLinkSize.Medium,
	appearance,
	visibleButtonsNum = 2,
	onDropdownOpenChange,
}) => {
	di(DropdownMenu);

	const context = useFlexibleUiContext();
	const ui = useFlexibleUiOptionContext();

	const [isOpen, setIsOpen] = useState(false);

	const renderableActionItems = useMemo(() => filterActionItems(items, context), [context, items]);
	const isMoreThenTwoItems = renderableActionItems.length > visibleButtonsNum;

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
	]);

	const moreActionDropdown = useMemo(() => {
		const actionItems = isMoreThenTwoItems
			? renderableActionItems.slice(visibleButtonsNum - 1)
			: [];

		if (actionItems.length > 0) {
			const spacing = sizeToButtonSpacing[size];
			const moreIcon = <MoreIcon label="more" />;
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
								spacing={spacing}
								testId="action-group-more-button"
								iconBefore={moreIcon}
								ref={triggerRef}
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
	]);

	return renderableActionItems.length > 0 ? (
		<div
			css={styles}
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
