import { snapshot } from '@af/visual-regression';
import {
  TableRenderer,
  TableRendererOverflow,
  TableRendererWideOverflow,
  TableRendererFullWidthOverflow,
  TableRendererMobile,
  TableRendererWithInlineComments,
  TableRendererWrappedNodes,
} from './table.fixture';

snapshot(TableRenderer, {
  description: 'Table renderer should NOT render a right shadow',
});
snapshot(TableRendererOverflow);
snapshot(TableRendererWideOverflow);
snapshot(TableRendererFullWidthOverflow);
snapshot(TableRendererMobile);
snapshot(TableRendererWithInlineComments, {
  description:
    'Table renderer should render inline comment over right overflow shadow',
});
snapshot(TableRendererWrappedNodes, {
  description:
    'Table renderer should NOT overflow inline nodes when table columns are narrow',
});
