import React from 'react';
import { shallow } from 'enzyme';
import Panel from '../../../../react/nodes/panel';
import { PanelType } from '@atlaskit/adf-schema';
import { ProviderFactory } from '@atlaskit/editor-common';
import EmojiItem from '../../../../react/nodes/emoji';

describe('Renderer - React/Nodes/Panel', () => {
  describe('info', () => {
    const infoPanel = shallow(
      <Panel panelType={PanelType.INFO}>This is a info panel</Panel>,
    );

    it('should wrap content with <div>-tag', () => {
      expect(infoPanel.name()).toEqual('styled.div');
    });

    it('should have two children', () => {
      expect(infoPanel.children()).toHaveLength(2);
    });
  });

  describe('note', () => {
    const notePanel = shallow(
      <Panel panelType={PanelType.NOTE}>This is a note panel</Panel>,
    );

    it('should wrap content with <div>-tag', () => {
      expect(notePanel.name()).toEqual('styled.div');
    });

    it('should have two children', () => {
      expect(notePanel.children()).toHaveLength(2);
    });
  });

  describe('tip', () => {
    const tipPanel = shallow(
      <Panel panelType={PanelType.TIP}>This is a tip panel</Panel>,
    );

    it('should wrap content with <div>-tag', () => {
      expect(tipPanel.name()).toEqual('styled.div');
    });

    it('should have two children', () => {
      expect(tipPanel.children()).toHaveLength(2);
    });
  });

  describe('warning', () => {
    const warningPanel = shallow(
      <Panel panelType={PanelType.WARNING}>This is a warning panel</Panel>,
    );

    it('should wrap content with <div>-tag', () => {
      expect(warningPanel.name()).toEqual('styled.div');
    });

    it('should have two children', () => {
      expect(warningPanel.children()).toHaveLength(2);
    });
  });

  describe('custom panel', () => {
    const providerFactory = ProviderFactory.create({});

    it('should wrap content with <div>-tag and have given emoji and background', () => {
      const customPanel = shallow(
        <Panel
          panelType={PanelType.CUSTOM}
          panelColor={'#b5f71ca14'}
          panelIcon={':smiley:'}
          allowCustomPanels={true}
          providers={providerFactory}
        >
          This is a custom panel with custom emoji and background
        </Panel>,
      );
      expect(customPanel.name()).toEqual('styled.div');
      expect(customPanel.props().backgroundColor).toEqual('#b5f71ca14');
      expect(customPanel.find(EmojiItem).props().shortName).toEqual(':smiley:');
    });

    it('custom panel should return div with data-panel-type attribute', () => {
      const customPanel = shallow(
        <Panel
          panelType={PanelType.CUSTOM}
          panelColor={'#34eb6e'}
          panelIcon={':smiley:'}
          allowCustomPanels={true}
          providers={providerFactory}
        >
          This is a custom panel with custom emoji and background
        </Panel>,
      );

      expect(customPanel.props()['data-panel-type']).toEqual('custom');
    });

    it('custom panel should return div with data-panel-color attribute', () => {
      const customPanel = shallow(
        <Panel
          panelType={PanelType.CUSTOM}
          panelColor={'#34eb6e'}
          panelIcon={':smiley:'}
          allowCustomPanels={true}
          providers={providerFactory}
        >
          This is a custom panel with custom emoji and background
        </Panel>,
      );

      expect(customPanel.props()['data-panel-color']).toEqual('#34eb6e');
    });

    it('custom panel should return div with data-panel-icon attribute', () => {
      const customPanel = shallow(
        <Panel
          panelType={PanelType.CUSTOM}
          panelColor={'#34eb6e'}
          panelIcon={':smiley:'}
          allowCustomPanels={true}
          providers={providerFactory}
        >
          This is a custom panel with custom emoji and background
        </Panel>,
      );

      expect(customPanel.props()['data-panel-icon']).toEqual(':smiley:');
    });
  });
});
