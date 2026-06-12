/* eslint-disable @atlaskit/ui-styling-standard/use-compiled -- Pre-existing lint debt surfaced by this mechanical type-import-only PR. */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const expandIconWrapperStyle: SerializedStyles = css({
	marginLeft: token('space.negative.100'),
});

/**
 * @private
 * @deprecated use `import { ToolbarExpandIcon } from '@atlaskit/editor-common/ui';` instead
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports -- Ignored via go/DSP-18766
export const expandIconContainerStyle: SerializedStyles = css({
	display: 'flex',
	alignItems: 'center',
});

const prefix = 'ak-editor-expand';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const expandClassNames: {
	content: string;
	contentCollapsed: string;
	expanded: string;
	icon: string;
	iconButton: string;
	iconContainer: string;
	iconSvg: string;
	inputContainer: string;
	prefix: string;
	titleContainer: string;
	titleInput: string;
	type: (type: string) => string;
} = {
	prefix,
	expanded: `${prefix}__expanded`,
	titleContainer: `${prefix}__title-container`,
	inputContainer: `${prefix}__input-container`,
	iconContainer: `${prefix}__icon-container`,
	icon: `${prefix}__icon`,
	iconButton: `${prefix}__icon-button`,
	iconSvg: `${prefix}__icon-svg`,
	titleInput: `${prefix}__title-input`,
	content: `${prefix}__content`,
	contentCollapsed: `${prefix}__content--collapsed`,
	type: (type: string) => `${prefix}__type-${type}`,
};
