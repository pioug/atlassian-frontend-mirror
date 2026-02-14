import { type LozengeProps, type ThemeAppearance } from '@atlaskit/lozenge';

import type { LinkLozengeInvokeActions } from '../../../../../../../extractors/common/lozenge/types';

export type LozengeItem = {
	appearance?: ThemeAppearance;
	id: string;
	text: string;
};

export type LozengeActionProps = {
	action: LinkLozengeInvokeActions;
	appearance?: ThemeAppearance;
	onAfterChanged?: () => void;
	shouldRenderToParent?: boolean;
	testId?: string;
	text: string | React.ReactNode;
	zIndex?: number;
} & Pick<LozengeProps, 'maxWidth'>;
