/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useMemo, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';
import { useIntl } from 'react-intl';

import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';
import { WidthObserver } from '@atlaskit/width-detector';

import type { RovoChatActionData } from '../../../../state/flexible-ui-context/types';
import useInvokeClientAction from '../../../../state/hooks/use-invoke-client-action';
import useRovoChat, { type SendPromptMessageData } from '../../../../state/hooks/use-rovo-chat';
import { getPromptAction, type RovoChatPromptKey } from '../../../common/rovo-chat-utils';
import AIEditIcon from '../../../FlexibleCard/assets/ai-edit-icon';

type PromptAction = NonNullable<ReturnType<typeof getPromptAction>>;

const HIDE_SECONDARY_ACTIONS_WIDTH = 320;
const PRIMARY_ACTION_ICON_ONLY_WIDTH = 220;

const styles = cssMap({
	actionGroup: {
		display: 'flex',
		flexDirection: 'row',
		gap: token('space.050'),
	},
});

type RovoPromptButtonProps = {
	hideContent?: boolean;
	icon: React.ReactNode;
	onClick: (
		event: React.MouseEvent<HTMLElement>,
		promptData: SendPromptMessageData,
		promptKey: RovoChatPromptKey,
	) => void;
	promptAction: PromptAction;
	promptKey: RovoChatPromptKey;
	testId: string;
};

const RovoPromptButton = ({
	hideContent = false,
	icon,
	onClick,
	promptAction,
	promptKey,
	testId,
}: RovoPromptButtonProps) => {
	const iconBefore = useCallback(() => <span aria-hidden="true">{icon}</span>, [icon]);
	const label = promptAction.data.name;
	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLElement>) => onClick(event, promptAction.data, promptKey),
		[onClick, promptAction.data, promptKey],
	);

	return (
		<Button
			appearance="subtle"
			aria-label={hideContent ? label : undefined}
			iconBefore={iconBefore}
			onClick={handleClick}
			spacing="compact"
			testId={`${testId}-${promptKey}`}
		>
			{hideContent ? null : label}
		</Button>
	);
};

type EmbedRovoActionsFooterProps = {
	actionData: RovoChatActionData;
	prompts: RovoChatPromptKey[];
	testId?: string;
};

const EmbedRovoActionsFooter = ({
	actionData,
	prompts,
	testId = 'embed-rovo-actions-footer',
}: EmbedRovoActionsFooterProps): React.JSX.Element | null => {
	const intl = useIntl();
	const invoke = useInvokeClientAction({});
	const { isRovoChatEnabled, sendPromptMessage } = useRovoChat();
	const [containerWidth, setContainerWidth] = useState<number | undefined>(undefined);
	const shouldHideSecondaryActions =
		containerWidth !== undefined && containerWidth < HIDE_SECONDARY_ACTIONS_WIDTH;
	const shouldHidePrimaryActionContent =
		containerWidth !== undefined && containerWidth < PRIMARY_ACTION_ICON_ONLY_WIDTH;

	const onClick = useCallback(
		(
			event: React.MouseEvent<HTMLElement>,
			promptData: SendPromptMessageData,
			promptKey: RovoChatPromptKey,
		) => {
			event.preventDefault();
			event.stopPropagation();

			invoke({
				...actionData.invokeAction,
				actionFn: async () => sendPromptMessage(promptData),
				prompt: promptKey,
			});
		},
		[actionData.invokeAction, invoke, sendPromptMessage],
	);

	const promptActions = useMemo(
		() =>
			prompts.reduce<React.ReactElement[]>((actions, promptKey) => {
				if (shouldHideSecondaryActions && actions.length > 0) {
					return actions;
				}

				const promptAction = getPromptAction({
					promptKey,
					intl,
					url: actionData.url,
					product: actionData.product,
					iconSize: 'small',
				});

				if (!promptAction) {
					return actions;
				}

				const isPrimaryAction = actions.length === 0;

				actions.push(
					<RovoPromptButton
						hideContent={isPrimaryAction && shouldHidePrimaryActionContent}
						icon={isPrimaryAction ? <AIEditIcon /> : promptAction.icon}
						key={promptKey}
						onClick={onClick}
						promptAction={promptAction}
						promptKey={promptKey}
						testId={testId}
					/>,
				);

				return actions;
			}, []),
		[
			actionData.product,
			actionData.url,
			intl,
			onClick,
			prompts,
			shouldHidePrimaryActionContent,
			shouldHideSecondaryActions,
			testId,
		],
	);

	if (!isRovoChatEnabled || promptActions.length === 0) {
		return null;
	}

	return (
		<div data-testid={testId}>
			<WidthObserver setWidth={setContainerWidth} offscreen />
			<div css={styles.actionGroup}>{promptActions}</div>
		</div>
	);
};

export default EmbedRovoActionsFooter;
