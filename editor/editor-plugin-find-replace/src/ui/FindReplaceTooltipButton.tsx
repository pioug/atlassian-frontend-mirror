import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import { findKeymapByDescription, ToolTipContent } from '@atlaskit/editor-common/keymaps';
import type { IconProps } from '@atlaskit/icon/types';
import Tooltip from '@atlaskit/tooltip';
interface Props {
	appearance?: 'default' | 'primary' | 'subtle';
	disabled?: boolean;
	icon: React.ComponentType<React.PropsWithChildren<IconProps>>;
	iconLabel: string;
	iconSize?: 'small' | undefined;
	isPressed?: boolean;
	keymapDescription: string;
	onClick: (ref: React.RefObject<HTMLButtonElement>) => void;
	title: string;
}

// eslint-disable-next-line @repo/internal/react/no-class-components
export class FindReplaceTooltipButton extends React.PureComponent<Props> {
	private buttonRef = React.createRef<HTMLButtonElement>();

	static defaultProps = {
		keymapDescription: 'no-keymap',
		appearance: 'subtle',
	};

	handleClick = (): void => {
		this.props.onClick(this.buttonRef);
	};

	render(): React.JSX.Element {
		const {
			title,
			icon: Icon,
			iconSize,
			keymapDescription,
			disabled,
			isPressed,
			appearance,
		} = this.props;
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
					// Ignored via go/ees005
					// eslint-disable-next-line react/jsx-props-no-spreading
					icon={(iconProps) => <Icon {...iconProps} size={iconSize} />}
					isDisabled={disabled}
					onClick={this.handleClick}
					isSelected={isPressed}
					// Ignored via go/ees005
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...pressedProps}
				/>
			</Tooltip>
		);
	}
}
