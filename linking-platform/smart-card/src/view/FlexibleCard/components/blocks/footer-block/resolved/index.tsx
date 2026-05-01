/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useMemo, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { browser } from '@atlaskit/linking-common/user-agent';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';
import { WidthObserver } from '@atlaskit/width-detector';

import {
	ActionName,
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

const providerStyles = css({
	alignSelf: 'center',
});

const rovoActionStyles = css({
	position: 'relative',
});

const FooterBlockResolvedView = (props: FooterBlockProps): JSX.Element => {
	const {
		actions,
		testId,
		onActionMenuOpenChange,
		size = SmartLinkSize.Medium,
		hideProvider,
		isPreviewBlockErrored,
	} = props;
	const context = useFlexibleUiContext();
	const isRovoSupportedFeature =
		!!context?.actions?.[ActionName.RovoChatAction] &&
		fg('platform_sl_3p_auth_rovo_block_card_kill_switch');
	const hasPreview = isRovoSupportedFeature && !!context?.preview && !isPreviewBlockErrored;

	const hasActions = useMemo(
		() => filterActionItems(actions, context)?.length > 0,
		[actions, context],
	);

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { safari = false } = useMemo(() => browser(), []);

	const onDropdownOpenChange = useCallback(
		(isOpen: boolean) => {
			if (onActionMenuOpenChange) {
				onActionMenuOpenChange({ isOpen });
			}
		},
		[onActionMenuOpenChange],
	);

	// WidthObserver fires whenever the footer's available width changes.
	const [containerWidth, setContainerWidth] = useState<number | undefined>(undefined);

	return (
		<Block {...props} testId={`${testId}-resolved-view`}>
			{!hideProvider && (
				<Provider
					appearance="subtle"
					testId={`${testId}-provider`}
					hideLabel={hasPreview}
					css={[isRovoSupportedFeature && providerStyles]}
				/>
			)}
			{actions && hasActions ? (
				<ElementGroup
					testId="smart-element-group-actions"
					align={SmartLinkAlignment.Right}
					direction={SmartLinkDirection.Horizontal}
					css={[
						size === SmartLinkSize.XLarge && actionGroupStyles,
						safari && safariStyles,
						isRovoSupportedFeature && rovoActionStyles,
					]}
					width={SmartLinkWidth.Flexible}
				>
					{isRovoSupportedFeature && (
						<WidthObserver setWidth={setContainerWidth} offscreen={true} />
					)}
					<ActionGroup
						onDropdownOpenChange={onDropdownOpenChange}
						items={actions}
						appearance={isRovoSupportedFeature ? 'subtle' : 'default'}
						size={isRovoSupportedFeature ? SmartLinkSize.Small : size}
						containerWidth={isRovoSupportedFeature ? containerWidth : undefined}
					/>
				</ElementGroup>
			) : null}
		</Block>
	);
};

export default FooterBlockResolvedView;
