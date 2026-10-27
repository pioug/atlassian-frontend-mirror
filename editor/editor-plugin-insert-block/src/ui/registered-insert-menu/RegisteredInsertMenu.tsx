/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { useIntl } from 'react-intl';

import { cssMap, jsx } from '@atlaskit/css';
import { insertSelectedItem } from '@atlaskit/editor-common/insert';
import type { InsertContentCallback } from '@atlaskit/editor-common/insert';
import { toolbarInsertBlockMessages } from '@atlaskit/editor-common/messages/insert-block';
import { MENU } from '@atlaskit/editor-common/quick-insert/keys';
import type {
	RegisteredMenuContextValue,
	RegisteredMenuInteraction,
	RegisteredMenuSelection,
} from '@atlaskit/editor-common/registered-menu';
import { RegisteredMenuContext } from '@atlaskit/editor-common/registered-menu/context';
import { createRegisteredMenuSurfaceContext } from '@atlaskit/editor-common/registered-menu/surface-context';
import { typeAheadListMessages } from '@atlaskit/editor-common/type-ahead/messages';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { RegisterComponent } from '@atlaskit/editor-ui-control-model/types';
import { Box } from '@atlaskit/primitives/compiled/box';
import Textfield from '@atlaskit/textfield/text-field';
import { token } from '@atlaskit/tokens';

const DEFAULT_MENU_MAX_HEIGHT = 520;
const SEARCH_HEIGHT = 64;
const styles = cssMap({
	menu: {
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('radius.large'),
		boxShadow: token('elevation.shadow.overlay'),
		display: 'flex',
		flexDirection: 'column',
		overflow: 'hidden',
		width: '350px',
	},
	hidden: { display: 'none' },
	search: {
		flexShrink: 0,
		paddingBlockStart: token('space.150'),
		paddingBlockEnd: token('space.100'),
		paddingInline: token('space.150'),
	},
});

type Props = {
	components: RegisterComponent[];
	editorView: EditorView;
	isOffline: boolean;
	maxHeight?: number;
	onClose: () => void;
	onSelect: () => void;
};

export const RegisteredInsertMenu = (props: Props): React.JSX.Element => {
	const { components, editorView, isOffline, onSelect } = props;
	const { formatMessage } = useIntl();
	const [interaction, setInteraction] = useState<RegisteredMenuInteraction>();
	const registerInteraction = useCallback((next: RegisteredMenuInteraction) => {
		setInteraction(next);
		return () => setInteraction((current) => (current === next ? undefined : current));
	}, []);
	const searchRef = useRef<HTMLInputElement>(null);
	const hasInteraction = Boolean(interaction);
	useLayoutEffect(() => {
		if (hasInteraction) {
			searchRef.current?.focus({ preventScroll: true });
		}
	}, [hasInteraction]);
	const maxHeight = props.maxHeight ?? DEFAULT_MENU_MAX_HEIGHT;
	const menuStyle = useMemo(() => ({ maxHeight }), [maxHeight]);
	const [menuOpenId] = useState(() => Symbol('registered-insert-menu-open'));
	const [query, setQuery] = useState('');
	const surfaceContext = useMemo(
		() => createRegisteredMenuSurfaceContext({ menuOpenId, surface: 'toolbar' }),
		[menuOpenId],
	);
	const Root = useMemo(
		() =>
			components.find(
				({ key, type, parents }) => key === MENU.key && type === MENU.type && !parents?.length,
			)?.component,
		[components],
	);
	// Interaction updates should not recreate the registered component's own props.
	const menu = useMemo(() => Root && <Root>{null}</Root>, [Root]);
	const select = useCallback(
		(selection: RegisteredMenuSelection) => {
			onSelect();
			queueMicrotask(() => {
				const { state } = editorView;
				const insert: InsertContentCallback = (content, options = {}) =>
					insertSelectedItem(content, options)(state, state.tr, state.selection.head);
				const transaction = selection(insert);
				if (transaction) {
					editorView.dispatch(transaction);
				}
			});
		},
		[editorView, onSelect],
	);
	const registeredMenu = useMemo<RegisteredMenuContextValue>(
		() => ({
			components,
			onClose: props.onClose,
			maxHeight: Math.max(0, maxHeight - SEARCH_HEIGHT),
			registerInteraction,
			editorView,
			isOffline,
			menuOpenId,
			rootComponent: MENU,
			query,
			select,
			surfaceContext,
		}),
		[
			components,
			props.onClose,
			maxHeight,
			registerInteraction,
			editorView,
			isOffline,
			menuOpenId,
			query,
			select,
			surfaceContext,
		],
	);
	const onQueryChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.currentTarget.value),
		[],
	);
	const onKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (event.key === 'Escape') {
				event.preventDefault();
				interaction?.onClose?.();
				props.onClose();
				return;
			}
			// Some IME key events report 229 without setting isComposing. Let the input finish
			// composing text before handling menu navigation or selection.
			if (
				event.target !== searchRef.current ||
				event.nativeEvent.isComposing ||
				event.keyCode === 229
			) {
				return;
			}
			if (interaction?.onKeyDown(event.nativeEvent)) {
				event.preventDefault();
			}
		},
		[interaction, props.onClose],
	);
	return (
		<RegisteredMenuContext.Provider value={registeredMenu}>
			{Root && (
				<div
					data-registered-insert-menu-root=""
					onKeyDownCapture={onKeyDown}
					data-keyboard-navigation-independent=""
					data-testid="registered-insert-menu"
					css={[styles.menu, !interaction && styles.hidden]}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- The popup supplies the available height at runtime.
					style={menuStyle}
				>
					<Box xcss={styles.search}>
						<Textfield
							aria-label={
								interaction?.label || formatMessage(toolbarInsertBlockMessages.insertMenu)
							}
							aria-activedescendant={interaction?.activeDescendantId}
							aria-controls={interaction?.listId}
							aria-expanded={interaction?.expanded ?? false}
							aria-autocomplete="list"
							placeholder={formatMessage(typeAheadListMessages.quickInsertInputPlaceholderLabel)}
							ref={searchRef}
							role="combobox"
							value={query}
							onChange={onQueryChange}
						/>
					</Box>
					{menu}
				</div>
			)}
		</RegisteredMenuContext.Provider>
	);
};
