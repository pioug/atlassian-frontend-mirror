/** @jsx jsx */
import { jsx } from '@emotion/react';

import type { AddonProps } from '../types';

import { dropdownItem } from './styles';

const DropdownItemWrapper = (props: AddonProps) => (
	<div
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		css={dropdownItem}
		onClick={() =>
			props.onClick &&
			props.onClick({
				actionOnClick: props.actionOnClick,
				renderOnClick: props.renderOnClick,
			})
		}
	>
		<span>{props.icon}</span>
		{props.children}
	</div>
);

export default DropdownItemWrapper;
