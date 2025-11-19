import React from 'react';

import UFOLoadHold from '../load-hold';

const Suspense = ({
	children,
	fallback,
	interactionName,
}: {
	children: React.ReactNode;
	fallback: React.ReactNode;
	interactionName: string;
}): React.JSX.Element => {
	return (
		<React.Suspense fallback={<UFOLoadHold name={interactionName}>{fallback}</UFOLoadHold>}>
			{children}
		</React.Suspense>
	);
};

export default Suspense;
