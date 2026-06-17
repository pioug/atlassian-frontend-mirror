import React from 'react';
import { mount } from 'enzyme';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import RendererEmoji from '../../../../react/nodes/emoji';

describe('Emoji', () => {
	it('should render Emoji UI component', () => {
		const component = mount(<RendererEmoji shortName="shortname" id="id" text="fallback" />);
		expect(component.find(RendererEmoji)).toHaveLength(1);
		component.unmount();
	});

	it('should convert text to fallback attribute', () => {
		const component = mount(<RendererEmoji shortName="shortname" id="id" text="fallback" />);

		expect(component.find(RendererEmoji).prop('text')).toEqual('fallback');
		component.unmount();
	});

	describe('renderWithProvider with platform_editor_custom_emoji_unicode_fallback', () => {
		// With no emojiProvider, the renderer falls back to a plain <span> that
		// surfaces the fallback text in its `data-emoji-text` attribute and text
		// content. We assert on this span directly.

		describe('when the gate is OFF', () => {
			beforeEach(() => {
				failGate('platform_editor_custom_emoji_unicode_fallback');
			});

			it('should render the fallback text for a custom emoji without fallback accessibility attributes', () => {
				const component = mount(
					<RendererEmoji
						id="atlassian-disapproval"
						shortName=":atlassian-disapproval:"
						text=":atlassian-disapproval:"
					/>,
				);
				const span = component.find('span[data-emoji-id="atlassian-disapproval"]');
				expect(span.prop('data-emoji-text')).toBe(':atlassian-disapproval:');
				expect(span.prop('title')).toBeUndefined();
				expect(span.prop('aria-label')).toBeUndefined();
				expect(span.prop('role')).toBeUndefined();
				expect(span.text()).toBe(':atlassian-disapproval:');
				component.unmount();
			});

			it('should render the fallback text for a standard emoji', () => {
				const component = mount(<RendererEmoji id="1f605" shortName=":sweat_smile:" text="😅" />);
				const span = component.find('span[data-emoji-id="1f605"]');
				expect(span.prop('data-emoji-text')).toBe('😅');
				expect(span.text()).toBe('😅');
				component.unmount();
			});
		});

		describe('when the gate is ON', () => {
			beforeEach(() => {
				passGate('platform_editor_custom_emoji_unicode_fallback');
			});

			it('should render U+FFFD for a custom emoji', () => {
				const component = mount(
					<RendererEmoji
						id="atlassian-disapproval"
						shortName=":atlassian-disapproval:"
						text=":atlassian-disapproval:"
					/>,
				);
				const span = component.find('span[data-emoji-id="atlassian-disapproval"]');
				expect(span.prop('data-emoji-text')).toBe('\uFFFD');
				expect(span.prop('title')).toBe(':atlassian-disapproval:');
				expect(span.prop('aria-label')).toBe('Emoji :atlassian-disapproval:');
				expect(span.prop('role')).toBe('img');
				expect(span.text()).toBe('\uFFFD');
				component.unmount();
			});

			it('should render U+FFFD when the text attribute is empty for a custom emoji', () => {
				const component = mount(
					<RendererEmoji id="atlassian-disapproval" shortName=":atlassian-disapproval:" text="" />,
				);
				const span = component.find('span[data-emoji-id="atlassian-disapproval"]');
				expect(span.prop('data-emoji-text')).toBe('\uFFFD');
				expect(span.text()).toBe('\uFFFD');
				component.unmount();
			});

			it('should use shortName as a standard emoji fallback when text is empty', () => {
				const component = mount(<RendererEmoji id="1f605" shortName="😅" text="" />);
				const span = component.find('span[data-emoji-id="1f605"]');
				expect(span.prop('data-emoji-text')).toBe('😅');
				expect(span.text()).toBe('😅');
				component.unmount();
			});

			it('should still render the Unicode text for a standard emoji without fallback accessibility attributes', () => {
				const component = mount(<RendererEmoji id="1f605" shortName=":sweat_smile:" text="😅" />);
				const span = component.find('span[data-emoji-id="1f605"]');
				expect(span.prop('data-emoji-text')).toBe('😅');
				expect(span.prop('title')).toBeUndefined();
				expect(span.prop('aria-label')).toBeUndefined();
				expect(span.prop('role')).toBeUndefined();
				expect(span.text()).toBe('😅');
				component.unmount();
			});

			it('should still render standalone VS-16 Extended_Pictographic emoji as Unicode text', () => {
				const component = mount(<RendererEmoji id="2764-fe0f" shortName=":heart:" text="❤️" />);
				const span = component.find('span[data-emoji-id="2764-fe0f"]');
				expect(span.prop('data-emoji-text')).toBe('❤️');
				expect(span.text()).toBe('❤️');
				component.unmount();
			});

			it('should still render skin-tone modifier emoji as Unicode text', () => {
				const component = mount(
					<RendererEmoji id="1f44b-1f3fd" shortName=":wave::skin-tone-4:" text="👋🏽" />,
				);
				const span = component.find('span[data-emoji-id="1f44b-1f3fd"]');
				expect(span.prop('data-emoji-text')).toBe('👋🏽');
				expect(span.text()).toBe('👋🏽');
				component.unmount();
			});
		});
	});
});
