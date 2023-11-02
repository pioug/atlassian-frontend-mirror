import React from 'react';

import { Label } from '@atlaskit/form';

import TextArea from '../../src';

export default function TextAreaAppearanceSubtle() {
  return (
    <>
      <Label htmlFor="appearance-subtle">Subtle appearance</Label>
      <TextArea
        appearance="subtle"
        id="appearance-subtle"
        name="appearance-subtle"
        placeholder="Enter your details here"
      />
    </>
  );
}
