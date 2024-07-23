/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import React, { useCallback, useMemo, useRef } from 'react';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import {
	clearNextSiblingMarginTopStyle,
	ExpandIconWrapper,
	ExpandLayoutWrapperWithRef,
	expandMessages,
	sharedExpandStyles,
	WidthProvider,
} from '@atlaskit/editor-common/ui';
import { akEditorLineHeight, relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import { fontSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';
import _uniqueId from 'lodash/uniqueId';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';
import type { AnalyticsEventPayload } from '../analytics/events';
import { MODE, PLATFORM } from '../analytics/events';
import { getPlatform } from '../utils';
import { ActiveHeaderIdConsumer } from './active-header-id-provider';
import type { RendererAppearance } from './Renderer/types';

export type StyleProps = {
	expanded?: boolean;
	focused?: boolean;
	'data-node-type'?: 'expand' | 'nestedExpand';
	'data-title'?: string;
	children?: React.ReactNode;
};

const titleStyles = css({
	outline: 'none',
	border: 'none',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	fontSize: relativeFontSizeToBase16(fontSize()),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	lineHeight: akEditorLineHeight,
	fontWeight: 'normal',
	display: 'flex',
	flex: 1,
	margin: 0,
	padding: `0 0 0 ${token('space.050', '4px')}`,
	textAlign: 'left',
});

const Container = (props: StyleProps) => {
	const paddingBottom = props.expanded ? token('space.100', '8px') : token('space.0', '0px');
	const sharedContainerStyles = sharedExpandStyles.containerStyles(props);

	// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
	const styles = () => css`
		${sharedContainerStyles()}
		padding: 0;
		padding-bottom: ${paddingBottom};
	`;

	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
		<div css={styles} {...props}>
			{props.children}
		</div>
	);
};

const TitleContainer = (props: StyleProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
	const paddingBottom = !props.expanded ? token('space.100', '8px') : token('space.0', '0px');

	// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
	const styles = () => css`
		${sharedExpandStyles.titleContainerStyles()}
		padding: ${token('space.100', '8px')};
		padding-bottom: ${paddingBottom};
	`;

	const { expanded, ...buttonProps } = props;

	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
		<button type="button" css={styles} {...buttonProps}>
			{props.children}
		</button>
	);
};

TitleContainer.displayName = 'TitleContainerButton';

const ContentContainer = (props: StyleProps) => {
	const sharedContentStyles = sharedExpandStyles.contentStyles(props);
	const visibility = props.expanded ? 'visible' : 'hidden';

	// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression  -- needs manual remediation
	const styles = () => css`
		${sharedContentStyles()};
		padding-right: ${token('space.200', '16px')};
		padding-left: ${token('space.400', '32px')};
		visibility: ${visibility};
	`;

	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
		<div css={styles} {...props}>
			{props.children}
		</div>
	);
};

export interface ExpandProps {
	title: string;
	nodeType: 'expand' | 'nestedExpand';
	children: React.ReactNode;
	fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
	nestedHeaderIds?: Array<string>;
	rendererAppearance?: RendererAppearance;
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
	nestedHeaderIds,
	rendererAppearance,
}: ExpandProps & WrappedComponentProps) {
	const [expanded, setExpanded] = React.useState(false);
	const [focused, setFocused] = React.useState(false);

	const isMobile = useMemo(
		() => getPlatform(rendererAppearance) === 'mobile',
		[rendererAppearance],
	);
	const label = intl.formatMessage(
		expanded ? expandMessages.collapseNode : expandMessages.expandNode,
	);
	const { current: id } = useRef(_uniqueId('expand-title-'));

	const handleFocus = useCallback(() => setFocused(true), []);
	const handleBlur = useCallback(() => setFocused(false), []);

	return (
		<Container
			data-testid={`expand-container-${nodeType}-${id}`}
			data-node-type={nodeType}
			data-title={title}
			data-expanded={expanded}
			expanded={expanded}
			focused={focused}
		>
			{nestedHeaderIds && nestedHeaderIds.length > 0 ? (
				<ActiveHeaderIdConsumer
					nestedHeaderIds={nestedHeaderIds}
					onNestedHeaderIdMatch={() => setExpanded(true)}
				/>
			) : null}
			<TitleContainer
				onClick={(e: React.SyntheticEvent) => {
					e.preventDefault();
					e.stopPropagation();
					fireExpandToggleAnalytics(nodeType, expanded, fireAnalyticsEvent);
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
						<ChevronRightIcon label={label} />
					</ExpandIconWrapper>
				) : (
					<Tooltip
						content={label}
						position="top"
						tag={ExpandLayoutWrapperWithRef}
						testId={'tooltip'}
					>
						<ExpandIconWrapper expanded={expanded}>
							<ChevronRightIcon label={label} />
						</ExpandIconWrapper>
					</Tooltip>
				)}
				<span css={titleStyles} id={id}>
					{title || intl.formatMessage(expandMessages.expandDefaultTitle)}
				</span>
			</TitleContainer>
			<ContentContainer expanded={expanded}>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
				<div className={`${nodeType}-content-wrapper`}>
					<WidthProvider>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
						<div css={clearNextSiblingMarginTopStyle} />
						{children}
					</WidthProvider>
				</div>
			</ContentContainer>
		</Container>
	);
}

export default injectIntl(Expand);
