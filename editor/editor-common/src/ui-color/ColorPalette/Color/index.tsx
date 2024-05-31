/** @jsx jsx */
import React, { PureComponent } from 'react';

import { jsx } from '@emotion/react';

import EditorDoneIcon from '@atlaskit/icon/glyph/editor/done';
import { N0 } from '@atlaskit/theme/colors';
import Tooltip from '@atlaskit/tooltip';

import { buttonStyle, buttonWrapperStyle } from './styles';

export interface Props {
	value: string;
	label: string;
	tabIndex?: number;
	isSelected?: boolean;
	onClick: (value: string, label: string) => void;
	borderColor: string;
	checkMarkColor?: string;
	autoFocus?: boolean;
	hexToPaletteColor?: (hexColor: string) => string | undefined;
}

class Color extends PureComponent<Props> {
	render() {
		const {
			autoFocus,
			tabIndex,
			value,
			label,
			isSelected,
			borderColor,

			/** this is not new usage - old code extracted from editor-core */
			/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
			checkMarkColor = N0,
			/**
			 * When hexToPaletteColor prop is set,
			 * it will be used to get background color style based on
			 * value (which will be hexcode) prop
			 */
			hexToPaletteColor,
		} = this.props;

		const colorStyle = hexToPaletteColor ? hexToPaletteColor(value) : value;
		return (
			<Tooltip content={label}>
				<span css={buttonWrapperStyle}>
					<button
						type="button"
						css={buttonStyle}
						aria-label={label}
						role="radio"
						aria-checked={isSelected}
						onClick={this.onClick}
						onMouseDown={this.onMouseDown}
						tabIndex={tabIndex}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						className={`${isSelected ? 'selected' : ''}`}
						style={{
							backgroundColor: colorStyle || 'transparent',
							border: `1px solid ${borderColor}`,
						}}
						autoFocus={autoFocus}
					>
						{isSelected && <EditorDoneIcon primaryColor={checkMarkColor} label="" />}
					</button>
				</span>
			</Tooltip>
		);
	}

	onMouseDown = (e: React.MouseEvent<{}>) => {
		e.preventDefault();
	};

	onClick = (e: React.MouseEvent<{}>) => {
		const { onClick, value, label } = this.props;
		e.preventDefault();
		onClick(value, label);
	};
}

export default Color;
