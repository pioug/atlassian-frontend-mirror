import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- TODO: migrate to @atlaskit/primitives/compiled
import { UNSAFE_BREAKPOINTS_CONFIG } from '@atlaskit/primitives/constants';
import { Table } from '@atlaskit/table/primitives/table';
import { TBody } from '@atlaskit/table/primitives/tbody';
import { TH } from '@atlaskit/table/primitives/th';
import { THead } from '@atlaskit/table/primitives/thead';
import { TR } from '@atlaskit/table/primitives/tr';
import { Cell as TD } from '@atlaskit/table/td';

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
