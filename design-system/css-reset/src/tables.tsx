// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors, typography } from '@atlaskit/theme';
import { token } from '@atlaskit/tokens';

import evaluateInner from './utils/evaluate-inner';

export default evaluateInner`
  table {
    border-collapse: collapse;
    width: 100%;
  }

  thead,
  tbody,
  tfoot {
    border-bottom: 2px solid ${token('color.border', colors.N40)};
  }

  td,
  th {
    border: none;
    padding: ${token('space.050', '4px')} ${token('space.100', '8px')};
    text-align: left;
  }

  th {
    vertical-align: top;
  }

  td:first-child,
  th:first-child {
    padding-left: 0;
  }

  td:last-child,
  th:last-child {
    padding-right: 0;
  }

  caption {
    ${typography.h600()}
    margin-bottom: ${token('space.100', '8px')};
    text-align: left;
  }
`;
