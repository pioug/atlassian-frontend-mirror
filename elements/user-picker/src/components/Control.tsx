/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { components, type ControlProps } from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

import { cssMap, jsx, cx } from '@compiled/react';

const controlStyles = cssMap({
	invalid: {
		borderColor: token('color.border.danger'),
		'&:hover': {
			borderColor: token('color.border.danger'),
		},
	},
	focused: {
		borderColor: token('color.border.focused'),
		backgroundColor: token('color.background.input'),
		'&:hover': {
			borderColor: token('color.border.focused'),
			backgroundColor: token('color.background.input'),
		},
	},
	disabled: {
		'&:hover': {
			backgroundColor: token('color.background.disabled'),
		},
	},
	subtle: {
		borderColor: 'transparent',
		backgroundColor: 'transparent',
		'&:hover': {
			borderColor: 'transparent',
			backgroundColor: token('color.background.danger'),
		},
	},
	root: {
		borderColor: token('color.border.input'),
		backgroundColor: token('color.background.input'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'&:hover': {
			borderColor: token('color.border.input'),
			backgroundColor: token('color.background.input.hovered'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.fabric-user-picker__clear-indicator': {
				opacity: 1,
			},
		},
		padding: 0,
		maxWidth: '100%',
	},
});

const Control = (props: ControlProps<any>) => {
	return (
		<components.Control
			{...props}
			xcss={cx(
				controlStyles.root,
				(props.selectProps.subtle || props.selectProps.noBorder) && controlStyles.subtle,
				props.isFocused && controlStyles.focused,
				props.isInvalid && controlStyles.invalid,
				props.isDisabled && controlStyles.disabled,
			)}
		/>
	);
};

export default Control;
