import { Providers } from '../provider-factory';

export interface CardOptions {
  provider?: Providers['cardProvider'];
  resolveBeforeMacros?: string[];
  allowBlockCards?: boolean;
  allowDatasource?: boolean;
  allowEmbeds?: boolean;
  allowResizing?: boolean;
  showServerActions?: boolean;
  useAlternativePreloader?: boolean;
  allowAlignment?: boolean;
  allowWrapping?: boolean;
}
