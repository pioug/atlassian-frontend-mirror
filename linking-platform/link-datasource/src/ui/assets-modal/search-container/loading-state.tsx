/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx, styled } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Flex } from '@atlaskit/primitives/compiled/flex';
import { token } from '@atlaskit/tokens';

import { AssetsAqlSearchInputSkeleton } from './aql-search-input/loading-state';
import { AssetsObjectSchemaSelectSkeleton } from './object-schema-select/loading-state';
import { FormRowContainer } from './styled';

type AssetsSearchConatinerLoadingProps = {
	// This is due to ModalTitle needing a ModalDialog so should be passed down
	modalTitle?: JSX.Element;
};

const styles = cssMap({
	flexStyles: {
		width: '100%',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
const SchemaSelectContainer = styled.div({
	width: '100%',
	maxWidth: '386px',
});
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
const FormContainer = styled.form({
	display: 'grid',
	rowGap: token('space.200'),
	width: '100%',
});

export const AssetsSearchContainerLoading = ({
	modalTitle,
}: AssetsSearchConatinerLoadingProps): JSX.Element => {
	return (
		<FormContainer data-testid="assets-datasource-modal--search-container-skeleton">
			{fg('astral_assets_macro_table_ui_uplift') ? (
				<Flex
					gap="space.100"
					alignItems="center"
					justifyContent="space-between"
					xcss={styles.flexStyles}
				>
					{modalTitle}
					<SchemaSelectContainer>
						<AssetsObjectSchemaSelectSkeleton />
					</SchemaSelectContainer>
				</Flex>
			) : (
				<FormRowContainer isNarrowGap>
					{modalTitle}
					<SchemaSelectContainer>
						<AssetsObjectSchemaSelectSkeleton />
					</SchemaSelectContainer>
				</FormRowContainer>
			)}
			<FormRowContainer>
				<AssetsAqlSearchInputSkeleton />
			</FormRowContainer>
		</FormContainer>
	);
};
