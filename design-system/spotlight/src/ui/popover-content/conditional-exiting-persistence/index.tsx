import React, { useContext } from 'react';

import { ExitingPersistence } from '@atlaskit/motion';

import { SpotlightContext } from '../../../controllers/context';

/**
 * __Conditional exiting persistence__
 *
 * A conditional exiting persistence that wraps the children in an `ExitingPersistence` component if the `motion` is defined.
 */
export const ConditionalExitingPersistence = ({
	children,
}: {
	children: React.ReactNode;
}): React.ReactNode => {
	const { card } = useContext(SpotlightContext);

	if (card.motion) {
		return <ExitingPersistence>{children}</ExitingPersistence>;
	}

	return children;
};

export default ConditionalExitingPersistence;
