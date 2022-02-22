/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/core';
import { renderCheckbox } from './utils';

type SnippetBlockOptionProps = {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

const SnippetBlockOption: React.FC<SnippetBlockOptionProps> = ({ setShow }) => (
  <h3>{renderCheckbox(setShow, 'SnippetBlock options', 'large')}</h3>
);

export default SnippetBlockOption;
