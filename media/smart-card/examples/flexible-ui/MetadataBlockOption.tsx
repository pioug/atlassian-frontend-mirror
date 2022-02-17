/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/core';
import { RadioGroup } from '@atlaskit/radio';
import { ElementItem } from '../../src';
import {
  blockOptionStyles,
  renderCheckbox,
  renderMetadataOptions,
} from './utils';

type MetadataBlockOptionProps = {
  primary: ElementItem[];
  secondary: ElementItem[];
  setMaxLines: React.Dispatch<React.SetStateAction<number>>;
  setPrimary: React.Dispatch<React.SetStateAction<ElementItem[]>>;
  setSecondary: React.Dispatch<React.SetStateAction<ElementItem[]>>;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

const MetadataBlockOption: React.FC<MetadataBlockOptionProps> = ({
  primary,
  secondary,
  setMaxLines,
  setPrimary,
  setSecondary,
  setShow,
}) => (
  <React.Fragment>
    <h3>{renderCheckbox(setShow, 'MetadataBlock options', 'large')}</h3>
    <div css={blockOptionStyles}>
      <div>
        <h6>Lines</h6>
        <RadioGroup
          defaultValue="2"
          options={[
            { name: 'metadataMaxLines', value: '1', label: 'Single' },
            { name: 'metadataMaxLines', value: '2', label: 'Double' },
          ]}
          onChange={(e) => setMaxLines(Number(e.currentTarget.value))}
        />
      </div>
      <div>
        <h6>Primary</h6>
        {renderMetadataOptions(primary, setPrimary)}
        <h6>Secondary</h6>
        {renderMetadataOptions(secondary, setSecondary)}
      </div>
    </div>
  </React.Fragment>
);

export default MetadataBlockOption;
