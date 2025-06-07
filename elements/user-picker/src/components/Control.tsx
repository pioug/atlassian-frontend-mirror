/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { components, type ControlProps } from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

import { cssMap, jsx, cx } from '@compiled/react';
import type { UserPickerProps } from '../types';

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
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.fabric-user-picker__clear-indicator': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			opacity: '0 !important',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'&:hover': {
			borderColor: token('color.border.input'),
			backgroundColor: token('color.background.input.hovered'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.fabric-user-picker__clear-indicator': {
				// TODO: remove !important once the Select styles props is removed https://product-fabric.atlassian.net/browse/DSP-22497
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				opacity: '1 !important',
			},
		},
		padding: 0,
		maxWidth: '100%',
	},
	compact: {
		minHeight: 'auto',
	},
});

const Control = (props: ControlProps<any> & UserPickerProps) => {
	const isCompact = props.appearance === 'compact';
	return (
		<components.Control
			{...props}
			xcss={cx(
				controlStyles.root,
				isCompact && controlStyles.compact,
				(props.selectProps.subtle || props.selectProps.noBorder) && controlStyles.subtle,
				props.isFocused && controlStyles.focused,
				props.isInvalid && controlStyles.invalid,
				props.isDisabled && controlStyles.disabled,
			)}
		/>
	);
};

export default Control;
