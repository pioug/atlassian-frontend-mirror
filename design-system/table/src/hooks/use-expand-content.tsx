import React, { createContext, useContext } from 'react';

type ExpandContentContext = {
	isExpandableContent: boolean;
};

const ExpandContentContext = createContext<ExpandContentContext>({
	isExpandableContent: false,
});

/**
 * __Expand content provider__
 *
 * An expand content provider allows `<Row>` to determine if it is a subitem.
 */
export const ExpandContentContextProvider: ({ children, }: {
    children: React.ReactNode;
}) => React.JSX.Element = ({
	children,
}: {
	children: React.ReactNode;
}): React.JSX.Element => {
	return (
		<ExpandContentContext.Provider value={{ isExpandableContent: true }}>
			{children}
		</ExpandContentContext.Provider>
	);
};

const useExpandContent: () => ExpandContentContext = () => {
	return useContext(ExpandContentContext);
};

export default useExpandContent;
