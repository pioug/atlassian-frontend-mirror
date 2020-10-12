import { ProductContainerPickerProps } from '../types';
import { ContainerPicker } from './ContainerPicker';
import React, { FunctionComponent } from 'react';

export const SpacePicker: FunctionComponent<ProductContainerPickerProps> = (
  props: ProductContainerPickerProps,
) => {
  return <ContainerPicker {...props} product={'confluence'} />;
};
