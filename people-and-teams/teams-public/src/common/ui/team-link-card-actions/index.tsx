import React from 'react';

import { defineMessages, useIntl } from 'react-intl-next';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { IconButton } from '@atlaskit/button/new';
import { cssMap, cx } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import CrossIcon from '@atlaskit/icon/core/cross';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { useAnalyticsEvents as useAnalyticsEventsNext } from '@atlaskit/teams-app-internal-analytics';
import Tooltip from '@atlaskit/tooltip';

import { type ContainerTypes } from '../../types';
import { AnalyticsAction, usePeopleAndTeamAnalytics } from '../../utils/analytics';

const styles = cssMap({
	crossIconWrapper: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		marginLeft: 'auto',
	},
	showMoreIconWrapper: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		marginLeft: 'auto',
	},
	iconHidden: {
		opacity: 0,
	},
	iconVisible: {
		opacity: 1,
	},
});

const messages = defineMessages({
	disconnectTooltip: {
		id: 'ptc-directory.team-containers.disconnect-button.tooltip',
		defaultMessage: 'Disconnect',
		description: 'Tooltip for the disconnect button',
	},
	editLink: {
		id: 'ptc-directory.team-containers.edit-link',
		defaultMessage: 'Edit link',
		description: 'Edit link option in dropdown',
	},
	removeLink: {
		id: 'ptc-directory.team-containers.remove-link',
		defaultMessage: 'Remove',
		description: 'Remove link option in dropdown',
	},
});

export interface TeamLinkCardActionsProps {
	containerType: ContainerTypes;
	title: string;
	containerId?: string;
	hovered: boolean;
	focused: boolean;
	isDropdownOpen: boolean;
	showKeyboardFocus: boolean;
	onDisconnectButtonClick: () => void;
	onEditLinkClick?: () => void;
	onDropdownOpenChange: (isOpen: boolean) => void;
}

export const TeamLinkCardActions = ({
	containerType,
	title,
	containerId,
	hovered,
	focused,
	isDropdownOpen,
	showKeyboardFocus,
	onDisconnectButtonClick,
	onEditLinkClick,
	onDropdownOpenChange,
}: TeamLinkCardActionsProps) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const { formatMessage } = useIntl();
	const { fireUIEvent } = usePeopleAndTeamAnalytics();
	const { fireEvent } = useAnalyticsEventsNext();

	// Show icons when:
	// 1. Hovering over the card
	// 2. Dropdown is open
	// 3. Focused via keyboard navigation (when showKeyboardFocus is true)
	const shouldShowIcon = hovered || isDropdownOpen || (focused && showKeyboardFocus);

	const handleDisconnectClick = (e: React.MouseEvent | React.KeyboardEvent) => {
		e.preventDefault();
		e.stopPropagation();
		onDisconnectButtonClick();
		if (fg('ptc-enable-teams-public-analytics-refactor')) {
			fireEvent('ui.button.clicked.containerUnlinkButton', {
				containerSelected: { container: containerType, containerId },
			});
		} else {
			fireUIEvent(createAnalyticsEvent, {
				action: AnalyticsAction.CLICKED,
				actionSubject: 'button',
				actionSubjectId: 'containerUnlinkButton',
				attributes: { containerSelected: { container: containerType, containerId } },
			});
		}
	};

	const handleEditLinkClick = (e: React.MouseEvent | React.KeyboardEvent) => {
		e.preventDefault();
		e.stopPropagation();
		onEditLinkClick?.();
		if (fg('ptc-enable-teams-public-analytics-refactor')) {
			fireEvent('ui.button.clicked.containerEditLinkButton', {
				containerSelected: { container: containerType, containerId },
			});
		} else {
			fireUIEvent(createAnalyticsEvent, {
				action: AnalyticsAction.CLICKED,
				actionSubject: 'button',
				actionSubjectId: 'containerEditLinkButton',
				attributes: {
					containerSelected: { container: containerType, containerId },
				},
			});
		}
	};

	if (containerType === 'WebLink') {
		return (
			<Box
				xcss={cx(
					styles.showMoreIconWrapper,
					shouldShowIcon ? styles.iconVisible : styles.iconHidden,
				)}
			>
				<DropdownMenu
					trigger={({ triggerRef, ...triggerProps }) => (
						<IconButton
							ref={triggerRef}
							{...triggerProps}
							label={`more options for ${title}`}
							appearance="subtle"
							icon={(iconProps) => <ShowMoreHorizontalIcon {...iconProps} size="small" />}
							spacing="compact"
						/>
					)}
					placement="bottom-end"
					shouldRenderToParent
					onOpenChange={(attrs) => {
						onDropdownOpenChange(attrs.isOpen);
					}}
				>
					<DropdownItemGroup>
						<DropdownItem onClick={handleEditLinkClick}>
							{formatMessage(messages.editLink)}
						</DropdownItem>
						<DropdownItem onClick={handleDisconnectClick}>
							{formatMessage(messages.removeLink)}
						</DropdownItem>
					</DropdownItemGroup>
				</DropdownMenu>
			</Box>
		);
	}

	return (
		<Box
			xcss={cx(styles.crossIconWrapper, shouldShowIcon ? styles.iconVisible : styles.iconHidden)}
		>
			<Tooltip content={formatMessage(messages.disconnectTooltip)} position="top">
				<IconButton
					label={`disconnect the container ${title}`}
					appearance="subtle"
					icon={(iconProps) => <CrossIcon {...iconProps} size="small" />}
					spacing="compact"
					onClick={handleDisconnectClick}
				/>
			</Tooltip>
		</Box>
	);
};
