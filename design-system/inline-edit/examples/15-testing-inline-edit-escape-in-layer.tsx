import React, { useState } from 'react';

import DatePicker from '@atlaskit/datetime-picker/date-picker';
import InlineEdit from '@atlaskit/inline-edit/inline-edit';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import { Popup } from '@atlaskit/popup/popup';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import Select from '@atlaskit/select/default';
import type { OptionType, ValueType } from '@atlaskit/select/types';
import Textfield from '@atlaskit/textfield/text-field';

const options: OptionType[] = [
	{ label: 'Apple', value: 'apple' },
	{ label: 'Banana', value: 'banana' },
	{ label: 'Cherry', value: 'cherry' },
];

function TextInlineEdit({
	testId,
	label,
	shouldPreventEscape = false,
}: {
	testId: string;
	label: string;
	shouldPreventEscape?: boolean;
}): React.JSX.Element {
	const [value, setValue] = useState('Text value');
	return (
		<InlineEdit
			testId={testId}
			defaultValue={value}
			label={label}
			editButtonLabel={value}
			editView={({ errorMessage, ...fieldProps }) => (
				<Textfield
					{...fieldProps}
					autoFocus
					onKeyDown={(event) => {
						// An inner handler that takes the Escape.
						if (shouldPreventEscape && event.key === 'Escape') {
							event.preventDefault();
						}
					}}
				/>
			)}
			readView={() => <Box padding="space.100">{value}</Box>}
			onConfirm={setValue}
		/>
	);
}

function SelectInlineEdit({ testId }: { testId: string }): React.JSX.Element {
	const [value, setValue] = useState<ValueType<OptionType>>(options[0]);
	return (
		<InlineEdit<ValueType<OptionType>>
			testId={testId}
			defaultValue={value}
			label="Fruit"
			editButtonLabel={value?.label ?? 'Pick a fruit'}
			editView={({ errorMessage, ...fieldProps }) => (
				<Select {...fieldProps} options={options} autoFocus />
			)}
			readView={() => <Box padding="space.100">{value?.label ?? 'Pick a fruit'}</Box>}
			onConfirm={setValue}
		/>
	);
}

function DateInlineEdit({ testId }: { testId: string }): React.JSX.Element {
	const [value, setValue] = useState('2026-11-24');
	return (
		<InlineEdit
			testId={testId}
			defaultValue={value}
			label="Date"
			editButtonLabel={value}
			editView={({ errorMessage, ...fieldProps }) => (
				<DatePicker {...fieldProps} autoFocus testId={`${testId}-picker`} />
			)}
			readView={() => <Box padding="space.100">{value}</Box>}
			onConfirm={setValue}
		/>
	);
}

/**
 * The same inline edits in each layer. Test ids start with the layer name.
 */
function Fields({ layer }: { layer: 'modal' | 'popup' }): React.JSX.Element {
	return (
		<Stack space="space.100">
			<TextInlineEdit testId={`${layer}-text`} label="Text" />
			<SelectInlineEdit testId={`${layer}-select`} />
			<DateInlineEdit testId={`${layer}-date`} />
			<TextInlineEdit
				testId={`${layer}-preventing`}
				label="Text that takes Escape"
				shouldPreventEscape
			/>
		</Stack>
	);
}

/**
 * Test fixture: inline edits inside a `ModalDialog` and inside a `Popup`. Each layer has a text, a
 * Select and a DatePicker edit view, and a text edit view whose own handler calls
 * `preventDefault()` on Escape. Browser tests press Escape and check what each press undoes: a
 * layer open in the edit view, then the edit, then the layer around the inline edit.
 * `modal-close-count` and `popup-close-count` count the `onClose` calls.
 */
export default function TestingInlineEditEscapeInLayer(): React.JSX.Element {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalCloseCount, setModalCloseCount] = useState(0);
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [popupCloseCount, setPopupCloseCount] = useState(0);

	return (
		<Stack space="space.100">
			<button type="button" data-testid="modal-trigger" onClick={() => setIsModalOpen(true)}>
				Open modal
			</button>
			<Popup
				isOpen={isPopupOpen}
				onClose={() => {
					setPopupCloseCount((count) => count + 1);
					setIsPopupOpen(false);
				}}
				placement="bottom-start"
				shouldRenderToParent
				testId="popup"
				content={() => (
					<Box padding="space.200">
						<Fields layer="popup" />
					</Box>
				)}
				trigger={(triggerProps) => (
					<button
						{...triggerProps}
						type="button"
						data-testid="popup-trigger"
						onClick={() => setIsPopupOpen((isOpen) => !isOpen)}
					>
						Open popup
					</button>
				)}
			/>
			<div>
				Modal closes: <output data-testid="modal-close-count">{modalCloseCount}</output>
			</div>
			<div>
				Popup closes: <output data-testid="popup-close-count">{popupCloseCount}</output>
			</div>
			<ModalTransition>
				{isModalOpen && (
					<ModalDialog
						testId="modal"
						onClose={() => {
							setModalCloseCount((count) => count + 1);
							setIsModalOpen(false);
						}}
					>
						<ModalHeader>
							<ModalTitle>Edit fields</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<Fields layer="modal" />
						</ModalBody>
					</ModalDialog>
				)}
			</ModalTransition>
		</Stack>
	);
}
