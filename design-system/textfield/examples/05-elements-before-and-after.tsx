import React, { Fragment } from 'react';

import Avatar from '@atlaskit/avatar';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { token } from '@atlaskit/tokens';

import Textfield from '../src';

export default function ElementsBeforeAfterExample() {
  return (
    <Fragment>
      <label htmlFor="after-input">After input</label>
      <Textfield
        testId="after-input"
        id="after-input"
        elemAfterInput={
          <div
            style={{
              paddingRight: token('space.075', '6px'),
              lineHeight: '100%',
            }}
          >
            <ErrorIcon label="error" />
          </div>
        }
      />
      <label htmlFor="before-input">Before input</label>
      <Textfield
        testId="before-input"
        id="before-input"
        elemBeforeInput={
          <div
            style={{
              paddingLeft: token('space.075', '6px'),
              lineHeight: '100%',
            }}
          >
            <Avatar size="small" borderColor="transparent" />
          </div>
        }
      />
    </Fragment>
  );
}
