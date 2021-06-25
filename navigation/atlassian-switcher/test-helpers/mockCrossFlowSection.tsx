import React from 'react';

export default () => {
  jest.mock('../src/cross-flow/components/cross-flow-section', () => {
    let __mockShouldThrowError__ = false;
    const actualModule = jest.requireActual(
      '../src/cross-flow/components/cross-flow-section',
    );
    const CrossFlowSectionOriginal = actualModule.CrossFlowSection;
    const CrossFlowSection = (props: any) => {
      if (__mockShouldThrowError__) {
        throw new Error('Crossflow section fail');
      }
      return <CrossFlowSectionOriginal {...props} />;
    };
    actualModule.CrossFlowSection = CrossFlowSection;
    actualModule.__setCrossFlowShouldThrowException = (val: boolean) => {
      __mockShouldThrowError__ = val;
    };
    return actualModule;
  });
};
