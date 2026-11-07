import { type RefObject, useCallback, useEffect, useMemo, useState } from 'react';

import type { PopupSelect } from '@atlaskit/select/popup-select';

import type { SelectOption } from './types';

type PopperConfig = NonNullable<PopupSelect<SelectOption, true>['props']['popperProps']>;

const VIEWPORT_PADDING = 8;
const TRIGGER_GAP = 8;
const MAX_MENU_HEIGHT = 300;
const MIN_PREFERRED_SPACE = 180;
// Reserve the footer and container padding until the open popup can be measured.
const INITIAL_EXTRA_HEIGHT = 72;
const INITIAL_CONTROL_HEIGHT = 48;

const viewportModifiers: PopperConfig['modifiers'] = [
	{ name: 'offset', options: { offset: [0, TRIGGER_GAP] } },
	// Placement and height are calculated together; flipping independently can clip the search box.
	{ name: 'flip', enabled: false },
	{
		name: 'preventOverflow',
		enabled: true,
		options: {
			rootBoundary: 'viewport',
			padding: VIEWPORT_PADDING,
			altAxis: true,
			tether: false,
		},
	},
];

type InlinePopupLayout = {
	maxMenuHeight: number;
	placement: 'bottom-start' | 'top-start';
};

export function useInlinePopupLayout(
	isInline: boolean,
	popupRef: RefObject<PopupSelect<SelectOption, true>>,
): {
	maxMenuHeight?: number;
	onClose: () => void;
	onOpen: () => void;
	popperProps?: PopupSelect<SelectOption, true>['props']['popperProps'];
} {
	const [isOpen, setIsOpen] = useState(false);
	const [layout, setLayout] = useState<InlinePopupLayout>({
		maxMenuHeight: MAX_MENU_HEIGHT,
		placement: 'bottom-start',
	});

	const updateLayout = useCallback(() => {
		const popup = popupRef.current;
		const trigger = popup?.targetRef;
		if (!isInline || !trigger) {
			return;
		}

		const viewport = window.visualViewport;
		const viewportTop = viewport?.offsetTop ?? 0;
		const viewportBottom = viewportTop + (viewport?.height ?? window.innerHeight);
		const rect = trigger.getBoundingClientRect();
		const below = Math.max(0, viewportBottom - rect.bottom - TRIGGER_GAP - VIEWPORT_PADDING);
		const above = Math.max(0, rect.top - viewportTop - TRIGGER_GAP - VIEWPORT_PADDING);
		const placement = below >= MIN_PREFERRED_SPACE || below >= above ? 'bottom-start' : 'top-start';
		const available = placement === 'bottom-start' ? below : above;

		const menu = popup.menuRef;
		const list = menu?.querySelector<HTMLElement>('[role="listbox"]');
		const controlHeight =
			popup.selectRef?.select?.controlRef?.offsetHeight ?? INITIAL_CONTROL_HEIGHT;
		// PopupSelect already subtracts the search control from maxMenuHeight. Reserve the
		// remaining chrome separately, including the pagination footer outside its scroll area.
		const extraHeight =
			menu && list
				? Math.max(0, menu.offsetHeight - list.offsetHeight - controlHeight)
				: INITIAL_EXTRA_HEIGHT;
		const maxMenuHeight = Math.max(
			controlHeight,
			Math.min(MAX_MENU_HEIGHT, available - extraHeight),
		);

		setLayout((previous) =>
			previous.placement === placement && previous.maxMenuHeight === maxMenuHeight
				? previous
				: { placement, maxMenuHeight },
		);
	}, [isInline, popupRef]);

	useEffect(() => {
		if (!isInline || !isOpen) {
			return;
		}
		updateLayout();
		const viewport = window.visualViewport;
		const observer =
			typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(updateLayout);
		const menu = popupRef.current?.menuRef;
		if (menu) {
			observer?.observe(menu);
		}
		window.addEventListener('resize', updateLayout);
		window.addEventListener('scroll', updateLayout, true);
		viewport?.addEventListener('resize', updateLayout);
		viewport?.addEventListener('scroll', updateLayout);
		return () => {
			observer?.disconnect();
			window.removeEventListener('resize', updateLayout);
			window.removeEventListener('scroll', updateLayout, true);
			viewport?.removeEventListener('resize', updateLayout);
			viewport?.removeEventListener('scroll', updateLayout);
		};
	}, [isInline, isOpen, popupRef, updateLayout]);

	const onOpen = useCallback(() => {
		if (isInline) {
			updateLayout();
			setIsOpen(true);
		}
	}, [isInline, updateLayout]);
	const onClose = useCallback(() => setIsOpen(false), []);
	const popperProps = useMemo(
		() => ({ placement: layout.placement, modifiers: viewportModifiers }),
		[layout.placement],
	);
	return {
		onOpen,
		onClose,
		maxMenuHeight: isInline ? layout.maxMenuHeight : undefined,
		popperProps: isInline ? popperProps : undefined,
	};
}
