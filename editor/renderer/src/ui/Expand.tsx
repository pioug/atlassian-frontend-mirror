/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import React, { useCallback, useRef, Suspense, lazy } from 'react';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import {
	ExpandIconWrapper,
	ExpandLayoutWrapperWithRef,
	expandMessages,
	WidthProvider,
} from '@atlaskit/editor-common/ui';
import {
	akEditorLineHeight,
	akEditorSwoopCubicBezier,
	akLayoutGutterOffset,
} from '@atlaskit/editor-shared-styles';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';
import { fg } from '@atlaskit/platform-feature-flags';

import _uniqueId from 'lodash/uniqueId';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';
import type { AnalyticsEventPayload } from '../analytics/events';
import { MODE, PLATFORM } from '../analytics/events';
import { ActiveHeaderIdConsumer } from './active-header-id-provider';
import type { RendererAppearance, RendererContentMode } from './Renderer/types';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

type StyleProps = {
	children?: React.ReactNode;
	'data-node-type'?: 'expand' | 'nestedExpand';
	'data-title'?: string;
	expanded?: boolean;
	focused?: boolean;
};

const titleStyles = css({
	outline: 'none',
	border: 'none',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	fontSize: `${14 / 16}rem`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/use-tokens-typography -- Ignored via go/DSP-18766
	lineHeight: akEditorLineHeight,
	fontWeight: token('font.weight.regular'),
	display: 'flex',
	flex: 1,
	margin: 0,
	padding: `0 0 0 ${token('space.050', '4px')}`,
	textAlign: 'left',
});

const titleStylesDense = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	fontSize: 'var(--ak-renderer-base-font-size)',
});

const containerStyles = css({
	borderWidth: token('border.width'),
	borderStyle: 'solid',
	borderColor: 'transparent',
	borderRadius: token('radius.small', '4px'),
	minHeight: '25px',
	background: token('color.background.neutral.subtle', 'transparent'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	transition: `background 0.3s ${akEditorSwoopCubicBezier}, border-color 0.3s ${akEditorSwoopCubicBezier}`,
	padding: token('space.0', '0px'),
	paddingBottom: token('space.0', '0px'),
	marginTop: token('space.050', '0.25rem'),
	marginBottom: 0,
	marginLeft: 0,
	marginRight: 0,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'td > :not(style):first-child, td > style:first-child + *': {
		marginTop: 0,
	},
});

const containerStylesExpanded = css({
	background: token('elevation.surface', 'rgba(255, 255, 255, 0.6)'),
	paddingBottom: token('space.100', '8px'),
	borderColor: token('color.border'),
});

const containerStylesFocused = css({
	borderColor: token('color.border.focused'),
});

const containerStylesDataNodeTypeExpand = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	marginLeft: `-${akLayoutGutterOffset}px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	marginRight: `-${akLayoutGutterOffset}px`,
});

const titleContainerStyles = css({
	display: 'flex',
	alignItems: 'flex-start',
	background: 'none',
	border: 'none',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	fontSize: `${14 / 16}rem`,
	width: '100%',
	color: token('color.text.subtle'),
	overflow: 'hidden',
	cursor: 'pointer',
	padding: token('space.100', '8px'),
	'&:focus': {
		outline: 0,
	},
});

const titleContainerStylesExpanded = css({
	paddingBottom: token('space.0', '0px'),
});

const contentContainerStyles = css({
	paddingTop: token('space.0', '0px'),
	marginLeft: token('space.050', '4px'),
	paddingRight: token('space.200', '16px'),
	paddingLeft: token('space.400', '32px'),
	display: 'flow-root',
	visibility: 'hidden',

	// The follow rules inside @supports block are added as a part of ED-8893
	// The fix is targeting mobile bridge on iOS 12 or below,
	// We should consider remove this fix when we no longer support iOS 12
	'@supports not (display: flow-root)': {
		width: '100%',
		boxSizing: 'border-box',
	},
});

const contentContainerStylesExpanded = css({
	paddingTop: token('space.100', '8px'),
	visibility: 'visible',
});

const contentContainerStylesNotExpanded = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.expand-content-wrapper, .nestedExpand-content-wrapper': {
		/* We visually hide the content here to preserve the content during copy+paste */
		/* Do not add text nowrap here because inline comment navigation depends on the location of the text */
		width: '100%',
		display: 'block',
		height: 0,
		overflow: 'hidden',
		clip: 'rect(1px, 1px, 1px, 1px)',
		userSelect: 'none',
	},
});

const clearNextSiblingMarginTopStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& + *': {
		// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		marginTop: '0 !important',
	},
});

// Lazy-loaded children component
const LazyChildren = lazy(() => {
	return Promise.resolve({
		default: ({ children }: { children: React.ReactNode }) => {
			return React.createElement(React.Fragment, null, children);
		},
	});
});

const Container = (props: StyleProps) => {
	return (
		<div
			css={[
				containerStyles,
				props['data-node-type'] === 'expand' && containerStylesDataNodeTypeExpand,
				props.expanded && containerStylesExpanded,
				props.focused && containerStylesFocused,
			]}
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
		>
			{props.children}
		</div>
	);
};

const TitleContainer = (props: StyleProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
	const { expanded, ...buttonProps } = props;

	return (
		// eslint-disable-next-line @atlaskit/design-system/no-html-button
		<button
			type="button"
			css={[titleContainerStyles, expanded && titleContainerStylesExpanded]}
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...buttonProps}
		>
			{props.children}
		</button>
	);
};

TitleContainer.displayName = 'TitleContainerButton';

const ContentContainer = (props: StyleProps) => {
	return (
		<div
			css={[
				contentContainerStyles,
				props.expanded && contentContainerStylesExpanded,
				!props.expanded && contentContainerStylesNotExpanded,
			]}
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
		>
			{props.children}
		</div>
	);
};

export interface ExpandProps {
	children: React.ReactNode;
	fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
	localId?: string;
	nestedHeaderIds?: Array<string>;
	nodeType: 'expand' | 'nestedExpand';
	rendererAppearance?: RendererAppearance;
	rendererContentMode?: RendererContentMode;
	title: string;
}

function fireExpandToggleAnalytics(
	nodeType: ExpandProps['nodeType'],
	expanded: boolean,
	fireAnalyticsEvent: ExpandProps['fireAnalyticsEvent'],
) {
	if (!fireAnalyticsEvent) {
		return;
	}

	fireAnalyticsEvent({
		action: ACTION.TOGGLE_EXPAND,
		actionSubject: nodeType === 'expand' ? ACTION_SUBJECT.EXPAND : ACTION_SUBJECT.NESTED_EXPAND,
		attributes: {
			platform: PLATFORM.WEB,
			mode: MODE.RENDERER,
			expanded: !expanded,
		},
		eventType: EVENT_TYPE.TRACK,
	});
}

function Expand({
	title,
	children,
	nodeType,
	intl,
	fireAnalyticsEvent,
	localId,
	nestedHeaderIds,
	rendererContentMode,
}: ExpandProps & WrappedComponentProps) {
	const [expanded, setExpanded] = React.useState(false);
	const [focused, setFocused] = React.useState(false);
	const [hasLoadedChildren, setHasLoadedChildren] = React.useState(false);

	const isMobile = false;
	const label = intl.formatMessage(
		expanded ? expandMessages.collapseNode : expandMessages.expandNode,
	);
	const { current: id } = useRef(_uniqueId('expand-title-'));

	const handleFocus = useCallback(() => setFocused(true), []);
	const handleBlur = useCallback(() => setFocused(false), []);

	const isCompactModeSupported =
		expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
		(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
			fg('platform_editor_content_mode_button_mvp'));
	const isCompact = rendererContentMode === 'compact' && isCompactModeSupported;

	return (
		<Container
			data-testid={`expand-container-${nodeType}-${id}`}
			data-node-type={nodeType}
			data-title={title}
			data-expanded={expanded}
			data-local-id={localId}
			expanded={expanded}
			focused={focused}
		>
			{nestedHeaderIds && nestedHeaderIds.length > 0 ? (
				<ActiveHeaderIdConsumer
					nestedHeaderIds={nestedHeaderIds}
					onNestedHeaderIdMatch={() => {
						if (!hasLoadedChildren) {
							setHasLoadedChildren(true);
						}
						setExpanded(true);
					}}
				/>
			) : null}
			<TitleContainer
				onClick={(e: React.SyntheticEvent) => {
					e.preventDefault();
					e.stopPropagation();
					fireExpandToggleAnalytics(nodeType, expanded, fireAnalyticsEvent);

					// Mark children as loaded when expanding for the first time
					if (!expanded && !hasLoadedChildren) {
						setHasLoadedChildren(true);
					}

					setExpanded(!expanded);
					e.persist();
					// @ts-ignore detail doesn't exist on type
					e.detail ? handleBlur() : handleFocus();
				}}
				onFocus={handleFocus}
				onBlur={handleBlur}
				aria-labelledby={id}
				aria-expanded={expanded}
				contentEditable={false}
				expanded={expanded}
			>
				{isMobile ? (
					<ExpandIconWrapper expanded={expanded}>
						<ChevronRightIcon label={label} spacing="spacious" size="small" />
					</ExpandIconWrapper>
				) : (
					<Tooltip
						content={label}
						position="top"
						// @ts-ignore: [PIT-1685] Fails in post-office due to backwards incompatibility issue with React 18
						tag={ExpandLayoutWrapperWithRef}
						testId={'tooltip'}
					>
						<ExpandIconWrapper expanded={expanded}>
							<ChevronRightIcon label={label} spacing="spacious" size="small" />
						</ExpandIconWrapper>
					</Tooltip>
				)}
				<span css={[titleStyles, isCompact && titleStylesDense]} id={id}>
					{title || intl.formatMessage(expandMessages.expandDefaultTitle)}
				</span>
			</TitleContainer>
			<ContentContainer expanded={expanded}>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
				<div className={`${nodeType}-content-wrapper`}>
					<WidthProvider>
						<div css={clearNextSiblingMarginTopStyle} />
						{fg('hot-121622_lazy_load_expand_content') ? (
							hasLoadedChildren ? (
								// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx
								<Suspense fallback={<div>Loading...</div>}>
									<LazyChildren>{children}</LazyChildren>
								</Suspense>
							) : null
						) : (
							children
						)}
					</WidthProvider>
				</div>
			</ContentContainer>
		</Container>
	);
}

export default injectIntl(Expand);
