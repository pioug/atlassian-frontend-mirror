export type ToPickerFormula = {
	oldPropName: string;
	destination: string[];
};

export const dtpPropsToMoveIntoPickerProps: ToPickerFormula[] = [
	{
		oldPropName: 'dateFormat',
		destination: ['datePickerProps', 'dateFormat'],
	},
	{
		oldPropName: 'times',
		destination: ['timePickerProps', 'times'],
	},
	{
		oldPropName: 'timeFormat',
		destination: ['timePickerProps', 'timeFormat'],
	},
	{
		oldPropName: 'timeIsEditable',
		destination: ['timePickerProps', 'timeIsEditable'],
	},
];
