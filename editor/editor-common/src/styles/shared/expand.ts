// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const expandIconWrapperStyle = css({
	marginLeft: token('space.negative.100', '-8px'),
});

const prefix = 'ak-editor-expand';

export const expandClassNames = {
	prefix,
	expanded: `${prefix}__expanded`,
	titleContainer: `${prefix}__title-container`,
	inputContainer: `${prefix}__input-container`,
	iconContainer: `${prefix}__icon-container`,
	icon: `${prefix}__icon`,
	titleInput: `${prefix}__title-input`,
	content: `${prefix}__content`,
	type: (type: string) => `${prefix}__type-${type}`,
};
