/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import { type BlockBuilderProps } from '../types';
import MetadataOption from './inputs/metadata-option';
import MaxLinesOption from './inputs/max-lines-option';
import { SmartLinkPosition, SmartLinkSize } from '../../../src';
import EnumOption from './inputs/enum-option';
import CheckboxOption from './inputs/checkbox-option';
import SelectOption from './inputs/select-option';
import ActionOption from './inputs/action-option';
import TextOption from './inputs/text-option';

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
}) => (
  <React.Fragment>
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
    <CheckboxOption
      label="Hide icon"
      name="title.hideIcon"
      onChange={onChange}
      propName="hideIcon"
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
    <TextOption
      defaultValue={template.text || ''}
      label="Override link title"
      name="title.text"
      onChange={onChange}
      propName="text"
      template={template}
    />
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
    <CheckboxOption
      label="Only show action on hover"
      name="title.showActionOnHover"
      onChange={onChange}
      propName="showActionOnHover"
      template={template}
    />
    <CheckboxOption
      label="Do not show any retry messages"
      name="title.hideRetry"
      onChange={onChange}
      propName="hideRetry"
      template={template}
    />
  </React.Fragment>
);

export default TitleBlockBuilder;
