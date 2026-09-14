import Button from '../../../../old-button/button';
import CustomThemeButton from '../../../../old-button/custom-theme-button/custom-theme-button';
import LoadingButton from '../../../../old-button/loading-button';

type Case = {
	name: string;
	Component: typeof Button | typeof CustomThemeButton | typeof LoadingButton;
};

const cases: Case[] = [
	{
		name: 'Button',
		Component: Button,
	},
	{
		name: 'CustomThemeButton',
		Component: CustomThemeButton,
	},
	{
		name: 'LoadingButton',
		Component: LoadingButton,
	},
];

export default function forEachType(fn: (value: Case) => void): void {
	cases.forEach((value: Case) => fn(value));
}
