/** @jsx jsx */
import React from 'react';
import { jsx, type SerializedStyles } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';
import EditorMoreIcon from '@atlaskit/icon/glyph/editor/more';
import Tooltip from '@atlaskit/tooltip';
import { messages } from '../../shared/i18n';
import { moreButtonStyle, moreEmojiContainerStyle, separatorStyle } from './styles';

/**
 * Test id for wrapper button
 */
export const RENDER_SHOWMORE_TESTID = 'show-more-button';

export const RENDER_WRAPPER_TESTID = 'show-more-wrapper';

interface CommonProps<T> {
	container?: T;
	button?: T;
}

export interface ShowMoreProps {
	/**
	 * Optional mouse click DOM event on showing more emoji icon
	 */
	onClick?: React.MouseEventHandler<HTMLElement>;
	/**
	 * Optional button css
	 */
	buttonStyle?: SerializedStyles;
	/**
	 * Optional custom styling for wrapper show more emoji button
	 */
	style?: CommonProps<React.CSSProperties>;
	/**
	 * Optional custom styling for wrapper show more emoji button
	 */
	className?: CommonProps<string>;
}

/**
 * Show more custom emojis button
 */
export const ShowMore = ({ onClick, style = {}, className = {}, buttonStyle }: ShowMoreProps) => {
	return (
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className.container}
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={moreEmojiContainerStyle}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={style.container}
			data-testid={RENDER_WRAPPER_TESTID}
		>
			{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
			<div css={separatorStyle} />
			<FormattedMessage {...messages.moreEmoji}>
				{(message) => (
					<Tooltip content={message}>
						{/* TODO: Convert this to use Emotion css/classname instead of style prop (stylelint rule CSS inline styles should not be used, move styles to an external CSS file) */}
						<button
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className={className.button}
							// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
							css={[moreButtonStyle, buttonStyle]}
							aria-label={messages.moreEmoji.defaultMessage}
							type="button"
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							style={style.button}
							onClick={onClick}
							data-testid={RENDER_SHOWMORE_TESTID}
						>
							<EditorMoreIcon label="More" />
						</button>
					</Tooltip>
				)}
			</FormattedMessage>
		</div>
	);
};
