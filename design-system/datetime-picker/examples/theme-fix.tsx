import React from 'react';

import { ThemeContext } from '@emotion/core';

import Button from '@atlaskit/button/custom-theme-button';
//TODO: This import is bad but because of all the export *'s I can't fix it
import Theme from '@atlaskit/theme';

import { DatePicker } from '../src';

export default () => {
  return (
    <>
      <Theme.Provider value={() => ({ mode: 'dark' })}>
        <DatePicker
          defaultValue="2020-02-02"
          testId="date-picker-real-dark-mode"
        />
        <Button>Real dark mode</Button>
      </Theme.Provider>
      <ThemeContext.Provider value={{ mode: {} }}>
        <DatePicker defaultValue="2020-02-02" testId="date-picker-theme-jank" />
        <Button>Fake dark mode</Button>
      </ThemeContext.Provider>

      <p>
        This example was used to fix a bug where a bad theme provider was
        affecting drop shadow on the calendar.{' '}
        <strong>Unfortunately Calendar does not support Dark Mode.</strong>
      </p>
    </>
  );
};
