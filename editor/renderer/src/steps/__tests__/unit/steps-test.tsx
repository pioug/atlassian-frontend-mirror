/* eslint-disable @atlaskit/editor/no-as-casting */
import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { IntlProvider } from 'react-intl-next';
import ReactSerializer from '../../../react/index';
import { getPosFromRange, resolvePos } from '../../index';
import {
	complexDocument,
	docWithFormattedText,
	docWithImage,
	docWithImageInTable,
} from './__fixtures__/documents';
// eslint-disable-next-line @atlaskit/platform/no-alias
import * as ffPackage from '@atlaskit/platform-feature-flags';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { getDefaultMediaClientConfig } from '@atlaskit/media-test-helpers';
import { MediaClientProvider } from '@atlaskit/media-client-react';
import { ffTest } from '@atlassian/feature-flags-test-utils';

/*
 * NOTE: This will interfere with the ability to test the compiled styles,
 * eg. you cannot do `expect(component).toHaveCompiledCss(…);` in tests that import this util.
 */
jest.mock('@compiled/react/runtime', () => ({
	...jest.requireActual('@compiled/react/runtime'),
	// Mock `<CS>` out so it doesn't generate `<style>` tags!
	CS: () => null,
}));

describe('steps', () => {
	const DOC_ROOT_OFFSET = 1;

	let container: HTMLElement | null = document.createElement('div');
	let docFromSchema: PMNode;
	let reactAdf: JSX.Element;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let root: any; // Change to Root once we go full React 18
	let firstValidParagraphPosition: number;
	let firstValidParagraph: HTMLElement;

	async function setup(
		{ smartLinksSsr, doc = complexDocument }: { smartLinksSsr: boolean; doc?: any } = {
			smartLinksSsr: false,
			doc: complexDocument,
		},
	) {
		container = document.createElement('div');
		document.body.appendChild(container);

		docFromSchema = schema.nodeFromJSON(doc);
		const mediaClientConfig = getDefaultMediaClientConfig();

		const reactSerializer = new ReactSerializer({
			surroundTextNodesWithTextWrapper: true,
			smartLinks: {
				ssr: smartLinksSsr,
			},
			media: {
				allowCaptions: true,
			},
		});

		reactAdf = reactSerializer.serializeFragment(docFromSchema.content)!;

		docFromSchema.descendants((node, pos) => {
			if (node.type.name === 'paragraph' && !firstValidParagraphPosition) {
				firstValidParagraphPosition = pos + DOC_ROOT_OFFSET;
			}

			return false;
		});
		if (process.env.IS_REACT_18 === 'true') {
			// @ts-ignore react-dom/client only available in react 18
			// eslint-disable-next-line @repo/internal/import/no-unresolved, import/dynamic-import-chunkname -- react-dom/client only available in react 18
			const { createRoot } = await import('react-dom/client');
			root = createRoot(container!);
			act(() => {
				root.render(
					<IntlProvider locale="en">
						<MediaClientProvider clientConfig={mediaClientConfig}>{reactAdf}</MediaClientProvider>
					</IntlProvider>,
				);
			});
		} else {
			render(
				<IntlProvider locale="en">
					<SmartCardProvider>
						<MediaClientProvider clientConfig={mediaClientConfig}>{reactAdf}</MediaClientProvider>
					</SmartCardProvider>
				</IntlProvider>,
				container,
			);
		}
		firstValidParagraph = container!.querySelector(
			`p[data-renderer-start-pos="${firstValidParagraphPosition!}"]`,
		) as HTMLElement;

		await act(async () => {
			// needed to ensure smart cards are rendered
			await new Promise((resolve) => setTimeout(resolve, 0));
		});
	}

	afterEach(() => {
		if (process.env.IS_REACT_18 === 'true') {
			root.unmount();
		} else {
			unmountComponentAtNode(container!);
		}
		firstValidParagraphPosition = 0;
	});

	describe('#getPosFromRange', () => {
		describe('when a paragraph is selected', () => {
			it('should calc the position', async () => {
				await setup();
				const myRange = new Range();
				const PARENT_OFFSET = 1;
				myRange.setStart(firstValidParagraph, 0);
				myRange.setEnd(firstValidParagraph.nextElementSibling as HTMLElement, 0);
				const paragraphNode = docFromSchema.nodeAt(firstValidParagraphPosition - PARENT_OFFSET)!;
				expect(getPosFromRange(myRange)).toEqual({
					from: firstValidParagraphPosition,
					to: firstValidParagraphPosition + paragraphNode.nodeSize,
				});

				expect(getPosFromRange(myRange)).toEqual({
					from: firstValidParagraphPosition,
					to: firstValidParagraphPosition + paragraphNode.nodeSize,
				});
			});
		});

		describe('when a part of paragraph is selected', () => {
			it('should calc the position of a plain text range', async () => {
				await setup();
				const myRange = new Range();
				const PARENT_OFFSET = 1;
				myRange.setStart(firstValidParagraph, 0);
				myRange.setEnd(firstValidParagraph.childNodes[1] as HTMLElement, 0);
				const paragraphNode = docFromSchema.nodeAt(firstValidParagraphPosition - PARENT_OFFSET)!;
				const textNode = paragraphNode.nodeAt(0)!;
				expect(getPosFromRange(myRange)).toEqual({
					from: firstValidParagraphPosition,
					to: firstValidParagraphPosition + textNode.nodeSize,
				});

				expect(getPosFromRange(myRange)).toEqual({
					from: firstValidParagraphPosition,
					to: firstValidParagraphPosition + textNode.nodeSize,
				});
			});

			it('should calc the position of a formatted text range', async () => {
				await setup({ doc: docWithFormattedText, smartLinksSsr: false });
				const myRange = new Range();
				const PARENT_OFFSET = 1;

				myRange.setStart(firstValidParagraph, 0);
				myRange.setEnd(firstValidParagraph.childNodes[1], 0);
				const paragraphNode = docFromSchema.nodeAt(firstValidParagraphPosition - PARENT_OFFSET)!;
				const textNode = paragraphNode.nodeAt(0)!;
				expect(getPosFromRange(myRange)).toEqual({
					from: firstValidParagraphPosition,
					to: firstValidParagraphPosition + textNode.nodeSize,
				});

				expect(getPosFromRange(myRange)).toEqual({
					from: firstValidParagraphPosition,
					to: firstValidParagraphPosition + textNode.nodeSize,
				});
			});

			describe.each([[true], [false]])(`ssr enabled: %o`, (ssrEnabled) => {
				const fg = jest.spyOn(ffPackage, 'fg');
				const ffDeps = ['editor_inline_comments_on_inline_nodes'];
				(fg as jest.Mock).mockImplementation((ff: string) => ffDeps.includes(ff));

				// helper util to get the text node from a nested element -- this could break if the
				// structure of inlineCards change
				function getFirstTextNode(element: ChildNode): HTMLElement | undefined {
					for (const child of element.childNodes) {
						if (child.nodeType === Node.TEXT_NODE) {
							return child as HTMLElement;
						} else {
							const textNode = getFirstTextNode(child as ChildNode);
							if (textNode) {
								return textNode;
							}
						}
					}
				}

				const prefix = 'range-with-inline-card-with-mark';
				test.each([
					[
						'across an inline card',
						{
							setRange: (myRange: Range, inlineCardWithMarkParagraph: HTMLParagraphElement) => {
								myRange.setStart(inlineCardWithMarkParagraph.childNodes[0], prefix.length);
								myRange.setEnd(
									// The third item in the document for this paragraph is a text node with a comment on it
									// which means the html will be a span (for the comment), and then a text node
									// so we reach in twice to get the text node
									inlineCardWithMarkParagraph.childNodes[3].childNodes[0] as HTMLElement,
									5,
								);
							},
							expectedPositions: { from: 1843, to: 1873 },
							expectedRangeContents:
								' This is an inline card https://trello.com/c/gfrst89H/4-much-muffins with',
						},
					],
					[
						'ending in an inline card',
						{
							setRange: (myRange: Range, inlineCardWithMarkParagraph: HTMLParagraphElement) => {
								myRange.setStart(inlineCardWithMarkParagraph.childNodes[0], prefix.length);
								myRange.setEnd(getFirstTextNode(inlineCardWithMarkParagraph.childNodes[2])!, 5);
							},
							expectedPositions: { from: 1843, to: 1868 },
							expectedRangeContents: ' This is an inline card https',
						},
					],
					[
						'starting in an inline card',
						{
							setRange: (myRange: Range, inlineCardWithMarkParagraph: HTMLParagraphElement) => {
								myRange.setStart(getFirstTextNode(inlineCardWithMarkParagraph.childNodes[2])!, 5);
								myRange.setEnd(inlineCardWithMarkParagraph.childNodes[3].childNodes[0], 5);
							},
							expectedPositions: { from: 1867, to: 1873 },
							expectedRangeContents: '://trello.com/c/gfrst89H/4-much-muffins with',
						},
					],
					[
						'entirely in an inline card',
						{
							setRange: (myRange: Range, inlineCardWithMarkParagraph: HTMLParagraphElement) => {
								myRange.setStart(getFirstTextNode(inlineCardWithMarkParagraph.childNodes[2])!, 5);
								myRange.setEnd(getFirstTextNode(inlineCardWithMarkParagraph.childNodes[2])!, 10);
							},
							expectedPositions: { from: 1867, to: 1868 },
							expectedRangeContents: '://tr',
						},
					],
				])(`%s`, async (_, testItem) => {
					await setup({ smartLinksSsr: ssrEnabled });

					const inlineCardWithMarkParagraph = [...document.querySelectorAll('p')].filter(
						(paragraph) => paragraph.textContent!.includes(prefix),
					)![0];
					const myRange = new Range();
					// This is a fragile, but sets a start position inside the paragraph
					// see the test document for full structure

					testItem.setRange(myRange, inlineCardWithMarkParagraph);

					const posFromRange = getPosFromRange(myRange);

					// coerce the range to a string
					const rangeContents = myRange + '';
					expect(rangeContents).toEqual(testItem.expectedRangeContents);
					expect(posFromRange).toEqual(testItem.expectedPositions);
				});
			});
		});

		describe('when an image is hovered', () => {
			it('should calc the position of the top-level image', async () => {
				await setup({ doc: docWithImage, smartLinksSsr: false });
				const imageContainer = container!.querySelector(
					'#newFileExperienceWrapper',
				)! as HTMLElement;
				const myRange = new Range();
				myRange.setStart(imageContainer, 0);
				myRange.setEnd(imageContainer, 0);

				expect(getPosFromRange(myRange)).toEqual({
					from: 1,
					to: 1,
				});
			});

			it('should calc the position of the caption of the top-level image', async () => {
				await setup({ doc: docWithImage, smartLinksSsr: false });
				const captionContainer = container?.querySelector('[data-media-caption="true"]');
				const myRange = new Range();
				const textNode = captionContainer?.childNodes[0];
				if (textNode) {
					myRange.setStart(textNode, 1);
					myRange.setEnd(textNode, 6);
				}

				expect(getPosFromRange(myRange)).toEqual({ from: 4, to: 9 });
			});

			it('should calc the position of the nested image', async () => {
				await setup({ doc: docWithImageInTable, smartLinksSsr: false });
				const imageContainer = container!.querySelector(
					'#newFileExperienceWrapper',
				)! as HTMLElement;
				const myRange = new Range();
				myRange.setStart(imageContainer, 0);
				myRange.setEnd(imageContainer, 0);

				expect(getPosFromRange(myRange)).toEqual({
					from: 10,
					to: 10,
				});
			});

			it('should calc the position of the caption of nested image', async () => {
				await setup({ doc: docWithImageInTable, smartLinksSsr: false });
				const captionContainer = container?.querySelector('[data-media-caption="true"]');
				const myRange = new Range();
				const textNode = captionContainer?.childNodes[0];
				if (textNode) {
					myRange.setStart(textNode, 0);
					myRange.setEnd(textNode, 4);
				}

				expect(getPosFromRange(myRange)).toEqual({ from: 12, to: 16 });
			});
		});
	});

	describe('#resolvePos', () => {
		ffTest.on('platform_editor_annotation_position_comment_nodes', '', () => {
			it('should not include comment nodes towards calculation', async () => {
				await setup();
				const testElement = document.createElement('p');
				testElement.dataset.rendererStartPos = '5';
				testElement.innerHTML = [
					'Hello ',
					// At time this test was written, inline nodes that are loaded by loadable components were getting
					// surrounded by comment nodes.
					'<!-- data-loadable-begin="vg-Rq:EfLS5:URVzo:4y5Pz:qz-Pe:F4Zdx" -->',
					'<span data-annotation-inline-node="true" data-annotation-mark="true" data-renderer-start-pos="10" data-ssr-placeholder="vg-Rq:EfLS5:URVzo:4y5Pz:qz-Pe:F4Zdx-3"></span>',
					'<!-- data-loadable-end="vg-Rq:EfLS5:URVzo:4y5Pz:qz-Pe:F4Zdx" -->',
					' world!',
				].join('');
				const finalTextNode = testElement.childNodes[testElement.childNodes.length - 1];

				// 14 = start position (5) + 'Hello '.length (6) + inline node (1) + offset (2)
				expect(resolvePos(finalTextNode, 2)).toBe(14);
			});
		});
		describe('when the text node is inside code block', () => {
			it('should return false', async () => {
				await setup();
				const codeBlockElements = container!.querySelectorAll('.code-block');
				const codeBlockNodes: {
					startPos: number;
					endPos: number;
					size: number;
				}[] = [];
				docFromSchema.nodesBetween(0, docFromSchema.nodeSize - 2, (node, pos) => {
					if (node.type.name === 'codeBlock') {
						codeBlockNodes.push({
							startPos: pos,
							endPos: pos + node.nodeSize,
							size: node.nodeSize,
						});
					}
				});
				expect(codeBlockElements.length).toBe(codeBlockNodes.length);
				codeBlockElements.forEach((element, index) => {
					const node = codeBlockNodes[index];
					expect(resolvePos(element, 0)).toBe(false);
					expect(resolvePos(element, node.size)).toBe(false);
				});
			});
		});

		describe('when the node is a text element', () => {
			it('should return the same position as ProseMirror', async () => {
				await setup();
				const firstChild = firstValidParagraph.childNodes[0];
				expect(firstChild).toBeInstanceOf(Text);
				expect(resolvePos(firstChild, 0)).toBe(firstValidParagraphPosition);
			});
		});

		describe('when the node is a HTML element', () => {
			it('should return the same position as ProseMirror', async () => {
				await setup();
				expect(resolvePos(firstValidParagraph, 0)).toBe(firstValidParagraphPosition);
			});
		});

		it('validate all ProseMirror nodes position', async () => {
			await setup();
			const nodePositions: {
				element: HTMLElement;
				startPos: number;
				endPos: number;
				size: number;
			}[] = [];
			docFromSchema.nodesBetween(0, docFromSchema.nodeSize - 2, (node, pos) => {
				const element = container!.querySelector(
					`[data-renderer-start-pos="${pos + DOC_ROOT_OFFSET}"]`,
				) as HTMLElement;

				if (element) {
					nodePositions.push({
						element,
						startPos: pos,
						endPos: pos + node.nodeSize,
						size: node.nodeSize,
					});
				}
			});

			expect(nodePositions.length).toBeGreaterThan(0);

			nodePositions.forEach(({ element, startPos, endPos, size }) => {
				expect(resolvePos(element, 0)).toBe(startPos + DOC_ROOT_OFFSET);
				expect(resolvePos(element, size)).toBe(endPos + DOC_ROOT_OFFSET);
			});
		});

		describe('when the text node is inside text highlight', () => {
			it('should return the same position as ProseMirror', async () => {
				await setup();
				const testElement = document.createElement('p');
				testElement.dataset.rendererStartPos = '7';
				testElement.appendChild(document.createTextNode('Hello '));
				const textHighlighterContainer = document.createElement('span');
				textHighlighterContainer.dataset.highlighted = 'true';
				const textHighlighterText = document.createTextNode('FY20');
				textHighlighterContainer.appendChild(textHighlighterText);
				testElement.appendChild(textHighlighterContainer);

				// 7 + 'Hello '.length + 2
				// 7 + 6 + 2 = 15
				expect(resolvePos(textHighlighterText, 2)).toBe(15);

				// 7 + 6 + 4 = 17
				expect(resolvePos(textHighlighterText, 4)).toBe(17);
			});
		});
	});
});
