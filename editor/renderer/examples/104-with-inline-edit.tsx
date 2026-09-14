import React, { useState } from 'react';
import { default as Renderer } from '../src/ui/Renderer';
import codeBlockADF from './helper/codeblock.adf.json';

import InlineEdit from '@atlaskit/inline-edit/inline-edit';
import Textfield from '@atlaskit/textfield/text-field';
import type { DocNode } from '@atlaskit/adf-schema/doc';

export default function InlineEditWithRenderer(): React.JSX.Element {
	const [editValue, setEditValue] = useState('Field value');

	return (
		<InlineEdit
			defaultValue={editValue}
			label="Inline edit"
			editView={({ errorMessage, ...fieldProps }) => <Textfield {...fieldProps} autoFocus />}
			readView={() => (
				<Renderer
					appearance="full-width"
					document={codeBlockADF as DocNode}
					allowWrapCodeBlock
					allowCopyToClipboard
				/>
			)}
			onConfirm={(value) => setEditValue(value)}
		/>
	);
}
