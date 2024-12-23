import React, { useState } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import { messages } from '@atlaskit/editor-common/floating-toolbar';
import type { ConfirmationDialogProps } from '@atlaskit/editor-common/types';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';
import { Text } from '@atlaskit/primitives';

type ListComponentProps = {
	nodes: ConfirmDialogChildrenListItemProps[];
};

type ConfirmDialogChildrenListItemProps = {
	id: string;
	name: string | null;
	amount: number;
};

export const CheckboxModal = (props: ConfirmationDialogProps & WrappedComponentProps) => {
	const [isChecked, setCheckbox] = useState(false);
	const {
		onConfirm,
		onClose,
		options,
		intl: { formatMessage },
		testId,
	} = props;

	const heading = options?.title || formatMessage(messages.confirmModalDefaultHeading);
	const okButtonLabel = options?.okButtonLabel || formatMessage(messages.confirmModalOK);
	const cancelButtonLabel =
		options?.cancelButtonLabel || formatMessage(messages.confirmModalCancel);
	const checkboxlabel = options?.checkboxLabel;
	const childrenInfo = options?.getChildrenInfo?.();

	const ListComponent = ({ nodes }: ListComponentProps) => {
		if (nodes.length === 0) {
			return null;
		}

		return (
			<ul>
				{nodes.map((node) => (
					// Ignored via go/ees005
					// eslint-disable-next-line react/jsx-props-no-spreading
					<ListItem {...node} key={node.id} />
				))}
			</ul>
		);
	};

	const ListItem = (props: ConfirmDialogChildrenListItemProps) => {
		const { id, name, amount } = props;
		return <li id={id}>{formatMessage(messages.confirmModalListUnit, { name, amount })}</li>;
	};

	return (
		<Modal onClose={onClose} testId={testId}>
			<ModalHeader>
				<ModalTitle appearance="warning">{heading}</ModalTitle>
			</ModalHeader>

			<ModalBody>
				<Text as="p">{options?.message}</Text>
				{!!childrenInfo?.length && <ListComponent nodes={childrenInfo} />}
				<Text as="p">
					<Checkbox
						isChecked={isChecked}
						onChange={() => setCheckbox(!isChecked)}
						label={checkboxlabel}
						testId={testId ? `${testId}-checkbox` : undefined}
					/>
				</Text>
			</ModalBody>
			<ModalFooter>
				<Button
					appearance="default"
					onClick={onClose}
					testId={testId ? `${testId}-cancel-button` : undefined}
				>
					{cancelButtonLabel}
				</Button>
				<Button
					appearance="warning"
					onClick={() => {
						onConfirm(isChecked);
						onClose();
					}}
					testId={testId ? `${testId}-confirm-button` : undefined}
				>
					{okButtonLabel}
				</Button>
			</ModalFooter>
		</Modal>
	);
};
