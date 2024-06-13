import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
import Portal from '@atlaskit/portal';

import DrawerPrimitive from '../src/components/primitives';

const DrawerExample = () => {
	const [isOpen, setIsOpen] = useState(false);

	const showDrawer = useCallback(() => setIsOpen(true), []);
	const hideDrawer = useCallback(() => setIsOpen(false), []);

	return (
		<>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles -- Ignored via go/DSP-18766 */}
			<style>{`body {background: lightgrey}`}</style>
			<Button onClick={showDrawer} testId="show-button">
				Show drawer
			</Button>
			<Portal zIndex="unset">
				<DrawerPrimitive
					testId="drawer"
					in={isOpen}
					onClose={hideDrawer}
					label="Testing drawer primitive"
				/>
			</Portal>
		</>
	);
};

export default DrawerExample;
