/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	UNSAFE_UpdateOnChange as Legacy,
	type UpdateOnChangeProps,
} from './legacy';
import { UNSAFE_UpdateOnChange as TopLayer } from './top-layer';

export const UNSAFE_UpdateOnChange = ({
	selectors,
	options,
}: UpdateOnChangeProps): JSX.Element | null =>
	fg('platform-dst-top-layer') ? (
		<TopLayer selectors={selectors} options={options} />
	) : (
		<Legacy selectors={selectors} options={options} />
	);
