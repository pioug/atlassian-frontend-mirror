import React, { Fragment, useEffect, useRef, useState } from 'react';

import styled from '@emotion/styled';

import { type AppearanceType, type SizeType } from '@atlaskit/avatar';
import Button from '@atlaskit/button/new';
import { Stack } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { RANDOM_USERS } from '../examples-util/data';
import AvatarGroup from '../src';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ButtonGroup = styled.div({
  margin: token('space.100', '8px'),
  textAlign: 'center',
});

const INITIAL_NUMBER_VISIBLE_AVATARS = 8;

export default () => {
  const lastAvatarItemRef = useRef<HTMLElement>(null);
  const [range, setRange] = useState(INITIAL_NUMBER_VISIBLE_AVATARS);
  const data = RANDOM_USERS.slice(0, range).map((d, i) => ({
    key: d.email,
    name: d.name,
    href: `/users/${i}`,
    appearance: 'circle' as AppearanceType,
    size: 'medium' as SizeType,
  }));

  useEffect(() => {
    lastAvatarItemRef.current?.focus();
  }, [range]);

  return (
    <Stack space="space.150">
      <p>Please note a maximum of 16 items can be added.</p>
      <AvatarGroup
        testId="overrides"
        appearance="stack"
        data={data}
        size="large"
        // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
        overrides={{
          AvatarGroupItem: {
            render: (Component, props, index) =>
              index === data.length - 1 ? (
                <Fragment key={`${index}-overridden`}>
                  <Component {...props} key={index} ref={lastAvatarItemRef} />
                  <ButtonGroup data-testid="load-more-actions">
                    <Button
                      testId="load-more"
                      isDisabled={range >= RANDOM_USERS.length}
                      onClick={() => {
                        setRange(range + 1);
                      }}
                    >
                      Load more users
                    </Button>
                  </ButtonGroup>
                </Fragment>
              ) : (
                <Component {...props} key={index} />
              ),
          },
        }}
      />
    </Stack>
  );
};
