import React from 'react';
import { shallow } from 'enzyme';
import Panel from '../../../../react/nodes/panel';
import { PanelType } from '@atlaskit/adf-schema';

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
});
