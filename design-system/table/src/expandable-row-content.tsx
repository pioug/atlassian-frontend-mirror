import React from 'react';

import { ExpandContentContextProvider } from './hooks/use-expand-content';

type ExpandableRowContentProps = {
	children?: React.ReactNode;
};

/**
 * __Expandable row content__
 *
 * Contains expandable content. Uses a context provider to allow children
 * to identify if they are expandable content.
 */
const ExpandableRowContent = ({ children }: ExpandableRowContentProps): React.JSX.Element => {
	return <ExpandContentContextProvider>{children}</ExpandContentContextProvider>;
};

export default ExpandableRowContent;
