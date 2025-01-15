import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { Drawer, DrawerCloseButton, DrawerContent, DrawerSidebar } from '@atlaskit/drawer/compiled';
import Flag, { FlagGroup } from '@atlaskit/flag';
import Info from '@atlaskit/icon/glyph/info';
import { Box } from '@atlaskit/primitives';

const FlagsInDrawerExample = () => {
	const [open, setOpen] = useState<boolean>(false);
	const [flags, setFlags] = useState<Array<number>>([]);

	const addFlag = () => {
		const newFlagId = flags.length + 1;
		const newFlags = flags.slice();
		newFlags.splice(0, 0, newFlagId);

		setFlags(newFlags);
	};

	const handleDismiss = () => {
		setFlags(flags.slice(1));
	};

	return (
		<Box>
			<Drawer
				label="Default drawer"
				onClose={() => {
					setOpen(false);
					setFlags([]);
				}}
				isOpen={open}
			>
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>
					<Button onClick={addFlag}>Add flag</Button>
					<FlagGroup onDismissed={handleDismiss} shouldRenderToParent>
						{flags.map((flagId) => {
							return (
								<Flag
									id={flagId}
									icon={<Info label="Info" />}
									key={flagId}
									title={`Flag #${flagId}`}
									description="Example flag description"
								/>
							);
						})}
					</FlagGroup>
				</DrawerContent>
			</Drawer>
			<Button appearance="primary" onClick={() => setOpen(true)}>
				Open drawer
			</Button>
		</Box>
	);
};

export default FlagsInDrawerExample;
