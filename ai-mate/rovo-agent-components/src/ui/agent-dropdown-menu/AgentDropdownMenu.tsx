/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { useEffect, useState } from 'react';

import { useIntl } from 'react-intl';

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import IconButton from '@atlaskit/button/icon/button';
import { jsx } from '@atlaskit/css';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import type { DropdownMenuProps } from '@atlaskit/dropdown-menu/types';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Inline } from '@atlaskit/primitives/compiled';
import Spinner from '@atlaskit/spinner/spinner';

import {
	AgentVerificationDropdownItem,
	type AgentVerificationDropdownItemProps,
} from '../agent-verification-dropdown-item';
import messages from './messages';

type CustomDropdownOption = {
	id: string;
	label: string;
	onClick: () => void;
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
	showDeleteOption?: boolean;
	isAutodevTemplateAgent?: boolean;
	agentId: string;
	agentName?: string;
	onEditAgent?: React.ComponentProps<typeof DropdownItem>['onClick'];
	onCopyAgent?: React.ComponentProps<typeof DropdownItem>['onClick'];
	onDuplicateAgent?: (
		e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>,
	) => Promise<void>;
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
	loadPermissionsOnMount?: boolean;
	shouldTriggerStopPropagation?: boolean;
	shouldRenderToParent?: DropdownMenuProps['shouldRenderToParent'];
	loadAgentPermissions: () => Promise<{
		isCreateEnabled?: boolean;
		isEditEnabled: boolean;
		isDeleteEnabled: boolean;
	}>;
	customDropdownOptions?: CustomDropdownOption[];
} & ViewAgentOptionProps &
	ViewAgentFullProfileProps &
	Partial<
		Pick<
			AgentVerificationDropdownItemProps,
			'agentRef' | 'userPermissionsRef' | 'onVerificationSuccess'
		>
	>;

export const AgentDropdownMenu = ({
	isAutodevTemplateAgent,
	onEditAgent,
	onCopyAgent,
	onDuplicateAgent,
	onDeleteAgent,
	onViewAgentFullProfileClick,
	onOpenChange,
	isForgeAgent,
	showDeleteOption = true,
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
	shouldRenderToParent,
	agentName,
	agentRef,
	userPermissionsRef,
	onVerificationSuccess,
	customDropdownOptions,
}: AgentDropdownMenuProps): JSX.Element => {
	const [isLoading, setIsLoading] = useState(false);
	const [isDuplicating, setIsDuplicating] = useState(false);
	const { formatMessage } = useIntl();
	const [hasBeenCopied, setHasBeenCopied] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [permissions, setPermissions] = useState<{
		isCreateEnabled?: boolean;
		isEditEnabled: boolean;
		isDeleteEnabled: boolean;
	}>();

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			const { isCreateEnabled, isEditEnabled, isDeleteEnabled } = await loadAgentPermissions();
			setIsLoading(false);

			setPermissions({ isCreateEnabled, isEditEnabled, isDeleteEnabled });
		};

		// Only load once
		if (!permissions && (isOpen || loadPermissionsOnMount)) {
			fetchData();
		}
	}, [isOpen, loadAgentPermissions, loadPermissionsOnMount, permissions]);

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
				{permissions.isDeleteEnabled && showDeleteOption && (
					<DropdownItem onClick={onDeleteAgent}>{formatMessage(messages.deleteAgent)}</DropdownItem>
				)}
			</DropdownItemGroup>
		);
	};

	const isCreateAgentsEnabled = permissions?.isCreateEnabled;

	return (
		<DropdownMenu<HTMLButtonElement>
			shouldRenderToParent={shouldRenderToParent}
			isLoading={isLoading}
			isOpen={isOpen}
			testId={dropdownMenuTestId}
			trigger={({ triggerRef, ...props }) => (
				<IconButton
					{...props}
					icon={MoreIcon}
					label={
						agentName
							? formatMessage(messages.moreActionsForLabel, { agentName: agentName })
							: formatMessage(messages.moreActionsLabel)
					}
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
		>
			<DropdownItemGroup>
				{customDropdownOptions?.map((option: CustomDropdownOption) => (
					<DropdownItem key={option.id} onClick={option.onClick}>
						{option.label}
					</DropdownItem>
				))}
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
				{!isForgeAgent && isCreateAgentsEnabled && (
					<DropdownItem
						onClick={async (e) => {
							if (fg('rovo_agent_versioning_enabled')) {
								e.stopPropagation();
							}

							setIsDuplicating(true);
							try {
								await onDuplicateAgent?.(e);
							} finally {
								setIsDuplicating(false);
							}
						}}
						isDisabled={isDuplicating}
					>
						<Inline space="space.050">
							{isDuplicating && <Spinner size="small" />}
							{isAutodevTemplateAgent
								? formatMessage(messages.useTemplateButton)
								: formatMessage(messages.duplicateAgent)}
						</Inline>
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
				{agentRef && userPermissionsRef && fg('rovo_agents_agent_verification') && (
					<AgentVerificationDropdownItem
						agentRef={agentRef ?? null}
						userPermissionsRef={userPermissionsRef ?? null}
						onVerificationSuccess={onVerificationSuccess}
						testId="agent-actions-menu-verification"
					/>
				)}
			</DropdownItemGroup>
			{renderEditDelete()}
		</DropdownMenu>
	);
};
