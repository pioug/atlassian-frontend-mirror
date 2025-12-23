import {
	TYPEWRITER_CYCLE_DELAY,
	TYPEWRITER_ERASE_DELAY,
	TYPEWRITER_PAUSE_BEFORE_ERASE,
	TYPEWRITER_TYPE_DELAY,
} from './constants';

export const cycleThroughPlaceholderPrompts = (
	placeholderPrompts: string[],
	activeTypewriterTimeouts: (() => void)[] | undefined,
	placeholderNodeWithText: HTMLElement,
	initialDelayWhenUserTypedAndDeleted: number = 0,
): void => {
	let currentPromptIndex = 0;
	let displayedText = '';
	let animationTimeouts: (number | NodeJS.Timeout)[] = [];

	const clearAllTimeouts = () => {
		animationTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
		animationTimeouts = [];
	};

	const scheduleTimeout = (callback: () => void, delay: number): number | NodeJS.Timeout => {
		const timeoutId = setTimeout(callback, delay);
		animationTimeouts.push(timeoutId);
		return timeoutId;
	};

	const startAnimationCycle = () => {
		const currentPrompt = placeholderPrompts[currentPromptIndex];

		let characterIndex = 0;
		const typeNextCharacter = () => {
			if (characterIndex < currentPrompt.length) {
				displayedText = currentPrompt.substring(0, characterIndex + 1);
				placeholderNodeWithText.textContent = displayedText;
				characterIndex++;
				scheduleTimeout(typeNextCharacter, TYPEWRITER_TYPE_DELAY);
			} else {
				scheduleTimeout(eraseLastCharacter, TYPEWRITER_PAUSE_BEFORE_ERASE);
			}
		};

		const eraseLastCharacter = () => {
			if (displayedText.length > 1) {
				displayedText = displayedText.substring(0, displayedText.length - 1);
				placeholderNodeWithText.textContent = displayedText;
				scheduleTimeout(eraseLastCharacter, TYPEWRITER_ERASE_DELAY);
			} else {
				displayedText = ' ';
				placeholderNodeWithText.textContent = displayedText;
				currentPromptIndex = (currentPromptIndex + 1) % placeholderPrompts.length;
				scheduleTimeout(startAnimationCycle, TYPEWRITER_CYCLE_DELAY);
			}
		};

		typeNextCharacter();
	};

	activeTypewriterTimeouts?.push(clearAllTimeouts);

	if (initialDelayWhenUserTypedAndDeleted > 0) {
		placeholderNodeWithText.textContent = ' ';
		scheduleTimeout(startAnimationCycle, initialDelayWhenUserTypedAndDeleted);
	} else {
		startAnimationCycle();
	}
};
