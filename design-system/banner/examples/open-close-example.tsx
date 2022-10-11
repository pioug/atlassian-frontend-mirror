/** @jsx jsx */
import { Fragment, useState } from 'react';

import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import WarningIcon from '@atlaskit/icon/glyph/warning';

import Banner from '../src';

const Icon = <WarningIcon label="" secondaryColor="inherit" />;

export default () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Fragment>
      <Button appearance="primary" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Hide' : 'Show'} banner
      </Button>
      {isOpen && (
        <Banner icon={Icon} appearance="warning">
          This is a warning banner
        </Banner>
      )}
    </Fragment>
  );
};
