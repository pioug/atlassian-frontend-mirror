import { useEffect, useState } from 'react';

import { IS_SIDEBAR_DRAGGING } from '../constants';

const getIsDragging = () => {
	// SSR bail-out because document is undefined on the server
	if (typeof document === 'undefined') {
		return false;
	}

	return document.documentElement.getAttribute(IS_SIDEBAR_DRAGGING) === 'true';
};

// TODO: I think this should be derived from the sidebar state,
// and not indirectly from observing an attribute change
const useIsSidebarDragging = () => {
	const [isDragging, setIsDragging] = useState(getIsDragging);

	useEffect(() => {
		const observer = new MutationObserver(() => {
			setIsDragging(getIsDragging);
		});

		observer.observe(document.documentElement, {
			attributeFilter: [IS_SIDEBAR_DRAGGING],
		});

		return () => {
			observer.disconnect();
		};
	}, []);

	return isDragging;
};

export default useIsSidebarDragging;
