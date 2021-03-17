import React, { Fragment } from 'react';

import Avatar from '@atlaskit/avatar';
import ErrorIcon from '@atlaskit/icon/glyph/error';

import Textfield from '../src';

export default function ElementsBeforeAfterExample() {
  return (
    <Fragment>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label htmlFor="after-input">After input</label>
      <Textfield
        testId="after-input"
        id="after-input"
        elemAfterInput={
          <div style={{ paddingRight: '6px', lineHeight: '100%' }}>
            <ErrorIcon label="error" />
          </div>
        }
      />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label htmlFor="before-input">Before input</label>
      <Textfield
        testId="before-input"
        id="before-input"
        elemBeforeInput={
          <div style={{ paddingLeft: '6px', lineHeight: '100%' }}>
            <Avatar size="small" borderColor="transparent" />
          </div>
        }
      />
    </Fragment>
  );
}
