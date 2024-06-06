import React from 'react';
import { type BlockBuilderProps } from '../types';
import SelectOption from './inputs/select-option';
import CheckboxOption from './inputs/checkbox-option';
import { MediaPlacement } from '../../../src';

const placementOptions = [
	{ label: 'Auto (default)', value: '' },
	{ label: 'Left', value: MediaPlacement.Left },
	{ label: 'Right', value: MediaPlacement.Right },
];

const PreviewBlockBuilder: React.FC<BlockBuilderProps> = ({ onChange, template }) => {
	return (
		<div>
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
		</div>
	);
};

export default PreviewBlockBuilder;
