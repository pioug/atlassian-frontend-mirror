/** @jsx jsx */
import { Fragment, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import { Checkbox } from '@atlaskit/checkbox';
import TextArea from '@atlaskit/textarea';

import Drawer from '../../src';

const CheckboxStyles = css({
  marginTop: 15,
});

const DrawerUnmountExample = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [shouldUnmount, setShouldUnmount] = useState<boolean>(false);

  return (
    <Fragment>
      <Drawer
        shouldUnmountOnExit={shouldUnmount}
        onClose={() => setOpen(false)}
        isOpen={open}
        width="medium"
      >
        <p>Type something below to see if the state is retained</p>
        <TextArea />
      </Drawer>
      <Button appearance="primary" onClick={() => setOpen(true)}>
        Open drawer
      </Button>
      <div css={CheckboxStyles}>
        <Checkbox
          label={
            <Fragment>
              Should unmount on exit. The drawer{' '}
              <strong>{shouldUnmount ? 'loses' : 'retains'}</strong> its state
              on close
            </Fragment>
          }
          onChange={(e) => setShouldUnmount(e.currentTarget.checked)}
        />
      </div>
    </Fragment>
  );
};

export default DrawerUnmountExample;
