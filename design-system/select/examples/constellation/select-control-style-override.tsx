/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag Fragment
 */
// oxlint-disable-next-line no-unused-vars
import { Fragment, type JSX } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import { Label } from '@atlaskit/form/label/default';
import { components } from '@atlaskit/react-select/components';
import Select from '@atlaskit/select/default';
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
