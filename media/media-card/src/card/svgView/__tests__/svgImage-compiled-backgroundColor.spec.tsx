/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';
import React from 'react';
import { render, screen } from '@atlassian/testing-library';
import { SvgView } from '../svgImage-compiled';
import type { FileIdentifier } from '@atlaskit/media-client';

// Mock useResolveSvg to return a valid SVG URL
jest.mock('@atlaskit/media-svg', () => ({
	useResolveSvg: jest.fn().mockReturnValue({
		svgUrl: 'data:image/svg+xml;base64,abc',
		source: 'remote',
	}),
	MediaSVGError: class MediaSVGError extends Error {
		primaryReason: string;
		secondaryError?: Error;
		constructor(reason: string, secondaryError?: Error) {
			super(reason);
			this.primaryReason = reason;
			this.secondaryError = secondaryError;
		}
	},
}));

const wrapperRef = { current: document.createElement('div') } as React.RefObject<HTMLDivElement>;

const identifier: FileIdentifier = {
	id: 'test-file-id',
	collectionName: 'test-collection',
	mediaItemType: 'file',
};

const defaultProps = {
	identifier,
	resizeMode: 'crop' as const,
	wrapperRef,
};

describe('SvgView (compiled) - backgroundColor prop', () => {
	it('should not set inline backgroundColor when prop is not provided', () => {
		render(<SvgView {...defaultProps} />);
		const img = screen.getByTestId('media-card-svg');
		expect(img.style.backgroundColor).toBe('');
	});

	it('should apply custom backgroundColor as inline style when provided', () => {
		render(<SvgView {...defaultProps} backgroundColor="transparent" />);
		const img = screen.getByTestId('media-card-svg');
		expect(img.style.backgroundColor).toBe('transparent');
	});

	it('should apply an arbitrary backgroundColor when provided', () => {
		render(<SvgView {...defaultProps} backgroundColor="rgb(0, 0, 255)" />);
		const img = screen.getByTestId('media-card-svg');
		expect(img.style.backgroundColor).toBe('rgb(0, 0, 255)');
	});

	it('should NOT apply the white background CSS class when an explicit backgroundColor is provided', () => {
		const { container: noBgContainer } = render(<SvgView {...defaultProps} />);
		const noBgImg = noBgContainer.querySelector(
			'[data-testid="media-card-svg"]',
		) as HTMLImageElement;
		// Snapshot the className applied when no backgroundColor is provided (includes white-bg class)
		const defaultClassName = noBgImg.className;

		const { container: withBgContainer } = render(
			<SvgView {...defaultProps} backgroundColor="red" />,
		);
		const withBgImg = withBgContainer.querySelector(
			'[data-testid="media-card-svg"]',
		) as HTMLImageElement;
		// When backgroundColor is provided, the white-bg class is dropped so className must differ
		expect(withBgImg.className).not.toBe(defaultClassName);
		// Sanity check: at least one class token from the default render is missing in the override render
		const defaultTokens = defaultClassName.split(/\s+/).filter(Boolean);
		const overrideTokens = new Set(withBgImg.className.split(/\s+/).filter(Boolean));
		const droppedTokens = defaultTokens.filter((token) => !overrideTokens.has(token));
		expect(droppedTokens.length).toBeGreaterThan(0);
	});

	it('should be accessible', async () => {
		const { container } = render(<SvgView {...defaultProps} />);
		await expect(container).toBeAccessible();
	});
});
