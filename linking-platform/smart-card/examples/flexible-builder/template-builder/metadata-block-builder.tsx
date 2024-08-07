/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { type BlockBuilderProps } from '../types';
import MetadataOption from './inputs/metadata-option';
import MaxLinesOption from './inputs/max-lines-option';
import { SmartLinkSize } from '../../../src';
import EnumOption from './inputs/enum-option';

const DEFAULT_MAX_LINES = 2;

const MetadataBlockBuilder = ({
	onChange,
	size = SmartLinkSize.Medium,
	template,
}: BlockBuilderProps) => {
	return (
		<div>
			<MaxLinesOption
				defaultValue={DEFAULT_MAX_LINES}
				label="Max lines"
				name="metadata.maxLines"
				onChange={onChange}
				propName="maxLines"
				max={2}
				template={template}
			/>
			<MetadataOption
				label="Primary metadata"
				name="metadata.primary"
				onChange={onChange}
				propName="primary"
				template={template}
			/>
			<MetadataOption
				label="Secondary metadata"
				name="metadata.secondary"
				onChange={onChange}
				propName="secondary"
				template={template}
			/>
			<EnumOption
				defaultValue={size}
				label="Size (inherit)"
				name="metadata.size"
				onChange={onChange}
				propName="size"
				source={SmartLinkSize}
				template={template}
			/>
		</div>
	);
};

export default MetadataBlockBuilder;
