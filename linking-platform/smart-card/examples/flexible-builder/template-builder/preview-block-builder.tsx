import React from 'react';

import { MediaPlacement } from '../../../src';
import { type BlockBuilderProps } from '../types';

import CheckboxOption from './inputs/checkbox-option';
import SelectOption from './inputs/select-option';

const placementOptions = [
	{ label: 'Auto (default)', value: '' },
	{ label: 'Left', value: MediaPlacement.Left },
	{ label: 'Right', value: MediaPlacement.Right },
];

const PreviewBlockBuilder = ({ onChange, template }: BlockBuilderProps): React.JSX.Element => {
	return (
		<>
			<SelectOption
				defaultValue=""
				label="Placement"
				name="preview.placement"
				onChange={onChange}
				propName="placement"
				options={placementOptions}
				template={template}
			/>
			<CheckboxOption
				label="Ignore container padding"
				name="preview.ignoreContainerPadding"
				onChange={onChange}
				propName="ignoreContainerPadding"
				template={template}
			/>
		</>
	);
};

export default PreviewBlockBuilder;
