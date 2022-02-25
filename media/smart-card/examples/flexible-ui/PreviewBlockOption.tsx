/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/core';
import { renderCheckbox } from './utils';

type SnippetBlockOptionProps = {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

const PreviewBlockOption: React.FC<SnippetBlockOptionProps> = ({ setShow }) => (
  <h3>{renderCheckbox(setShow, 'PreviewBlock options', 'large')}</h3>
);

export default PreviewBlockOption;
