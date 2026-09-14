import React from 'react';

import Block from '../../view/FlexibleCard/components/blocks/block';
import { default as PreviewBlock } from '../../view/FlexibleCard/components/blocks/preview-block';
import { default as SnippetBlock } from '../../view/FlexibleCard/components/blocks/snippet-block';
import { default as TitleBlock } from '../../view/FlexibleCard/components/blocks/title-block';
import { default as Title } from '../../view/FlexibleCard/components/elements/title-element';
import { isFlexibleUiBlock } from '../is-flexible-ui-block';
import { isFlexibleUiCard } from '../is-flexible-ui-card';
import { isFlexibleUiElement } from '../is-flexible-ui-element';
import { isFlexibleUiPreviewBlock } from '../is-flexible-ui-preview-block';
import { isFlexibleUiTitleBlock } from '../is-flexible-ui-title-block';

describe('isFlexibleUiCard', () => {
	it('returns true if card has TitleBlock as children', () => {
		const isFlexible = isFlexibleUiCard(<TitleBlock />);

		expect(isFlexible).toBeTruthy();
	});

	it('returns false if card does not have TitleBlock as children', () => {
		const isFlexible = isFlexibleUiCard(<SnippetBlock />);

		expect(isFlexible).toBeFalsy();
	});

	it('returns false if card does not have any children', () => {
		const isFlexible = isFlexibleUiCard();

		expect(isFlexible).toBeFalsy();
	});

	it('returns false if card children is not a flexible ui block', () => {
		const isFlexible = isFlexibleUiCard(<div />);

		expect(isFlexible).toBeFalsy();
	});

	describe('when removeBlockRestriction is true', () => {
		it('returns false if card does not have any children', () => {
			const isFlexible = isFlexibleUiCard(undefined, { removeBlockRestriction: true });

			expect(isFlexible).toBeFalsy();
		});

		it('returns true if card has any children', () => {
			const isFlexible = isFlexibleUiCard(<div />, { removeBlockRestriction: true });

			expect(isFlexible).toBeTruthy();
		});
	});
});

describe('isFlexibleUiBlock', () => {
	it('returns true if React.Node is Flexible UI block', () => {
		const isBlock = isFlexibleUiBlock(<TitleBlock />);

		expect(isBlock).toBeTruthy();
	});

	it('returns false if React.Node is not Flexible UI block', () => {
		const isBlock = isFlexibleUiBlock(<div></div>);

		expect(isBlock).toBeFalsy();
	});

	it('return false if node is invalid', () => {
		const isBlock = isFlexibleUiBlock('This is a text.');

		expect(isBlock).toBeFalsy();
	});
});

describe('isFlexibleUiElement', () => {
	it('returns true if React.Node is Flexible UI element', () => {
		const isElement = isFlexibleUiElement(<Title />);

		expect(isElement).toBeTruthy();
	});

	it('returns false if React.Node is not Flexible UI element', () => {
		const isElement = isFlexibleUiElement(<Block />);

		expect(isElement).toBeFalsy();
	});

	it('return false if node is invalid', () => {
		const isElement = isFlexibleUiElement('This is a text.');

		expect(isElement).toBeFalsy();
	});
});

describe('isFlexibleUiTitleBlock', () => {
	it('returns true if React.Node is Flexible UI Title block', () => {
		const isBlock = isFlexibleUiTitleBlock(<TitleBlock />);

		expect(isBlock).toBeTruthy();
	});

	it('returns false if React.Node is not Flexible UI block', () => {
		const isBlock = isFlexibleUiTitleBlock(<div></div>);

		expect(isBlock).toBeFalsy();
	});

	it('return false if node is invalid', () => {
		const isBlock = isFlexibleUiTitleBlock('This is a text.');

		expect(isBlock).toBeFalsy();
	});
});

describe('isFlexibleUiPreviewBlock', () => {
	it('returns true if React.Node is Flexible UI preview block', () => {
		const isBlock = isFlexibleUiPreviewBlock(<PreviewBlock />);

		expect(isBlock).toBeTruthy();
	});

	it('returns false if React.Node is not Flexible UI block', () => {
		const isBlock = isFlexibleUiPreviewBlock(<div></div>);

		expect(isBlock).toBeFalsy();
	});

	it('return false if node is invalid', () => {
		const isBlock = isFlexibleUiPreviewBlock('This is a text.');

		expect(isBlock).toBeFalsy();
	});
});
