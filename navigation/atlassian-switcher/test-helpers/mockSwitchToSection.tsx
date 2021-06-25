import React from 'react';

export default () => {
  jest.mock(
    '../src/ui/components/switcher-components/switch-to-section',
    () => {
      let __mockShouldThrowError__ = false;
      const actualModule = jest.requireActual(
        '../src/ui/components/switcher-components/switch-to-section',
      );
      const SwitchToSectionOriginal = actualModule.SwitchToSection;
      const SwitchToSection = (props: any) => {
        if (__mockShouldThrowError__) {
          throw new Error('Switch to section fail');
        }
        return <SwitchToSectionOriginal {...props} />;
      };
      actualModule.SwitchToSection = SwitchToSection;
      actualModule.__setSwitchToShouldThrowException = (val: boolean) => {
        __mockShouldThrowError__ = val;
      };
      return actualModule;
    },
  );
};
