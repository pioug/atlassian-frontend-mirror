import type { CustomTriggerProps } from '@atlaskit/dropdown-menu/types';
import type { LozengeProps, ThemeAppearance } from '@atlaskit/lozenge/lozenge';

export type LozengeActionTriggerProps = {
	appearance?: ThemeAppearance;
	isOpen?: boolean;
	testId?: string;
	text: string | React.ReactNode;
	trailingMetric?: string;
} & Pick<LozengeProps, 'maxWidth'> &
	CustomTriggerProps<HTMLButtonElement>;
