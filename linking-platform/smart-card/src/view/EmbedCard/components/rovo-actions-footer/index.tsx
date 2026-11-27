/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useMemo, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';
import { useIntl } from 'react-intl';

import Button from '@atlaskit/button/default/button';
import RemixIcon from '@atlaskit/icon-lab/core/ai-generative-remix';
import { usePlugins } from '@atlaskit/link-provider/use-plugins';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';
import { WidthObserver } from '@atlaskit/width-detector/width-observer';

import { messages } from '../../../../messages';
import type {
	RovoChatActionData,
	RemixActionData,
} from '../../../../state/flexible-ui-context/types';
import useInvokeClientAction from '../../../../state/hooks/use-invoke-client-action';
import useRovoChat, { type SendPromptMessageData } from '../../../../state/hooks/use-rovo-chat';
import { useRemixActionExposure } from '../../../../utils/use-remix-action-exposure';
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
	actionData?: RovoChatActionData;
	prompts: RovoChatPromptKey[];
	remixActionData?: RemixActionData;
	testId?: string;
};

const EmbedRovoActionsFooter = ({
	actionData,
	remixActionData,
	prompts,
	testId = 'embed-rovo-actions-footer',
}: EmbedRovoActionsFooterProps): React.JSX.Element | null => {
	const intl = useIntl();
	const { remix } = usePlugins();
	const invoke = useInvokeClientAction({});
	const { isRovoChatEnabled, sendPromptMessage } = useRovoChat();
	const [containerWidth, setContainerWidth] = useState<number | undefined>(undefined);
	const shouldHideSecondaryActions =
		containerWidth !== undefined && containerWidth < HIDE_SECONDARY_ACTIONS_WIDTH;
	const shouldHidePrimaryActionContent =
		containerWidth !== undefined && containerWidth < PRIMARY_ACTION_ICON_ONLY_WIDTH;

	const isRemixVisible = Boolean(remixActionData && remix);
	useRemixActionExposure(isRemixVisible);

	const onClick = useCallback(
		(
			event: React.MouseEvent<HTMLElement>,
			promptData: SendPromptMessageData,
			promptKey: RovoChatPromptKey,
		) => {
			event.preventDefault();
			event.stopPropagation();

			if (!actionData) {
				return;
			}
			invoke({
				...actionData.invokeAction,
				actionFn: async () => sendPromptMessage(promptData),
				prompt: promptKey,
			});
		},
		[actionData, invoke, sendPromptMessage],
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
					url: actionData?.url,
					product: actionData?.product,
					iconSize: 'small',
				});

				if (!promptAction) {
					return actions;
				}

				const isPrimaryAction = actions.length === 0;
				// The primary chat action normally uses the branded AI icon.
				// With platform_sl_rovo_summarize_icon_consistency on, every action keeps its own
				// prompt icon so Summarize matches the inline and block cards.
				const shouldUseBrandedIcon = fg('platform_sl_rovo_summarize_icon_consistency')
					? false
					: isPrimaryAction;

				actions.push(
					<RovoPromptButton
						hideContent={isPrimaryAction && !remixActionData && shouldHidePrimaryActionContent}
						icon={shouldUseBrandedIcon ? <AIEditIcon /> : promptAction.icon}
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
			actionData?.product,
			actionData?.url,
			intl,
			onClick,
			prompts,
			remixActionData,
			shouldHidePrimaryActionContent,
			shouldHideSecondaryActions,
			testId,
		],
	);

	if (!isRemixVisible && (!isRovoChatEnabled || !actionData || promptActions.length === 0)) {
		return null;
	}

	return (
		<div data-testid={testId}>
			<WidthObserver setWidth={setContainerWidth} offscreen />
			<div css={styles.actionGroup}>
				{remixActionData && remix ? (
					<Button
						appearance="subtle"
						spacing="compact"
						aria-label={intl.formatMessage(messages.rovo_prompt_button_remix)}
						iconBefore={() => <RemixIcon label="" size="small" />}
						onClick={(event) => {
							event.preventDefault();
							event.stopPropagation();
							const anchorElement = event.currentTarget;
							void invoke({
								...remixActionData.invokeAction,
								actionFn: async () => remix.open({ anchorElement, url: remixActionData.url }),
							});
						}}
					>
						{shouldHidePrimaryActionContent
							? undefined
							: intl.formatMessage(messages.rovo_prompt_button_remix)}
					</Button>
				) : null}
				{isRovoChatEnabled && actionData && !(remixActionData && shouldHideSecondaryActions)
					? promptActions
					: null}
			</div>
		</div>
	);
};

export default EmbedRovoActionsFooter;
