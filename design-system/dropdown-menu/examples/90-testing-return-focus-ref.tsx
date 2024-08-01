import React, { useRef } from 'react';

import { Checkbox } from '@atlaskit/checkbox';
import { Inline } from '@atlaskit/primitives';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

export default () => {
	const ref = useRef<HTMLInputElement>(null);

	return (
		<Inline space="space.300">
			<DropdownMenu trigger="Actions" testId="dropdown" shouldRenderToParent returnFocusRef={ref}>
				<DropdownItemGroup>
					<DropdownItem>Move</DropdownItem>
					<DropdownItem>Clone</DropdownItem>
					<DropdownItem>Delete</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>

			<Checkbox label="One" value="1" name="checkbox1" />
			<Checkbox id="checkbox2" label="Two" value="2" name="checkbox2" ref={ref} />
			<Checkbox id="checkbox3" label="Three" value="3" name="checkbox3" />
		</Inline>
	);
};
