import React, { createContext, useCallback, useContext, useState } from 'react';

import __noop from '@atlaskit/ds-lib/noop';

type ExpandContextState = {
	isExpanded: boolean;
	toggleExpanded(): void;
};

const ExpandContext = createContext<ExpandContextState>({
	isExpanded: false,
	toggleExpanded: __noop,
});

/**
 * __Expand context provider__
 *
 * An expand context provider.
 */
export const ExpandContextProvider: (props: {
	children: React.ReactNode;
	isExpanded?: boolean;
	isDefaultExpanded?: boolean;
}) => React.JSX.Element = ({ children, isExpanded: isExpandedProp, isDefaultExpanded = false }) => {
	const [isExpanded, setIsExpanded] = useState(isDefaultExpanded);

	const toggleExpanded = useCallback(() => {
		setIsExpanded((v) => !v);
	}, []);

	return (
		<ExpandContext.Provider value={{ isExpanded: isExpandedProp || isExpanded, toggleExpanded }}>
			{children}
		</ExpandContext.Provider>
	);
};

const useExpand: () => ExpandContextState = () => {
	return useContext(ExpandContext);
};

export default useExpand;
