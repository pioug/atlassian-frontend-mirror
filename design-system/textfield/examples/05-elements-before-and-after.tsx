import React, { Fragment } from 'react';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import Avatar from '@atlaskit/avatar';
import Textfield from '../src';

export default function() {
  return (
    <Fragment>
      <label htmlFor="after-input">After input</label>
      <Textfield
        id="after-input"
        elemAfterInput={
          <div style={{ paddingRight: '6px', lineHeight: '100%' }}>
            <ErrorIcon label="error" />
          </div>
        }
      />
      <label htmlFor="before-input">Before input</label>
      <Textfield
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
