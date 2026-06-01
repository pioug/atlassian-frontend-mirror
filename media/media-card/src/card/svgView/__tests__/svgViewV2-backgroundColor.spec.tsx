import React from 'react';
import { render, screen } from '@atlassian/testing-library';
import { SvgView } from '../svgViewV2';
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

jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn().mockReturnValue(true),
}));

jest.mock('@atlaskit/react-ufo/interaction-context', () => ({
	useInteractionContext: jest.fn().mockReturnValue(null),
}));

jest.mock('@atlaskit/react-ufo/custom-data', () => ({
	__esModule: true,
	default: () => null,
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

describe('SvgView (V2) - backgroundColor prop', () => {
	it('should pass useWhiteBackground=true when no backgroundColor is provided', () => {
		render(<SvgView {...defaultProps} />);
		const img = screen.getByTestId('media-card-svg');
		// Without backgroundColor, useWhiteBackground is true so the white bg CSS class is applied
		expect(img.style.backgroundColor).toBe('');
	});

	it('should pass useWhiteBackground=false and set backgroundColor when provided', () => {
		render(<SvgView {...defaultProps} backgroundColor="transparent" />);
		const img = screen.getByTestId('media-card-svg');
		expect(img.style.backgroundColor).toBe('transparent');
	});

	it('should apply arbitrary backgroundColor when provided', () => {
		render(<SvgView {...defaultProps} backgroundColor="red" />);
		const img = screen.getByTestId('media-card-svg');
		expect(img.style.backgroundColor).toBe('red');
	});

	it('should NOT apply the white background CSS class when an explicit backgroundColor is provided', () => {
		const { container: noBgContainer } = render(<SvgView {...defaultProps} />);
		const noBgImg = noBgContainer.querySelector(
			'[data-testid="media-card-svg"]',
		) as HTMLImageElement;
		const defaultClassName = noBgImg.className;

		const { container: withBgContainer } = render(
			<SvgView {...defaultProps} backgroundColor="red" />,
		);
		const withBgImg = withBgContainer.querySelector(
			'[data-testid="media-card-svg"]',
		) as HTMLImageElement;
		// When backgroundColor is provided, useWhiteBackground is false so the white-bg class is dropped
		expect(withBgImg.className).not.toBe(defaultClassName);
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
