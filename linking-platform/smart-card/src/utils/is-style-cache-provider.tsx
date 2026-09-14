import React from 'react';

export const isStyleCacheProvider = (
	node: React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>,
): boolean => {
	if (
		typeof node.type !== 'string' &&
		node.type?.name === 'StyleCacheProvider' &&
		node.props.children
	) {
		return true;
	} else if (typeof node.type !== 'string' && node.type?.name === 'CC' && node.props.children) {
		return true;
	}
	return false;
};
