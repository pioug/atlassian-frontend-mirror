import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import { findKeymapByDescription, ToolTipContent } from '@atlaskit/editor-common/keymaps';
import type { IconProps } from '@atlaskit/icon/types';
import Tooltip from '@atlaskit/tooltip';
interface Props {
	title: string;
	icon: React.ComponentType<React.PropsWithChildren<IconProps>>;
	iconLabel: string;
	iconSize?: 'small' | undefined;
	keymapDescription: string;
	onClick: (ref: React.RefObject<HTMLButtonElement>) => void;
	disabled?: boolean;
	isPressed?: boolean;
	appearance?: 'default' | 'primary' | 'subtle';
}

// eslint-disable-next-line @repo/internal/react/no-class-components
export class FindReplaceTooltipButton extends React.PureComponent<Props> {
	private buttonRef = React.createRef<HTMLButtonElement>();

	static defaultProps = {
		keymapDescription: 'no-keymap',
		appearance: 'subtle',
	};

	handleClick = () => {
		this.props.onClick(this.buttonRef);
	};

	render() {
		const { title, icon, iconSize, keymapDescription, disabled, isPressed, appearance } =
			this.props;
		const pressedProps = {
			...(typeof isPressed === 'boolean' && { 'aria-pressed': isPressed }),
		};
		return (
			<Tooltip
				content={
					<ToolTipContent description={title} keymap={findKeymapByDescription(keymapDescription)} />
				}
				hideTooltipOnClick={true}
				position={'top'}
			>
				<IconButton
					id="afterInputSection"
					label={title}
					appearance={appearance}
					testId={title}
					ref={this.buttonRef}
					icon={icon}
					UNSAFE_size={iconSize}
					isDisabled={disabled}
					onClick={this.handleClick}
					isSelected={isPressed}
					{...pressedProps}
				/>
			</Tooltip>
		);
	}
}
