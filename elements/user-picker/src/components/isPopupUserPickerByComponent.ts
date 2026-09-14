import { PopupSelect } from '@atlaskit/select/popup-select';

export const isPopupUserPickerByComponent = (SelectComponent: React.ComponentType<any>): boolean =>
	SelectComponent === PopupSelect;
