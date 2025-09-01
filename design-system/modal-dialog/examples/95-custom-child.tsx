/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useState } from 'react';

import { css, cssMap, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { Field } from '@atlaskit/form';
import Modal, { ModalHeader, ModalTitle, ModalTransition } from '@atlaskit/modal-dialog';
import { Box } from '@atlaskit/primitives/compiled';
import { RadioGroup } from '@atlaskit/radio';
import { token } from '@atlaskit/tokens';

const childStyles = css({
	height: '400px',
	backgroundColor: token('color.background.accent.magenta.subtler'),
});
const containerStyles = cssMap({
	root: {
		paddingBlockEnd: token('space.200'),
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
});

type BorderRadius = 'less' | 'same' | 'more';

const borderRadiuses = [
	{
		name: 'border-radius',
		value: 'less',
		label: 'Less than 3px means the box shadow does not match',
		testId: 'less',
	},
	{
		name: 'border-radius',
		value: 'same',
		label: '3px',
		testId: 'same',
	},
	{
		name: 'border-radius',
		value: `more`,
		label: 'More than 3px means you start to see the background',
		testId: 'more',
	},
];

const borderRadiusMap = cssMap({
	less: { borderRadius: 0 },
	same: { borderRadius: token('border.radius') },
	more: { borderRadius: token('radius.large') },
});

export function ModalWithCustomChildExample() {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedBorderRadius, setSelectedBorderRadius] = useState<BorderRadius>('same');
	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	return (
		<Box xcss={containerStyles.root}>
			<p>
				If using a custom child which has its own background you should set the border radius to be
				3px. If it is set less than 3px the border radius will not match the box shadow, and if set
				to be more than 3px you will start to see the background of the modal dialog.
			</p>

			<Field name="sb" label="Border radius">
				{() => (
					<RadioGroup
						options={borderRadiuses}
						value={selectedBorderRadius}
						onChange={(e) => setSelectedBorderRadius(e.target.value as BorderRadius)}
					/>
				)}
			</Field>

			<br />
			<Button appearance="primary" onClick={open} testId="modal-trigger">
				Open Modal
			</Button>

			<ModalTransition>
				{isOpen && (
					<Modal onClose={close} testId="modal">
						<div css={[childStyles, borderRadiusMap[selectedBorderRadius]]}>
							<ModalHeader hasCloseButton>
								<ModalTitle>Modal Title</ModalTitle>
							</ModalHeader>
						</div>
					</Modal>
				)}
			</ModalTransition>
		</Box>
	);
}

export default ModalWithCustomChildExample;
