import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import { Label } from '@atlaskit/form';
import Popup from '@atlaskit/popup';

import { DatePicker } from '../src';

export default () => {
  const [isOpen, setIsOpen] = useState(false);

  const PopupContent = () => {
    const [date, setDate] = useState('');
    return (
      <div id="popup-content" style={{ width: '500px', height: '500px' }}>
        <Label htmlFor="text3"> first field</Label>
        <input id="text3" type="text" />
        <DatePicker
          autoFocus={false}
          id="value1"
          onChange={(date: string) => {
            setDate(date);
          }}
          value={date}
          spacing="compact"
          testId="jql-builder-basic-datetime.ui.between-dates.value-1"
        />
        <Label htmlFor="text4"> first field</Label>
        <input id="text4" type="text" />
      </div>
    );
  };

  return (
    <div>
      <Label htmlFor="text1"> first field</Label>
      <input id="text1" type="text" />
      <br />
      <Label htmlFor="react-select-custom--input">Custom date format</Label>
      <DatePicker
        id="custom"
        dateFormat="DD/MMM/YY"
        selectProps={{
          placeholder: 'e.g. 31/Dec/18',
        }}
        onChange={console.log}
        testId="datepicker-1"
      />
      <Label htmlFor="text2"> third field</Label>
      <input id="text2" type="text" />

      <div>
        <Popup
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          content={() => <PopupContent />}
          trigger={({ ...triggerProps }) => (
            <Button
              id="popup-trigger"
              {...triggerProps}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? 'Close' : 'Open'} Popup
            </Button>
          )}
          placement="bottom-start"
        />
      </div>
    </div>
  );
};
