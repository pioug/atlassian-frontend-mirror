/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx, styled } from '@compiled/react';

import Form, { type OnSubmitHandler } from '@atlaskit/form';
import { CloseButton } from '@atlaskit/modal-dialog';
import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../analytics';
import type { ObjectSchema, SearchForm } from '../../../types/assets/types';

import { AqlSearchInput } from './aql-search-input';
import { AssetsObjectSchemaSelect } from './object-schema-select';
import { FormRowContainer } from './styled';

export type InitialSearchData = {
	aql?: string;
	objectSchema?: ObjectSchema;
	objectSchemas?: ObjectSchema[];
};

export interface SearchContainerProps {
	initialSearchData: InitialSearchData;
	isSearching: boolean;
	// This is due to ModalTitle needing a ModalDialog so should be passed down
	modalTitle?: JSX.Element;
	onCancel: () => void;
	onSearch: (aql: string, schemaId: string) => void;
	workspaceId: string;
}

const styles = cssMap({
	modalTitleContainer: {
		gap: token('space.200'),
		alignItems: 'center',
	},
	flexStyles: {
		flexDirection: 'row-reverse',
		width: '100%',
	},
});

const DEFAULT_AQL_QUERY = '';
const SEARCH_FORM_ID = 'linkDataSource.assets.configModal.searchContainer-form';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
const FormContainer = styled.form({
	display: 'grid',
	rowGap: token('space.200', '16px'),
	width: '100%',
});

export const AssetsSearchContainer = (props: SearchContainerProps) => {
	const { onSearch, workspaceId, initialSearchData, modalTitle, isSearching, onCancel } = props;
	const { fireEvent } = useDatasourceAnalyticsEvents();

	const onFormSubmit: OnSubmitHandler<SearchForm> = (searchFormValues) => {
		const { aql, objectSchema } = searchFormValues;
		if (aql && objectSchema) {
			fireEvent('ui.aqlEditor.searched', {});
			// Pass the validated aql and object schema back to modal
			onSearch(aql, objectSchema.value);
		}
	};

	return (
		<Form<SearchForm> onSubmit={onFormSubmit}>
			{({ formProps }) => (
				<FormContainer {...formProps} id={SEARCH_FORM_ID}>
					<FormRowContainer isNarrowGap>
						<Flex gap="space.200" justifyContent="space-between" xcss={styles.flexStyles}>
							<Flex justifyContent="end">
								<CloseButton onClick={onCancel} />
							</Flex>
							<Flex justifyContent="start" xcss={styles.modalTitleContainer}>
								{modalTitle}
								<AssetsObjectSchemaSelect
									value={initialSearchData.objectSchema ?? undefined}
									workspaceId={workspaceId}
									initialObjectSchemas={initialSearchData.objectSchemas ?? undefined}
									classNamePrefix="assets-datasource-modal--object-schema-select"
								/>
							</Flex>
						</Flex>
					</FormRowContainer>
					<FormRowContainer>
						<AqlSearchInput
							value={initialSearchData.aql ?? DEFAULT_AQL_QUERY}
							workspaceId={workspaceId}
							isSearching={isSearching}
						/>
					</FormRowContainer>
				</FormContainer>
			)}
		</Form>
	);
};
