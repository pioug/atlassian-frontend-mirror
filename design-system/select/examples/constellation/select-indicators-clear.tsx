/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, Fragment, type FunctionComponent } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import { Label } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives/compiled';
import Select, { type ClearIndicatorProps, type OptionType } from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

import { cities } from '../common/data';

const clearIndicatorStyles = cssMap({
	default: {
		paddingInline: token('space.050'),
		color: token('color.text'),
	},
	focus: {
		color: token('color.text.brand'),
	},
});

const CustomClearText: FunctionComponent = () => <Fragment>clear all</Fragment>;

const ClearIndicator = (props: ClearIndicatorProps<OptionType, true>) => {
	const {
		children = <CustomClearText />,
		getStyles,
		innerProps: { ref, ...restInnerProps },
		isFocused,
	} = props;

	return (
		<div
			{...restInnerProps}
			ref={ref}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={getStyles('clearIndicator', props) as CSSProperties}
		>
			<Box xcss={cx(clearIndicatorStyles.default, isFocused && clearIndicatorStyles.focus)}>
				{children}
			</Box>
		</div>
	);
};

const _default: () => JSX.Element = () => (
	<Fragment>
		<Label htmlFor="indicators-clear">What city do you live in?</Label>
		<Select
			inputId="indicators-clear"
			closeMenuOnSelect={false}
			components={{ ClearIndicator }}
			defaultValue={[cities[4], cities[5]]}
			isMulti
			options={cities}
		/>
	</Fragment>
);
export default _default;
