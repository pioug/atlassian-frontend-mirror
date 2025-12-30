/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import QuestionsIcon from '@atlaskit/icon/core/question-circle';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { ACTION_SUBJECT_ID } from '../../analytics';
import { unsupportedContentMessages } from '../../messages/unsupportedContent';
import type { UnsupportedContentTooltipPayload } from '../../utils';
import { trackUnsupportedContentTooltipDisplayedFor } from '../../utils/track-unsupported-content';
import { getUnsupportedContent } from '../unsupported-content-helper';

const blockNodeStyle = css({
	background: token('color.background.disabled'),
	border: `${token('border.width')} dashed ${token('color.border.disabled')}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: token('radius.small', '3px'),
	boxSizing: 'border-box',
	cursor: 'default',
	display: 'flex',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	fontSize: relativeFontSizeToBase16(14),
	margin: `${token('space.100', '8px')} 0`,
	minHeight: '24px',
	padding: token('space.150', '12px'),
	textAlign: 'center',
	verticalAlign: 'text-bottom',
	minWidth: '120px',
	alignItems: 'center',
	justifyContent: 'center',
});

export interface Props {
	children?: React.ReactNode;
	dispatchAnalyticsEvent?: (payload: UnsupportedContentTooltipPayload) => void;
	node?: PMNode;
}

const UnsupportedBlockNode = ({
	node,
	intl,
	dispatchAnalyticsEvent,
}: Props & WrappedComponentProps) => {
	const message = getUnsupportedContent(
		unsupportedContentMessages.unsupportedBlockContent,
		unsupportedContentMessages.unsupportedBlockContent.defaultMessage + ':',
		node,
		intl,
	);

	const tooltipContent = intl.formatMessage(unsupportedContentMessages.unsupportedContentTooltip);

	const { current: style } = useRef({ padding: '4px' });

	const originalNodeType = node?.attrs.originalValue.type;

	const tooltipOnShowHandler = useCallback(
		() =>
			dispatchAnalyticsEvent &&
			trackUnsupportedContentTooltipDisplayedFor(
				dispatchAnalyticsEvent,
				ACTION_SUBJECT_ID.ON_UNSUPPORTED_BLOCK,
				originalNodeType,
			),
		[dispatchAnalyticsEvent, originalNodeType],
	);
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		<div css={blockNodeStyle} className="unsupported">
			{message}
			<Tooltip
				content={tooltipContent}
				hideTooltipOnClick={false}
				position="bottom"
				onShow={tooltipOnShowHandler}
				strategy="absolute"
			>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<span style={style}>
					<QuestionsIcon label="?" LEGACY_size="small" />
				</span>
			</Tooltip>
		</div>
	);
};

export default injectIntl(UnsupportedBlockNode);
