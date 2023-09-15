import React from 'react';

import { Label } from '@atlaskit/form';

import TextArea from '../../src';

export default function TextAreaAppearanceNone() {
  return (
    <>
      <Label htmlFor="appearance-none">None Appearance</Label>
      <TextArea
        appearance="none"
        id="appearance-none"
        name="appearance-none"
        placeholder="Enter your details here"
      />
    </>
  );
}
