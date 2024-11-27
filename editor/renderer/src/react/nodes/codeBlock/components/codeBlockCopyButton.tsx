/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { useState } from 'react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';
import Tooltip from '@atlaskit/tooltip';
import Button from '@atlaskit/button/custom-theme-button';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import { copyTextToClipboard } from '../../../utils/clipboard';
import { codeBlockButtonMessages } from '@atlaskit/editor-common/messages';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from '../../../../analytics/enums';
import AnalyticsContext from '../../../../analytics/analyticsContext';

type Props = {
	content: string;
};

const CopyButton = ({ content, intl }: Props & WrappedComponentProps) => {
	const [tooltip, setTooltip] = useState<string>(
		intl.formatMessage(codeBlockButtonMessages.copyCodeToClipboard),
	);
	const [className, setClassName] = useState<string>('copy-to-clipboard');
	const onMouseLeave = () => {
		setTooltip(intl.formatMessage(codeBlockButtonMessages.copyCodeToClipboard));
		setClassName('copy-to-clipboard');
	};
	return (
		<AnalyticsContext.Consumer>
			{({ fireAnalyticsEvent }) => (
				<span>
					<Tooltip content={tooltip} hideTooltipOnClick={false} position="top">
						{/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
						<div onMouseLeave={onMouseLeave}>
							<Button
								appearance="subtle"
								aria-haspopup={true}
								aria-label={tooltip}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
								className={className}
								iconBefore={<CopyIcon label={tooltip} />}
								onClick={(event) => {
									fireAnalyticsEvent({
										// @ts-expect-error - Type 'ACTION.CLICKED' is not assignable to type 'ACTION.CLICKED | ACTION.EDITOR_TTI | ACTION.MEDIA_LINK_TRANSFORMED | ACTION.STARTED | ACTION.TOGGLE_EXPAND | ACTION.UNSUPPORTED_CONTENT_ENCOUNTERED | ACTION.VISITED | ACTION.RENDERED | ACTION.INVALID_PROSEMIRROR_DOCUMENT | ACTION.CRASHED | ... 6 more ... | AnnotationActionType'.
										// This error was introduced after upgrading to TypeScript 5
										action: ACTION.CLICKED,
										actionSubject: ACTION_SUBJECT.BUTTON,
										actionSubjectId: ACTION_SUBJECT_ID.CODEBLOCK_COPY,
										eventType: EVENT_TYPE.UI,
									});

									copyTextToClipboard(content);
									setTooltip(intl.formatMessage(codeBlockButtonMessages.copiedCodeToClipboard));
									setClassName('copy-to-clipboard clicked');

									event.stopPropagation();
								}}
								spacing="compact"
							/>
						</div>
					</Tooltip>
				</span>
			)}
		</AnalyticsContext.Consumer>
	);
};

export default injectIntl(CopyButton);
