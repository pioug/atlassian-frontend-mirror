import React from 'react';
import { BlockBuilderProps } from '../types';
import { SmartLinkSize } from '../../../src';
import EnumOption from './inputs/enum-option';
import ActionOption from './inputs/action-option';

const FooterBlockBuilder: React.FC<BlockBuilderProps> = ({
  onChange,
  size = SmartLinkSize.Medium,
  template,
}) => {
  return (
    <div>
      <EnumOption
        defaultValue={size}
        label="Size (inherit)"
        name="footer.size"
        onChange={onChange}
        propName="size"
        source={SmartLinkSize}
        template={template}
      />
      <ActionOption
        name="footer.actions"
        onChange={onChange}
        propName="actions"
        template={template}
      />
    </div>
  );
};

export default FooterBlockBuilder;
