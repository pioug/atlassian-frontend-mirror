/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag Fragment
 */
import { Fragment } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import { Label } from '@atlaskit/form';
import Select, { components } from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

import { cities } from '../common/data';

const controlStyles = cssMap({
	root: {
		minHeight: '40px',
	},
	focused: {
		boxShadow: `0 0 0 2px ${token('color.border.focused')}`,
	},
});

const _default: () => JSX.Element = () => (
	<>
		<Label htmlFor="indicators-dropdown">What city do you live in?</Label>
		<Select
			components={{
				Control: (props) => (
					<components.Control
						{...props}
						xcss={cx(controlStyles.root, props.isFocused && controlStyles.focused)}
					/>
				),
			}}
			options={cities}
		/>
	</>
);
export default _default;
