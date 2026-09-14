import { snapshot } from '@af/visual-regression';

import { default as BlockCardSSR } from '../../../examples/vr-card-ssr/resolved-block-card-ssr.vr.ap';
import { default as InlineCardSSR } from '../../../examples/vr-card-ssr/resolved-inline-card-ssr.vr.ap';

snapshot(InlineCardSSR);
snapshot(BlockCardSSR);
