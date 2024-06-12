import React from 'react';

import { ExpandContextProvider } from './hooks/use-expand';

type ExpandableRowProps = {
	children: React.ReactNode;
	/**
	 * Controlled: If the row is expanded.
	 */
	isExpanded?: boolean;
	/**
	 * Uncontrolled: If the row is expanded by default.
	 */
	isDefaultExpanded?: boolean;
};

/**
 * __Expandable row__
 *
 * A context provider for `<Row>` to support expandable content.
 */
const ExpandableRow = ({ children, isExpanded, isDefaultExpanded }: ExpandableRowProps) => {
	return (
		<ExpandContextProvider isExpanded={isExpanded} isDefaultExpanded={isDefaultExpanded}>
			{children}
		</ExpandContextProvider>
	);
};

export default ExpandableRow;
