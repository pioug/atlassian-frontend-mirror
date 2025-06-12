/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';

import { SmartLinkStatus } from '../../../../../constants';
import { useMouseDownEvent } from '../../../../../state/analytics/useLinkClicked';
import { useFlexibleCardContext } from '../../../../../state/flexible-ui-context';
import { Title } from '../../elements';
import ActionGroup from '../action-group';

import TitleBlockErroredView from './errored';
import TitleBlockResolvedView from './resolved';
import TitleBlockResolvingView from './resolving';
import { type TitleBlockProps } from './types';

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
			return TitleBlockResolvingView;
		case SmartLinkStatus.Resolved:
			return TitleBlockResolvedView;
		case SmartLinkStatus.Unauthorized:
		case SmartLinkStatus.Forbidden:
		case SmartLinkStatus.NotFound:
		case SmartLinkStatus.Errored:
		case SmartLinkStatus.Fallback:
		default:
			return TitleBlockErroredView;
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
const TitleBlock = ({
	actions = [],
	anchorTarget,
	hideTitleTooltip,
	maxLines,
	onActionMenuOpenChange,
	onClick,
	status: statusProp = SmartLinkStatus.Fallback,
	showActionOnHover,
	testId = 'smart-block-title',
	text,
	icon,
	theme,
	hideRetry,
	metadataPosition,
	hideIcon = false,
	className,
	anchorRef,
	CompetitorPrompt,
	url,
	hideIconLoadingSkeleton,
	...props
}: TitleBlockProps) => {
	const cardContext = fg('platform-linking-flexible-card-context')
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useFlexibleCardContext()
		: undefined;
	const { status = SmartLinkStatus.Fallback, ui } = cardContext || {};

	if (!fg('platform-linking-flexible-card-unresolved-action')) {
		if (hideRetry && props.retry) {
			delete props.retry;
		}
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
			{...(fg('platform-linking-flexible-card-context') ? undefined : { onClick })}
			onMouseDown={onMouseDown}
			target={anchorTarget}
			theme={fg('platform-linking-flexible-card-context') ? ui?.theme : theme}
			anchorRef={anchorRef}
			{...overrideText}
		/>
	);

	const Component = getTitleBlockViewComponent(
		fg('platform-linking-flexible-card-context') ? status : statusProp,
	);

	return (
		<Component
			{...props}
			css={[showActionOnHover && !actionDropdownOpen && actionStyles]}
			actionGroup={actionGroup}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
			testId={testId}
			title={title}
			metadataPosition={metadataPosition}
			hideIcon={hideIcon}
			{...(fg('platform-linking-flexible-card-unresolved-action') ? { hideRetry } : undefined)}
			icon={icon}
			hideIconLoadingSkeleton={hideIconLoadingSkeleton}
			size={fg('platform-linking-flexible-card-context') ? props.size ?? ui?.size : props?.size}
			{...(fg('platform-linking-flexible-card-context') ? undefined : { theme })}
			CompetitorPrompt={CompetitorPrompt}
			url={url}
		/>
	);
};

export default TitleBlock;
