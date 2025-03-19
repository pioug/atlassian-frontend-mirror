/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useMemo } from 'react';

import { css, jsx } from '@compiled/react';

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

const actionGroupStylesOld = css({
	maxHeight: '2rem',
});

const actionGroupStyles = css({
	maxHeight: token('space.400'),
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
			{!hideProvider && (
				<Provider
					{...(fg('platform-linking-visual-refresh-v1') ? { appearance: 'subtle' } : {})}
					testId={`${testId}-provider`}
				/>
			)}
			{actions && hasActions ? (
				<ElementGroup
					testId="smart-element-group-actions"
					align={SmartLinkAlignment.Right}
					direction={SmartLinkDirection.Horizontal}
					{...(fg('platform-linking-visual-refresh-v1')
						? { css: size === SmartLinkSize.XLarge && actionGroupStyles }
						: { css: size === SmartLinkSize.XLarge && actionGroupStylesOld })}
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
