import React from 'react';

import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import { Box, xcss } from '@atlaskit/primitives';

// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import variants from '../src/utils/variants';

const constrainedWidthCellStyles = xcss({
	width: 'size.600',
});

const ContrainedWidthCell = ({ children }: { children: React.ReactNode }) => {
	return (
		<td>
			<Box xcss={constrainedWidthCellStyles}>{children}</Box>
		</td>
	);
};

const label = 'A really long text label';

export default function TruncationExample() {
	return (
		<table>
			<thead>
				<tr>
					<th>Variant</th>
					<th>Default</th>
					<th>Icon before</th>
					<th>Icon after</th>
				</tr>
			</thead>
			<tbody>
				{variants.map(({ name, Component }) => (
					<tr key={name}>
						<th>{name}</th>
						<ContrainedWidthCell>
							<Component>{label}</Component>
						</ContrainedWidthCell>
						<ContrainedWidthCell>
							<Component iconBefore={ChevronDownIcon}>{label}</Component>
						</ContrainedWidthCell>
						<ContrainedWidthCell>
							<Component iconAfter={ChevronDownIcon}>{label}</Component>
						</ContrainedWidthCell>
						<ContrainedWidthCell>
							<Component iconBefore={ChevronDownIcon} iconAfter={ChevronDownIcon}>
								{label}
							</Component>
						</ContrainedWidthCell>
					</tr>
				))}
			</tbody>
		</table>
	);
}
