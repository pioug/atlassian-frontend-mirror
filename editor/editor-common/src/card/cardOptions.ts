import { Providers } from '../provider-factory';

export interface CardOptions {
  provider?: Providers['cardProvider'];
  resolveBeforeMacros?: string[];
  allowBlockCards?: boolean;
  allowEmbeds?: boolean;
  allowResizing?: boolean;
  useAlternativePreloader?: boolean;
}
