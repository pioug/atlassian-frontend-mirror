/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';

import { SmartLinkStatus } from '../../../../../constants';
import { useMouseDownEvent } from '../../../../../state/analytics/useLinkClicked';
import { Title } from '../../elements';
import ActionGroup from '../action-group';

import { TitleBlockErroredViewNew } from './errored';
import { TitleBlockResolvedViewNew } from './resolved';
import { TitleBlockResolvingViewNew } from './resolving';
import TitleBlockOld from './TitleBlockOld';
import { type TitleBlockProps } from './types';

const styles = css({});
const actionStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.actions-button-group': {
		opacity: 0,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&:hover .actions-button-group, .actions-button-group:focus-within': {
		opacity: 1,
	},
});

const getTitleBlockViewComponent = (status: SmartLinkStatus) => {
	switch (status) {
		case SmartLinkStatus.Pending:
		case SmartLinkStatus.Resolving:
			return TitleBlockResolvingViewNew;
		case SmartLinkStatus.Resolved:
			return TitleBlockResolvedViewNew;
		case SmartLinkStatus.Unauthorized:
		case SmartLinkStatus.Forbidden:
		case SmartLinkStatus.NotFound:
		case SmartLinkStatus.Errored:
		case SmartLinkStatus.Fallback:
		default:
			return TitleBlockErroredViewNew;
	}
};

/**
 * Represents a TitleBlock, which is the foundation of Flexible UI.
 * This contains an icon, the link, and any associated metadata and actions in one block.
 * The TitleBlock will also render differently given the state of the smart link.
 * This can be found in the corresponding Resolving, Resolved and Errored views.
 * @public
 * @param {TitleBlockProps} TitleBlockProps
 * @see Block
 * @see TitleBlockResolvingViewNew
 * @see TitleBlockResolvedViewNew
 * @see TitleBlockErroredViewNew
 */
const TitleBlockNew = ({
	actions = [],
	anchorTarget,
	hideTitleTooltip,
	maxLines,
	onActionMenuOpenChange,
	onClick,
	status = SmartLinkStatus.Fallback,
	showActionOnHover,
	testId = 'smart-block-title',
	text,
	icon,
	theme,
	hideRetry,
	metadataPosition,
	hideIcon = false,
	className,
	...props
}: TitleBlockProps) => {
	if (hideRetry && props.retry) {
		delete props.retry;
	}

	const [actionDropdownOpen, setActionDropdownOpen] = useState(false);
	const onDropdownOpenChange = useCallback(
		(isOpen: boolean) => {
			setActionDropdownOpen(isOpen);
			if (onActionMenuOpenChange) {
				onActionMenuOpenChange({ isOpen });
			}
		},
		[onActionMenuOpenChange],
	);
	const actionGroup = actions.length > 0 && (
		<ActionGroup
			items={actions}
			visibleButtonsNum={showActionOnHover ? 1 : 2}
			onDropdownOpenChange={onDropdownOpenChange}
		/>
	);
	const overrideText = !!text ? { text } : {};
	const onMouseDown = useMouseDownEvent();
	const title = (
		<Title
			hideTooltip={hideTitleTooltip}
			maxLines={maxLines}
			onClick={onClick}
			onMouseDown={onMouseDown}
			target={anchorTarget}
			theme={theme}
			{...overrideText}
		/>
	);

	const Component = getTitleBlockViewComponent(status);
	return (
		<div css={[showActionOnHover && !actionDropdownOpen ? actionStyles : styles]}>
			<Component
				{...props}
				actionGroup={actionGroup}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={className}
				testId={testId}
				title={title}
				metadataPosition={metadataPosition}
				hideIcon={hideIcon}
				icon={icon}
			/>
		</div>
	);
};

const TitleBlock = (props: TitleBlockProps): JSX.Element => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <TitleBlockNew {...props} />;
	} else {
		return <TitleBlockOld {...props} />;
	}
};

export default TitleBlock;
