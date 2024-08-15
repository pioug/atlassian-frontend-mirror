import React, { useCallback, useState } from 'react';

import { IntlProvider } from 'react-intl-next';

// eslint-disable-next-line no-restricted-imports
import Button from '@atlaskit/button/new';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { type DatasourceAdf, type InlineCardAdf } from '@atlaskit/linking-common/types';
import { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';
import Textfield from '@atlaskit/textfield';

import SmartLinkClient from '../../examples-helpers/smartLinkCustomClient';
import { type ConfigModalProps } from '../../src/common/types';
import { CancelButton } from '../../src/ui/common/modal/cancel-button';
import { useDatasourceContext } from '../../src/ui/common/modal/datasource-context';
import { DatasourceModal } from '../../src/ui/common/modal/datasource-modal';
import { createDatasourceModal } from '../../src/ui/common/modal/datasource-modal/createDatasourceModal';
import { InsertButton } from '../../src/ui/common/modal/insert-button';
import { DatasourceViewModeDropDown } from '../../src/ui/common/modal/mode-switcher';

// This is the shape of your `parameters` object. It can be any shape you decide to use.
// `parameters` is the value that will be persisted when the user clicks the Insert button. It should contain all the information to render the Smart Link List View for that datasource.
type MyConfigModalParameters = {
	searchQuery: string;
};

// isValidParameters()*` is a validation function provided by you.
// When it returns false, the modal will not attempt to query the datasource for the preview items, and the InsertButton will also be disabled.
const isValidParameters = (parameters: unknown): parameters is MyConfigModalParameters => {
	return (
		typeof parameters === 'object' &&
		parameters !== null &&
		'searchQuery' in parameters &&
		typeof parameters.searchQuery === 'string'
	);
};

type ConnectedConfigModalProps = Omit<
	ConfigModalProps<InlineCardAdf | DatasourceAdf<MyConfigModalParameters>, MyConfigModalParameters>,
	'onInsert' | 'datasourceId'
>;

// This is your modal component
const ModalComponent = ({ onCancel }: ConnectedConfigModalProps) => {
	// `useDatasourceContext()` is the main way to access data outside of the modal, as well as interacting with the preview.
	const {
		tableState: {},
		parameters,
		setParameters,
	} = useDatasourceContext<MyConfigModalParameters>();

	const setSearchQuery = useCallback(
		(searchQuery: string) => {
			setParameters({ searchQuery });
		},
		[setParameters],
	);

	const url = `https://atlassian.com?search=${parameters?.searchQuery}`;

	const getButtonAnalyticsPayload = () => {
		return {
			searchCount: 0,
			destinationObjectTypes: [],
			extensionKey: '',
			actions: [],
		};
	};

	return (
		<DatasourceModal onClose={onCancel}>
			<ModalHeader>
				<ModalTitle>Basic Config Modal</ModalTitle>
				<DatasourceViewModeDropDown />
			</ModalHeader>
			<ModalBody>
				{
					// the <form> is the component where your user can input their query
				}
				<form>
					<Textfield
						name="search"
						placeholder="Enter your query here..."
						onChange={(e) => setSearchQuery(e.currentTarget.value)}
					/>
				</form>
			</ModalBody>
			<ModalFooter>
				{
					// ready to use CancelButton and InsertButton to close the modal, persist the datasource as `parameters`, as well as fire analytics events
				}
				<CancelButton onCancel={onCancel} getAnalyticsPayload={getButtonAnalyticsPayload} />
				<InsertButton url={url} getAnalyticsPayload={getButtonAnalyticsPayload}>
					Submit
				</InsertButton>
			</ModalFooter>
		</DatasourceModal>
	);
};

// `createDatasourceModal()` is a function that wraps your modal with necessary context providers.
const MyCustomDatasourceModal = createDatasourceModal<MyConfigModalParameters>({
	dataProvider: 'my-custom-datasource',
	isValidParameters,
	component: ModalComponent,
});

const MyCustomDatasourceModalWithProvider = () => {
	const [showModal, setShowModal] = useState(false);

	const toggleIsOpen = () => setShowModal((prevOpenState) => !prevOpenState);
	const closeModal = () => setShowModal(false);

	return (
		<IntlProvider locale="en">
			<SmartCardProvider client={new SmartLinkClient()}>
				<Button appearance="primary" onClick={toggleIsOpen}>
					Toggle Modal
				</Button>
				{showModal && (
					<MyCustomDatasourceModal
						datasourceId={'my-custom-datasource-id'}
						visibleColumnKeys={[]}
						parameters={{}}
						onCancel={closeModal}
						onInsert={closeModal}
					/>
				)}
			</SmartCardProvider>
		</IntlProvider>
	);
};

export default MyCustomDatasourceModalWithProvider;
