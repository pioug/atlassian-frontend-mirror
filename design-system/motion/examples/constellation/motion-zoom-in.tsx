/** @jsx jsx */
import React, { useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import {
  ExitingPersistence,
  StaggeredEntrance,
  ZoomIn,
} from '@atlaskit/motion';

import { Block, Centered, RetryContainer } from '../../examples-utils';

const MotionZoomInExample = () => {
  const [isIn, setIsIn] = useState(true);

  return (
    <RetryContainer>
      <div css={containerStyles}>
        <Button onClick={() => setIsIn((prev) => !prev)}>
          {isIn ? 'Exit' : 'Enter'}
        </Button>
      </div>

      <Centered css={centeredStyles}>
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

const containerStyles = css({ textAlign: 'center' });

const centeredStyles = css({ height: '82px' });

export default MotionZoomInExample;
