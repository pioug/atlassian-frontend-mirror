/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx, styled } from '@compiled/react';
import { FormattedMessage } from 'react-intl';

import Form from '@atlaskit/form/form';
import type { OnSubmitHandler } from '@atlaskit/form/types';
import Heading from '@atlaskit/heading/heading';
import { CloseButton } from '@atlaskit/modal-dialog/close-button';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Flex } from '@atlaskit/primitives/compiled/flex';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../analytics';
import {
	aqlKey,
	type ObjectSchema,
	type ObjectSchemaOption,
	type SearchForm,
} from '../../../types/assets/types';
import { AssetsModalConfigPopup } from '../modal-config-popup';
import { modalMessages } from '../modal/messages';
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
		width: '100%',
	},
});

const DEFAULT_AQL_QUERY = '';
const SEARCH_FORM_ID = 'linkDataSource.assets.configModal.searchContainer-form';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
const FormContainer = styled.form({
	display: 'grid',
	rowGap: token('space.200'),
	width: '100%',
});

export const AssetsSearchContainer = (props: SearchContainerProps): JSX.Element => {
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
			{({ formProps, setFieldValue }) => {
				const onSchemaChange = (schema: ObjectSchemaOption) => {
					if (fg('platform_lp_sllv_assets_default_schema_aql')) {
						const defaultAql = `objectSchema = "${schema.label}"`;
						setFieldValue(aqlKey, defaultAql);
						onSearch(defaultAql, schema.value);
					}
				};

				return (
					<FormContainer {...formProps} id={SEARCH_FORM_ID}>
						<FormRowContainer isNarrowGap>
							{fg('astral_assets_macro_table_ui_uplift') ? (
								<Flex gap="space.200" justifyContent="space-between" xcss={styles.flexStyles}>
									<Flex justifyContent="start" xcss={styles.modalTitleContainer}>
										{modalTitle}
									</Flex>
									<Flex justifyContent="end">
										<Flex alignItems="center" gap="space.100">
											<Text>
												<FormattedMessage {...modalMessages.insertObjectsTitle} />:
											</Text>
											<AssetsObjectSchemaSelect
												value={initialSearchData.objectSchema ?? undefined}
												workspaceId={workspaceId}
												initialObjectSchemas={initialSearchData.objectSchemas ?? undefined}
												classNamePrefix="assets-datasource-modal--object-schema-select"
												onSchemaChange={onSchemaChange}
											/>
										</Flex>
										{/* TODO: wire config changes through to the modal */}
										<AssetsModalConfigPopup onChange={() => {}} />
										<CloseButton onClick={onCancel} />
									</Flex>
								</Flex>
							) : (
								<Flex gap="space.200" justifyContent="space-between" xcss={styles.flexStyles}>
									<Flex justifyContent="start" xcss={styles.modalTitleContainer}>
										{modalTitle}
										<AssetsObjectSchemaSelect
											value={initialSearchData.objectSchema ?? undefined}
											workspaceId={workspaceId}
											initialObjectSchemas={initialSearchData.objectSchemas ?? undefined}
											classNamePrefix="assets-datasource-modal--object-schema-select"
											onSchemaChange={onSchemaChange}
										/>
									</Flex>
									<Flex justifyContent="end">
										<CloseButton onClick={onCancel} />
									</Flex>
								</Flex>
							)}
						</FormRowContainer>
						{fg('astral_assets_macro_table_ui_uplift') ? (
							<Heading size="xsmall">
								<FormattedMessage {...modalMessages.filterObjectsText} />
							</Heading>
						) : null}
						<FormRowContainer>
							<AqlSearchInput
								value={initialSearchData.aql ?? DEFAULT_AQL_QUERY}
								workspaceId={workspaceId}
								isSearching={isSearching}
							/>
						</FormRowContainer>
					</FormContainer>
				);
			}}
		</Form>
	);
};
