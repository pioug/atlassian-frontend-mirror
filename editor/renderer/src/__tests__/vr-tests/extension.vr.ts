import {
  ExtensionAwesomeList,
  ExtensionBlockEh,
  ExtensionsWithLayout,
  ExtensionsWithinTable,
  ExtensionIframeNested,
} from './extension.fixture';
import { snapshot } from '@af/visual-regression';

snapshot(ExtensionAwesomeList);
snapshot(ExtensionBlockEh);
snapshot(ExtensionsWithLayout);
snapshot(ExtensionsWithinTable);
snapshot(ExtensionIframeNested);
