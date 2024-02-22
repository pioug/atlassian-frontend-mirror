import React, { useState } from 'react';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker from '../src';

const Example = () => {
  const [isMulti, setIsMulti] = useState(false);
  const [openMenuOnClick, setOpenMenuOnClick] = useState(false);
  return (
    <>
      <div>
        <input
          checked={isMulti}
          id="is-multi"
          onChange={() => {
            setIsMulti(!isMulti);
          }}
          type="checkbox"
        />
        <label htmlFor="is-multi">IsMulti</label>
      </div>
      <div>
        <input
          checked={openMenuOnClick}
          id="open-menu-on-click"
          onChange={() => {
            setOpenMenuOnClick(!openMenuOnClick);
          }}
          type="checkbox"
        />
        <label htmlFor="open-menu-on-click">
          openMenuOnClick
          <span style={{ color: 'red' }}>
            {isMulti ? ' (this prop will be ignored on multi)' : ''}
          </span>
        </label>
      </div>
      <br></br>
      <ExampleWrapper>
        {({ options, onInputChange, onSelection }) => (
          <UserPicker
            fieldId="example"
            options={options}
            onChange={console.log}
            onInputChange={onInputChange}
            onSelection={onSelection}
            isMulti={isMulti}
            openMenuOnClick={openMenuOnClick}
          />
        )}
      </ExampleWrapper>
    </>
  );
};
export default Example;
