/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { Dispatch, SetStateAction } from 'react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';
import TextWrapIcon from '@atlaskit/icon/core/text-wrap';

import Button from '@atlaskit/button/custom-theme-button';
import { codeBlockButtonMessages } from '@atlaskit/editor-common/messages';
import Icon from '@atlaskit/icon';
import Tooltip from '@atlaskit/tooltip';
import AnalyticsContext from '../../../../analytics/analyticsContext';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from '../../../../analytics/enums';
import { fg } from '@atlaskit/platform-feature-flags';

const WrapIcon = () => {
	return (
		<svg width="24" height="24" fill="none" viewBox="0 0 24 24">
			<g fill="currentColor" clipPath="url(#clip0_654_431)">
				<path
					d="M20 4h-1v16h1V4ZM3 8a1 1 0 0 1 1-1h9.5a4.5 4.5 0 1 1 0 9h-2.086l.293.293a1 1 0 0 1-1.414 1.414l-2-2a1 1 0 0 1 0-1.414l2-2a1 1 0 0 1 1.414 1.414l-.293.293H13.5a2.5 2.5 0 0 0 0-5H4a1 1 0 0 1-1-1Z"
					clipRule="evenodd"
					fillRule="evenodd"
				/>
			</g>
		</svg>
	);
};

type Props = {
	setWrapLongLines: Dispatch<SetStateAction<boolean>>;
	wrapLongLines?: boolean;
};

const CodeBlockWrapButton = ({
	setWrapLongLines,
	wrapLongLines,
	intl,
}: Props & WrappedComponentProps) => {
	const wrapMessage = intl.formatMessage(
		wrapLongLines ? codeBlockButtonMessages.unwrapCode : codeBlockButtonMessages.wrapCode,
	);

	return (
		<AnalyticsContext.Consumer>
			{({ fireAnalyticsEvent }) => (
				<span>
					<Tooltip content={wrapMessage} hideTooltipOnClick={false} position="top">
						<Button
							appearance="subtle"
							aria-haspopup={true}
							aria-label={wrapMessage}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className={`wrap-code ${wrapLongLines ? 'clicked' : ''}`}
							iconBefore={
								fg('platform-custom-icon-migration') ? (
									<TextWrapIcon label="" />
								) : (
									<Icon glyph={WrapIcon} label="" />
								)
							}
							isSelected={wrapLongLines}
							onClick={(event) => {
								fireAnalyticsEvent({
									// @ts-expect-error - Type 'ACTION.CLICKED' is not assignable to type 'ACTION.CLICKED | ACTION.MEDIA_LINK_TRANSFORMED | ACTION.STARTED | ACTION.TOGGLE_EXPAND | ACTION.UNSUPPORTED_CONTENT_ENCOUNTERED | ACTION.VISITED | ACTION.RENDERED | ACTION.INVALID_PROSEMIRROR_DOCUMENT | ACTION.CRASHED | ... 6 more ... | AnnotationActionType'
									// This error was introduced after upgrading to TypeScript 5
									action: ACTION.CLICKED,
									actionSubject: ACTION_SUBJECT.BUTTON,
									actionSubjectId: ACTION_SUBJECT_ID.CODEBLOCK_WRAP,
									attributes: {
										wrapped: !wrapLongLines,
									},
									eventType: EVENT_TYPE.UI,
								});

								setWrapLongLines(!wrapLongLines);

								event.stopPropagation();
							}}
							spacing="compact"
						/>
					</Tooltip>
				</span>
			)}
		</AnalyticsContext.Consumer>
	);
};

export default injectIntl(CodeBlockWrapButton);
