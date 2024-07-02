/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { xcss } from '@atlaskit/primitives';
import { useCallback, useMemo, useState } from 'react';
import { SmartLinkSize, type FlexibleUiActionName } from '../../../../../constants';
import {
	useFlexibleUiContext,
	useFlexibleUiOptionContext,
} from '../../../../../state/flexible-ui-context';
import * as Actions from '../../actions';
import type { ActionMessage } from '../../actions/action/types';
import { getPrimitivesPaddingSpaceBySize } from '../../utils';
import { ActionFooter } from './action-footer';
import type { ActionBlockProps } from './types';
import { di } from 'react-magnetic-di';

const ignoreContainerPaddingStyles = css({
	display: 'flex',
	flexDirection: 'column',
	boxSizing: 'border-box',
	flexGrow: 1,
	width: '100%',
	// We have to find a better way to ignore container padding
	// This has become more and more of a common use case.
	marginLeft: 'calc(var(--container-gap-left) * -1)',
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

const ActionBlock = ({
	blockRef,
	onClick: onClickCallback,
	size,
	spaceInline,
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
					size={size}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
					xcss={xcss({ paddingInline: padding })}
					hideTooltip={isLoading}
				/>
			) : null;
		});
	}, [context?.actions, onClick, onError, padding, size, spaceInline, isLoading, onLoadingChange]);

	return actions ? (
		<div css={ignoreContainerPaddingStyles} ref={blockRef} data-testid={testId}>
			{actions}
			<ActionFooter message={message} paddingInline={padding} testId={testId} />
		</div>
	) : null;
};

export default ActionBlock;
