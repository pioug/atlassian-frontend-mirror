/** @jsx jsx */
import { Fragment, useState } from 'react';

import { css, jsx } from '@emotion/react';

import { ButtonGroup } from '@atlaskit/button';
import Button from '@atlaskit/button/standard-button';
import { RadioGroup } from '@atlaskit/radio';
import { token } from '@atlaskit/tokens';

import Popup from '../../src';

const radioValues = [
  { name: 'None', value: '0', label: 'None' },
  { name: 'Button 1', value: '1', label: 'Button 1' },
  { name: 'Button 2', value: '2', label: 'Button 2' },
  { name: 'Button 3', value: '3', label: 'Button 3' },
];

const contentStyles = css({
  padding: token('space.200', '16px'),
});

const PopupFocusExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonToFocus, setButtonToFocus] = useState('0');

  return (
    <Fragment>
      <p>
        <strong>Select a button to focus</strong>
      </p>
      <RadioGroup
        onChange={({ currentTarget: { value } }) => setButtonToFocus(value)}
        defaultValue={radioValues[0].value}
        options={radioValues}
      />
      <Popup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        content={({ setInitialFocusRef }) => {
          return (
            <div css={contentStyles}>
              <ButtonGroup>
                {radioValues.map(
                  ({ value, label }) =>
                    value !== '0' && (
                      <Button
                        key={value}
                        ref={
                          value === buttonToFocus
                            ? setInitialFocusRef
                            : undefined
                        }
                      >
                        {label}
                      </Button>
                    ),
                )}
              </ButtonGroup>
            </div>
          );
        }}
        trigger={(triggerProps) => (
          <Button
            {...triggerProps}
            appearance="primary"
            isSelected={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Close' : 'Open'} popup
          </Button>
        )}
        placement="bottom-start"
      />
    </Fragment>
  );
};

export default PopupFocusExample;
