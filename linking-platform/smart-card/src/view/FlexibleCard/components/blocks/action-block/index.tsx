/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useMemo, useState } from 'react';

import { css, jsx } from '@compiled/react';
import { di } from 'react-magnetic-di';

import { FadeIn, StaggeredEntrance } from '@atlaskit/motion';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import {
	type FlexibleUiActionName,
	InternalActionName,
	SmartLinkSize,
} from '../../../../../constants';
import {
	useFlexibleUiContext,
	useFlexibleUiOptionContext,
} from '../../../../../state/flexible-ui-context';
import useAISummaryAction from '../../../../../state/hooks/use-ai-summary-action';
import * as Actions from '../../actions';
import type { ActionMessage } from '../../actions/action/types';

import { ActionFooter } from './action-footer';
import type { ActionBlockProps } from './types';

const ignoreContainerPaddingStyles = css({
	display: 'flex',
	flexDirection: 'column',
	boxSizing: 'border-box',
	flexGrow: 1,
	width: 'calc(100% + var(--container-gap-left) + var(--container-gap-right))',
	// We have to find a better way to ignore container padding
	// This has become more and more of a common use case.
	marginLeft: 'calc(var(--container-gap-left)  * -1)',
	marginRight: 'calc(var(--container-gap-right) * -1)',
});

const DEFAULT_SORT_ORDER = ['PreviewAction', 'CopyLinkAction', 'AISummaryAction'];

const sort = (a: FlexibleUiActionName, b: FlexibleUiActionName) => {
	let idxA = DEFAULT_SORT_ORDER.indexOf(a);
	let idxB = DEFAULT_SORT_ORDER.indexOf(b);

	if (idxA === -1) {
		idxA = DEFAULT_SORT_ORDER.length;
	}

	if (idxB === -1) {
		idxB = DEFAULT_SORT_ORDER.length;
	}

	return idxA - idxB;
};

/**
 * Get container padding based on smart link size
 * To replace container/index.tsx getPadding() with space token for primitives
 */
export const getPrimitivesPaddingSpaceBySize = (size: SmartLinkSize) => {
	switch (size) {
		case SmartLinkSize.XLarge:
			return token('space.300');
		case SmartLinkSize.Large:
			return token('space.250');
		case SmartLinkSize.Medium:
			return token('space.200');
		case SmartLinkSize.Small:
		default:
			return token('space.100');
	}
};

const ActionBlock = ({
	blockRef,
	onClick: onClickCallback,
	size,
	spaceInline,
	className,
	testId = 'smart-block-action',
	is3PAuthRovoActionsExperimentOn,
}: ActionBlockProps) => {
	di(ActionFooter);

	const context = useFlexibleUiContext();
	const ui = useFlexibleUiOptionContext();

	const url = context?.url;

	const isRovoChatActionAvailable =
		is3PAuthRovoActionsExperimentOn && fg('platform_sl_3p_auth_rovo_action_kill_switch')
			? context?.actions?.[InternalActionName.RovoChatAction] !== undefined
			: undefined;

	const [message, setMessage] = useState<ActionMessage>();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const onLoadingChange = useCallback(
		(isLoading: boolean) => {
			setIsLoading(isLoading);
		},
		[setIsLoading],
	);

	const padding = !ui?.hidePadding
		? getPrimitivesPaddingSpaceBySize(ui?.size || SmartLinkSize.Medium)
		: undefined;

	const onClick = useCallback(
		(name: FlexibleUiActionName) => {
			setMessage(undefined);
			onClickCallback?.(name);
		},
		[onClickCallback],
	);

	const onError = useCallback((error: ActionMessage) => {
		setMessage(error);
	}, []);

	const actions = useMemo(() => {
		if (!context?.actions) {
			return;
		}

		const arr = fg('platform_sl_3p_auth_rovo_action_kill_switch')
			? is3PAuthRovoActionsExperimentOn && isRovoChatActionAvailable
				? [InternalActionName.RovoChatAction]
				: (Object.keys(context.actions) as FlexibleUiActionName[]).filter(
						(name) => name !== InternalActionName.RovoChatAction,
					)
			: (Object.keys(context.actions) as FlexibleUiActionName[]);

		arr.sort(sort);

		const renderAction = (name: FlexibleUiActionName, motionStyle?: React.CSSProperties) => {
			const Action = name in Actions ? Actions[name as keyof typeof Actions] : undefined;
			if (!Action) {
				return null;
			}

			const style =
				padding || motionStyle
					? { ...(motionStyle || {}), ...(padding && { paddingInline: padding }) }
					: undefined;
			return (
				<Action
					as="stack-item"
					spaceInline={spaceInline}
					key={name}
					onClick={() => onClick(name)}
					onError={onError}
					onLoadingChange={onLoadingChange}
					size={size || ui?.size}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/design-system/no-unsafe-design-token-usage
					style={style}
					hideTooltip={isLoading}
				/>
			);
		};

		return isRovoChatActionAvailable && fg('platform_sl_3p_auth_rovo_action_kill_switch') ? (
			<StaggeredEntrance columns={1}>
				{arr.map((name, index) => (
					<FadeIn duration={'large'} key={index}>
						{(motion) => renderAction(name, motion.style)}
					</FadeIn>
				))}
			</StaggeredEntrance>
		) : (
			arr.map((name) => renderAction(name))
		);
	}, [
		context?.actions,
		is3PAuthRovoActionsExperimentOn,
		isRovoChatActionAvailable,
		spaceInline,
		onError,
		onLoadingChange,
		size,
		ui?.size,
		padding,
		isLoading,
		onClick,
	]);

	if (
		!fg('platform_sl_3p_auth_rovo_action_kill_switch') ||
		(!isRovoChatActionAvailable && actions) ||
		!url
	) {
		return actions ? (
			<div
				css={[ignoreContainerPaddingStyles]}
				ref={blockRef}
				data-testid={testId}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={className}
			>
				{actions}
				<ActionFooter message={message} testId={testId} />
			</div>
		) : null;
	}

	const aiSummaryConfig = fg('platform_sl_3p_auth_rovo_action_kill_switch')
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useAISummaryAction(url)
		: undefined;

	return actions &&
		(aiSummaryConfig?.state.status === 'done' || aiSummaryConfig?.state.status === 'error') ? (
		<div
			css={[ignoreContainerPaddingStyles]}
			ref={blockRef}
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
		>
			{actions}
			<ActionFooter message={message} testId={testId} />
		</div>
	) : null;
};

export default ActionBlock;
