import { getEditorType } from '../query-param-reader';

interface EditorConfigurationProvider {
  getMode(): string;
  getLocale(): string;
  isQuickInsertEnabled(): boolean;
  isSelectionObserverEnabled(): boolean;
  isCollabProviderEnabled(): boolean;
  isPredictableListEnabled(): boolean;
}

type ThemeMode = 'light' | 'dark';

enum EditorAppearance {
  FULL = 'full',
  COMPACT = 'compact',
}

interface EditorConfig {
  editorType: EditorAppearance;
  mode?: ThemeMode;
  locale?: string;
  enableQuickInsert?: boolean;
  selectionObserverEnabled?: boolean;
  allowCollabProvider?: boolean;
  allowPredictableList?: boolean;
}

export default class MobileEditorConfiguration
  implements EditorConfigurationProvider {
  private editorType: EditorAppearance = EditorAppearance.FULL;
  private mode: ThemeMode = 'light';
  private locale: string = 'en';
  private enableQuickInsert: boolean = false;
  private selectionObserverEnabled: boolean = false;
  private allowCollabProvider: boolean = false;
  private allowPredictableList: boolean = false;

  constructor(editorConfig?: string) {
    const editorType = getEditorType();

    if (editorType) {
      this.editorType = editorType as EditorAppearance;
    }

    if (editorConfig) {
      this.update(editorConfig);
    }
  }

  update(editorConfig: string) {
    const config = JSON.parse(editorConfig) as EditorConfig;

    this.locale = config.locale || this.locale;
    this.mode = config.mode || this.mode;
    this.enableQuickInsert =
      config.enableQuickInsert !== undefined
        ? config.enableQuickInsert
        : this.enableQuickInsert;
    this.selectionObserverEnabled =
      config.selectionObserverEnabled !== undefined
        ? config.selectionObserverEnabled
        : this.selectionObserverEnabled;
    this.allowCollabProvider =
      config.allowCollabProvider !== undefined
        ? config.allowCollabProvider
        : this.allowCollabProvider;
    this.allowPredictableList =
      config.allowPredictableList !== undefined
        ? config.allowPredictableList
        : this.allowPredictableList;
  }

  getMode(): ThemeMode {
    return this.mode;
  }

  getLocale(): string {
    return this.locale;
  }

  isQuickInsertEnabled(): boolean {
    return this.enableQuickInsert;
  }

  isSelectionObserverEnabled(): boolean {
    return this.selectionObserverEnabled;
  }

  isCollabProviderEnabled(): boolean {
    return this.allowCollabProvider;
  }

  isPredictableListEnabled(): boolean {
    return this.allowPredictableList;
  }

  isAllowScrollGutter(): boolean {
    return this.editorType !== EditorAppearance.COMPACT;
  }

  // We need to retain the previous configuartion flags as `locale` and `mode` can be configured
  // dynamically any time.
  cloneAndUpdateConfig(newConfig: string): MobileEditorConfiguration {
    const newEditorConfig = JSON.stringify({
      ...this,
      ...JSON.parse(newConfig),
    });
    return new MobileEditorConfiguration(newEditorConfig);
  }
}
