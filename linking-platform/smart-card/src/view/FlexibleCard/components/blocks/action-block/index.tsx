/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useMemo, useState } from 'react';

import { css, jsx } from '@compiled/react';
import { di } from 'react-magnetic-di';

import { token } from '@atlaskit/tokens';

import { type FlexibleUiActionName, SmartLinkSize } from '../../../../../constants';
import {
	useFlexibleUiContext,
	useFlexibleUiOptionContext,
} from '../../../../../state/flexible-ui-context';
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
}: ActionBlockProps) => {
	di(ActionFooter);

	const context = useFlexibleUiContext();
	const ui = useFlexibleUiOptionContext();

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

		const arr = Object.keys(context.actions) as FlexibleUiActionName[];

		arr.sort(sort);

		return arr.map((name) => {
			const Action = name in Actions ? Actions[name as keyof typeof Actions] : undefined;

			return Action ? (
				<Action
					as="stack-item"
					spaceInline={spaceInline}
					key={name}
					onClick={() => onClick(name)}
					onError={onError}
					onLoadingChange={onLoadingChange}
					size={size || ui?.size}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/design-system/no-unsafe-design-token-usage
					style={padding && { paddingInline: padding }}
					hideTooltip={isLoading}
				/>
			) : null;
		});
	}, [
		context?.actions,
		spaceInline,
		onError,
		onLoadingChange,
		size,
		ui?.size,
		padding,
		isLoading,
		onClick,
	]);

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
};

export default ActionBlock;
