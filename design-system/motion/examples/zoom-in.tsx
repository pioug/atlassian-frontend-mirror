/** @jsx jsx */
import React, { useState } from 'react';

import { jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';

import { Block, Centered, RetryContainer } from '../examples-utils';
import { ExitingPersistence, StaggeredEntrance, ZoomIn } from '../src';

export default () => {
  const [isIn, setIsIn] = useState(true);

  return (
    <RetryContainer>
      <div style={{ textAlign: 'center' }}>
        <Button onClick={() => setIsIn((prev) => !prev)}>
          {isIn ? 'Exit' : 'Enter'}
        </Button>
      </div>

      <Centered css={{ height: '82px' }}>
        <StaggeredEntrance>
          <ExitingPersistence appear>
            {isIn && (
              <React.Fragment>
                <ZoomIn>
                  {(props) => <Block {...props} appearance="small" />}
                </ZoomIn>
                <ZoomIn>
                  {(props) => <Block {...props} appearance="small" />}
                </ZoomIn>
                <ZoomIn>
                  {(props) => <Block {...props} appearance="small" />}
                </ZoomIn>
              </React.Fragment>
            )}
          </ExitingPersistence>
        </StaggeredEntrance>
      </Centered>
    </RetryContainer>
  );
};
