/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, styled } from '@compiled/react';

import Form, { type OnSubmitHandler } from '@atlaskit/form';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../analytics';
import type { ObjectSchema, SearchForm } from '../../../types/assets/types';

import { AqlSearchInput } from './aql-search-input';
import { AssetsObjectSchemaSelect } from './object-schema-select';
import { AssetsSearchContainerOld } from './search-container-old';
import { FormRowContainer } from './styled';

export type InitialSearchData = {
	objectSchema?: ObjectSchema;
	objectSchemas?: ObjectSchema[];
	aql?: string;
};

export interface SearchContainerProps {
	workspaceId: string;
	initialSearchData: InitialSearchData;
	onSearch: (aql: string, schemaId: string) => void;
	// This is due to ModalTitle needing a ModalDialog so should be passed down
	modalTitle?: JSX.Element;
	isSearching: boolean;
}

const DEFAULT_AQL_QUERY = '';
const SEARCH_FORM_ID = 'linkDataSource.assets.configModal.searchContainer-form';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
const SchemaSelectContainer = styled.div({
	width: '100%',
	maxWidth: '386px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
const FormContainer = styled.form({
	display: 'grid',
	rowGap: token('space.200', '16px'),
	width: '100%',
});

export const AssetsSearchContainerNew = (props: SearchContainerProps) => {
	const { onSearch, workspaceId, initialSearchData, modalTitle, isSearching } = props;
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
						{modalTitle}
						<SchemaSelectContainer>
							<AssetsObjectSchemaSelect
								value={initialSearchData.objectSchema ?? undefined}
								workspaceId={workspaceId}
								initialObjectSchemas={initialSearchData.objectSchemas ?? undefined}
								classNamePrefix="assets-datasource-modal--object-schema-select"
							/>
						</SchemaSelectContainer>
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

export const AssetsSearchContainer = (props: SearchContainerProps) => {
	if (fg('bandicoots-compiled-migration-link-datasource')) {
		return <AssetsSearchContainerNew {...props} />;
	} else {
		return <AssetsSearchContainerOld {...props} />;
	}
};
