/** @jsx jsx */
import { jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import AddIcon from '@atlaskit/icon/glyph/add';

import Tooltip from '../src';

function Example() {
  return (
    <Tooltip content="Outer tooltip">
      <Button
        iconAfter={
          <Tooltip content="Inner tooltip" position="right">
            <AddIcon label="inner" size="small" />
          </Tooltip>
        }
      >
        Hover Over Me Or My Icon
      </Button>
    </Tooltip>
  );
}

export default () => <Example />;
