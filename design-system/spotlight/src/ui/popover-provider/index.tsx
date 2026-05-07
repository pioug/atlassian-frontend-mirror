/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';

import { PopoverProvider as Legacy } from './legacy';
import { PopoverProvider as TopLayer } from './top-layer';

/**
 * __Popover provider__
 *
 * A popover provider provides necesary context for the `PopoverContent` and `PopoverTarget` components.
 *
 */
export const PopoverProvider: typeof Legacy = ({ children }) =>
	fg('platform-dst-top-layer') ? (
		<TopLayer>{children}</TopLayer>
	) : (
		<Legacy>{children}</Legacy>
	);
