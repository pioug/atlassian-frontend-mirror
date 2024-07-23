/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { ElementBrowser } from '@atlaskit/editor-common/element-browser';
import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';

import { getCategories } from '../../../example-helpers/quick-insert-categories';
import { default as EditorContext } from '../../ui/EditorContext';

// Hiding the enter (⏎) key due to a bug in fonts for gemini on CI, causing tests to fail in CI but pass locally
const hideEnterKey = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	"div[data-testid='element_search__element_after_input']": {
		visibility: 'hidden',
	},
});

const RenderElementBrowser = (
	props: {
		getItems: (query?: string, category?: string) => QuickInsertItem[];
	} & WrappedComponentProps,
) => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
	<div style={{ display: 'flex', height: '150px' }}>
		<ElementBrowser
			categories={getCategories(props.intl)}
			getItems={props.getItems}
			showSearch={true}
			showCategories={true}
			mode="full"
			defaultCategory="all"
			onInsertItem={() => {}}
		/>
	</div>
);

const ElementBrowserWithIntl = injectIntl(RenderElementBrowser);

const ElementBrowserComp = () => {
	const getItems: () => QuickInsertItem[] = () => [
		{
			name: 'item-1',
			title: 'Item 1',
			action: () => false,
			categories: ['category-2'],
		},
		{
			name: 'item-2',
			title: 'Item 2',
			action: () => false,
			categories: ['category-3'],
		},
		{
			name: 'item-3',
			title: 'Item 3',
			action: () => false,
			categories: ['category-3'],
		},
		{
			name: 'item-4',
			title: 'Item 4',
			action: () => false,
			categories: ['category-3'],
		},
	];

	return <ElementBrowserWithIntl getItems={getItems} />;
};
export default () => (
	<div css={hideEnterKey}>
		<EditorContext>
			<ElementBrowserComp />
		</EditorContext>
	</div>
);
