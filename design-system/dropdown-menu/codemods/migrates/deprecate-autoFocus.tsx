// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import { createRemoveFuncFor } from '@atlaskit/codemod-utils';

const deprecateAutoFocus = () => [
	createRemoveFuncFor('@atlaskit/dropdown-menu', 'DropdownItem', 'autoFocus'),
	createRemoveFuncFor('@atlaskit/dropdown-menu', 'DropdownItemCheckbox', 'autoFocus'),
	createRemoveFuncFor('@atlaskit/dropdown-menu', 'DropdownItemRadio', 'autoFocus'),
];

export default deprecateAutoFocus;
