import React from 'react';

import { render, screen } from '@testing-library/react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { MultiValue } from '../../../components/MultiValue';
import { scrollToValue } from '../../../components/scrollToValue';
import { VALUE_CONTAINER_ATTRIBUTE } from '../../../components/valueContainerAttribute';
import { type User } from '../../../types';

jest.mock('../../../components/scrollToValue', () => ({
	scrollToValue: jest.fn(),
}));

jest.mock('@atlaskit/react-select/components', () => ({
	...jest.requireActual('@atlaskit/react-select/components'),
	components: {
		...jest.requireActual('@atlaskit/react-select/components').components,
		MultiValue: ({ children, innerProps }: any) => <div {...innerProps}>{children}</div>,
	},
}));

jest.mock('@atlaskit/tag/avatar-tag', () => ({
	...jest.requireActual('@atlaskit/tag/avatar-tag'),
	__esModule: true,
	default: (props: { text: string }) => (
		<div data-testid="user-picker-avatar-tag">{props.text}</div>
	),
}));

jest.mock('../../../components/SizeableAvatar', () => ({
	SizeableAvatar: (props: any) => <div>SizeableAvatar - {JSON.stringify(props)}</div>,
}));

const mockScrollToValue = scrollToValue as jest.MockedFunction<typeof scrollToValue>;

describe('MultiValue scrolling with list semantics (A11Y-30826)', () => {
	const data = {
		label: 'Jace Beleren',
		data: {
			id: 'abc-123',
			name: 'Jace Beleren',
			publicName: 'jbeleren',
		} as User,
	};

	// `MultiValue` declares the full react-select value prop surface; the component
	// only reads these fields, so supply them the way the sibling specs do.
	const valueProps: any = {
		data,
		removeProps: { onClick: jest.fn() },
		selectProps: { isDisabled: false },
		innerProps: {},
	};

	/**
	 * Mirrors the real composition: `MultiValueContainer` renders the tagged value
	 * container; `SelectedValueList` renders the `ul` and each selected value’s `li`.
	 */
	const valueContainer = (isFocused: boolean) => (
		<div {...{ [VALUE_CONTAINER_ATTRIBUTE]: true }} data-testid="value-container">
			<ul>
				<li>
					<MultiValue {...valueProps} isFocused={isFocused} />
				</li>
			</ul>
		</div>
	);

	afterEach(() => {
		mockScrollToValue.mockClear();
	});

	// Both value render paths must gain list semantics: the tag uplift is rolled
	// out but the legacy path is still in the codebase until its gate is cleaned up.
	describe.each([
		['tag uplift', true],
		['legacy', false],
	])('%s value', (_name, upliftEnabled) => {
		const mockUpliftGate = () => {
			if (upliftEnabled) {
				passGate('platform-dst-lozenge-tag-badge-visual-uplifts');
			} else {
				failGate('platform-dst-lozenge-tag-badge-visual-uplifts');
			}
		};

		const withListGate = () => {
			mockUpliftGate();
			passGate('platform-user-picker-a11y-30826-value-list');
		};

		it('uses the original scroll container when the gate is off', () => {
			mockUpliftGate();
			failGate('platform-user-picker-a11y-30826-value-list');
			const legacyContainer = (isFocused: boolean) => (
				<div data-testid="legacy-container">
					<div>
						<MultiValue {...valueProps} isFocused={isFocused} />
					</div>
				</div>
			);
			const { rerender } = render(legacyContainer(false));

			rerender(legacyContainer(true));

			expect(mockScrollToValue).toHaveBeenCalledTimes(1);
			expect(mockScrollToValue.mock.calls[0][1]).toBe(screen.getByTestId('legacy-container'));
		});

		it('resolves the scroll container through the ul and li wrappers', () => {
			withListGate();
			const { rerender } = render(valueContainer(false));

			rerender(valueContainer(true));

			// The `ul` and `li` have no layout box under `display: contents`, so the
			// scroll container must be the tagged value container, not either wrapper.
			expect(mockScrollToValue).toHaveBeenCalledTimes(1);
			expect(mockScrollToValue.mock.calls[0][1]).toBe(screen.getByTestId('value-container'));
		});

		it('does not scroll when there is no value container ancestor', () => {
			withListGate();
			const untaggedList = (isFocused: boolean) => (
				<ul>
					<li>
						<MultiValue {...valueProps} isFocused={isFocused} />
					</li>
				</ul>
			);
			const { rerender } = render(untaggedList(false));

			rerender(untaggedList(true));

			expect(mockScrollToValue).not.toHaveBeenCalled();
		});
	});
});
