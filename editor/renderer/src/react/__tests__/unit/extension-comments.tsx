import React from 'react';

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';

import { AnnotationMarkStates } from '@atlaskit/adf-schema/annotation';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { AnnotationUpdateEmitter, AnnotationUpdateEvent } from '@atlaskit/editor-common/types';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { ReactSerializer } from '../../../index';
import { InlineCommentsStateContext, ProvidersContext } from '../../../ui/annotations/context';
import { ExtensionComments } from '../../nodes/extension-comments';

describe('Renderer extension comment badge', () => {
	const gate = 'cc_maui_annotations_on_extensions';
	const marks = ['first', 'second', 'resolved', 'unknown'].map((id) =>
		defaultSchema.marks.annotation.create({ id, annotationType: 'inlineComment' }),
	);
	const renderBadge = (
		enabled = true,
		states = {
			first: AnnotationMarkStates.ACTIVE,
			second: AnnotationMarkStates.ACTIVE,
			resolved: AnnotationMarkStates.RESOLVED,
		},
	) => {
		const subscriber = new AnnotationUpdateEmitter();
		const onComment = jest.fn();
		subscriber.on(AnnotationUpdateEvent.ON_ANNOTATION_CLICK, onComment);
		const result = render(
			<IntlProvider locale="en">
				<ProvidersContext.Provider
					value={{ inlineComment: { getState: async () => [], updateSubscriber: subscriber } }}
				>
					<InlineCommentsStateContext.Provider value={states}>
						{/* Fixture for the renderer's existing extension DOM contract. */}
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop */}
						<div className="ak-renderer-extension" data-testid="chart">
							<ExtensionComments enabled={enabled} marks={marks}>
								<button>Chart interaction</button>
							</ExtensionComments>
						</div>
					</InlineCommentsStateContext.Provider>
				</ProvidersContext.Provider>
			</IntlProvider>,
		);
		return { ...result, subscriber, onComment };
	};

	it('does not render a badge when the node predicate rejects the extension', () => {
		renderBadge(false);
		expect(screen.queryByRole('button', { name: 'View comments' })).not.toBeInTheDocument();
	});

	it('does not render resolved or unknown threads', () => {
		renderBadge(true, {
			first: AnnotationMarkStates.RESOLVED,
			second: AnnotationMarkStates.RESOLVED,
			resolved: AnnotationMarkStates.RESOLVED,
		});
		expect(screen.queryByRole('button', { name: 'View comments' })).not.toBeInTheDocument();
	});

	it('opens all unresolved threads anchored to the chart, without hijacking chart clicks', async () => {
		const { onComment } = renderBadge();
		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: 'Chart interaction' }));
		expect(onComment).not.toHaveBeenCalled();
		await user.click(screen.getByRole('button', { name: 'View comments' }));
		expect(onComment).toHaveBeenCalledWith(
			expect.objectContaining({
				annotationIds: ['first', 'second'],
				eventTarget: screen.getByTestId('chart'),
				eventTargetType: 'extension',
			}),
		);
	});

	it.each(['{Enter}', ' '])('opens threads with keyboard activation %s', async (key) => {
		const { onComment } = renderBadge();
		const user = userEvent.setup();
		await user.tab();
		await user.tab();
		expect(screen.getByRole('button', { name: 'View comments' })).toHaveFocus();
		await user.keyboard(key);
		expect(onComment).toHaveBeenCalledTimes(1);
	});

	it('remains accessible when the provider focuses and unfocuses a thread', async () => {
		const { container, subscriber } = renderBadge();
		const badge = screen.getByRole('button', { name: 'View comments' });
		const defaultClass = badge.className;
		act(() =>
			subscriber.emit(AnnotationUpdateEvent.SET_ANNOTATION_FOCUS, { annotationId: 'second' }),
		);
		expect(badge.className).not.toBe(defaultClass);
		await expect(container).toBeAccessible();
		act(() => subscriber.emit(AnnotationUpdateEvent.REMOVE_ANNOTATION_FOCUS));
		expect(badge.className).toBe(defaultClass);
		expect(screen.getByRole('button', { name: 'View comments' })).toBeInTheDocument();
	});

	it('serializes extension annotations as non-interactive sibling anchors', async () => {
		passGate(gate);
		const doc = defaultSchema.nodeFromJSON({
			type: 'doc',
			content: [
				{
					type: 'extension',
					attrs: { extensionType: 'test', extensionKey: 'chart' },
					marks: [{ type: 'annotation', attrs: { id: 'first', annotationType: 'inlineComment' } }],
				},
			],
		});
		const serializer = new ReactSerializer({
			allowAnnotations: true,
			objectContext: { adDoc: doc.toJSON() },
			extensionHandlers: { test: () => <button>Chart interaction</button> },
		});
		const subscriber = new AnnotationUpdateEmitter();
		const onComment = jest.fn();
		const isBlockNodeSupported = jest.fn(() => true);
		subscriber.on(AnnotationUpdateEvent.ON_ANNOTATION_CLICK, onComment);
		const { container } = render(
			<IntlProvider locale="en">
				<ProvidersContext.Provider
					value={{
						inlineComment: {
							isBlockNodeSupported,
							getState: async () => [],
							updateSubscriber: subscriber,
						},
					}}
				>
					<InlineCommentsStateContext.Provider value={{ first: AnnotationMarkStates.ACTIVE }}>
						{serializer.serializeFragment(doc.content)}
					</InlineCommentsStateContext.Provider>
				</ProvidersContext.Provider>
			</IntlProvider>,
		);
		const marker = container.querySelector('#first');
		expect(isBlockNodeSupported).toHaveBeenCalledWith(doc.firstChild);
		expect(screen.getByTestId('extension--wrapper')).toHaveAttribute(
			'data-inline-comments-target',
			'true',
		);
		expect(marker?.tagName).toBe('DIV');
		expect(marker).toHaveAttribute('data-block-mark', 'true');
		expect(marker).not.toHaveAttribute('role', 'button');
		expect(marker).not.toHaveAttribute('tabindex');
		expect(marker).not.toContainElement(screen.getByRole('button', { name: 'Chart interaction' }));
		expect(marker).toHaveStyle({ position: 'absolute', pointerEvents: 'none' });
		await userEvent.setup().click(await screen.findByRole('button', { name: 'View comments' }));
		expect(onComment).toHaveBeenCalledWith(
			expect.objectContaining({
				eventTarget: screen
					.getByRole('button', { name: 'Chart interaction' })
					.closest('.ak-renderer-extension'),
				annotationIds: ['first'],
			}),
		);
		await expect(container).toBeAccessible();
	});

	it('does not expose extension comment UI when the annotations gate is disabled', () => {
		failGate(gate);
		const doc = defaultSchema.nodeFromJSON({
			type: 'doc',
			content: [
				{
					type: 'extension',
					attrs: { extensionType: 'test', extensionKey: 'chart' },
					marks: [{ type: 'annotation', attrs: { id: 'first', annotationType: 'inlineComment' } }],
				},
			],
		});
		const serializer = new ReactSerializer({
			allowAnnotations: true,
			objectContext: { adDoc: doc.toJSON() },
			extensionHandlers: { test: () => <div>Chart</div> },
		});
		const isBlockNodeSupported = jest.fn(() => true);
		const { container } = render(
			<IntlProvider locale="en">
				<ProvidersContext.Provider
					value={{ inlineComment: { getState: async () => [], isBlockNodeSupported } }}
				>
					<InlineCommentsStateContext.Provider value={{ first: AnnotationMarkStates.ACTIVE }}>
						{serializer.serializeFragment(doc.content)}
					</InlineCommentsStateContext.Provider>
				</ProvidersContext.Provider>
			</IntlProvider>,
		);

		expect(isBlockNodeSupported).not.toHaveBeenCalled();
		expect(screen.getByTestId('extension--wrapper')).not.toHaveAttribute(
			'data-inline-comments-target',
		);
		expect(container.querySelector('[aria-label="View comments"]')).not.toBeInTheDocument();
	});
});
