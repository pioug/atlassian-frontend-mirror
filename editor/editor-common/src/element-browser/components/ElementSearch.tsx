/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { memo, useLayoutEffect, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import withAnalyticsContext from '@atlaskit/analytics-next/withAnalyticsContext';
import type { WithContextProps } from '@atlaskit/analytics-next/withAnalyticsContext';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { shortcutStyle } from '@atlaskit/editor-shared-styles/shortcut';
import SearchIcon from '@atlaskit/icon/core/search';
import { fg } from '@atlaskit/platform-feature-flags';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

import type { QuickInsertItem } from '../../provider-factory';
import { GRID_SIZE, SEARCH_ITEM_HEIGHT_WIDTH } from '../constants';
import useFocus from '../hooks/use-focus';
import commonMessages from '../messages';
import { Modes } from '../types';

interface Props {
	ariaControlsId?: string;
	focus: boolean;
	items: QuickInsertItem[];
	mode: keyof typeof Modes;
	onClick: (e: React.MouseEvent) => void;
	onKeyDown: (e: React.KeyboardEvent) => void;
	onSearch: (value: string) => void;
	searchTerm?: string;
	selectedItemIndex?: number;
}

function ElementSearch({
	onSearch,
	mode,
	intl: { formatMessage },
	focus,
	onClick,
	onKeyDown,
	searchTerm,
	items,
	selectedItemIndex,
	ariaControlsId,
}: Props & WrappedComponentProps): JSX.Element {
	const ref = useFocus(focus);
	const assistiveTextRef = useRef<HTMLDivElement>(null);

	const [inputFocused, setInputFocused] = useState(false);

	useLayoutEffect(() => {
		if (assistiveTextRef) {
			const assistiveDiv = assistiveTextRef.current;
			/**
			 * We need to remove and set attributes, for the proper working of screen readers.
			 */
			assistiveDiv?.removeAttribute('aria-live');
			assistiveDiv?.setAttribute('aria-live', 'polite');
		}
	}, [items, formatMessage]);

	const onChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
		onSearch(value);
	};
	const onFocus = (_e: React.FocusEvent<HTMLInputElement>) => {
		setInputFocused(true);
	};
	const onBlur = (_e: React.FocusEvent<HTMLInputElement>) => {
		setInputFocused(false);
	};

	const getFormattedMessage = (itemsCount: number): string => {
		if (searchTerm === '') {
			return `${formatMessage(commonMessages.assistiveTextDefault, {
				count: itemsCount,
			})}`;
		}
		if (itemsCount > 1) {
			return `${formatMessage(commonMessages.assistiveTextResult, {
				count: itemsCount,
			})}`;
		}
		if (itemsCount === 1) {
			return `${formatMessage(commonMessages.assistiveTextResult, {
				count: itemsCount,
			})}`;
		}
		return formatMessage(commonMessages.assistiveTextResult, {
			count: itemsCount,
		});
	};

	const assistiveMessage = getFormattedMessage(items?.length);

	const isInputNotFocusedAndItemSelected = !inputFocused && selectedItemIndex !== undefined;
	const ariaActiveDescendant = isInputNotFocusedAndItemSelected
		? `searched-item-${selectedItemIndex}`
		: undefined;

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<div css={[wrapper, mode === Modes.inline && wrapperInline]}>
			<Textfield
				ref={ref}
				onChange={onChange}
				onClick={onClick}
				onFocus={onFocus}
				onKeyDown={onKeyDown}
				onBlur={onBlur}
				elemBeforeInput={
					<div
						css={elementBeforeInput}
						data-testid="element_search__element_before_input"
						aria-hidden="true"
					>
						<SearchIcon
							spacing="spacious"
							label="Advanced search"
							color={token('color.icon.subtle')}
						/>
					</div>
				}
				elemAfterInput={
					<div css={elementAfterInput} data-testid="element_search__element_after_input">
						<div css={styledShortcut}>
							&#9166; {formatMessage(commonMessages.elementAfterInputMessage)}
						</div>
					</div>
				}
				placeholder={formatMessage(commonMessages.placeHolderMessage)}
				aria-label={formatMessage(
					fg('ally_30205_accessibility_label_fix')
						? commonMessages.searchAriaLabelNew
						: commonMessages.searchAriaLabel,
				)}
				aria-labelledby={
					fg('platform_editor_ally_remove_role_tabpanel') ? undefined : 'search-assistive'
				}
				aria-describedby={
					fg('platform_editor_ally_remove_role_tabpanel') ? 'search-assistive' : undefined
				}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className="js-search-input"
				role="combobox"
				aria-expanded="true"
				aria-controls={ariaControlsId}
				aria-activedescendant={ariaActiveDescendant}
				value={searchTerm}
			/>
			<span
				id="search-assistive"
				ref={assistiveTextRef}
				aria-live="polite"
				aria-atomic="true"
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className="assistive"
			>
				{assistiveMessage}
			</span>
		</div>
	);
}

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const styledShortcut = css(shortcutStyle, {
	padding: `${token('space.050')} ${token('space.100')}`,
	width: token('space.600'),
});

const wrapper = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > [data-ds--text-field--container]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		height: `${GRID_SIZE * 6}px`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		borderRadius: `${GRID_SIZE}px`,
		flex: '1 1 100%',
		overflow: 'visible',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& > [data-ds--text-field--input]': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			fontSize: relativeFontSizeToBase16(14),
			padding: `${token('space.100')} ${token('space.075')} ${token('space.100')} 0`,
		},
	},
});

const wrapperInline = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > [data-ds--text-field--container]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		height: `40px`,
		flex: 'none',
		overflow: 'revert',
	},
});

const elementBeforeInput = css({
	margin: `${token('space.025')} ${token('space.075')} 0 ${token('space.100')}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'span, svg': {
		height: '20px',
		width: '20px',
	},
});

const elementAfterInput = css({
	margin: `0 ${token('space.100')}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: SEARCH_ITEM_HEIGHT_WIDTH,
	textAlign: 'center',
});

const MemoizedElementSearchWithAnalytics: React.MemoExoticComponent<
	React.ForwardRefExoticComponent<
		Omit<Props & WrappedComponentProps, 'intl'> & {
			forwardedRef?: React.Ref<unknown>;
		} & WithContextProps &
			React.RefAttributes<unknown>
	>
> = memo(
	withAnalyticsContext({
		component: 'Searchbar',
	})(injectIntl(ElementSearch)),
);

export default MemoizedElementSearchWithAnalytics;
