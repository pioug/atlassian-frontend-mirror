import React from 'react';

import styled from '@emotion/styled';

import { AppearanceType, SizeType } from '@atlaskit/avatar';
import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import {
  getFreeToUseAvatarImage,
  RANDOM_USERS,
} from '../../examples-util/data';
import AvatarGroup from '../../src';

const ButtonGroup = styled.div({
  margin: token('space.100', '8px'),
  textAlign: 'center',
});

const AvatarGroupOverridesExample = () => {
  const data = RANDOM_USERS.slice(0, 8).map((d, i) => ({
    key: d.email,
    name: d.name,
    href: '#',
    appearance: 'circle' as AppearanceType,
    size: 'medium' as SizeType,
    src: getFreeToUseAvatarImage(i),
  }));

  return (
    <AvatarGroup
      testId="overrides"
      appearance="stack"
      data={data}
      size="large"
      // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
      overrides={{
        AvatarGroupItem: {
          render: (Component, props, index) => {
            const avatarItem = <Component {...props} key={index} />;

            return index === data.length - 1 ? (
              <React.Fragment key={`${index}-overridden`}>
                {avatarItem}
                <ButtonGroup data-testid="load-more-actions">
                  <Button testId="load-more">Load more</Button>
                </ButtonGroup>
              </React.Fragment>
            ) : (
              avatarItem
            );
          },
        },
      }}
    />
  );
};

export default AvatarGroupOverridesExample;
