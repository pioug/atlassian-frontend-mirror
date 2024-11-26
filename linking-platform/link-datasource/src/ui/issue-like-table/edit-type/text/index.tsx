import React, { useEffect } from 'react';

import { type FieldProps } from '@atlaskit/form';
import { Layering } from '@atlaskit/layering';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

import { succeedUfoExperience } from '../../../../analytics/ufoExperiences';
import { useDatasourceExperienceId } from '../../../../contexts/datasource-experience-id';
import type { DatasourceTypeWithOnlyTypeValues, DatasourceTypeWithOnlyValues } from '../../types';

interface TextEditTypeProps extends Omit<FieldProps<string>, 'value'> {
	currentValue: DatasourceTypeWithOnlyTypeValues<'string'>;
	setEditValues: React.Dispatch<React.SetStateAction<DatasourceTypeWithOnlyValues>>;
}

const TextEditType = (props: TextEditTypeProps) => {
	const experienceId = useDatasourceExperienceId();

	const { currentValue } = props;

	useEffect(() => {
		if (experienceId) {
			succeedUfoExperience(
				{
					name: 'inline-edit-rendered',
				},
				experienceId,
			);
		}
	}, [experienceId]);

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
				value={currentValue?.values?.[0] ?? ''}
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
