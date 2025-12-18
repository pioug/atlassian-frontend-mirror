import React, { useCallback, useState } from 'react';

import { useIntl } from 'react-intl-next';

import { IconButton } from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
import { fg } from '@atlaskit/platform-feature-flags';

import messages from '../../messages';
import { OverflowActionButtonsWrapper } from '../../styled/Card';
import { type AnalyticsWithDurationProps, type ProfileCardAction } from '../../types';
import { moreActionsClicked, PACKAGE_META_DATA } from '../../util/analytics';
import { getPageTime } from '../../util/performance';

type OverflowButtonsProps = {
	actions: ProfileCardAction[];
	onItemClick: (
		action: ProfileCardAction,
		args: any,
		event: React.MouseEvent | React.KeyboardEvent,
		index: number,
	) => void;
	fullName?: string;
} & AnalyticsWithDurationProps;

export const ACTION_OVERFLOW_THRESHOLD = 2;

export const OverflowProfileCardButtons = (props: OverflowButtonsProps): React.JSX.Element => {
	const intl = useIntl();

	const [, setOpen] = useState(false);

	const { actions, onItemClick, fireAnalyticsWithDuration, fireAnalyticsWithDurationNext } = props;

	const numActions = actions.length + ACTION_OVERFLOW_THRESHOLD;

	const onOpenChange = useCallback(
		({ isOpen: nextOpen }: { isOpen: boolean }) => {
			setOpen((prevOpen) => {
				if (nextOpen && !prevOpen) {
					if (fg('ptc-enable-profile-card-analytics-refactor')) {
						fireAnalyticsWithDurationNext('ui.profilecard.clicked.moreActions', (duration) => ({
							duration,
							numActions,
							firedAt: Math.round(getPageTime()),
							...PACKAGE_META_DATA,
						}));
					} else {
						fireAnalyticsWithDuration((duration) =>
							moreActionsClicked('user', {
								duration,
								numActions,
							}),
						);
					}
				}

				return nextOpen;
			});
		},
		[numActions, fireAnalyticsWithDuration, fireAnalyticsWithDurationNext],
	);

	return (
		<OverflowActionButtonsWrapper testId="profilecard-actions-overflow">
			<DropdownMenu
				onOpenChange={onOpenChange}
				placement={'bottom-end'}
				trigger={({ triggerRef, isSelected, testId, ...providedProps }) => {
					return (
						<IconButton
							type="button"
							{...providedProps}
							ref={triggerRef}
							label={
								fg('jfp_a11y_team_profile_card_actions_label')
									? intl.formatMessage(messages.profileCardMoreIconLabelWithName, {
											fullName: props.fullName,
										})
									: intl.formatMessage(messages.profileCardMoreIconLabel)
							}
							icon={MoreIcon}
						/>
					);
				}}
			>
				<DropdownItemGroup>
					{actions.map((action, index) => (
						<DropdownItem
							key={action.id}
							onClick={(event, ...args: any) => {
								onItemClick(action, args, event, index);
							}}
							href={action.link}
							target={action.target}
						>
							{action.label}
						</DropdownItem>
					))}
				</DropdownItemGroup>
			</DropdownMenu>
		</OverflowActionButtonsWrapper>
	);
};
