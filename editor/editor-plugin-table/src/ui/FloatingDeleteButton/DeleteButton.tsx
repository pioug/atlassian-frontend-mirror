import type { SyntheticEvent } from 'react';
import React from 'react';

import type { MessageDescriptor, WithIntlProps, WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { TableCssClassName as ClassName } from '../../types';

interface ButtonProps {
	onClick?: (event: SyntheticEvent) => void;
	onMouseEnter?: (event: SyntheticEvent) => void;
	onMouseLeave?: (event: SyntheticEvent) => void;
	removeLabel: MessageDescriptor;
	style?: object;
}

const DeleteButton = ({
	style,
	onClick,
	onMouseEnter,
	onMouseLeave,
	removeLabel,
	intl: { formatMessage },
}: ButtonProps & WrappedComponentProps) => (
	<div
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={ClassName.CONTROLS_DELETE_BUTTON_WRAP}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		style={style}
		onMouseEnter={onMouseEnter}
		onMouseLeave={onMouseLeave}
		onFocus={onMouseEnter}
		onBlur={onMouseLeave}
	>
		<button
			type="button"
			aria-label={formatMessage(removeLabel, { 0: 1 })}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={ClassName.CONTROLS_DELETE_BUTTON}
			onMouseDown={onClick}
			onMouseMove={(e) => e.preventDefault()}
		>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766  */}
			<svg className={ClassName.CONTROLS_BUTTON_ICON}>
				<path
					d="M12.242 10.828L9.414 8l2.828-2.829a.999.999 0 1 0-1.414-1.414L8 6.587l-2.829-2.83a1 1 0 0 0-1.414 1.414l2.83 2.83-2.83 2.827a1 1 0 0 0 1.414 1.414l2.83-2.828 2.827 2.828a.999.999 0 1 0 1.414-1.414"
					fill="currentColor"
					fillRule="evenodd"
				/>
			</svg>
		</button>
	</div>
);

// eslint-disable-next-line @typescript-eslint/no-restricted-types
const _default_1: React.FC<WithIntlProps<ButtonProps & WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<ButtonProps & WrappedComponentProps>;
} = injectIntl(DeleteButton);
export default _default_1;
