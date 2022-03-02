/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/core';
import { RenderActionOptions, renderCheckbox } from './utils';
import { ActionItem } from '../../src';

type FooterBlockOptionProps = {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setActions: React.Dispatch<React.SetStateAction<ActionItem[]>>;
};

const FooterBlockOption: React.FC<FooterBlockOptionProps> = ({
  setShow,
  setActions,
}) => (
  <div>
    <h3>{renderCheckbox(setShow, 'FooterBlock options', 'large')}</h3>
    <h6>Actions</h6>
    <RenderActionOptions setActionItems={setActions} />
  </div>
);

export default FooterBlockOption;
