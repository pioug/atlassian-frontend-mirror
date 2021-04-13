import { mount } from 'enzyme';
import React from 'react';
import { App } from '../../index';
import MobileEditor from '../../mobile-editor-element';
import * as BridgeInitialiser from '../../native-to-web/bridge-initialiser';
import { useEditorConfiguration } from '../../hooks/use-editor-configuration';
import WebBridgeImpl from '../../native-to-web';

jest.mock('../../../utils/fetch-proxy', () => ({
  useFetchProxy: () => {},
}));

jest.mock('../../hooks/use-editor-configuration', () => ({
  useEditorConfiguration: jest.fn().mockReturnValue({
    getLocale: () => 'fr',
  }),
}));

describe('Mobile Editor', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should pass editor configuration locale to Mobile Editor', () => {
    const bridge = ({
      getContent: () => {},
      setContent: () => {},
    } as unknown) as WebBridgeImpl;
    const getBridge = jest.spyOn(BridgeInitialiser, 'getBridge');
    getBridge.mockReturnValue(bridge);

    const result = mount(<App defaultValue={'defaultValue'} />);

    expect(result.find(MobileEditor).prop('locale')).toBe('fr');
  });

  it('should call getBridge method when the app is mounted', () => {
    const getBridge = jest.spyOn(BridgeInitialiser, 'getBridge');

    mount(<App defaultValue={'defaultValue'} />);

    expect(getBridge).toHaveBeenCalledTimes(1);
  });

  it('should have called useEditorConfiguration on load', () => {
    const bridge = ({
      getContent: () => {},
      setContent: () => {},
    } as unknown) as WebBridgeImpl;
    const getBridge = jest.spyOn(BridgeInitialiser, 'getBridge');
    getBridge.mockReturnValue(bridge);

    mount(<App defaultValue={'defaultValue'} />);

    expect(useEditorConfiguration).toHaveBeenCalledWith(bridge);
  });

  it('should have a wrapper with min-height of "46px" for iOS', () => {
    window.webkit = {} as any;

    const wrapper = mount(<App defaultValue={'defaultValue'} />);
    const style = wrapper.childAt(0).props().style;

    expect(style).toEqual({ minHeight: '46px' });
  });

  it('should not have a wrapper with min-height of "46px" for Android', () => {
    window.webkit = undefined;

    const wrapper = mount(<App defaultValue={'defaultValue'} />);
    const style = wrapper.childAt(0).props().style;

    expect(style).not.toEqual({ minHeight: '46px' });
  });
});
