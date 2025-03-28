/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag
 */
import { useCallback, useMemo, useState } from 'react';

import { css, jsx } from '@atlaskit/css';
import { addLink, getAriaKeyshortcuts } from '@atlaskit/editor-common/keymaps';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	ArrowKeyNavigationType,
	DropdownMenu,
	ToolbarButton,
	type MenuItem,
} from '@atlaskit/editor-common/ui-menu';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import { token } from '@atlaskit/tokens';

import type { SelectionToolbarPlugin } from '../selectionToolbarPluginType';

import { getOverflowPrimaryToolbarConfig } from './overflow-toolbar-config';

const DROPDOWN_WIDTH = 240;

const buttonStyles = css({
	paddingTop: token('space.075'),
	paddingBottom: token('space.075'),
	paddingLeft: token('space.075'),
	paddingRight: token('space.075'),
});

type Props = {
	api?: ExtractInjectionAPI<SelectionToolbarPlugin>;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
};

export function PrimaryToolbarComponent({
	api,
	popupsBoundariesElement,
	popupsMountPoint,
	popupsScrollableElement,
}: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const items = useMemo(() => getOverflowPrimaryToolbarConfig({ api }), [api]);
	const content = 'Show more items';

	const onClick = useCallback(() => {
		setIsOpen(!isOpen);
	}, [isOpen]);

	const onMenuItemActivated = useCallback(({ item }: { item: MenuItem }) => {
		item?.onClick?.();
	}, []);

	return (
		<DropdownMenu
			isOpen={isOpen}
			onOpenChange={(attrs) => setIsOpen(attrs.isOpen)}
			items={items}
			arrowKeyNavigationProviderOptions={{
				type: ArrowKeyNavigationType.MENU,
			}}
			boundariesElement={popupsBoundariesElement}
			mountTo={popupsMountPoint}
			scrollableElement={popupsScrollableElement}
			section={{ hasSeparator: true }}
			onItemActivated={onMenuItemActivated}
			fitWidth={DROPDOWN_WIDTH}
		>
			<ToolbarButton
				onClick={onClick}
				aria-haspopup="dialog"
				aria-keyshortcuts={getAriaKeyshortcuts(addLink)}
				aria-label={content}
				title={content}
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides -- Ignored via go/DSP-18766
				css={buttonStyles}
			>
				<ShowMoreHorizontalIcon label={content} />
			</ToolbarButton>
		</DropdownMenu>
	);
}
