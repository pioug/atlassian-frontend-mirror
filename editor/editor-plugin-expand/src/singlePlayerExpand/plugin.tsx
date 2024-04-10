import {
  expand,
  extendedNestedExpand,
  nestedExpand,
} from '@atlaskit/adf-schema';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

// TODO: https://product-fabric.atlassian.net/browse/ED-22840
// In ED-22840 make sure we update the ExpandPlugin type to use singlePlayerExpands own types
import type { ExpandPlugin } from '../legacyExpand/types';

export const expandPlugin: ExpandPlugin = () => {
  return {
    name: 'expand',
    nodes() {
      const nestedExpandNode = getBooleanFF(
        'platform.editor.allow-extended-nested-expand',
      )
        ? extendedNestedExpand
        : nestedExpand;
      return [
        { name: 'expand', node: expand },
        { name: 'nestedExpand', node: nestedExpandNode },
      ];
    },
    actions: {
      insertExpand: () => {
        return false;
      },
    },
    pmPlugins() {
      return [];
    },
    pluginsOptions: {},
  };
};
