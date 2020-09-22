import Button, { CustomThemeButton, LoadingButton } from '../../../index';

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

export default function forEachType(fn: (value: Case) => void) {
  cases.forEach((value: Case) => fn(value));
}
