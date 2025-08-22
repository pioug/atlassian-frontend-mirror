/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React, { useState } from 'react';

import type { FieldDefinition } from '@atlaskit/editor-common/extensions';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ButtonItem, HeadingItem, MenuGroup, Section } from '@atlaskit/menu';

export default function ExtensionNodePicker({
	fields,
	selectedField,
	onSelect,
}: {
	fields: FieldDefinition[];
	onSelect: (field: FieldDefinition) => void;
	selectedField?: string;
}) {
	const [hasSelection, setHasSelection] = useState<boolean>(false);

	return (
		<div
			style={{
				border: `1px solid #ccc`,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				boxShadow: '0px 4px 8px rgba(9, 30, 66, 0.25), 0px 0px 1px rgba(9, 30, 66, 0.31)',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				borderRadius: 4,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				maxWidth: 320,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				maxHeight: '90vh',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				overflow: 'auto',
			}}
		>
			<MenuGroup>
				<Section>
					<HeadingItem>Select a field</HeadingItem>
					{(fields || []).map((field) => {
						const isSelected = selectedField === field.name;

						const doSelect = () => onSelect(field);

						if (isSelected && isSelected !== hasSelection) {
							doSelect();
							setHasSelection(isSelected);
						}

						const label = field.isRequired ? `${field.label} (Required)` : field.label;

						return (
							<ButtonItem
								isSelected={isSelected}
								key={field.name}
								onClick={doSelect}
								description={field.type}
							>
								{label}
							</ButtonItem>
						);
					})}
				</Section>
			</MenuGroup>
		</div>
	);
}
