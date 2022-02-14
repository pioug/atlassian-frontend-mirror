/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/core';
import {
  handleOnChange,
  renderCheckbox,
  sizeOptions,
  themeOptions,
} from './utils';
import { RadioGroup } from '@atlaskit/radio';
import { SmartLinkSize, SmartLinkTheme } from '../../src';

const styles = css`
  display: flex;
  gap: 1rem;
`;

type CardOptionProps = {
  size: SmartLinkSize;
  theme: SmartLinkTheme;
  setHideBackground: React.Dispatch<React.SetStateAction<boolean>>;
  setHideElevation: React.Dispatch<React.SetStateAction<boolean>>;
  setHidePadding: React.Dispatch<React.SetStateAction<boolean>>;
  setSize: React.Dispatch<React.SetStateAction<SmartLinkSize>>;
  setTheme: React.Dispatch<React.SetStateAction<SmartLinkTheme>>;
};

const CardOption: React.FC<CardOptionProps> = ({
  size,
  theme,
  setHideBackground,
  setHideElevation,
  setHidePadding,
  setSize,
  setTheme,
}) => (
  <div>
    <h3>Card options</h3>
    <div css={styles}>
      <div>
        {renderCheckbox(setHideBackground, 'Hide background')}
        {renderCheckbox(setHideElevation, 'Hide elevation')}
        {renderCheckbox(setHidePadding, 'Hide padding')}
      </div>
      <div>
        <h6>Size</h6>
        <RadioGroup
          defaultValue={size}
          options={sizeOptions}
          onChange={handleOnChange(setSize)}
        />
      </div>
      <div>
        <h6>Theme</h6>
        <RadioGroup
          defaultValue={theme}
          options={themeOptions}
          onChange={handleOnChange(setTheme)}
        />
      </div>
    </div>
  </div>
);

export default CardOption;
