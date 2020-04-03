import React from 'react';
import { ContainerHeader, ItemAvatar } from '../../../src';
import { CONTENT_NAV_WIDTH } from '../../../src/common/constants';

export default () => (
  <div style={{ width: CONTENT_NAV_WIDTH }}>
    <ContainerHeader
      before={s => <ItemAvatar appearance="square" itemState={s} />}
      subText="Container description"
      text="Container name"
    />
  </div>
);
