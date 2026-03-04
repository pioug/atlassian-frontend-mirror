/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { useIntl } from 'react-intl-next';

import { cssMap, jsx } from '@atlaskit/css';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { blockTypeMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import QuotationMarkIcon from '@atlaskit/icon/core/quotation-mark';
import { fg } from '@atlaskit/platform-feature-flags';

import type { BlockTypePlugin } from '../blockTypePluginType';

const styles = cssMap({
	svgOverflow: {
		// @ts-expect-error - nested selector required to target SVGs within icon wrapper
		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors
		svg: { overflow: 'visible' },
	},
});

type QuoteBlockMenuItemProps = {
	api: ExtractInjectionAPI<BlockTypePlugin> | undefined;
};

const NODE_NAME = 'blockquote';

const QuoteBlockMenuItem = ({ api }: QuoteBlockMenuItemProps) => {
	const { formatMessage } = useIntl();

	const handleClick = (event: React.MouseEvent | React.KeyboardEvent) => {
		const triggeredFrom =
			event.nativeEvent instanceof KeyboardEvent || event.nativeEvent.detail === 0
				? INPUT_METHOD.KEYBOARD
				: INPUT_METHOD.MOUSE;
		const inputMethod = INPUT_METHOD.BLOCK_MENU;

		api?.core.actions.execute(({ tr }) => {
			const command = api?.blockMenu?.commands.transformNode(tr.doc.type.schema.nodes.blockquote, {
				inputMethod,
				triggeredFrom,
				targetTypeName: NODE_NAME,
			});
			return command ? command({ tr }) : null;
		});
	};

	// [FEATURE FLAG: platform_editor_block_menu_v2_patch_3]
	// Adds size="small" to icons for better visual consistency in block menu.
	// Adds overflow: visible to SVGs to fix when view port is in different zoom level, sometimes the right edge of the icon is cut off.
	// To clean up: remove conditionals, keep only size="small" version and always apply svgOverflowStyles wrapper.
	const iconSize = fg('platform_editor_block_menu_v2_patch_3') ? 'small' : undefined;
	const icon = <QuotationMarkIcon label="" size={iconSize} />;

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			elemBefore={
				fg('platform_editor_block_menu_v2_patch_3') ? (
					<span css={styles.svgOverflow}>{icon}</span>
				) : (
					icon
				)
			}
		>
			{formatMessage(blockTypeMessages.blockquote)}
		</ToolbarDropdownItem>
	);
};

export const createQuoteBlockMenuItem = ({ api }: QuoteBlockMenuItemProps) => {
	return (): React.JSX.Element => <QuoteBlockMenuItem api={api} />;
};
