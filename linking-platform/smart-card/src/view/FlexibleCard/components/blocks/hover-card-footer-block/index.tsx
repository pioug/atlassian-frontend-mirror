/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useMemo } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { ActionName, type FlexibleUiActionName } from '../../../../../constants';
import { useFlexibleCardContext } from '../../../../../state/flexible-ui-context';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import * as Actions from '../../actions';
import { Provider } from '../../elements';
import Block from '../block';

import type { ResolvedHoverCardFooterBlockProps } from './types';

/**
 * Allowed footer actions for HoverCard, in display order. Fetched from context.
 * @featureGate platform_sl_3p_auth_rovo_action_kill_switch
 */
const HIDDEN_HOVER_CARD_FOOTER_ACTIONS: FlexibleUiActionName[] = [ActionName.RovoChatAction];

const ignoreContainerMarginStyles = css({
	boxSizing: 'border-box',
	width: 'calc(100% + var(--container-gap-left) + var(--container-gap-right))',
	marginLeft: 'calc(var(--container-gap-left)  * -1)',
	marginRight: 'calc(var(--container-gap-right) * -1)',
	marginBottom: 'calc(var(--container-padding) * -1)',
	height: token('space.600'),
	paddingInline: token('space.200'),
	paddingBlock: token('space.150'),
});

const elevatedFooterStyles = css({
	borderTop: `1px solid ${token('color.border')}`,
	backgroundColor: token('elevation.surface.sunken'),
	gap: token('space.100'),
	borderBottomLeftRadius: token('radius.large'),
	borderBottomRightRadius: token('radius.large'),
});

const providerStyles = css({
	height: token('space.300'),
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-start',
	boxSizing: 'border-box',
	flexGrow: 1,
});

const actionsStyles = css({
	display: 'flex',
	gap: 0,
	marginLeft: 'auto',
	alignItems: 'center',
	boxSizing: 'border-box',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& *': {
		paddingLeft: token('space.0'),
		paddingRight: token('space.0'),
		paddingTop: token('space.0'),
		paddingBottom: token('space.0'),
		marginTop: token('space.0'),
		marginBottom: token('space.0'),
		marginLeft: token('space.0'),
		marginRight: token('space.0'),
		gap: token('space.0'),
		rowGap: token('space.0'),
		columnGap: token('space.0'),
		'&:hover': {
			borderRadius: token('radius.small'),
		},
	},
});

/**
 * Footer block for HoverCard resolved view: Provider on the left, ActionGroup (up to 4 actions) on the right.
 * @internal
 * @param {ResolvedHoverCardFooterBlockProps} ResolvedHoverCardFooterBlockProps
 * @see Block
 */
const ResolvedHoverCardFooterBlock = ({
	testId = 'smart-hover-card-footer-block',
	onActionClick,
	hideProvider,
	...props
}: ResolvedHoverCardFooterBlockProps): React.JSX.Element => {
	const cardContext = useFlexibleCardContext();
	const context = useFlexibleUiContext();

	const size = props.size ?? cardContext?.ui?.size;

	const actions = useMemo(() => {
		if (!context?.actions) {
			return [];
		}

		let arr = Object.keys(context.actions) as FlexibleUiActionName[];
		arr = arr.filter(
			(name) => !HIDDEN_HOVER_CARD_FOOTER_ACTIONS.includes(name as ActionName),
		) as FlexibleUiActionName[];

		return arr.map((name) => {
			const Action = name in Actions ? Actions[name as keyof typeof Actions] : undefined;

			return Action ? (
				<Action
					key={name}
					as="stack-item"
					content=""
					onClick={() => onActionClick?.(name as FlexibleUiActionName)}
					size={size}
					iconSize={'small'}
				/>
			) : null;
		});
	}, [context?.actions, onActionClick, size]);

	return (
		<Block
			{...props}
			size={size}
			testId={`${testId}-resolved-view`}
			css={[ignoreContainerMarginStyles, elevatedFooterStyles]}
		>
			{!hideProvider && (
				<div css={providerStyles}>
					<Provider appearance="subtle" testId={`${testId}-provider`} />
				</div>
			)}
			{actions.length > 0 ? (
				<div css={actionsStyles} data-testid={`${testId}-actions`}>
					{actions}
				</div>
			) : null}
		</Block>
	);
};

export default ResolvedHoverCardFooterBlock;
