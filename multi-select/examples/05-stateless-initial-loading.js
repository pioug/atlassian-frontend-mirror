import React from 'react';
import { MultiSelectStateless } from '../src';

const array = [];
export default () => (
  <MultiSelectStateless
    items={array}
    label="Always loading..."
    isLoading
    loadingMessage="Custom loading message"
    isOpen
    shouldFitContainer
  />
);
