import { snapshot } from '@af/visual-regression';

import { default as BlockCardSSR } from '../../../examples/vr-card-ssr/resolved-block-card-ssr';
import { default as InlineCardSSR } from '../../../examples/vr-card-ssr/resolved-inline-card-ssr';

snapshot(InlineCardSSR);
snapshot(BlockCardSSR);
