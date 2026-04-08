export type FromPickerFormula = {
	source: string[];
	newPropName: string;
};

export const selectPropsToMoveIntoProps: FromPickerFormula[] = [
	{
		source: ['selectProps', 'aria-describedby'],
		newPropName: 'aria-describedby',
	},
	{
		source: ['selectProps', 'aria-label'],
		newPropName: 'label',
	},
	{
		source: ['selectProps', 'inputId'],
		newPropName: 'id',
	},
	{
		source: ['selectProps', 'placeholder'],
		newPropName: 'placeholder',
	},
];
