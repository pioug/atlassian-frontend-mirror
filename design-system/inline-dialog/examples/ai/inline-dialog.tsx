import React, { useId, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import Heading from '@atlaskit/heading/heading';
import InlineDialog from '@atlaskit/inline-dialog/inline-dialog';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Text } from '@atlaskit/primitives/compiled/text';

export default function Example(): React.JSX.Element {
	const id = useId();
	const [openDialog, setOpenDialog] = useState<'basic' | 'titled' | null>(null);

	return (
		<Inline space="space.200">
			<InlineDialog
				content={<div id={`${id}-basic`}>This is an inline dialog</div>}
				isOpen={openDialog === 'basic'}
				onClose={() => setOpenDialog(null)}
			>
				<Button
					aria-expanded={openDialog === 'basic'}
					aria-controls={openDialog === 'basic' ? `${id}-basic` : undefined}
					onClick={() => setOpenDialog((current) => (current === 'basic' ? null : 'basic'))}
				>
					Show details
				</Button>
			</InlineDialog>
			<InlineDialog
				content={
					<div id={`${id}-titled`}>
						<Heading size="large">Dialog Title</Heading>
						<Text>Dialog content goes here</Text>
					</div>
				}
				isOpen={openDialog === 'titled'}
				onClose={() => setOpenDialog(null)}
			>
				<Button
					aria-expanded={openDialog === 'titled'}
					aria-controls={openDialog === 'titled' ? `${id}-titled` : undefined}
					onClick={() => setOpenDialog((current) => (current === 'titled' ? null : 'titled'))}
				>
					Open Dialog
				</Button>
			</InlineDialog>
		</Inline>
	);
}
