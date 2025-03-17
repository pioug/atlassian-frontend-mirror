/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, styled } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { AssetsAqlSearchInputSkeleton } from './aql-search-input/loading-state';
import { AssetsObjectSchemaSelectSkeleton } from './object-schema-select/loading-state';
import { FormRowContainer } from './styled';

type AssetsSearchConatinerLoadingProps = {
	// This is due to ModalTitle needing a ModalDialog so should be passed down
	modalTitle?: JSX.Element;
};
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

export const AssetsSearchContainerLoading = ({ modalTitle }: AssetsSearchConatinerLoadingProps) => {
	return (
		<FormContainer data-testid="assets-datasource-modal--search-container-skeleton">
			<FormRowContainer isNarrowGap>
				{modalTitle}
				<SchemaSelectContainer>
					<AssetsObjectSchemaSelectSkeleton />
				</SchemaSelectContainer>
			</FormRowContainer>
			<FormRowContainer>
				<AssetsAqlSearchInputSkeleton />
			</FormRowContainer>
		</FormContainer>
	);
};
