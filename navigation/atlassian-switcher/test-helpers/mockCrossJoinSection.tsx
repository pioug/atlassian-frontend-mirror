import React from 'react';

export default () => {
  jest.mock('../src/cross-join/components/cross-join-section', () => {
    let __mockShouldThrowError__ = false;
    const actualModule = jest.requireActual(
      '../src/cross-join/components/cross-join-section',
    );
    const CrossJoinSectionOriginal = actualModule.CrossJoinSection;
    const CrossJoinSection = (props: any) => {
      if (__mockShouldThrowError__) {
        throw new Error('CrossJoin section fail');
      }
      return <CrossJoinSectionOriginal {...props} />;
    };
    actualModule.CrossJoinSection = CrossJoinSection;
    actualModule.__setCrossJoinShouldThrowException = (val: boolean) => {
      __mockShouldThrowError__ = val;
    };
    return actualModule;
  });
};
