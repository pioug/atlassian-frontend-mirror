/** @jsx jsx */
import { FC, useCallback, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { Box, xcss } from '@atlaskit/primitives';

import Popup from '../src';

const contentStyles = xcss({
  margin: 'space.200',
});

type PopupExampleProps = {
  name: string;
};

const PopupExample: FC<PopupExampleProps> = ({ name }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClick = useCallback(() => {
    console.log('onClick', name);
    setIsOpen(!isOpen);
  }, [isOpen, name, setIsOpen]);

  const onClose = useCallback(() => {
    console.log('onClose', name);
    setIsOpen(false);
  }, [name, setIsOpen]);

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      content={() => <Box xcss={contentStyles}>content</Box>}
      trigger={(triggerProps) => (
        <Button {...triggerProps} onClick={onClick}>
          {isOpen ? 'Close' : 'Open'} {name} popup
        </Button>
      )}
      placement="bottom-start"
    />
  );
};

const containerStyles = css({
  display: 'flex',
});

export default () => (
  <div css={containerStyles}>
    <PopupExample name="foo" />
    <PopupExample name="bar" />
    <PopupExample name="baz" />
  </div>
);
