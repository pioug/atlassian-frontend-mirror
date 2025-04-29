import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { Drawer, DrawerCloseButton, DrawerContent, DrawerSidebar } from '@atlaskit/drawer/compiled';
import Flag, { FlagGroup } from '@atlaskit/flag';
import InformationIcon from '@atlaskit/icon/core/migration/information--info';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

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
									icon={
										<InformationIcon
											label="Info"
											LEGACY_primaryColor={token('color.icon.information')}
											color={token('color.icon.information')}
											spacing="spacious"
										/>
									}
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
