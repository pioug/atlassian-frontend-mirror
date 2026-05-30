/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';

import { PopoverTarget as Legacy } from './legacy';
import { PopoverTarget as TopLayer } from './top-layer';

/**
 * __Target__
 *
 * A target is the element that the popover content will be positioned in relation to.
 */
export const PopoverTarget: typeof Legacy = ({ children }) =>
	fg('platform-dst-top-layer-spotlight') ? (
		<TopLayer>{children}</TopLayer>
	) : (
		<Legacy>{children}</Legacy>
	);
