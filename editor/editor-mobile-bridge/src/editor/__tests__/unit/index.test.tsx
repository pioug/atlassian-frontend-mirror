import { mount } from 'enzyme';
import React from 'react';
import { App } from '../../index';
import * as BridgeInitialiser from '../../native-to-web/bridge-initialiser';

describe('Mobile Editor', () => {
  it('should call getBridge method when the app is mounted', () => {
    const getBridge = jest.spyOn(BridgeInitialiser, 'getBridge');
    mount(<App defaultValue={'defaultValue'} />);
    expect(getBridge).toHaveBeenCalledTimes(1);
  });
});
