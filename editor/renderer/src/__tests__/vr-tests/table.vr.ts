import { snapshot } from '@af/visual-regression';
import {
  TableRenderer,
  TableRendererOverflow,
  TableRendererWideOverflow,
  TableRendererFullWidthOverflow,
} from './table.fixture';

snapshot(TableRenderer);
snapshot(TableRendererOverflow);
snapshot(TableRendererWideOverflow);
snapshot(TableRendererFullWidthOverflow);
