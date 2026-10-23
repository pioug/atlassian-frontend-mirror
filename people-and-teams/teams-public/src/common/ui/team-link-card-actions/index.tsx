import React from 'react';

import { defineMessages, useIntl } from 'react-intl';

import IconButton from '@atlaskit/button/icon/button';
import { cssMap } from '@atlaskit/css';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import CrossIcon from '@atlaskit/icon/core/cross';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import { Box } from '@atlaskit/primitives/compiled/box';
import { useAnalyticsEvents } from '@atlaskit/teams-app-internal-analytics/use-analytics-events';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import { type ContainerTypes } from '../../types';

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
		description: 'Dropdown menu option label to edit a team container link',
	},
	removeLink: {
		id: 'ptc-directory.team-containers.remove-link',
		defaultMessage: 'Remove',
		description: 'Dropdown menu option label to remove a team container link',
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
	onDisconnectButtonClick,
	onEditLinkClick,
	onDropdownOpenChange,
}: TeamLinkCardActionsProps): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const { fireEvent } = useAnalyticsEvents();
	const dropdownTriggerElementRef = React.useRef<HTMLButtonElement | null>(null);

	const returnFocusToDropdownTrigger = () => {
		dropdownTriggerElementRef.current?.focus();
	};

	const handleDisconnectClick = (e: React.MouseEvent | React.KeyboardEvent) => {
		e.preventDefault();
		e.stopPropagation();
		returnFocusToDropdownTrigger();
		onDisconnectButtonClick();
		fireEvent('ui.button.clicked.containerUnlinkButton', {
			containerSelected: { container: containerType, containerId },
		});
	};

	const handleEditLinkClick = (e: React.MouseEvent | React.KeyboardEvent) => {
		e.preventDefault();
		e.stopPropagation();
		returnFocusToDropdownTrigger();
		onEditLinkClick?.();
		fireEvent('ui.button.clicked.containerEditLinkButton', {
			containerSelected: { container: containerType, containerId },
		});
	};

	if (containerType === 'WebLink') {
		return (
			<Box xcss={styles.showMoreIconWrapper}>
				<DropdownMenu
					trigger={({ triggerRef, ...triggerProps }) => (
						<IconButton
							ref={triggerRef}
							{...triggerProps}
							onClick={(e) => {
								dropdownTriggerElementRef.current = e.currentTarget;
								triggerProps.onClick?.(e);
							}}
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
		<Box xcss={styles.crossIconWrapper}>
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
