import React, { useContext, useMemo } from 'react';

import type { XpcProductId, XpcSubProductId } from './xpcDestinationResolver';
import { XpcNavigationContext } from './xpcNavigationContext';

export interface XpcSourceProviderProps {
	children?: React.ReactNode;
	source: {
		product?: XpcProductId;
		subProduct?: XpcSubProductId | null;
	};
}

export const XpcSourceProvider = ({
	children,
	source,
}: XpcSourceProviderProps): React.JSX.Element => {
	const parent = useContext(XpcNavigationContext);
	const value = useMemo(
		() =>
			parent
				? {
						...parent,
						source: {
							product: source.product ?? parent.source.product,
							...(source.subProduct === null
								? {}
								: { subProduct: source.subProduct ?? parent.source.subProduct }),
						},
					}
				: undefined,
		[parent, source.product, source.subProduct],
	);

	if (!parent) {
		return <>{children}</>;
	}

	return (
		<XpcNavigationContext.Provider value={value ?? parent}>
			{children}
		</XpcNavigationContext.Provider>
	);
};
