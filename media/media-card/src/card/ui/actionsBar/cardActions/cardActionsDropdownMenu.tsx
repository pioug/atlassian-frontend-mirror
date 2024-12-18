import React from 'react';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';

import MoreIcon from '@atlaskit/icon/core/migration/show-more-horizontal--more';
import DropdownMenu, {
	DropdownItemGroup,
	DropdownItem,
	type DropdownItemProps,
} from '@atlaskit/dropdown-menu';

import { type CardAction } from '../../../actions';
import { type CardActionIconButtonVariant } from './styles';
import { withAnalyticsEvents, type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { createAndFireMediaCardEvent, fireMediaCardEvent } from '../../../../utils/analytics';
import { CardActionButton } from './cardActionButton';

export type CardActionsDropdownMenuProps = {
	readonly actions: CardAction[];

	readonly triggerColor?: string;
	readonly triggerVariant?: CardActionIconButtonVariant;
	readonly onOpenChange?: (attrs: { isOpen: boolean }) => void;
};

type DropdownItemPropsWithAnalytics = DropdownItemProps & WithAnalyticsEventsProps; // Trick applied due to the lack of props type of DropdownItem
const DropdownItemWithProps = (props: DropdownItemPropsWithAnalytics) => (
	<DropdownItem testId="media-card-actions-menu-item" {...props} />
);

const createDropdownItemWithAnalytics = (action: CardAction, index: number) => {
	const { label, handler, isDisabled } = action;
	const DropdownItemWithAnalytics = withAnalyticsEvents({
		onClick: createAndFireMediaCardEvent({
			eventType: 'ui',
			action: 'clicked',
			actionSubject: 'button',
			actionSubjectId: 'mediaCardDropDownMenuItem',
			attributes: {
				label,
			},
		}),
	})(DropdownItemWithProps);

	return (
		<DropdownItemWithAnalytics key={index} onClick={() => handler()} isDisabled={isDisabled}>
			{label}
		</DropdownItemWithAnalytics>
	);
};

export const CardActionsDropdownMenu = ({
	actions,
	triggerColor,
	onOpenChange,
	triggerVariant,
}: CardActionsDropdownMenuProps) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();

	if (actions.length > 0) {
		return (
			<DropdownMenu
				testId="media-card-actions-menu"
				onOpenChange={onOpenChange}
				trigger={({ triggerRef, isSelected, testId, onClick, ...providedProps }) => (
					<CardActionButton
						variant={triggerVariant}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={{ color: triggerColor }}
						ref={triggerRef}
						onClick={(e) => {
							fireMediaCardEvent(
								{
									eventType: 'ui',
									action: 'clicked',
									actionSubject: 'button',
									actionSubjectId: 'mediaCardDropDownMenu',
									attributes: {},
								},
								createAnalyticsEvent,
							);
							onClick?.(e);
						}}
						{...providedProps}
					>
						<MoreIcon color="currentColor" spacing="spacious" label="more" />
					</CardActionButton>
				)}
			>
				<DropdownItemGroup>{actions.map(createDropdownItemWithAnalytics)}</DropdownItemGroup>
			</DropdownMenu>
		);
	} else {
		return null;
	}
};
