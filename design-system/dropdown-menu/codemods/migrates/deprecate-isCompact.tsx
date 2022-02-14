// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import { createRemoveFuncFor } from '@atlaskit/codemod-utils';

const deprecateIsCompact = () => [
  createRemoveFuncFor('@atlaskit/dropdown-menu', 'DropdownItem', 'isCompact'),
  createRemoveFuncFor(
    '@atlaskit/dropdown-menu',
    'DropdownItemCheckbox',
    'isCompact',
  ),
  createRemoveFuncFor(
    '@atlaskit/dropdown-menu',
    'DropdownItemRadio',
    'isCompact',
  ),
];

export default deprecateIsCompact;
