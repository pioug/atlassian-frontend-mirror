/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useCallback } from 'react';
import { Field } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import { BlockBuilderProps, BlockTemplate } from '../types';
import MetadataOption from './inputs/metadata-option';
import MaxLinesOption from './inputs/max-lines-option';
import { SmartLinkPosition, SmartLinkSize } from '../../../src';
import EnumOption from './inputs/enum-option';
import CheckboxOption from './inputs/checkbox-option';
import SelectOption from './inputs/select-option';
import { ChangeParams, handleOnChange } from '../utils';
import ActionOption from './inputs/action-option';

const DEFAULT_MAX_LINES = 2;

const targetOptions = [
  { label: '_blank (default)', value: '_blank' },
  { label: '_parent', value: '_parent' },
  { label: '_self', value: '_self' },
  { label: '_top', value: '_top' },
];

const TitleBlockBuilder: React.FC<BlockBuilderProps> = ({
  onChange,
  size = SmartLinkSize.Medium,
  template,
}) => {
  const handleOnTextChange = useCallback(
    (...params: ChangeParams<BlockTemplate>) => (
      e: React.SyntheticEvent<HTMLInputElement>,
    ) => {
      handleOnChange<BlockTemplate>(...params, e.currentTarget.value);
    },
    [],
  );
  return (
    <div>
      <MaxLinesOption
        defaultValue={DEFAULT_MAX_LINES}
        label="Max lines"
        name="title.maxLines"
        onChange={onChange}
        propName="maxLines"
        max={2}
        template={template}
      />
      <MetadataOption
        label="Metadata"
        name="title.metadata"
        onChange={onChange}
        propName="metadata"
        template={template}
      />
      <MetadataOption
        label="Subtitle metadata"
        name="title.subtitle"
        onChange={onChange}
        propName="subtitle"
        template={template}
      />
      <EnumOption
        defaultValue={SmartLinkPosition.Top}
        label="Position"
        name="title.position"
        onChange={onChange}
        propName="position"
        source={SmartLinkPosition}
        template={template}
      />
      <SelectOption
        defaultValue="_blank"
        label="Override link target"
        name="title.anchorTarget"
        onChange={onChange}
        propName="anchorTarget"
        options={targetOptions}
        template={template}
      />
      <Field
        label="Override link title"
        name="title.text"
        defaultValue={template.text || ''}
      >
        {({ fieldProps }) => (
          <Textfield
            {...fieldProps}
            onChange={handleOnTextChange(onChange, template, 'text', '')}
          />
        )}
      </Field>
      <CheckboxOption
        label="Hide title tooltip"
        name="title.hideTitleTooltip"
        onChange={onChange}
        propName="hideTitleTooltip"
        template={template}
      />
      <EnumOption
        defaultValue={size}
        label="Size (inherit)"
        name="title.size"
        onChange={onChange}
        propName="size"
        source={SmartLinkSize}
        template={template}
      />
      <ActionOption
        name="title.actions"
        onChange={onChange}
        propName="actions"
        template={template}
      />
    </div>
  );
};

export default TitleBlockBuilder;
