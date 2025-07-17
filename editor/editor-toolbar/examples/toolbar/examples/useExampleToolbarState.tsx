import { useState } from 'react';

type TextStyle =
	| 'normal'
	| 'heading1'
	| 'heading2'
	| 'heading3'
	| 'heading4'
	| 'heading5'
	| 'heading6'
	| 'quote';
type Formatting =
	| 'bold'
	| 'italic'
	| 'underline'
	| 'strikethrough'
	| 'code'
	| 'subscript'
	| 'superscript';
type Pinning = 'none' | 'pinned';
type ListOrAlignment = 'none' | 'left' | 'center' | 'right' | 'bulleted' | 'numbered';

export const useExampleToolbarState = () => {
	const [textStyle, setTextStyle] = useState<TextStyle>('normal');
	const [formatting, setFormatting] = useState<Partial<Record<Formatting, boolean>>>({});
	const [listOrAlignment, setListOrAlignment] = useState<ListOrAlignment>('none');
	const [pinning, setPinning] = useState<Pinning>('none');
	const [lastAction, setLastAction] = useState<string | null>(null);

	const onSetTextStyle = (style: TextStyle) => () => {
		setTextStyle(style);
	};

	const onToggleFormatting = (format: Formatting) => () => {
		setFormatting((prev) => {
			if (format === 'code') {
				return {
					code: !prev.code,
				};
			} else if (prev.code) {
				return prev;
			}
			return {
				...prev,
				[format]: !prev[format],
			};
		});
	};

	const onToggleListOrAlignment = (newListOrAlignment: ListOrAlignment) => () => {
		setListOrAlignment((prev) => {
			const isList = (value: ListOrAlignment) => value === 'bulleted' || value === 'numbered';
			if (isList(prev) && !isList(newListOrAlignment)) {
				return prev;
			}
			if (prev === newListOrAlignment) {
				return 'none';
			}
			return newListOrAlignment;
		});
	};

	const onTogglePinning = () => {
		setPinning((prev) => (prev === 'none' ? 'pinned' : 'none'));
	};

	const onClick = (action: string, callback?: () => void) => () => {
		callback?.();
		setLastAction(action);
	};

	console.log('rendering with list or alignment:', listOrAlignment);

	return {
		textStyle,
		onSetTextStyle,
		formatting,
		onToggleFormatting,
		listOrAlignment,
		onToggleListOrAlignment,
		pinning,
		onTogglePinning,
		onClick,
		lastAction,
	};
};
