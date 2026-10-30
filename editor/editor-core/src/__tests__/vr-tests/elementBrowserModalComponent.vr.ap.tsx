/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// The font workaround targets an element owned by ElementBrowser.
// These styles require selectors or values outside @atlaskit/css.
import type { JSX } from 'react';

import { css, jsx } from '@compiled/react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import ElementBrowser from '@atlaskit/editor-common/element-browser/ElementBrowserLoader';
import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory/quick-insert-provider';

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
export const ElementBrowserModal = (): JSX.Element => (
	<div css={hideEnterKey}>
		<EditorContext>
			<ElementBrowserComp />
		</EditorContext>
	</div>
);

const ElementBrowserCompWithDisabled = () => {
	const getItems: () => QuickInsertItem[] = () => [
		{
			name: 'item-1',
			title: 'Item 1',
			description: 'Item 1 description',
			action: () => false,
			categories: ['category-2'],
		},
		{
			name: 'item-2',
			title: 'Item 2',
			description: 'Item 2 description',
			action: () => false,
			isDisabled: true,
			categories: ['category-3'],
		},
		{
			name: 'item-3',
			title: 'Item 3',
			isDisabled: true,
			action: () => false,
			categories: ['category-3'],
		},
		{
			name: 'item-4',
			title: 'Item 4',
			description: 'Item 4 description',
			action: () => false,
			categories: ['category-3'],
		},
	];

	return <ElementBrowserWithIntl getItems={getItems} />;
};
export const ElementBrowserModalWithDisabled = (): JSX.Element => (
	<div css={hideEnterKey}>
		<EditorContext>
			<ElementBrowserCompWithDisabled />
		</EditorContext>
	</div>
);
