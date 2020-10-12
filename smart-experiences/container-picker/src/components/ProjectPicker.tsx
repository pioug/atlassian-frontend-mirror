import { ProductContainerPickerProps } from '../types';
import { ContainerPicker } from './ContainerPicker';
import React, { FunctionComponent } from 'react';

export const ProjectPicker: FunctionComponent<ProductContainerPickerProps> = (
  props: ProductContainerPickerProps,
) => {
  return <ContainerPicker {...props} product={'jira'} />;
};
