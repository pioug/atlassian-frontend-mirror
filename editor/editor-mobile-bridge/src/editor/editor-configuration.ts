interface EditorConfigurationProvider {
  getEditorAppearance(): EditorAppearance;
  getMode(): string;
  getLocale(): string;
  isQuickInsertEnabled(): boolean;
  isSelectionObserverEnabled(): boolean;
  isCollabProviderEnabled(): boolean;
  isPredictableListEnabled(): boolean;
  isScrollGutterPersisted(): boolean;
}

type ThemeMode = 'light' | 'dark';

export enum EditorAppearance {
  FULL = 'full',
  COMPACT = 'compact',
}

interface EditorConfig {
  editorAppearance?: EditorAppearance;
  mode?: ThemeMode;
  locale?: string;
  enableQuickInsert?: boolean;
  selectionObserverEnabled?: boolean;
  allowCollabProvider?: boolean;
  allowPredictableList?: boolean;
  useUnpredictableInputRule?: boolean;
  placeholder?: string;
  allowEmptyADFCheck?: boolean;
  localIdGenerationOnTables?: boolean;
  dataConsumerMark?: boolean;
}

export default class MobileEditorConfiguration
  implements EditorConfigurationProvider {
  private editorAppearance: EditorAppearance = EditorAppearance.FULL;
  private mode: ThemeMode = 'light';
  private locale: string = 'en';
  private enableQuickInsert: boolean = false;
  private selectionObserverEnabled: boolean = false;
  private allowCollabProvider: boolean = false;
  private allowPredictableList: boolean = true;
  private useUnpredictableInputRule: boolean = true;
  private placeholder?: string | undefined;
  private allowEmptyADFCheck: boolean = false;
  private localIdGenerationOnTables: boolean = false;
  private dataConsumerMark: boolean = false;

  constructor(editorConfig?: string) {
    if (editorConfig) {
      this.update(editorConfig);
    }
  }

  update(editorConfig: string) {
    const config = JSON.parse(editorConfig) as EditorConfig;

    this.editorAppearance = config.editorAppearance || this.editorAppearance;
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
    this.useUnpredictableInputRule =
      config.useUnpredictableInputRule !== undefined
        ? config.useUnpredictableInputRule
        : this.useUnpredictableInputRule;
    this.placeholder =
      config.placeholder !== undefined ? config.placeholder : this.placeholder;
    this.allowEmptyADFCheck =
      config.allowEmptyADFCheck !== undefined
        ? config.allowEmptyADFCheck
        : this.allowEmptyADFCheck;
    this.localIdGenerationOnTables =
      config.localIdGenerationOnTables !== undefined
        ? config.localIdGenerationOnTables
        : this.localIdGenerationOnTables;
    this.dataConsumerMark =
      config.dataConsumerMark !== undefined
        ? config.dataConsumerMark
        : this.dataConsumerMark;
  }

  getEditorAppearance(): EditorAppearance {
    return this.editorAppearance;
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

  isUnpredictableInputRuleEnabled(): boolean {
    return this.useUnpredictableInputRule;
  }

  isScrollGutterPersisted(): boolean {
    return this.getEditorAppearance() === EditorAppearance.COMPACT;
  }
  isIndentationAllowed(): boolean {
    return this.getEditorAppearance() !== EditorAppearance.COMPACT;
  }

  getPlaceholder(): string | undefined {
    return this.placeholder;
  }

  isAllowEmptyADFCheckEnabled(): boolean {
    return this.allowEmptyADFCheck;
  }

  isLocalIdGenerationOnTablesEnabled(): boolean {
    return this.localIdGenerationOnTables;
  }

  isDataConsumerMarkEnabled(): boolean {
    return this.dataConsumerMark;
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
