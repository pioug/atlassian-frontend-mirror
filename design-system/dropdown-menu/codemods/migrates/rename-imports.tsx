import { createRenameImportFor } from '../utils/create-rename-import';

export const renameDropdownItemGroupRadio = createRenameImportFor({
	componentName: 'DropdownItemGroupRadio',
	newComponentName: 'DropdownItemRadioGroup',
	packagePath: '@atlaskit/dropdown-menu',
	isDefaultImport: false,
});

export const renameDropdownItemGroupCheckbox = createRenameImportFor({
	componentName: 'DropdownItemGroupCheckbox',
	newComponentName: 'DropdownItemCheckboxGroup',
	packagePath: '@atlaskit/dropdown-menu',
	isDefaultImport: false,
});

export const renameDropdownMenuStateless = createRenameImportFor({
	componentName: 'DropdownMenuStateless',
	newComponentName: 'DropdownMenuStateless',
	packagePath: '@atlaskit/dropdown-menu',
	isDefaultImport: true,
});
