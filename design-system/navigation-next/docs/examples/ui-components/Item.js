import React from 'react';
import Badge from '@atlaskit/badge';
import CloseButton from '@atlaskit/icon/glyph/cross';
import { Item, ItemAvatar } from '../../../src';
import { CONTENT_NAV_WIDTH } from '../../../src/common/constants';

export default () => (
  <div css={{ width: CONTENT_NAV_WIDTH }}>
    <Item
      after={({ isActive, isHover }) =>
        isActive || isHover ? (
          <CloseButton size="small" />
        ) : (
          <Badge appearance="primary">3</Badge>
        )
      }
      before={s => <ItemAvatar itemState={s} presence="online" size="small" />}
      text="Item title"
      subText="Some kind of description"
    />
  </div>
);
