/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { useIntl } from 'react-intl-next';

import { cssMap, jsx } from '@atlaskit/css';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { blockMenuMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import LayoutTwoColumnsIcon from '@atlaskit/icon/core/layout-two-columns';
import { fg } from '@atlaskit/platform-feature-flags';

import type { LayoutPlugin } from '../layoutPluginType';

const styles = cssMap({
	svgOverflow: {
		// @ts-expect-error - nested selector required to target SVGs within icon wrapper
		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors
		svg: { overflow: 'visible' },
	},
});

type Props = {
	api: ExtractInjectionAPI<LayoutPlugin> | undefined;
};

const NODE_NAME = 'layoutSection';

const LayoutBlockMenuItem = ({ api }: Props) => {
	const { formatMessage } = useIntl();

	const handleClick = (event: React.MouseEvent | React.KeyboardEvent) => {
		const triggeredFrom =
			event.nativeEvent instanceof KeyboardEvent || event.nativeEvent.detail === 0
				? INPUT_METHOD.KEYBOARD
				: INPUT_METHOD.MOUSE;
		const inputMethod = INPUT_METHOD.BLOCK_MENU;

		api?.core.actions.execute(({ tr }) => {
			const command = api?.blockMenu?.commands.transformNode(
				tr.doc.type.schema.nodes.layoutSection,
				{
					inputMethod,
					triggeredFrom,
					targetTypeName: NODE_NAME,
				},
			);
			return command ? command({ tr }) : null;
		});
	};

	// [FEATURE FLAG: platform_editor_block_menu_v2_patch_3]
	// Adds size="small" to icons for better visual consistency in block menu.
	// Adds overflow: visible to SVGs to fix when view port is in different zoom level, sometimes the right edge of the icon is cut off.
	// To clean up: remove conditionals, keep only size="small" version and always apply svgOverflowStyles wrapper.
	const iconSize = fg('platform_editor_block_menu_v2_patch_3') ? 'small' : undefined;
	const icon = <LayoutTwoColumnsIcon label="" size={iconSize} />;

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
			{formatMessage(blockMenuMessages.layout)}
		</ToolbarDropdownItem>
	);
};

export const createLayoutBlockMenuItem = (api: ExtractInjectionAPI<LayoutPlugin> | undefined) => {
	return (): React.JSX.Element => <LayoutBlockMenuItem api={api} />;
};
