import type { EmojiProvider } from '@atlaskit/emoji';

const DEFAULT_TONE = 0;
const SELECTED_TONE_CHANGED_EVENT = 'SELECTED_TONE_CHANGED_EVENT';

function proxySetSelectedTone(emojiProvider: EmojiProvider) {
	return new Proxy(emojiProvider, {
		get(target, key, receiver) {
			// Look for setSelectedTone property access
			if (key === 'setSelectedTone' && typeof target.setSelectedTone === 'function') {
				// Then apply proxy for the function call
				return new Proxy(target.setSelectedTone, {
					apply(applyTarget, thisArgs, args) {
						// Execute the tone selection update
						Reflect.apply(applyTarget, thisArgs, args);
						// Emit deferred event
						const tone = args.length > 0 ? args[0] : DEFAULT_TONE;
						setTimeout(() => {
							try {
								window.dispatchEvent(
									new CustomEvent(SELECTED_TONE_CHANGED_EVENT, { detail: { tone } }),
								);
								// eslint-disable-next-line no-unused-vars
							} catch (_error) {
								// TODO(TC-13359): Log warning to Sentry when monitoring is set up
								// logMessage(`[proxySetSelectedTone] Error setting selected tone`, 'warning', {
								// 	error: _error,
								// 	selectedTone: tone,
								// });
							}
						});
					},
				});
			}
			// Everything else, fallback to target directly
			return Reflect.get(target, key, receiver);
		},
	});
}

export const withSelectedToneEmitter = async (
	promise: Promise<EmojiProvider>,
): Promise<EmojiProvider> => proxySetSelectedTone(await promise);
