import type { IntlShape } from 'react-intl-next';
import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
export type { IconProps } from '@atlaskit/editor-common/types';

export type QuickInsertHandler =
  | Array<QuickInsertItem>
  | ((intl: IntlShape) => Array<QuickInsertItem>);
