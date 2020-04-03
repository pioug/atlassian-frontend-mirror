import React from 'react';
import CardClient from '../client';
import { SmartCardProvider, ProviderProps } from '../state';

const Hook = (props: { callback: Function }) => {
  props.callback();
  return null;
};

export const renderHook = (callback: Function) => {
  return <Hook callback={callback} />;
};
export const renderSmartLinkHook = (
  callback: Function,
  providerProps?: Partial<ProviderProps>,
) => {
  return (
    <SmartCardProvider client={new CardClient()} {...providerProps}>
      <Hook callback={callback} />;
    </SmartCardProvider>
  );
};
