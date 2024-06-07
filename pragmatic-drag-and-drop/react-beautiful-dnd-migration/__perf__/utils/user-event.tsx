import { fireEvent } from '@testing-library/react';

export function setElementFromPoint(el: Element | null): () => void {
	const original = document.elementFromPoint;

	document.elementFromPoint = () => el;

	return () => {
		document.elementFromPoint = original;
	};
}

const sloppyClickThreshold = 5;

const keyCodes = {
	tab: 9,
	enter: 13,
	escape: 27,
	space: 32,
	pageUp: 33,
	pageDown: 34,
	end: 35,
	home: 36,
	arrowLeft: 37,
	arrowUp: 38,
	arrowRight: 39,
	arrowDown: 40,
};

function getTransitionEnd(propertyName: string = 'transform'): Event {
	const event: Event = new Event('transitionend', {
		bubbles: true,
		cancelable: true,
	});
	// cheating and adding property to event as TransitionEvent constructor does not exist
	// @ts-expect-error
	event.propertyName = propertyName;
	return event;
}

export async function waitForAnimationFrame(): Promise<unknown> {
	return new Promise(requestAnimationFrame);
}

type UserEventController = {
	/**
	 * If no `dragHandle` is specified then the `element` will be used as the
	 * drag handle.
	 */
	lift(args: { element: HTMLElement; dragHandle?: HTMLElement }): void;
	drop(args: { dragHandle: HTMLElement }): void;
	cancel(args: { dragHandle: HTMLElement }): void;
	dragOver(args: { dragHandle: HTMLElement; target: HTMLElement }): Promise<void>;
	dragAndDrop(args: {
		element: HTMLElement;
		dragHandle?: HTMLElement;
		target: HTMLElement;
	}): Promise<void>;
};

type UserEvent = {
	rbdMouse: UserEventController;
	nativePointer: UserEventController;
};

async function dragAndDrop(
	controller: UserEventController,
	args: {
		element: HTMLElement;
		dragHandle: HTMLElement;
		target: HTMLElement;
	},
) {
	controller.lift(args);
	await controller.dragOver(args);
	controller.drop(args);
}

export const userEvent: UserEvent = {
	rbdMouse: {
		lift({ element, dragHandle = element }) {
			fireEvent.mouseDown(dragHandle);
			fireEvent.mouseMove(dragHandle, {
				clientX: 0,
				clientY: sloppyClickThreshold,
			});
		},
		async dragOver({ dragHandle, target }) {
			const initialRect = dragHandle.getBoundingClientRect();
			const targetRect = target.getBoundingClientRect();

			fireEvent.mouseMove(dragHandle, {
				clientX: targetRect.x - initialRect.x,
				clientY: targetRect.y - initialRect.y,
			});

			await waitForAnimationFrame();
		},
		async dragAndDrop({ element, dragHandle = element, target }) {
			await dragAndDrop(userEvent.rbdMouse, { element, dragHandle, target });
		},
		drop({ dragHandle }) {
			fireEvent.mouseUp(dragHandle);
			fireEvent(dragHandle, getTransitionEnd());
		},
		cancel({ dragHandle }) {
			fireEvent.keyDown(dragHandle, { keyCode: keyCodes.escape });
		},
	},

	nativePointer: {
		lift({ element, dragHandle = element }) {
			const cleanupSetElementFromPoint = setElementFromPoint(dragHandle);
			fireEvent.dragStart(element);
			cleanupSetElementFromPoint();
		},
		async dragOver({ target }) {
			fireEvent.dragOver(target);
		},
		async dragAndDrop({ element, dragHandle = element, target }) {
			await dragAndDrop(userEvent.nativePointer, {
				element,
				dragHandle,
				target,
			});
		},
		drop({ dragHandle }) {
			fireEvent.drop(dragHandle);
		},
		cancel({ dragHandle }) {
			fireEvent.dragEnd(dragHandle);
		},
	},
};
