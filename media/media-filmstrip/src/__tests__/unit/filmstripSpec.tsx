import React from 'react';
import { render, screen } from '@atlassian/testing-library';
import { Filmstrip, type FilmstripProps, type FilmstripItem } from '../..';
import { getDefaultMediaClientConfig } from '@atlaskit/media-test-helpers';
import { type Identifier } from '@atlaskit/media-client';
import { type MediaClientConfig } from '@atlaskit/media-core';

jest.mock('@atlaskit/media-card', () => {
	const original = jest.requireActual('@atlaskit/media-card');
	return {
		...original,
		Card: (props: any) => (
			<div
				data-testid={`media-card-${props.identifier?.id || 'unknown'}`}
				data-selectable={props.selectable}
				data-selected={props.selected}
				data-should-open-media-viewer={props.shouldOpenMediaViewer}
				data-has-media-client-config={props.mediaClientConfig ? 'true' : undefined}
				data-media-viewer-items={
					props.mediaViewerItems ? JSON.stringify(props.mediaViewerItems) : undefined
				}
			>
				Card
			</div>
		),
		CardLoading: (props: any) => <div data-testid="card-loading">CardLoading</div>,
	};
});

describe('<Filmstrip />', () => {
	const firstIdentifier: Identifier = {
		id: 'id-1',
		mediaItemType: 'file',
	};
	const secondIdentifier: Identifier = {
		id: 'id-2',
		mediaItemType: 'file',
	};
	type Arguments = {
		items?: FilmstripProps['items'];
		shouldOpenMediaViewer?: FilmstripProps['shouldOpenMediaViewer'];
		mediaClientConfig?: FilmstripProps['mediaClientConfig'];
	};
	const setup = (props: Arguments = {}) => {
		const mediaClientConfig: MediaClientConfig = getDefaultMediaClientConfig();
		const items: FilmstripItem[] = [
			{
				identifier: firstIdentifier,
			},
			{
				identifier: secondIdentifier,
			},
		];
		const result = render(
			<Filmstrip mediaClientConfig={mediaClientConfig} items={items} {...props} />,
		);

		return {
			...result,
			mediaClientConfig,
		};
	};

	it('should capture and report a11y violations', async () => {
		const { container } = setup();
		await expect(container).toBeAccessible();
	});

	it('should render the right amount of Cards', () => {
		setup();

		expect(screen.getByTestId('media-card-id-1')).toBeInTheDocument();
		expect(screen.getByTestId('media-card-id-2')).toBeInTheDocument();
	});

	it('should pass properties down to Cards', () => {
		setup({
			items: [
				{
					identifier: firstIdentifier,
					selectable: true,
					selected: true,
				},
				{
					identifier: secondIdentifier,
				},
			],
			shouldOpenMediaViewer: true,
		});

		const firstCard = screen.getByTestId('media-card-id-1');
		expect(firstCard).toHaveAttribute('data-selectable', 'true');
		expect(firstCard).toHaveAttribute('data-selected', 'true');
		expect(firstCard).toHaveAttribute('data-should-open-media-viewer', 'true');
		expect(firstCard).toHaveAttribute('data-has-media-client-config', 'true');
		const mediaViewerItems = JSON.parse(firstCard.getAttribute('data-media-viewer-items')!);
		expect(mediaViewerItems).toEqual([firstIdentifier, secondIdentifier]);
	});

	it('should not activate media-viewer by default', () => {
		setup({
			items: [{ identifier: firstIdentifier }, { identifier: secondIdentifier }],
		});

		const firstCard = screen.getByTestId('media-card-id-1');
		expect(firstCard).not.toHaveAttribute('data-should-open-media-viewer', 'true');
		expect(firstCard).not.toHaveAttribute('data-media-viewer-items');
	});

	it('should not activate media-viewer if shouldOpenMediaViewer is false', () => {
		setup({
			items: [{ identifier: firstIdentifier }, { identifier: secondIdentifier }],
			shouldOpenMediaViewer: false,
		});

		const firstCard = screen.getByTestId('media-card-id-1');
		expect(firstCard).toHaveAttribute('data-should-open-media-viewer', 'false');
		expect(firstCard).not.toHaveAttribute('data-media-viewer-items');
	});

	it('should render loading cards if mediaClientConfig is missing', () => {
		setup({
			mediaClientConfig: undefined,
		});
		expect(screen.getAllByTestId('card-loading')).toHaveLength(2);
	});
});
