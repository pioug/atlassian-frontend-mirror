import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import InlineDialog from '@atlaskit/inline-dialog';

const content = (
	<div>
		<p>Hello!</p>
	</div>
);

// In this example, the first inline dialog should close when the second inline dialog is opened
const InlineDialogDefaultExample = () => {
	const [dialogOneOpen, setDialogOne] = useState<boolean>(false);
	const [dialogTwoOpen, setDialogTwo] = useState<boolean>(false);

	const toggleDialogOne = () => {
		setDialogOne(!dialogOneOpen);
	};

	const toggleDialogTwo = () => {
		setDialogTwo(!dialogTwoOpen);
	};

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ minHeight: '120px' }} data-testid="inline-dialog">
			<InlineDialog
				onClose={() => {
					setDialogOne(false);
				}}
				content={content}
				isOpen={dialogOneOpen}
			>
				<Button isSelected={dialogOneOpen} onClick={toggleDialogOne}>
					Click for dialog 1
				</Button>
			</InlineDialog>
			<InlineDialog
				onClose={() => {
					setDialogTwo(false);
				}}
				content={content}
				isOpen={dialogTwoOpen}
			>
				<Button isSelected={dialogTwoOpen} onClick={toggleDialogTwo}>
					Click for dialog 2
				</Button>
			</InlineDialog>
		</div>
	);
};

export default InlineDialogDefaultExample;
