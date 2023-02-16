/** @jsx jsx */
import { FC, useState } from 'react';

import { css, jsx } from '@emotion/react';

import { ButtonGroup } from '@atlaskit/button';
import Button from '@atlaskit/button/standard-button';
import { token } from '@atlaskit/tokens';

import Popup from '../../src';

const contentStyles = css({
  padding: token('space.200', '16px'),
});

type PopupExampleProps = {
  index: number;
};

const PopupExample: FC<PopupExampleProps> = ({ index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popup
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      content={() => <div css={contentStyles}>Content</div>}
      trigger={(triggerProps) => (
        <Button
          {...triggerProps}
          isSelected={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'Close' : 'Open'} popup {index + 1}
        </Button>
      )}
      placement="bottom-start"
    />
  );
};

const PopupMultipleExample = () => (
  <ButtonGroup>
    {Array.from(Array(3)).map((_, index) => (
      <PopupExample index={index} />
    ))}
  </ButtonGroup>
);

export default PopupMultipleExample;
