import type { ThemeAppearance } from '@atlaskit/lozenge/lozenge';

import type { LozengeItem } from '../types';

export type LozengeActionItemProps = LozengeItem & {
	onClick?: (id: string, text: string, appearance?: ThemeAppearance) => void;
	testId?: string;
};
