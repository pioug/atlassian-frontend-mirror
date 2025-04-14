import { fg } from '@atlaskit/platform-feature-flags';

import { type VCIgnoreReason } from '../../../common/vc/types';
import { shouldHandleEditorLnv } from '../../../config';
import { markProfilingEnd, markProfilingStart, withProfiling } from '../../../self-measurements';
import { isContainedWithinMediaWrapper } from '../media-wrapper/vc-utils';

import { EditorLnvHandler } from './editor-lnv';
import isNonVisualStyleMutation from './non-visual-styles/is-non-visual-style-mutation';
import { SSRPlaceholderHandlers } from './ssr-placeholders';
import type {
	BrowserObservers,
	Callback,
	MutationRecordWithTimestamp,
	ObservedMutationType,
} from './types';

export type { ObservedMutationType } from './types';

const state = {
	normal: 1,
	waitingForFirstRender: 2,
	ignoring: 3,
};

type SSRInclusiveState = {
	state: number;
	reactRootElement: null | HTMLElement;
	renderStop: number;
	renderStart: number;
};

type ObservedMutationMapValue = {
	mutation: MutationRecordWithTimestamp;
	ignoreReason?: VCIgnoreReason;
	type: ObservedMutationType;
	attributeName?: string | null;
	oldValue?: string | null;
	newValue?: string | null;
};

export type SelectorConfig = {
	id: boolean;
	testId: boolean;
	role: boolean;
	className: boolean;
	dataVC?: boolean;
};

type ConstructorOptions = {
	selectorConfig: SelectorConfig;
};

const isElementVisible = withProfiling(
	function isElementVisible(target: Element): boolean {
		if (!target || typeof target.checkVisibility !== 'function') {
			return true;
		}

		const isVisible = target.checkVisibility({
			contentVisibilityAuto: true,
			opacityProperty: true,
			visibilityProperty: true,
		} as CheckVisibilityOptions);

		return isVisible;
	},
	['vc'],
);

const isInsideEditorContainer = withProfiling(
	function isInsideEditorContainer(target: Element): boolean {
		if (!target || typeof target.closest !== 'function') {
			return false;
		}

		return Boolean(target.closest('.ProseMirror'));
	},
	['vc'],
);

export class Observers implements BrowserObservers {
	private intersectionObserver: IntersectionObserver | null;

	private mutationObserver: MutationObserver | null;

	private observedMutations: WeakMap<Element, ObservedMutationMapValue> = new WeakMap();

	private elementsInView = new Set();

	private callbacks = new Set<Callback>();

	private totalTime = 0;

	private _startMeasureTimestamp = -1;

	private ssrPlaceholderHandler: SSRPlaceholderHandlers;
	private editorLnvHandler: EditorLnvHandler;

	private ssr: SSRInclusiveState = {
		state: state.normal,
		reactRootElement: null,
		renderStart: -1,
		renderStop: -1,
	};

	private selectorConfig: SelectorConfig = {
		id: false,
		testId: false,
		role: false,
		className: true,
		dataVC: true,
	};

	constructor(opts: ConstructorOptions) {
		const operationTimer = markProfilingStart('Observers constructor');
		this.selectorConfig = {
			...this.selectorConfig,
			...opts.selectorConfig,
		};
		this.intersectionObserver = this.getIntersectionObserver();
		this.mutationObserver = this.getMutationObserver();
		this.ssrPlaceholderHandler = new SSRPlaceholderHandlers();
		this.editorLnvHandler = new EditorLnvHandler();
		this.isBrowserSupported = withProfiling(this.isBrowserSupported.bind(this), ['vc']);
		this.observe = withProfiling(this.observe.bind(this), ['vc']);
		this.disconnect = withProfiling(this.disconnect.bind(this), ['vc']);
		this.subscribeResults = withProfiling(this.subscribeResults.bind(this), ['vc']);
		this.getTotalTime = withProfiling(this.getTotalTime.bind(this), ['vc']);
		this.setReactRootElement = withProfiling(this.setReactRootElement.bind(this), ['vc']);
		this.setReactRootRenderStart = withProfiling(this.setReactRootRenderStart.bind(this), ['vc']);
		this.setReactRootRenderStop = withProfiling(this.setReactRootRenderStop.bind(this), ['vc']);
		this.observeElement = withProfiling(this.observeElement.bind(this), ['vc']);
		this.getMutationObserver = withProfiling(this.getMutationObserver.bind(this), ['vc']);
		this.getElementName = withProfiling(this.getElementName.bind(this), ['vc']);
		this.getIntersectionObserver = withProfiling(this.getIntersectionObserver.bind(this), ['vc']);
		this.measureStart = withProfiling(this.measureStart.bind(this), ['vc']);
		this.measureStop = withProfiling(this.measureStop.bind(this), ['vc']);
		markProfilingEnd(operationTimer, { tags: ['vc'] });
	}

	isBrowserSupported() {
		return (
			typeof window.IntersectionObserver === 'function' &&
			typeof window.MutationObserver === 'function'
		);
	}

	observe() {
		this.totalTime = 0;
		this.ssr = {
			state: state.normal,
			reactRootElement: null,
			renderStart: -1,
			renderStop: -1,
		};
		this.mutationObserver?.observe(document.body, {
			attributeFilter: ['hidden', 'style', 'src', 'class'],
			attributeOldValue: true,
			attributes: true,
			childList: true,
			subtree: true,
		});
	}

	disconnect() {
		this.mutationObserver?.disconnect();
		this.intersectionObserver?.disconnect();
		this.observedMutations = new WeakMap();
		this.elementsInView = new Set();
		this.callbacks = new Set();
		this.ssr.reactRootElement = null;
		this.ssrPlaceholderHandler.clear();
		this.editorLnvHandler.clear();
	}

	subscribeResults = (cb: Callback) => {
		this.callbacks.add(cb);
	};

	getTotalTime() {
		return this.totalTime;
	}

	setReactRootElement(element: HTMLElement) {
		this.ssr.reactRootElement = element;
	}

	setReactRootRenderStart(startTime = performance.now()) {
		this.ssr.renderStart = startTime;
		this.ssr.state = state.waitingForFirstRender;
	}

	setReactRootRenderStop(stopTime = performance.now()) {
		this.ssr.renderStop = stopTime;
	}

	private observeElement = (
		node: HTMLElement,
		mutation: MutationRecordWithTimestamp,
		type: ObservedMutationType,
		ignoreReason: VCIgnoreReason,
		attributeName?: string | null,
		oldValue: string | null = null,
		newValue: string | null = null,
	) => {
		this.intersectionObserver?.observe(node);
		if (fg('platform_ufo_log_attr_mutation_values')) {
			this.observedMutations.set(node, {
				mutation,
				ignoreReason,
				type,
				attributeName,
				oldValue,
				newValue,
			});
		} else {
			this.observedMutations.set(node, {
				mutation,
				ignoreReason,
				type,
			});
		}
	};

	private getMutationObserver() {
		if (!this.isBrowserSupported()) {
			return null;
		}

		const shouldHandleEditorLnvLocal = shouldHandleEditorLnv();

		return new MutationObserver((mutations) => {
			const operationTimer = markProfilingStart('mutationObserverCallback');
			this.measureStart();

			mutations.forEach((mutation: MutationRecordWithTimestamp) => {
				// patching element if timestamp not automatically added
				// eslint-disable-next-line no-param-reassign
				mutation.timestamp =
					mutation.timestamp === undefined ? performance.now() : mutation.timestamp;

				let ignoreReason: VCIgnoreReason = '';

				if (
					this.ssr.state === state.waitingForFirstRender &&
					mutation.timestamp > this.ssr.renderStart &&
					mutation.target === this.ssr.reactRootElement
				) {
					this.ssr.state = state.ignoring;
					if (this.ssr.renderStop === -1) {
						// arbitrary 500ms DOM update window
						this.ssr.renderStop = mutation.timestamp + 500;
					}
					ignoreReason = 'ssr-hydration';
				}

				if (
					this.ssr.state === state.ignoring &&
					mutation.timestamp > this.ssr.renderStart &&
					mutation.target === this.ssr.reactRootElement
				) {
					if (mutation.timestamp <= this.ssr.renderStop) {
						ignoreReason = 'ssr-hydration';
					} else {
						this.ssr.state = state.normal;
					}
				}

				if (mutation.type === 'childList') {
					mutation.addedNodes.forEach((node) => {
						if (isContainedWithinMediaWrapper(node)) {
							ignoreReason = 'image';
						}

						if (
							node instanceof HTMLElement
							/* && !node instanceof HTMLStyleElement && !node instanceof HTMLScriptElement && !node instanceof HTMLLinkElement */
						) {
							if (
								this.ssrPlaceholderHandler.isPlaceholder(node) ||
								this.ssrPlaceholderHandler.isPlaceholderIgnored(node)
							) {
								this.ssrPlaceholderHandler.checkIfExistedAndSizeMatching(node).then((result) => {
									if (result === false) {
										this.observeElement(node, mutation, 'html', ignoreReason);
									}
								});
								return;
							}

							if (
								this.ssrPlaceholderHandler.isPlaceholderReplacement(node) ||
								this.ssrPlaceholderHandler.isPlaceholderIgnored(node)
							) {
								this.ssrPlaceholderHandler
									.validateReactComponentMatchToPlaceholder(node)
									.then((result) => {
										if (result === false) {
											this.observeElement(node, mutation, 'html', ignoreReason);
										}
									});
								return;
							}

							if (shouldHandleEditorLnvLocal) {
								if (this.editorLnvHandler.shouldHandleAddedNode(node)) {
									this.editorLnvHandler.handleAddedNode(node).then(({ shouldIgnore }) => {
										this.observeElement(
											node,
											mutation,
											'html',
											shouldIgnore ? 'editor-lazy-node-view' : ignoreReason,
										);
									});
									return;
								}
							}
							this.observeElement(node, mutation, 'html', ignoreReason);
						}
						if (node instanceof Text && node.parentElement != null) {
							this.observeElement(node.parentElement, mutation, 'text', ignoreReason);
						}
					});
					mutation.removedNodes.forEach((node) => {
						if (node instanceof Element) {
							this.elementsInView.delete(node);
							this.intersectionObserver?.unobserve(node);
						}
					});
				} else if (mutation.type === 'attributes') {
					if (mutation.target instanceof HTMLElement) {
						const attributeName = mutation.attributeName;
						if (fg('platform_ufo_vc_ignore_same_value_mutation')) {
							/*
								"MutationObserver was explicitly designed to work that way, but I can't now recall the reasoning.
								I think it might have been something along the lines that for consistency every setAttribute call should create a record.
								Conceptually there is after all a mutation: there is an old value replaced with a new one,
								and whether or not they are the same doesn't really matter.
								And Custom elements should work the same way as MutationObserver."
								https://github.com/whatwg/dom/issues/520#issuecomment-336574796
							*/
							const oldValue = mutation.oldValue ?? undefined;
							const newValue = attributeName
								? mutation.target.getAttribute(attributeName)
								: undefined;
							if (oldValue !== newValue) {
								if (isNonVisualStyleMutation(mutation)) {
									ignoreReason = 'non-visual-style';
								}
								if (fg('platform_ufo_vc_fix_ignore_image_mutation')) {
									if (isContainedWithinMediaWrapper(mutation.target)) {
										ignoreReason = 'image';
									}
								}
								this.observeElement(
									mutation.target,
									mutation,
									'attr',
									ignoreReason,
									attributeName,
									oldValue,
									newValue,
								);
							}
						} else {
							if (isNonVisualStyleMutation(mutation)) {
								ignoreReason = 'non-visual-style';
							}
							if (fg('platform_ufo_vc_fix_ignore_image_mutation')) {
								if (isContainedWithinMediaWrapper(mutation.target)) {
									ignoreReason = 'image';
								}
							}
							this.observeElement(mutation.target, mutation, 'attr', ignoreReason, attributeName);
						}
					}
				}
			});

			markProfilingEnd(operationTimer, { tags: ['vc'] });
		});
	}

	private getElementName(element: HTMLElement) {
		try {
			const tagName = element.localName;
			const dataVCAttr = element.getAttribute('data-vc');
			const dataVC = this.selectorConfig.dataVC && dataVCAttr ? `[data-vc="${dataVCAttr}"]` : '';
			const id = this.selectorConfig.id && element.id ? `#${element.id}` : '';
			let testId = this.selectorConfig.testId
				? element.getAttribute('data-testid') || element.getAttribute('data-test-id')
				: '';
			testId = testId ? `[testid=${testId}]` : '';
			let role = this.selectorConfig.role ? element.getAttribute('role') : '';
			role = role ? `[role=${role}]` : '';
			let classList = this.selectorConfig.className ? Array.from(element.classList).join('.') : '';
			classList = classList === '' ? '' : `.${classList}`;
			const attrs = dataVC ? dataVC : [id, testId, role].join('');

			let idString = '';

			if (attrs === '' && classList === '') {
				const parent = element.parentElement
					? this.getElementName(element.parentElement)
					: 'unknown';
				idString = `${parent} > ${tagName}`;
			} else {
				idString = [tagName, attrs || classList].join('');
			}

			return idString;
		} catch (e) {
			return 'error';
		}
	}

	private getIntersectionObserver() {
		if (!this.isBrowserSupported()) {
			return null;
		}

		return new IntersectionObserver((entries) => {
			const operationTimer = markProfilingStart('intersectionObserverCallback');
			this.measureStart();
			entries.forEach(({ isIntersecting, intersectionRect: ir, target }) => {
				const data = this.observedMutations.get(target);
				this.observedMutations.delete(target);

				if (isIntersecting && ir.width > 0 && ir.height > 0) {
					if (!(target instanceof HTMLElement)) {
						return;
					}

					if (!data?.mutation) {
						// ignore intersection report without recent mutation
						return;
					}

					if (!isElementVisible(target)) {
						data.ignoreReason = 'not-visible';
					}

					if (fg('platform_editor_ed-25937_ignore_mutations_for_ttvc')) {
						if (isInsideEditorContainer(target)) {
							data.ignoreReason = 'editor-container-mutation';
						}
					}

					this.callbacks.forEach((callback) => {
						let elementName;
						try {
							elementName = this.getElementName(target);
						} catch (e) {
							elementName = 'error';
						}
						callback(
							data.mutation.timestamp || performance.now(),
							ir,
							elementName,
							target,
							data.type,
							data.ignoreReason,
							data.attributeName,
							data.oldValue,
							data.newValue,
						);
					});

					this.elementsInView.add(target);
				} else {
					this.elementsInView.delete(target);
				}
			});
			this.measureStop();
			markProfilingEnd(operationTimer, { tags: ['vc'] });
		});
	}

	private measureStart() {
		this._startMeasureTimestamp = performance.now();
	}

	private measureStop() {
		if (this._startMeasureTimestamp === -1) {
			return;
		}
		this.totalTime += performance.now() - this._startMeasureTimestamp;
		this._startMeasureTimestamp = -1;
	}
}
