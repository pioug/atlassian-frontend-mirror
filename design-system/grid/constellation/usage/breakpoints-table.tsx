import React from 'react';

import { UNSAFE_BREAKPOINTS_CONFIG } from '@atlaskit/primitives/responsive';
import { Table, TBody, TD, TH, THead, TR } from '@atlaskit/table/primitives';

// TODO: This needs a new home.  We may want to show this here, but where does this live?
export const BreakpointsTable: () => React.JSX.Element = () => (
	<Table>
		<THead>
			<TR isBodyRow={false}>
				<TH>Breakpoint</TH>
				<TH align="number">Min width</TH>
				<TH align="number">Max width</TH>
				<TH align="number" width="12ch">
					# of columns
				</TH>
			</TR>
		</THead>
		<TBody>
			{Object.entries(UNSAFE_BREAKPOINTS_CONFIG).map(([breakpoint, config]) => (
				<TR key={breakpoint}>
					<TD>
						{/* eslint-disable-next-line @atlaskit/design-system/use-primitives-text */}
						<strong>{breakpoint}</strong>
					</TD>
					<TD align="number">{config.min}</TD>
					<TD align="number">{config.max || 'n/a'}</TD>
					<TD align="number">12</TD>
				</TR>
			))}
		</TBody>
	</Table>
);
