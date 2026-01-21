import type { CustomTriggerProps } from '@atlaskit/dropdown-menu';
import type { LozengeProps, ThemeAppearance } from '@atlaskit/lozenge';

export type LozengeActionTriggerProps = {
	appearance?: ThemeAppearance;
	isOpen?: boolean;
	testId?: string;
	text: string | React.ReactNode;
} & Pick<LozengeProps, 'maxWidth'> &
	CustomTriggerProps<HTMLButtonElement>;
