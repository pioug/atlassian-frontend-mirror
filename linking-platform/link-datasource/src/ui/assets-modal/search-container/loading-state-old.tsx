/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { AssetsAqlSearchInputSkeleton } from './aql-search-input/loading-state';
import { AssetsObjectSchemaSelectSkeleton } from './object-schema-select/loading-state';
import { FormContainer, FormRowContainer, SchemaSelectContainer } from './styled-old';

type AssetsSearchConatinerLoadingProps = {
	// This is due to ModalTitle needing a ModalDialog so should be passed down
	modalTitle?: JSX.Element;
};

export const AssetsSearchContainerLoadingOld = ({
	modalTitle,
}: AssetsSearchConatinerLoadingProps) => {
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
