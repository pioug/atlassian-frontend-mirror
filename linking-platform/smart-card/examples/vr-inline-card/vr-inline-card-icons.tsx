import type { ComponentType } from 'react';

import { withWaitForItem } from '@atlaskit/link-test-helpers';

import type { Card } from '../../src';
import type { CardSSR } from '../../src/ssr';
import { InlineCardIcons } from '../utils/inline-card-icons';

const _default_1: ComponentType<{
    CardComponent?: typeof Card | typeof CardSSR;
}> = withWaitForItem(InlineCardIcons, () => {
    const item = document.body.querySelectorAll('[data-testid="document-file-format-icon"]');
    return item[20];
});
export default _default_1;
