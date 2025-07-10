/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useMemo } from 'react';

import { css, jsx } from '@compiled/react';

import { browser } from '@atlaskit/linking-common/user-agent';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import {
	SmartLinkAlignment,
	SmartLinkDirection,
	SmartLinkSize,
	SmartLinkWidth,
} from '../../../../../../constants';
import { useFlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import { Provider } from '../../../elements';
import ActionGroup from '../../action-group';
import Block from '../../block';
import ElementGroup from '../../element-group';
import { filterActionItems } from '../../utils';
import type { FooterBlockProps } from '../types';

const actionGroupStyles = css({
	maxHeight: token('space.400'),
});

const safariStyles = css({
	height: '100%',
});

const FooterBlockResolvedView = (props: FooterBlockProps) => {
	const {
		actions,
		testId,
		onActionMenuOpenChange,
		size = SmartLinkSize.Medium,
		hideProvider,
	} = props;
	const context = useFlexibleUiContext();

	const hasActions = useMemo(
		() => filterActionItems(actions, context)?.length > 0,
		[actions, context],
	);

	const { safari = false } = fg('platform-linking-visual-refresh-v2')
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useMemo(() => browser(), [])
		: {};

	const onDropdownOpenChange = useCallback(
		(isOpen: boolean) => {
			if (onActionMenuOpenChange) {
				onActionMenuOpenChange({ isOpen });
			}
		},
		[onActionMenuOpenChange],
	);

	return (
		<Block {...props} testId={`${testId}-resolved-view`}>
			{!hideProvider && <Provider appearance="subtle" testId={`${testId}-provider`} />}
			{actions && hasActions ? (
				<ElementGroup
					testId="smart-element-group-actions"
					align={SmartLinkAlignment.Right}
					direction={SmartLinkDirection.Horizontal}
					css={[size === SmartLinkSize.XLarge && actionGroupStyles, safari && safariStyles]}
					width={SmartLinkWidth.Flexible}
				>
					<ActionGroup
						onDropdownOpenChange={onDropdownOpenChange}
						items={actions}
						appearance="default"
						size={size}
					/>
				</ElementGroup>
			) : null}
		</Block>
	);
};

export default FooterBlockResolvedView;
