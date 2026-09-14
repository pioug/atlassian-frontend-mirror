/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, type RefObject, useEffect, useRef } from 'react';

import { jsx } from '@compiled/react';
import { bind } from 'bind-event-listener';

import { cssMap } from '@atlaskit/css';
import { getNextFocusable } from '@atlaskit/top-layer/get-next-focusable';
import type { TFocusableFilter } from '@atlaskit/top-layer/types';

const styles = cssMap({
	displayNone: {
		display: 'none',
	},
	visibilityHidden: {
		visibility: 'hidden',
	},
});

function useTabNavigation({
	containerRef,
	filter,
}: {
	containerRef: RefObject<HTMLElement | null>;
	filter?: TFocusableFilter;
}) {
	useEffect(() => {
		const container = containerRef.current;
		if (!container) {
			return;
		}
		return bind(container, {
			type: 'keydown',
			listener(event) {
				if (event.key !== 'Tab') {
					return;
				}
				event.preventDefault();
				getNextFocusable({
					container,
					direction: event.shiftKey ? 'backwards' : 'forwards',
					filter,
				})?.focus();
			},
		});
	}, [containerRef, filter]);
}

function ContainerOriginFixture(): ReactNode {
	const containerRef = useRef<HTMLDivElement>(null);
	useTabNavigation({ containerRef });

	return (
		<div ref={containerRef} tabIndex={-1} data-testid="container-origin">
			<button type="button" data-testid="container-first">
				First
			</button>
			<button type="button" data-testid="container-last">
				Last
			</button>
		</div>
	);
}

function NegativeTabIndexDestinationFixture(): ReactNode {
	const containerRef = useRef<HTMLDivElement>(null);
	useTabNavigation({ containerRef });

	return (
		<div ref={containerRef} data-testid="negative-tab-index-container">
			<button type="button" data-testid="negative-tab-index-before">
				Before
			</button>
			<button type="button" tabIndex={-1} data-testid="negative-tab-index-skip">
				Skip
			</button>
			<button type="button" data-testid="negative-tab-index-after">
				After
			</button>
		</div>
	);
}

function VisibilityFixture(): ReactNode {
	const containerRef = useRef<HTMLDivElement>(null);
	useTabNavigation({ containerRef });

	return (
		<div ref={containerRef} data-testid="visibility-container">
			<input aria-label="Current" data-testid="visibility-current" />
			<input aria-label="Display none" css={styles.displayNone} />
			<div css={styles.displayNone}>
				<input aria-label="Display none ancestor" />
			</div>
			<input aria-label="Visibility hidden" css={styles.visibilityHidden} />
			<div css={styles.visibilityHidden}>
				<input aria-label="Visibility hidden ancestor" />
			</div>
			<button type="button" data-testid="visibility-next">
				Next
			</button>
		</div>
	);
}

function isIncluded(element: HTMLElement): boolean {
	return element.dataset.focusFilter !== 'excluded';
}

function FilterFixture(): ReactNode {
	const containerRef = useRef<HTMLDivElement>(null);
	useTabNavigation({ containerRef, filter: isIncluded });

	return (
		<div ref={containerRef} data-testid="filter-container">
			<button type="button" data-testid="filter-before">
				Before
			</button>
			<button type="button" data-testid="filter-origin" data-focus-filter="excluded">
				Filtered origin
			</button>
			<button type="button" data-testid="filter-after">
				After
			</button>
		</div>
	);
}

export default function FocusableBrowserEdgeCases(): ReactNode {
	return (
		<div>
			<ContainerOriginFixture />
			<NegativeTabIndexDestinationFixture />
			<VisibilityFixture />
			<FilterFixture />
		</div>
	);
}
