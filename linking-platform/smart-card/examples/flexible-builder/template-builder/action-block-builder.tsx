import React from 'react';
import { SmartLinkSize } from '../../../src/constants';
import type { BlockBuilderProps } from '../types';
import EnumOption from './inputs/enum-option';

const ActionBlockBuilder = ({
	onChange,
	size = SmartLinkSize.Medium,
	template,
}: BlockBuilderProps) => {
	return (
		<div>
			<EnumOption
				defaultValue={size}
				label="Size (inherit)"
				name="action.size"
				onChange={onChange}
				propName="size"
				source={SmartLinkSize}
				template={template}
			/>
		</div>
	);
};

export default ActionBlockBuilder;
