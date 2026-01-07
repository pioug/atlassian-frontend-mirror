import { useEffect, useState } from 'react';

import { IS_SIDEBAR_COLLAPSING } from '../constants';

const getIsCollapsing = () => {
	// SSR bail-out because document is undefined on the server
	if (typeof document === 'undefined') {
		return false;
	}

	return document.documentElement.getAttribute(IS_SIDEBAR_COLLAPSING) === 'true';
};

const useIsSidebarCollapsing = (): boolean => {
	const [isCollapsing, setIsCollapsing] = useState(getIsCollapsing);

	useEffect(() => {
		const observer = new MutationObserver(() => {
			setIsCollapsing(getIsCollapsing);
		});

		observer.observe(document.documentElement, {
			attributeFilter: [IS_SIDEBAR_COLLAPSING],
		});

		return () => {
			observer.disconnect();
		};
	}, []);

	return isCollapsing;
};

export default useIsSidebarCollapsing;
