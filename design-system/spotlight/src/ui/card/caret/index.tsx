/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef } from 'react';

import { jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';

import type { Placement } from '../../../types';

import { Caret as Legacy } from './legacy';
import { Caret as TopLayer } from './top-layer';

export interface CaretProps {
	/**
	 * The position in relation to the target the content should be shown at. Overrides `PopoverContent.placement`
	 */
	placement?: Placement;

	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;
}
/**
 * __Caret__
 *
 * A `Caret` is a purely visual pointer displayed on the edge of a spotlight, which points to the target element.
 *
 */
export const Caret: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<CaretProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, CaretProps>(({ placement, testId }: CaretProps, ref) => {
	return fg('platform-dst-top-layer') ? (
		<TopLayer ref={ref} placement={placement} testId={testId} />
	) : (
		<Legacy ref={ref} placement={placement} testId={testId} />
	);
});
