/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import EditorDoneIcon from '@atlaskit/icon/core/migration/check-mark--editor-done';
import { token } from '@atlaskit/tokens';
import { Pressable } from '@atlaskit/primitives/compiled';
import { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl-next';
import { css, cssMap, jsx } from '@compiled/react';
import { ANALYTICS_HOVER_DELAY } from '../constants';
import { messages } from '../i18n';
import { type Color as ColorType } from '../Status';

const styles = cssMap({
	button: {
		height: '24px',
		width: '24px',
		backgroundColor: token('color.background.neutral'),
		paddingTop: token('space.0'),
		paddingRight: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.0'),
		borderRadius: token('border.radius'),
		border: `${token('border.width')} solid ${token('color.border')}`,
		display: 'block',
		overflow: 'hidden',
	},
});

// We have tried with changing border and padding from 1px to token near version 2px,
// the pop - up is being expanded to two lines.
const buttonWrapperStyles = css({
	borderWidth: '1px',
	borderStyle: 'solid',
	borderColor: 'transparent',
	marginTop: '0px',
	marginRight: token('space.025'),
	marginBottom: '0px',
	marginLeft: token('space.025'),
	display: 'flex',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	padding: '1px',
	borderRadius: token('space.075'),
	'&:hover': {
		border: `1px solid ${token('color.border')}`,
	},
});

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
							xcss={styles.button}
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
