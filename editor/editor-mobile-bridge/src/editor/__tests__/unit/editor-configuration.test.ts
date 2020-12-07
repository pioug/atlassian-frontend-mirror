import MobileEditorConfiguration from '../../editor-configuration';

describe('Editor Configuration', () => {
  it('should have default values for its properties', () => {
    const editorConfig = new MobileEditorConfiguration();

    expect(editorConfig.mode()).toEqual('light');
    expect(editorConfig.locale()).toEqual('en');
    expect(editorConfig.isQuickInsertEnabled()).toEqual(false);
    expect(editorConfig.isSelectionObserverEnabled()).toEqual(false);
    expect(editorConfig.allowCollabProvider()).toEqual(false);
  });

  it('should set the mode value and retain the rest with default values', () => {
    const editorConfig = new MobileEditorConfiguration('{ "mode": "dark" }');

    expect(editorConfig.mode()).toEqual('dark');
    expect(editorConfig.locale()).toEqual('en');
    expect(editorConfig.isQuickInsertEnabled()).toEqual(false);
    expect(editorConfig.isSelectionObserverEnabled()).toEqual(false);
    expect(editorConfig.allowCollabProvider()).toEqual(false);
  });

  it('should set the locale value and retain the rest with default values', () => {
    const editorConfig = new MobileEditorConfiguration('{ "locale": "es" }');

    expect(editorConfig.mode()).toEqual('light');
    expect(editorConfig.locale()).toEqual('es');
    expect(editorConfig.isQuickInsertEnabled()).toEqual(false);
    expect(editorConfig.isSelectionObserverEnabled()).toEqual(false);
    expect(editorConfig.allowCollabProvider()).toEqual(false);
  });

  it('should set the isQuickInsertEnabled value and retain the rest with default values', () => {
    const editorConfig = new MobileEditorConfiguration(
      '{ "enableQuickInsert": true}',
    );

    expect(editorConfig.mode()).toEqual('light');
    expect(editorConfig.locale()).toEqual('en');
    expect(editorConfig.isQuickInsertEnabled()).toEqual(true);
    expect(editorConfig.isSelectionObserverEnabled()).toEqual(false);
    expect(editorConfig.allowCollabProvider()).toEqual(false);
  });

  it('should set the isSelectionObserverEnabled value and retain the rest with default values', () => {
    const editorConfig = new MobileEditorConfiguration(
      '{"selectionObserverEnabled": true}',
    );

    expect(editorConfig.mode()).toEqual('light');
    expect(editorConfig.locale()).toEqual('en');
    expect(editorConfig.isQuickInsertEnabled()).toEqual(false);
    expect(editorConfig.isSelectionObserverEnabled()).toEqual(true);
    expect(editorConfig.allowCollabProvider()).toEqual(false);
  });

  it('should set the allowCollabProvider value and retain the rest with default values', () => {
    const editorConfig = new MobileEditorConfiguration(
      '{"allowCollabProvider": true}',
    );

    expect(editorConfig.mode()).toEqual('light');
    expect(editorConfig.locale()).toEqual('en');
    expect(editorConfig.isQuickInsertEnabled()).toEqual(false);
    expect(editorConfig.isSelectionObserverEnabled()).toEqual(false);
    expect(editorConfig.allowCollabProvider()).toEqual(true);
  });

  it('should clone and update the current with the new Configuration', () => {
    const newConfig = '{"locale":"zh", "mode": "light"}';
    const originalEditorConfig = new MobileEditorConfiguration(
      '{"mode": "dark", "enableQuickInsert": true}',
    );
    const newEditorConfig = originalEditorConfig.cloneAndUpdateConfig(
      newConfig,
    );

    expect(newEditorConfig.mode()).toEqual('light');
    expect(newEditorConfig.locale()).toEqual('zh');
    expect(newEditorConfig.isQuickInsertEnabled()).toEqual(true);
    expect(newEditorConfig.isSelectionObserverEnabled()).toEqual(false);
    expect(newEditorConfig.allowCollabProvider()).toEqual(false);
  });

  it('should clone and update the default editorConfig with the new Configuration', () => {
    const newConfig =
      '{"locale":"zh", "mode": "dark", "enableQuickInsert": true}';
    const originalEditorConfig = new MobileEditorConfiguration();
    const newEditorConfig = originalEditorConfig.cloneAndUpdateConfig(
      newConfig,
    );

    expect(newEditorConfig.mode()).toEqual('dark');
    expect(newEditorConfig.locale()).toEqual('zh');
    expect(newEditorConfig.isQuickInsertEnabled()).toEqual(true);
    expect(newEditorConfig.isSelectionObserverEnabled()).toEqual(false);
    expect(newEditorConfig.allowCollabProvider()).toEqual(false);
  });
});
