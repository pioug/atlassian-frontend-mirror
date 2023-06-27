/** @jsx jsx */
import { FC, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import { RadioGroup } from '@atlaskit/radio';
import { token } from '@atlaskit/tokens';

import Popup from '../src';

import {
  popupButton1Radio,
  popupContent,
  popupTextContent,
  popupTrigger,
} from './utils/selectors';

const radioValues = [
  { name: 'None', value: '-1', label: 'None' },
  { name: 'Button 0', value: '0', label: 'Button 0' },
  { name: 'Button 1', value: '1', label: 'Button 1', id: popupButton1Radio },
  { name: 'Button 2', value: '2', label: 'Button 2' },
];

const spacerStyles = css({
  margin: token('space.250', '20px'),
});

const sizedContentStyles = css({
  padding: token('space.400', '32px'),
  alignItems: 'center',
  textAlign: 'center',
  verticalAlign: 'center',
});

type PopupProps = {
  buttonToFocus: string;
  setInitialFocusRef: any;
};

const PopupContent: FC<PopupProps> = ({
  buttonToFocus,
  setInitialFocusRef,
}) => {
  const getRef = (index: number) => {
    if (parseInt(buttonToFocus) === index) {
      return (ref: HTMLElement) => {
        setInitialFocusRef(ref);
      };
    }
  };

  return (
    <div id={popupContent} css={sizedContentStyles}>
      <p id={popupTextContent}>Content</p>
      {Array.from({ length: 3 }, (_, index) => (
        <Button id={`button-${index}`} key={index} ref={getRef(index)}>
          Button {index}
        </Button>
      ))}
    </div>
  );
};

export default () => {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonToFocus, setButtonToFocus] = useState('-1');

  return (
    <div css={spacerStyles}>
      <p>
        <strong>Choose a button to focus initially:</strong>
      </p>
      <RadioGroup
        onChange={({ currentTarget: { value } }) => setButtonToFocus(value)}
        defaultValue={radioValues[0].value}
        options={radioValues}
      />
      <Popup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        content={({ setInitialFocusRef }) => (
          <PopupContent
            buttonToFocus={buttonToFocus}
            setInitialFocusRef={setInitialFocusRef}
          />
        )}
        trigger={(triggerProps) => (
          <Button
            id={popupTrigger}
            {...triggerProps}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Close' : 'Open'} Popup
          </Button>
        )}
        placement="bottom-start"
      />
    </div>
  );
};
