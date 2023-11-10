/** @jsx jsx */
import { jsx } from '@emotion/react';

import Form from '@atlaskit/form';

import { useDatasourceAnalyticsEvents } from '../../../analytics';
import type { ObjectSchema, SearchForm } from '../../../types/assets/types';

import { AqlSearchInput } from './aql-search-input';
import { AssetsObjectSchemaSelect } from './object-schema-select';
import {
  FormContainer,
  FormRowContainer,
  SchemaSelectContainer,
} from './styled';

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

export const AssetsSearchContainer = (props: SearchContainerProps) => {
  const { onSearch, workspaceId, initialSearchData, modalTitle, isSearching } =
    props;
  const { fireEvent } = useDatasourceAnalyticsEvents();

  const onFormSubmit = (searchFormValues: SearchForm) => {
    const { aql, objectSchema } = searchFormValues;
    if (objectSchema) {
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
                initialObjectSchemas={
                  initialSearchData.objectSchemas ?? undefined
                }
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
