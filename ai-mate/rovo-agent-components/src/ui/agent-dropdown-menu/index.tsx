/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useEffect, useState } from 'react';

import { useIntl } from 'react-intl-next';

import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import Button, { type ButtonProps, IconButton } from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import MoreIcon from '@atlaskit/icon/core/migration/show-more-horizontal--more';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { ChatPillIcon } from '../../common/ui/chat-icon';

import messages from './messages';

const styles = cssMap({
	chatToAgentButtonContainer: {
		width: '100%',
	},

	chatToAgentButtonWrapper: {
		display: 'flex',
		justifyContent: 'center',
		fontWeight: token('font.weight.medium'),
	},

	chatPillButtonInline: { paddingInline: token('space.025') },

	chatPillText: {
		wordBreak: 'break-word',
		textAlign: 'left',
		whiteSpace: 'pre-wrap',
	},

	chatPillIconWrapper: {
		minWidth: '20px',
		height: '20px',
	},
});

type ChatToAgentButtonProps = {
	onClick: ButtonProps['onClick'];
};

export const ChatToAgentButton = ({ onClick }: ChatToAgentButtonProps) => {
	const { formatMessage } = useIntl();

	return (
		<Box xcss={styles.chatToAgentButtonContainer}>
			<Button testId="view-agent-modal-chat-to-agent-button" shouldFitContainer onClick={onClick}>
				<Box xcss={styles.chatToAgentButtonWrapper}>
					<Inline space="space.050" xcss={styles.chatPillButtonInline}>
						<Box xcss={styles.chatPillIconWrapper}>
							<ChatPillIcon />
						</Box>
						<Box xcss={styles.chatPillText}>{formatMessage(messages.chatToAgentButton)}</Box>
					</Inline>
				</Box>
			</Button>
		</Box>
	);
};

type ViewAgentOptionProps =
	| {
			showViewAgentOption: true;
			onViewAgentClick: React.ComponentProps<typeof DropdownItem>['onClick'];
	  }
	| {
			showViewAgentOption?: false;
			onViewAgentClick?: undefined;
	  };

type ViewAgentFullProfileProps =
	| {
			onViewAgentFullProfileClick: React.ComponentProps<typeof DropdownItem>['onClick'];
			doesAgentHaveIdentityAccountId: boolean;
	  }
	| {
			onViewAgentFullProfileClick?: undefined;
			doesAgentHaveIdentityAccountId?: undefined;
	  };

type AgentDropdownMenuProps = {
	isAgentCreatedByUser: boolean;
	isAutodevTemplateAgent?: boolean;
	agentId: string;
	onEditAgent?: React.ComponentProps<typeof DropdownItem>['onClick'];
	onCopyAgent?: React.ComponentProps<typeof DropdownItem>['onClick'];
	onDuplicateAgent?: React.ComponentProps<typeof DropdownItem>['onClick'];
	onDeleteAgent?: React.ComponentProps<typeof DropdownItem>['onClick'];
	isForgeAgent: boolean;
	onDropdownTriggerClick?: (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	) => void;
	onOpenChange?: React.ComponentProps<typeof DropdownMenu>['onOpenChange'];
	spacing?: React.ComponentProps<typeof IconButton>['spacing'];
	appearance?: React.ComponentProps<typeof IconButton>['appearance'];
	dropdownMenuTestId?: React.ComponentProps<typeof DropdownMenu>['testId'];
	loadAgentPermissions?: () => Promise<{
		isEditEnabled: boolean;
		isDeleteEnabled: boolean;
	}>;
	loadPermissionsOnMount?: boolean;
	shouldTriggerStopPropagation?: boolean;
} & ViewAgentOptionProps &
	ViewAgentFullProfileProps;

export const AgentDropdownMenu = ({
	isAgentCreatedByUser,
	isAutodevTemplateAgent,
	onEditAgent,
	onCopyAgent,
	onDuplicateAgent,
	onDeleteAgent,
	onViewAgentFullProfileClick,
	onOpenChange,
	isForgeAgent,
	showViewAgentOption = false,
	onViewAgentClick,
	onDropdownTriggerClick,
	spacing,
	appearance,
	dropdownMenuTestId,
	doesAgentHaveIdentityAccountId,
	loadAgentPermissions,
	loadPermissionsOnMount,
	shouldTriggerStopPropagation,
}: AgentDropdownMenuProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const { formatMessage } = useIntl();
	const [hasBeenCopied, setHasBeenCopied] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [permissions, setPermissions] = useState<{
		isEditEnabled: boolean;
		isDeleteEnabled: boolean;
	}>();

	useEffect(() => {
		const fetchData = async () => {
			if (!loadAgentPermissions) {
				const canEditDelete = isAgentCreatedByUser && !isForgeAgent;
				setPermissions({ isEditEnabled: canEditDelete, isDeleteEnabled: canEditDelete });
				return;
			}

			setIsLoading(true);
			const { isEditEnabled, isDeleteEnabled } = await loadAgentPermissions();
			setIsLoading(false);

			setPermissions({ isEditEnabled, isDeleteEnabled });
		};

		// Only load once
		if (!permissions && (isOpen || loadPermissionsOnMount)) {
			fetchData();
		}
	}, [
		isAgentCreatedByUser,
		isForgeAgent,
		isOpen,
		loadAgentPermissions,
		loadPermissionsOnMount,
		permissions,
	]);

	useEffect(() => {
		if (!isOpen) {
			setHasBeenCopied(false);
		}
	}, [isOpen]);

	const renderEditDelete = () => {
		if (!permissions?.isEditEnabled && !permissions?.isDeleteEnabled) {
			return null;
		}

		return (
			<DropdownItemGroup hasSeparator>
				{permissions.isEditEnabled && (
					<DropdownItem onClick={onEditAgent}>{formatMessage(messages.editAgent)}</DropdownItem>
				)}
				{permissions.isDeleteEnabled && (
					<DropdownItem onClick={onDeleteAgent}>{formatMessage(messages.deleteAgent)}</DropdownItem>
				)}
			</DropdownItemGroup>
		);
	};

	return (
		<DropdownMenu<HTMLButtonElement>
			isLoading={isLoading}
			isOpen={isOpen}
			testId={dropdownMenuTestId}
			trigger={({ triggerRef, ...props }) => (
				<IconButton
					{...props}
					icon={MoreIcon}
					label={formatMessage(messages.moreActionsLabel)}
					ref={triggerRef}
					spacing={spacing}
					appearance={appearance}
					onClick={(e, analyticsEvent) => {
						if (onDropdownTriggerClick) {
							onDropdownTriggerClick(e, analyticsEvent);
						}

						if (shouldTriggerStopPropagation) {
							e.stopPropagation();
						}

						props.onClick?.(e);
					}}
				/>
			)}
			onOpenChange={(args) => {
				setIsOpen(args.isOpen);
				onOpenChange?.(args);

				if (!args.isOpen) {
					setHasBeenCopied(false);
				}
			}}
			shouldRenderToParent={fg('should-render-to-parent-should-be-true-ai-mate')}
		>
			<DropdownItemGroup>
				{showViewAgentOption && (
					<DropdownItem onClick={onViewAgentClick}>
						{formatMessage(messages.viewAgent)}
					</DropdownItem>
				)}
				{doesAgentHaveIdentityAccountId && onViewAgentFullProfileClick && (
					<DropdownItem onClick={onViewAgentFullProfileClick}>
						{formatMessage(messages.viewAgentFullProfile)}
					</DropdownItem>
				)}
				{!isForgeAgent && (
					<DropdownItem onClick={onDuplicateAgent}>
						{isAutodevTemplateAgent
							? formatMessage(messages.useTemplateButton)
							: formatMessage(messages.duplicateAgent)}
					</DropdownItem>
				)}
				<DropdownItem
					onClick={(e) => {
						e.stopPropagation();
						setHasBeenCopied(true);
						onCopyAgent?.(e);
					}}
				>
					{formatMessage(
						hasBeenCopied ? messages.linkedCopiedToProfile : messages.copyLinkToProfile,
					)}
				</DropdownItem>
			</DropdownItemGroup>
			{renderEditDelete()}
		</DropdownMenu>
	);
};
