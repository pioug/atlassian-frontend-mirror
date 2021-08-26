import React, { useState } from 'react';
import Button from '@atlaskit/button';
import ModalDialog, { ModalBody } from '@atlaskit/modal-dialog';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker from '../src';

const closeMenuOnScroll: EventListener = () => {
  return true;
};

const createBoolean = (
  state: boolean,
  label: string,
  onChange: (state: boolean) => void,
) => {
  return (
    <div>
      <input
        checked={state}
        onChange={() => onChange(!state)}
        type="checkbox"
      />
      <label>{label}</label>
    </div>
  );
};

const Example = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [isMenuPositionFixed, setIsMenuPositionFixed] = useState(true);
  const [isCloseMenuOnScroll, setIsCloseMenuOnScroll] = useState(true);
  return (
    <>
      <Button onClick={() => setIsOpened(!isOpened)}>Show Modal</Button>
      {isOpened && (
        <ModalDialog width="x-large" height="40vh">
          <h2 style={{ padding: '2vh' }}>User picker in Modal</h2>
          <ModalBody>
            <ExampleWrapper>
              {({ options, onInputChange }) => (
                <>
                  {createBoolean(
                    isMenuPositionFixed,
                    "menuPosition = 'fixed'",
                    setIsMenuPositionFixed,
                  )}
                  {createBoolean(
                    isCloseMenuOnScroll,
                    'closeMenuOnScroll',
                    setIsCloseMenuOnScroll,
                  )}
                  <UserPicker
                    fieldId="example"
                    options={options}
                    onChange={console.log}
                    onInputChange={onInputChange}
                    noOptionsMessage={() => null}
                    isMulti
                    menuPosition={isMenuPositionFixed ? 'fixed' : 'absolute'}
                    closeMenuOnScroll={
                      isCloseMenuOnScroll ? closeMenuOnScroll : false
                    }
                  />
                  <div style={{ height: '100vh' }} />
                </>
              )}
            </ExampleWrapper>
          </ModalBody>
        </ModalDialog>
      )}
    </>
  );
};
export default Example;
