import React from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import withAnalyticsEvents, {
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next/withAnalyticsEvents';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import type { DropdownItemProps } from '@atlaskit/dropdown-menu/types';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';

import { createAndFireMediaCardEvent } from '../../../../utils/analytics/createAndFireMediaCardEvent';
import { fireMediaCardEvent } from '../../../../utils/analytics/fireMediaCardEvent';
import { type CardAction } from '../../../actions';
import { CardActionButton } from './cardActionButton';
import { type CardActionIconButtonVariant } from './styles';

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
}: CardActionsDropdownMenuProps): React.JSX.Element | null => {
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
