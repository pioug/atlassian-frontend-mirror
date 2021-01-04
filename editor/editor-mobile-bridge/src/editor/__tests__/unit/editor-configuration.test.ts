import MobileEditorConfiguration from '../../editor-configuration';
import * as QueryParamsReader from '../../../query-param-reader';

describe('Editor Configuration', () => {
  it('should have default values for its properties', () => {
    const editorConfig = new MobileEditorConfiguration();

    expect(editorConfig.getMode()).toEqual('light');
    expect(editorConfig.getLocale()).toEqual('en');
    expect(editorConfig.isQuickInsertEnabled()).toEqual(false);
    expect(editorConfig.isSelectionObserverEnabled()).toEqual(false);
    expect(editorConfig.isCollabProviderEnabled()).toEqual(false);
    expect(editorConfig.isPredictableListEnabled()).toEqual(false);
  });

  it('should set the mode value and retain the rest with default values', () => {
    const editorConfig = new MobileEditorConfiguration('{ "mode": "dark" }');

    expect(editorConfig.getMode()).toEqual('dark');
    expect(editorConfig.getLocale()).toEqual('en');
    expect(editorConfig.isQuickInsertEnabled()).toEqual(false);
    expect(editorConfig.isSelectionObserverEnabled()).toEqual(false);
    expect(editorConfig.isCollabProviderEnabled()).toEqual(false);
    expect(editorConfig.isPredictableListEnabled()).toEqual(false);
  });

  it('should set the locale value and retain the rest with default values', () => {
    const editorConfig = new MobileEditorConfiguration('{ "locale": "es" }');

    expect(editorConfig.getMode()).toEqual('light');
    expect(editorConfig.getLocale()).toEqual('es');
    expect(editorConfig.isQuickInsertEnabled()).toEqual(false);
    expect(editorConfig.isSelectionObserverEnabled()).toEqual(false);
    expect(editorConfig.isCollabProviderEnabled()).toEqual(false);
    expect(editorConfig.isPredictableListEnabled()).toEqual(false);
  });

  it('should set the isQuickInsertEnabled value and retain the rest with default values', () => {
    const editorConfig = new MobileEditorConfiguration(
      '{ "enableQuickInsert": true}',
    );

    expect(editorConfig.getMode()).toEqual('light');
    expect(editorConfig.getLocale()).toEqual('en');
    expect(editorConfig.isQuickInsertEnabled()).toEqual(true);
    expect(editorConfig.isSelectionObserverEnabled()).toEqual(false);
    expect(editorConfig.isCollabProviderEnabled()).toEqual(false);
    expect(editorConfig.isPredictableListEnabled()).toEqual(false);
  });

  it('should set the isSelectionObserverEnabled value and retain the rest with default values', () => {
    const editorConfig = new MobileEditorConfiguration(
      '{"selectionObserverEnabled": true}',
    );

    expect(editorConfig.getMode()).toEqual('light');
    expect(editorConfig.getLocale()).toEqual('en');
    expect(editorConfig.isQuickInsertEnabled()).toEqual(false);
    expect(editorConfig.isSelectionObserverEnabled()).toEqual(true);
    expect(editorConfig.isCollabProviderEnabled()).toEqual(false);
    expect(editorConfig.isPredictableListEnabled()).toEqual(false);
  });

  it('should set the allowCollabProvider value and retain the rest with default values', () => {
    const editorConfig = new MobileEditorConfiguration(
      '{"allowCollabProvider": true}',
    );

    expect(editorConfig.getMode()).toEqual('light');
    expect(editorConfig.getLocale()).toEqual('en');
    expect(editorConfig.isQuickInsertEnabled()).toEqual(false);
    expect(editorConfig.isSelectionObserverEnabled()).toEqual(false);
    expect(editorConfig.isCollabProviderEnabled()).toEqual(true);
    expect(editorConfig.isPredictableListEnabled()).toEqual(false);
  });

  it('should set the allowPredictableList value and retain the rest with default values', () => {
    const editorConfig = new MobileEditorConfiguration(
      '{"allowPredictableList": true}',
    );

    expect(editorConfig.getMode()).toEqual('light');
    expect(editorConfig.getLocale()).toEqual('en');
    expect(editorConfig.isQuickInsertEnabled()).toEqual(false);
    expect(editorConfig.isSelectionObserverEnabled()).toEqual(false);
    expect(editorConfig.isCollabProviderEnabled()).toEqual(false);
    expect(editorConfig.isPredictableListEnabled()).toEqual(true);
  });

  it('should clone and update the current configuartion with the new configuration', () => {
    const newConfig = '{"locale":"zh", "mode": "light"}';
    const originalEditorConfig = new MobileEditorConfiguration(
      '{"mode": "dark", "enableQuickInsert": true}',
    );
    const newEditorConfig = originalEditorConfig.cloneAndUpdateConfig(
      newConfig,
    );

    expect(newEditorConfig.getMode()).toEqual('light');
    expect(newEditorConfig.getLocale()).toEqual('zh');
    expect(newEditorConfig.isQuickInsertEnabled()).toEqual(true);
    expect(newEditorConfig.isSelectionObserverEnabled()).toEqual(false);
    expect(newEditorConfig.isCollabProviderEnabled()).toEqual(false);
    expect(newEditorConfig.isPredictableListEnabled()).toEqual(false);
  });

  it('should clone and update the default configuration with the new configuration', () => {
    const newConfig =
      '{"locale":"zh", "mode": "dark", "enableQuickInsert": true}';
    const originalEditorConfig = new MobileEditorConfiguration();
    const newEditorConfig = originalEditorConfig.cloneAndUpdateConfig(
      newConfig,
    );

    expect(newEditorConfig.getMode()).toEqual('dark');
    expect(newEditorConfig.getLocale()).toEqual('zh');
    expect(newEditorConfig.isQuickInsertEnabled()).toEqual(true);
    expect(newEditorConfig.isSelectionObserverEnabled()).toEqual(false);
    expect(newEditorConfig.isCollabProviderEnabled()).toEqual(false);
    expect(newEditorConfig.isPredictableListEnabled()).toEqual(false);
  });

  it('should not allow scroll gutter for compact editor', () => {
    jest
      .spyOn(QueryParamsReader, 'getEditorType')
      .mockReturnValueOnce('compact');

    const originalEditorConfig = new MobileEditorConfiguration();

    expect(originalEditorConfig.isAllowScrollGutter()).toBe(false);
  });

  it('should allow scroll gutter for full editor', () => {
    jest.spyOn(QueryParamsReader, 'getEditorType').mockReturnValueOnce('full');

    const originalEditorConfig = new MobileEditorConfiguration();

    expect(originalEditorConfig.isAllowScrollGutter()).toBe(true);
  });
});
