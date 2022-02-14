// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import { createRemoveFuncFor } from '@atlaskit/codemod-utils';

const deprecateIsHidden = () => [
  createRemoveFuncFor('@atlaskit/dropdown-menu', 'DropdownItem', 'isHidden'),
  createRemoveFuncFor(
    '@atlaskit/dropdown-menu',
    'DropdownItemCheckbox',
    'isHidden',
  ),
  createRemoveFuncFor(
    '@atlaskit/dropdown-menu',
    'DropdownItemRadio',
    'isHidden',
  ),
];

export default deprecateIsHidden;
