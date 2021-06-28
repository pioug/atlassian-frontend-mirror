import React, { useState } from 'react';

import { MenuGroup, Section, HeadingItem, ButtonItem } from '@atlaskit/menu';
import { FieldDefinition } from '@atlaskit/editor-common/extensions';

export default function ExtensionNodePicker({
  fields,
  selectedField,
  onSelect,
}: {
  fields: FieldDefinition[];
  selectedField?: string;
  onSelect: (field: FieldDefinition) => void;
}) {
  const [hasSelection, setHasSelection] = useState<boolean>(false);

  return (
    <div
      style={{
        border: `1px solid #ccc`,
        boxShadow:
          '0px 4px 8px rgba(9, 30, 66, 0.25), 0px 0px 1px rgba(9, 30, 66, 0.31)',
        borderRadius: 4,
        maxWidth: 320,
        maxHeight: '90vh',
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

            const label = field.isRequired
              ? `${field.label} (Required)`
              : field.label;

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
