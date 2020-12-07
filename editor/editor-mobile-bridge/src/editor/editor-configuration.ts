interface EditorConfigurationProvider {
  mode(): string;
  locale(): string;
  isQuickInsertEnabled(): boolean;
  isSelectionObserverEnabled(): boolean;
  allowCollabProvider(): boolean;
}

type ThemeMode = 'light' | 'dark';

interface EditorConfig {
  mode: ThemeMode;
  locale: string;
  enableQuickInsert: boolean;
  selectionObserverEnabled: boolean;
  allowCollabProvider: boolean;
}

export default class MobileEditorConfiguration
  implements EditorConfigurationProvider {
  private _mode: ThemeMode = 'light';
  private _locale: string = 'en';
  private _isQuickInsertEnabled: boolean = false;
  private _isSelectionObserverEnabled: boolean = false;
  private _allowCollabProvider: boolean = false;

  constructor(editorConfig?: string) {
    if (editorConfig) {
      this.update(editorConfig);
    }
  }

  update(editorConfig: string) {
    const config = JSON.parse(editorConfig) as EditorConfig;

    this._locale = config.locale || this._locale;
    this._mode = config.mode || this._mode;
    this._isQuickInsertEnabled =
      config.enableQuickInsert || this._isQuickInsertEnabled;
    this._isSelectionObserverEnabled =
      config.selectionObserverEnabled || this._isSelectionObserverEnabled;
    this._allowCollabProvider =
      config.allowCollabProvider || this._allowCollabProvider;
  }

  mode(): ThemeMode {
    return this._mode;
  }
  locale(): string {
    return this._locale;
  }
  isQuickInsertEnabled(): boolean {
    return this._isQuickInsertEnabled;
  }
  isSelectionObserverEnabled(): boolean {
    return this._isSelectionObserverEnabled;
  }
  allowCollabProvider(): boolean {
    return this._allowCollabProvider;
  }
  cloneAndUpdateConfig(newEditorConfig: string): MobileEditorConfiguration {
    const newEditorConfigObject = Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this,
    );
    newEditorConfigObject.update(newEditorConfig);
    return newEditorConfigObject;
  }
}
