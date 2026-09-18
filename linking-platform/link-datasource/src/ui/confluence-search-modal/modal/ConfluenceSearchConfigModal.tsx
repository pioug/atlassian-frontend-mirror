import React from 'react';

import type { DatasourceParameters } from '@atlaskit/linking-types/datasource';

import { StoreContainer } from '../../../state';
import { createDatasourceModal } from '../../common/modal/datasource-modal/createDatasourceModal';
import {
	type ConfluenceSearchConfigModalProps,
	type ConfluenceSearchDatasourceParameters,
} from '../types';
import { PlainConfluenceSearchConfigModal } from './PlainConfluenceSearchConfigModal';

const isValidParameters = (parameters: DatasourceParameters | undefined): boolean =>
	!!(
		parameters &&
		parameters.cloudId &&
		Object.values(parameters).filter((v) => v !== undefined).length > 1
	);

const ConnectedConfluenceSearchConfigModal =
	createDatasourceModal<ConfluenceSearchDatasourceParameters>({
		isValidParameters,
		dataProvider: 'confluence-search',
		component: PlainConfluenceSearchConfigModal,
	});

export const ConfluenceSearchConfigModal = (
	props: ConfluenceSearchConfigModalProps,
): React.JSX.Element => {
	return (
		<StoreContainer>
			<ConnectedConfluenceSearchConfigModal
				{...props}
				/**
				 * If the intial parameters are not valid, we will not initialise the modal state
				 * with `overrideParameters`. This is to allow the modal to be opened without
				 * any initial parameters and require the user to perform a search.
				 */
				parameters={
					props.overrideParameters && isValidParameters(props.parameters)
						? { ...props.parameters, ...props.overrideParameters }
						: props.parameters
				}
			/>
		</StoreContainer>
	);
};
