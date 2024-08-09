import React, { useState } from 'react';

import AKInlineEdit from '@atlaskit/inline-edit';
import { Box, xcss } from '@atlaskit/primitives';

import { editType } from '../edit-type';
import type { DatasourceTypeWithOnlyValues } from '../types';

const containerStyles = xcss({
	marginBlockStart: 'space.negative.100',
});

interface InlineEditProps {
	datasourceTypeWithValues: DatasourceTypeWithOnlyValues;
	readView: React.ReactNode;
}

export const InlineEdit = ({ datasourceTypeWithValues, readView }: InlineEditProps) => {
	const [isEditing, setIsEditing] = useState(false);

	return (
		<Box xcss={containerStyles}>
			<AKInlineEdit
				{...editType(datasourceTypeWithValues)}
				hideActionButtons
				readView={() => readView}
				readViewFitContainerWidth
				isEditing={isEditing}
				onEdit={() => setIsEditing(true)}
				onCancel={() => setIsEditing(false)}
				onConfirm={(value) => {
					setIsEditing(false);
					// Save value back to the store
				}}
			/>
		</Box>
	);
};
