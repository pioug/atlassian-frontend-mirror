/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useMemo, useState } from 'react';

import { jsx } from '@compiled/react';
import invariant from 'tiny-invariant';

import Button from '@atlaskit/button/new';
import Form, { Field } from '@atlaskit/form';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';
import type { Operation } from '@atlaskit/navigation-system/side-nav-items/drag-and-drop/hitbox';
import { Stack } from '@atlaskit/primitives/compiled';
import SectionMessage from '@atlaskit/section-message';
import Select from '@atlaskit/select';

import type { TFilter } from '../data';
import { useDispatch, useGetData } from '../state-context';

type TFormData = {
	operation: { value: string };
	target: { value: string };
};

const operations: Operation[] = ['reorder-before', 'reorder-after', 'combine'];

const labels: { [TValue in Operation]: string } = {
	combine: 'Make child of',
	'reorder-before': 'Move before',
	'reorder-after': 'Move after',
};

type TOption = { label: string; value: string };

function getAvailableTargets({
	exclude,
	filters,
}: {
	exclude: TFilter;
	filters: TFilter[];
}): TOption[] {
	if (!filters.length) {
		return [];
	}

	const withExclusion = filters.filter((filter) => exclude.id !== filter.id);

	const options = withExclusion.map((filter) => ({ value: filter.id, label: filter.name }));
	const children = withExclusion.flatMap((filter) =>
		getAvailableTargets({ filters: filter.children, exclude }),
	);
	return [...options, ...children];
}

export function FilterMoveModal({ onClose, filter }: { onClose: () => void; filter: TFilter }) {
	const dispatch = useDispatch();
	const getData = useGetData();

	const onSubmit = useCallback(
		(formData: TFormData) => {
			console.log('formData = ', formData);

			if (!formData.target || !formData.operation) {
				onClose();
				return;
			}

			dispatch({
				type: 'filter-move',
				draggingId: filter.id,
				targetId: formData.target.value,
				operation: formData.operation.value as Operation,
				trigger: 'keyboard',
			});

			onClose();
		},
		[dispatch, filter.id, onClose],
	);

	const targetOptions: TOption[] = useMemo(() => {
		// need to exclude `filter` and all children of `filter`
		return getAvailableTargets({ exclude: filter, filters: getData().filters });
	}, [getData, filter]);

	const [target, setTarget] = useState<TOption | null>(null);

	const operationOptions: TOption[] = useMemo(() => {
		if (!target) {
			return [];
		}
		return operations.map((operation) => ({
			value: operation,
			label: labels[operation],
		}));
	}, [target]);

	return (
		<Modal onClose={onClose}>
			<Form<TFormData> onSubmit={onSubmit}>
				{({ formProps }) => (
					<form {...formProps}>
						<ModalHeader hasCloseButton>
							<ModalTitle>Move: {filter.name}</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<Stack space="space.200">
								<Stack>
									<Field<{ value: string; label: string }>
										id="target"
										name="target"
										label="Move relative to filter"
										isRequired
									>
										{({ fieldProps }) => (
											<Select
												{...fieldProps}
												onChange={(option) => {
													invariant(option !== null);
													setTarget(option);
													fieldProps.onChange(option);
												}}
												menuPosition="fixed"
												options={targetOptions}
											/>
										)}
									</Field>
									<Field<{ value: string; label: string }>
										id="operation"
										name="operation"
										label="Operation"
										isRequired
									>
										{({ fieldProps }) => (
											<Select
												{...fieldProps}
												onChange={(option) => {
													invariant(option !== null);
													console.log(option);
													fieldProps.onChange(option);
												}}
												menuPosition="fixed"
												options={operationOptions}
											/>
										)}
									</Field>
								</Stack>
								<SectionMessage appearance="warning">
									This experience is <strong>illustrative</strong> of what could be done to support
									complex movement operations. More thought needs to be given about what these
									fields are available, what the fields are called, and what the option labels
									should be.
								</SectionMessage>
							</Stack>
						</ModalBody>
						<ModalFooter>
							<Button appearance="subtle" onClick={onClose}>
								Cancel
							</Button>
							<Button appearance="primary" onClick={onClose} type="submit">
								Move
							</Button>
						</ModalFooter>
					</form>
				)}
			</Form>
		</Modal>
	);
}
