import { render, screen } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import { AnnotationsDraftContext, AnnotationsDraftContextWrapper } from '../../context';
import type { Position } from '../../types';

type ChildrenProps = {
	applyAnnotationDraftAt: (position: Position) => void;
	clearAnnotationDraft: () => void;
};

describe('Annotations: AnnotationsDraftContextWrapper', () => {
	// eslint-disable-next-line @typescript-eslint/ban-types
	let applyAnnotationDraftAt: Function;
	// eslint-disable-next-line @typescript-eslint/ban-types
	let clearAnnotationDraft: Function;
	const mockComponent = jest.fn();
	const mockSetDraftRange = jest.fn();
	const mockClearDraftRange = jest.fn();
	beforeEach(() => {
		const MyFakeComponent = (props: React.PropsWithChildren<ChildrenProps>) => {
			applyAnnotationDraftAt = props.applyAnnotationDraftAt;
			clearAnnotationDraft = props.clearAnnotationDraft;
			return <AnnotationsDraftContext.Consumer>{mockComponent}</AnnotationsDraftContext.Consumer>;
		};

		render(
			<>
				<AnnotationsDraftContextWrapper
					setDraftRange={mockSetDraftRange}
					clearDraftRange={mockClearDraftRange}
				>
					{MyFakeComponent}
				</AnnotationsDraftContextWrapper>
			</>,
		);

		mockComponent.mockReset();
		mockSetDraftRange.mockReset();
		mockClearDraftRange.mockReset();
	});

	describe('when the applyAnnotationDraftAt is called', () => {
		it('should set replace the current position', () => {
			const position = { from: 1, to: 10 };
			act(() => {
				applyAnnotationDraftAt!(position);
			});

			expect(mockComponent).toHaveBeenCalledTimes(1);
			expect(mockComponent).toHaveBeenNthCalledWith(1, position);
		});

		it('should call setDraftRange', () => {
			const position = { from: 1, to: 10 };
			act(() => {
				applyAnnotationDraftAt!(position);
			});

			expect(mockSetDraftRange).toHaveBeenCalledTimes(1);
		});
	});

	describe('when the clearAnnotationDraft is called', () => {
		it('should set the position as null', () => {
			act(() => {
				const position = { from: 1, to: 10 };
				applyAnnotationDraftAt!(position);
			});

			mockComponent.mockReset();

			act(() => {
				clearAnnotationDraft!();
			});

			expect(mockComponent).toHaveBeenCalledWith(null);
		});

		it('should call clear draft range', () => {
			act(() => {
				const position = { from: 1, to: 10 };
				applyAnnotationDraftAt!(position);
			});

			act(() => {
				clearAnnotationDraft!();
			});

			expect(mockClearDraftRange).toHaveBeenCalledTimes(1);
		});
	});
});

describe('Annotations: AnnotationsDraftContextWrapper nested render', () => {
	const mockComponent = jest.fn();
	const mockSetDraftRange = jest.fn();
	const mockClearDraftRange = jest.fn();

	const TestComponent = () => {
		return <AnnotationsDraftContext.Consumer>{mockComponent}</AnnotationsDraftContext.Consumer>;
	};

	describe('should not render context provider when isNestedRender is true and feature flag is on', () => {
		ffTest(
			'confluence_frontend_fix_extension_draft_annotation',
			() => {
				render(
					<AnnotationsDraftContextWrapper
						setDraftRange={mockSetDraftRange}
						clearDraftRange={mockClearDraftRange}
						isNestedRender
					>
						{TestComponent}
					</AnnotationsDraftContextWrapper>,
				);

				expect(screen.getByTestId('context-wrapper-without-provider')).toBeInTheDocument();
			},
			() => {
				render(
					<AnnotationsDraftContextWrapper
						setDraftRange={mockSetDraftRange}
						clearDraftRange={mockClearDraftRange}
						isNestedRender
					>
						{TestComponent}
					</AnnotationsDraftContextWrapper>,
				);

				expect(screen.queryByTestId('context-wrapper-without-provider')).not.toBeInTheDocument();
			},
		);
	});
});
