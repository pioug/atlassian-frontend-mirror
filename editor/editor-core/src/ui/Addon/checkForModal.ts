/**
 * @see ED-14699 - check if editor is inside a modal to continue to bring cursor to input when
 * any part of the editor container is clicked
 *
 * Handles two cases when a click event is fired:
 *
 * 1. if editor (e.g. comment inside of Jira ticket view) is inside modal then ensure focus and cursor is brought to the input
 * 2. if another modal is open (e.g. delete confirmation modal for confluence table) then ignore clicks as they shouldn't influence editor state
 */
export const checkForModal = (target: HTMLElement | null): boolean => {
	const modalDialog = target?.closest('[role=dialog]');

	if (modalDialog) {
		// return false if not an editor inside modal, otherwise return true
		return !!modalDialog?.querySelector('.akEditor');
	}

	// no modal present so we can return true
	return true;
};
