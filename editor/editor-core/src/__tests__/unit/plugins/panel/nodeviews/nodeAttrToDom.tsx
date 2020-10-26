import { PanelType, PanelAttributes } from '@atlaskit/adf-schema';
import { panelAttrsToDom } from '../../../../../plugins/panel/utils';

const attrsPanelSuccess = {
  panelType: PanelType.SUCCESS,
};
const attrsPanelCustom = {
  panelType: PanelType.CUSTOM,
};
const attrsColor = {
  panelColor: 'red',
};
const attrsEmoji = {
  panelIcon: ':heart:',
};

const getResults = (attrs: PanelAttributes, isEnabled: boolean): Object => {
  return panelAttrsToDom(attrs, isEnabled);
};

describe('Panel - panelAttrsToDom', () => {
  describe('Custom Panels disabled', () => {
    it('should ignore color/icon and return success panel', () => {
      const result = getResults(
        { ...attrsPanelSuccess, ...attrsColor, ...attrsEmoji },
        false,
      );
      expect(result).toEqual([
        'div',
        { class: 'ak-editor-panel', 'data-panel-type': 'success', style: '' },
        ['span', { class: 'ak-editor-panel__icon' }],
        ['div', { class: 'ak-editor-panel__content' }, 0],
      ]);
    });

    it('should ignore color/icon and return custom panel', () => {
      const result = getResults(
        { ...attrsPanelCustom, ...attrsColor, ...attrsEmoji },
        false,
      );
      expect(result).toEqual([
        'div',
        { class: 'ak-editor-panel', 'data-panel-type': 'custom', style: '' },
        ['span', { class: 'ak-editor-panel__icon' }],
        ['div', { class: 'ak-editor-panel__content' }, 0],
      ]);
    });
  });

  describe('Custom Panels enabled', () => {
    it('should ignore color/icon and return success panel', () => {
      const result = getResults(
        { ...attrsPanelSuccess, ...attrsColor, ...attrsEmoji },
        true,
      );
      expect(result).toEqual([
        'div',
        { class: 'ak-editor-panel', 'data-panel-type': 'success', style: '' },
        ['span', { class: 'ak-editor-panel__icon' }],
        ['div', { class: 'ak-editor-panel__content' }, 0],
      ]);
    });

    it('should apply color/icon and return custom panel', () => {
      const result = getResults(
        { ...attrsPanelCustom, ...attrsColor, ...attrsEmoji },
        true,
      );
      expect(result).toEqual([
        'div',
        {
          class: 'ak-editor-panel',
          'data-panel-type': 'custom',
          style: 'background-color: red',
        },
        ['span', { class: 'ak-editor-panel__icon' }],
        ['div', { class: 'ak-editor-panel__content' }, 0],
      ]);
    });

    it('should apply icon and return custom panel', () => {
      const result = getResults({ ...attrsPanelCustom, ...attrsEmoji }, true);
      expect(result).toEqual([
        'div',
        {
          class: 'ak-editor-panel',
          'data-panel-type': 'custom',
          style: '',
        },
        ['span', { class: 'ak-editor-panel__icon' }],
        ['div', { class: 'ak-editor-panel__content' }, 0],
      ]);
    });

    it('should apply color and return custom panel', () => {
      const result = getResults({ ...attrsPanelCustom, ...attrsColor }, true);
      expect(result).toEqual([
        'div',
        {
          class: 'ak-editor-panel',
          'data-panel-type': 'custom',
          style: 'background-color: red',
        },
        ['div', { class: 'ak-editor-panel__content' }, 0],
      ]);
    });

    it('should apply nothing and return custom panel', () => {
      const result = getResults({ ...attrsPanelCustom }, true);
      expect(result).toEqual([
        'div',
        {
          class: 'ak-editor-panel',
          'data-panel-type': 'custom',
          style: '',
        },
        ['div', { class: 'ak-editor-panel__content' }, 0],
      ]);
    });
  });
});
