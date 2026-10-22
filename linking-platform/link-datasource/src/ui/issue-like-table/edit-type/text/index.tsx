import React, { useEffect } from 'react';

import type { FieldProps } from '@atlaskit/form/field';
import Textfield from '@atlaskit/textfield/text-field';
import { token } from '@atlaskit/tokens';

import { succeedUfoExperience } from '../../../../analytics/ufoExperiences/succeedUfoExperience';
import { useDatasourceExperienceId } from '../../../../contexts/datasource-experience-id/use-datasource-experience-id';
import type { DatasourceTypeWithOnlyTypeValues, DatasourceTypeWithOnlyValues } from '../../types';
import { InlineEditLayer } from '../inline-edit-layer';

interface TextEditTypeProps extends Omit<FieldProps<string>, 'value'> {
	currentValue: DatasourceTypeWithOnlyTypeValues<'string'>;
	labelId?: string;
	setEditValues: React.Dispatch<React.SetStateAction<DatasourceTypeWithOnlyValues>>;
}

const TextEditType = (props: TextEditTypeProps): React.JSX.Element => {
	const experienceId = useDatasourceExperienceId();

	const { currentValue, labelId } = props;

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
		<InlineEditLayer>
			<Textfield
				{...props}
				autoFocus
				isCompact
				testId="inline-edit-text"
				style={{
					// We need 8px left padding to match read only version, but there is already 1px of border
					padding: `${token('space.100')} calc(${token('space.100')} - 1px)`,
				}}
				value={currentValue?.values?.[0] ?? ''}
				aria-labelledby={labelId}
				onChange={(e) =>
					props.setEditValues({
						type: 'string',
						values: [e.currentTarget.value],
					})
				}
			/>
		</InlineEditLayer>
	);
};

export default TextEditType;
