export let cssIssueOccurrence: number = 0;

export default function trackDisplayContentsOccurrence(element: HTMLElement): void {
	const computedStyle = window.getComputedStyle(element);
	if (computedStyle.display === 'contents') {
		cssIssueOccurrence++;
	}
}

export function resetCssIssueOccurrence(): void {
	cssIssueOccurrence = 0;
}
