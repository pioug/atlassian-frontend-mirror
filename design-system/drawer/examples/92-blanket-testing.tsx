import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
import Portal from '@atlaskit/portal';

import Blanket from '../src/components/blanket';

const BlanketExample = () => {
	const [isOpen, setIsOpen] = useState(false);

	const showBlanket = useCallback(() => setIsOpen(true), []);
	const hideBlanket = useCallback(() => setIsOpen(false), []);

	return (
		<>
			<Button onClick={showBlanket} testId="show-button">
				Show blanket
			</Button>
			<Portal zIndex="unset">
				<Blanket isOpen={isOpen} onBlanketClicked={hideBlanket} />
			</Portal>
		</>
	);
};

export default BlanketExample;
