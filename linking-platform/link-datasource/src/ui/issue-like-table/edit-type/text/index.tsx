import React from 'react';

import { type FieldProps } from '@atlaskit/form';
import { Layering } from '@atlaskit/layering';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

import type { DatasourceTypeWithOnlyValues } from '../../types';

interface TextEditTypeProps extends Omit<FieldProps<string>, 'value'> {
	currentValue: DatasourceTypeWithOnlyValues;
	setEditValues: React.Dispatch<React.SetStateAction<DatasourceTypeWithOnlyValues>>;
}

export const toTextValue = (typeWithValues: DatasourceTypeWithOnlyValues): string =>
	(typeWithValues.values?.[0] as string) ?? '';

const TextEditType = (props: TextEditTypeProps) => {
	return (
		<Layering isDisabled={false}>
			<Textfield
				{...props}
				autoFocus
				isCompact
				testId="inline-edit-text"
				style={{
					// We need 8px left padding to match read only version, but there is already 1px of border
					padding: `${token('space.100', '8px')} calc(${token('space.100', '8px')} - 1px)`,
				}}
				value={toTextValue(props.currentValue)}
				onChange={(e) =>
					props.setEditValues({
						type: 'string',
						values: [e.currentTarget.value],
					})
				}
			/>
		</Layering>
	);
};

export default TextEditType;
