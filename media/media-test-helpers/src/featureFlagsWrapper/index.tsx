import React, { useState } from 'react';
import FeatureFlagsDropdown from './dropdown';

const isLocalStorageSupported = () => {
	try {
		if (typeof window !== 'undefined' && !!window.localStorage) {
			//we try accessing localStorage
			localStorage.getItem('some-key');
			return true;
		}
	} catch (e) {}
	return false;
};

const FeatureFlagsWrapper = ({ children }: { children: React.ReactNode }) => {
	const [childrenKey, setChildrenKey] = useState(0);
	// This is a trick to force a re-render on the component's children to see the new FF values taking effect
	const onFlagChanged = () => {
		setChildrenKey(childrenKey + 1);
	};
	return isLocalStorageSupported() ? (
		<>
			<FeatureFlagsDropdown onFlagChanged={onFlagChanged} />
			<React.Fragment key={childrenKey}>{children}</React.Fragment>
		</>
	) : (
		<>{children}</>
	);
};

export default FeatureFlagsWrapper;
