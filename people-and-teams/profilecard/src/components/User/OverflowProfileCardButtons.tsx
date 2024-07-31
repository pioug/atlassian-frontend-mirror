import React, { useCallback, useState } from 'react';

import { useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/custom-theme-button';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import MoreIcon from '@atlaskit/icon/core/migration/show-more-horizontal--more';

import messages from '../../messages';
import { OverflowActionButtonsWrapper } from '../../styled/Card';
import { type AnalyticsWithDurationProps, type ProfileCardAction } from '../../types';
import { moreActionsClicked } from '../../util/analytics';

type OverflowButtonsProps = {
	actions: ProfileCardAction[];
	onItemClick: (
		action: ProfileCardAction,
		args: any,
		event: React.MouseEvent | React.KeyboardEvent,
		index: number,
	) => void;
} & AnalyticsWithDurationProps;

export const ACTION_OVERFLOW_THRESHOLD = 2;

export const OverflowProfileCardButtons = (props: OverflowButtonsProps) => {
	const intl = useIntl();

	const [, setOpen] = useState(false);

	const { actions, onItemClick, fireAnalyticsWithDuration } = props;

	const numActions = actions.length + ACTION_OVERFLOW_THRESHOLD;

	const onOpenChange = useCallback(
		({ isOpen: nextOpen }: { isOpen: boolean }) => {
			setOpen((prevOpen) => {
				if (nextOpen && !prevOpen) {
					fireAnalyticsWithDuration((duration) =>
						moreActionsClicked('user', {
							duration,
							numActions,
						}),
					);
				}

				return nextOpen;
			});
		},
		[numActions, fireAnalyticsWithDuration],
	);

	return (
		<OverflowActionButtonsWrapper data-testid="profilecard-actions-overflow">
			<DropdownMenu
				onOpenChange={onOpenChange}
				placement={'bottom-end'}
				trigger={({ triggerRef, isSelected, testId, ...providedProps }) => (
					<Button
						type="button"
						{...providedProps}
						ref={triggerRef}
						iconBefore={
							<MoreIcon
								color="currentColor"
								spacing="spacious"
								label={intl.formatMessage(messages.profileCardMoreIconLabel)}
							/>
						}
					/>
				)}
			>
				<DropdownItemGroup>
					{actions.map((action, index) => (
						<DropdownItem
							key={action.id}
							onClick={(event, ...args: any) => {
								onItemClick(action, args, event, index);
							}}
							href={action.link}
						>
							{action.label}
						</DropdownItem>
					))}
				</DropdownItemGroup>
			</DropdownMenu>
		</OverflowActionButtonsWrapper>
	);
};
