/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import EditorDoneIcon from '@atlaskit/icon/core/migration/check-mark--editor-done';
import { N50 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { Pressable, xcss } from '@atlaskit/primitives';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl-next';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { ANALYTICS_HOVER_DELAY } from '../constants';
import { messages } from '../i18n';
import { type Color as ColorType } from '../Status';

const buttonStyles = xcss({
	height: '24px',
	width: '24px',
	background: 'color.background.neutral',
	padding: 'space.0',
	borderRadius: 'border.radius',
	borderWidth: 'border.width',
	borderStyle: 'solid',
	borderColor: 'color.border',
	display: 'block',
	overflow: 'hidden',
});

// We have tried with changing border and padding from 1px to token near version 2px,
// the pop - up is being expanded to two lines.
// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/design-system/no-css-tagged-template-expression -- Ignored via go/DSP-18766
const buttonWrapperStyles = css`
	border: 1px solid transparent;
	margin: 0 ${token('space.025', '2px')};
	font-size: 0;
	display: flex;
	align-items: center;
	padding: 1px;
	border-radius: ${token('space.075', '6px')};
	&:hover {
		border: 1px solid ${token('color.border', N50)};
	}
`;

export interface ColorProps {
	value: ColorType;
	tabIndex?: number;
	isSelected?: boolean;
	onClick: (value: ColorType) => void;
	onHover?: (value: ColorType) => void;
	backgroundColor: string;
	borderColor: string;
	iconColor: string;
	setRef?: (value: HTMLButtonElement) => HTMLButtonElement;
}

export default class Color extends PureComponent<ColorProps> {
	private hoverStartTime: number = 0;

	render() {
		const { tabIndex, backgroundColor, isSelected, borderColor, iconColor, value, setRef } =
			this.props;
		return (
			<li css={buttonWrapperStyles}>
				<FormattedMessage {...messages[`${value}Color` as keyof typeof messages]}>
					{(labels) => (
						<Pressable
							xcss={buttonStyles}
							onClick={this.onClick}
							onMouseEnter={this.onMouseEnter}
							onMouseLeave={this.onMouseLeave}
							onMouseDown={this.onMouseDown}
							tabIndex={tabIndex}
							title={labels[0] as string}
							// button element does not support aria-selected.
							// For button selected (to be precise pressed) or not
							//  use aria-pressed as per
							// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role#associated_aria_roles_states_and_properties
							aria-pressed={isSelected}
							style={{
								backgroundColor: backgroundColor || 'transparent',
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
								color: iconColor,
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								borderColor,
							}}
							ref={setRef}
						>
							{isSelected && <EditorDoneIcon color="currentColor" label={labels[0] as string} />}
						</Pressable>
					)}
				</FormattedMessage>
			</li>
		);
	}

	componentWillUnmount() {
		this.hoverStartTime = 0;
	}

	onMouseEnter = () => {
		this.hoverStartTime = Date.now();
	};

	onMouseLeave = () => {
		const { onHover } = this.props;
		const delay = Date.now() - this.hoverStartTime;

		if (delay >= ANALYTICS_HOVER_DELAY && onHover) {
			onHover(this.props.value);
		}
		this.hoverStartTime = 0;
	};

	onMouseDown: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();
	};

	onClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		const { onClick, value } = this.props;
		e.preventDefault();
		onClick(value);
	};
}
