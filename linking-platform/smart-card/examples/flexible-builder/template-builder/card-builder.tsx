/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import CheckboxOption from './inputs/checkbox-option';
import { CardBuilderProps } from '../types';

const CardBuilder: React.FC<{
  onChange: (template: CardBuilderProps) => void;
  template?: CardBuilderProps;
}> = ({ onChange, template = {} }) => (
  <div>
    <CheckboxOption
      label="Show hover preview"
      name="showHoverPreview"
      onChange={onChange}
      propName="showHoverPreview"
      template={template}
    />
  </div>
);

export default CardBuilder;
