import { mount } from 'enzyme';
import React from 'react';
import { App } from '../../index';
import MobileEditor from '../../mobile-editor-element';
import * as BridgeInitialiser from '../../native-to-web/bridge-initialiser';
import * as UseEditorConfigurationApi from '../../hooks/use-editor-configuration';
import EditorConfiguration, {
  EditorAppearance,
} from '../../editor-configuration';

import { useProviders } from '../../hooks/use-providers';
import WebBridgeImpl from '../../native-to-web';
import { waitFor } from '@testing-library/react';

const defaultValue = JSON.stringify({
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'default editor',
        },
      ],
    },
  ],
});

jest.mock('../../../utils/fetch-proxy', () => ({
  useFetchProxy: () => {},
}));

jest.mock('../../hooks/use-providers', () => ({
  useProviders: jest.fn().mockReturnValue({
    providers: {},
    resetProviders: jest.fn(),
  }),
}));

describe('Mobile Editor', () => {
  describe('on load', () => {
    let bridge: WebBridgeImpl;
    let getBridge: jest.SpyInstance;
    let setResetProviders: jest.SpyInstance;
    let useEditorConfiguration: jest.SpyInstance;

    beforeEach(() => {
      bridge = new WebBridgeImpl();

      getBridge = jest.spyOn(BridgeInitialiser, 'getBridge');
      getBridge.mockReturnValue(bridge);

      setResetProviders = jest.spyOn(bridge, 'setResetProviders');

      const config = new EditorConfiguration('{"locale": "fr"}');
      useEditorConfiguration = jest.spyOn(
        UseEditorConfigurationApi,
        'useEditorConfiguration',
      );
      useEditorConfiguration.mockReturnValue(config);
    });

    afterEach(() => {
      getBridge.mockRestore();
      setResetProviders.mockRestore();
      useEditorConfiguration.mockRestore();
    });

    it('should pass editor configuration locale to Mobile Editor', () => {
      const result = mount(<App defaultValue={defaultValue} />);
      expect(result.find(MobileEditor).prop('locale')).toBe('fr');
      result.unmount();
    });

    it('should call getBridge method when the app is mounted', () => {
      const wrapper = mount(<App defaultValue={defaultValue} />);
      expect(getBridge).toHaveBeenCalledTimes(1);
      wrapper.unmount();
    });

    it('should have called useEditorConfiguration on load', () => {
      const wrapper = mount(<App defaultValue={defaultValue} />);
      expect(useEditorConfiguration).toHaveBeenCalledWith(bridge);
      wrapper.unmount();
    });

    it('should have called useProviders on load', () => {
      const wrapper = mount(<App defaultValue={defaultValue} />);
      expect(setResetProviders).toHaveBeenCalled();
      wrapper.unmount();
    });

    it('should have called bridge.setResetProviders on load', () => {
      const wrapper = mount(<App defaultValue={defaultValue} />);
      expect(useProviders).toHaveBeenCalled();
      wrapper.unmount();
    });
  });

  describe('min-height', () => {
    it('should have a wrapper with min-height of "46px" for iOS', () => {
      window.webkit = {} as any;

      const wrapper = mount(<App defaultValue={defaultValue} />);
      const style = wrapper.childAt(0).props().style;

      expect(style).toEqual({ minHeight: '46px' });
      wrapper.unmount();
    });

    it('should not have a wrapper with min-height of "46px" for Android', () => {
      window.webkit = undefined;

      const wrapper = mount(<App defaultValue={defaultValue} />);
      const style = wrapper.childAt(0).props().style;

      expect(style).not.toEqual({ minHeight: '46px' });
      wrapper.unmount();
    });
  });

  describe('Schema update on appearance mode change', () => {
    let bridge: WebBridgeImpl;
    let getBridge: jest.SpyInstance;

    beforeAll(() => {
      bridge = new WebBridgeImpl();
      getBridge = jest.spyOn(BridgeInitialiser, 'getBridge');
      getBridge.mockReturnValue(bridge);
    });

    afterAll(() => {
      getBridge.mockRestore();
    });

    it('schema constructed by default(full editor) should include taskList', async () => {
      const wrapper = mount(<App defaultValue={defaultValue} />);
      await waitFor(() =>
        expect(!!bridge?.editorView?.state.schema.nodes.taskList).toBeTruthy(),
      );
      wrapper.unmount();
    });

    it('schema re-constructed by compact editor should not include taskList', (done) => {
      const config = JSON.stringify(
        new EditorConfiguration(
          `{"editorAppearance": "${EditorAppearance.COMPACT}"}`,
        ),
      );
      bridge.configure(config);
      setImmediate(() => {
        expect(bridge?.editorView?.state.schema.nodes.taskList).toBeUndefined();
        done();
      });
    });
  });
});
