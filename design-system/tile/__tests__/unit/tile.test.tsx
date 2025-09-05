import React from 'react';

import { render, screen } from '@testing-library/react';

import Tile from '../../src';

const toPxNumber = (value: string): number => {
	if (!value) {
		return 0;
	}
	const trimmed = value.trim();
	if (trimmed.endsWith('px')) {
		return parseFloat(trimmed);
	}
	if (trimmed.endsWith('pc')) {
		return parseFloat(trimmed) * 16; // 1pc = 16px
	}
	const parsed = parseFloat(trimmed);
	return Number.isNaN(parsed) ? 0 : parsed;
};

describe('Tile', () => {
	it('renders children', () => {
		render(
			<Tile label="My label" testId="tile">
				<span>🙂</span>
			</Tile>,
		);

		expect(screen.getByText('🙂')).toBeInTheDocument();
	});

	it('renders hidden label', () => {
		render(<Tile label="My label" testId="tile" />);
		expect(screen.getByText('My label')).toBeInTheDocument();
	});

	it('applies data-testid when provided', () => {
		render(
			<Tile label="Label" testId="my-tile">
				<div />
			</Tile>,
		);
		expect(screen.getByTestId('my-tile')).toBeInTheDocument();
	});

	it('uses medium size by default (32px x 32px)', () => {
		render(
			<Tile label="Label" testId="tile-default">
				<div />
			</Tile>,
		);
		const el = screen.getByTestId('tile-default');
		const style = getComputedStyle(el);
		expect(toPxNumber(style.width)).toBe(32);
		expect(toPxNumber(style.height)).toBe(32);
	});

	it('respects provided size (xlarge = 48px x 48px)', () => {
		render(
			<Tile label="Label" size="xlarge" testId="tile-xl">
				<div />
			</Tile>,
		);
		const el = screen.getByTestId('tile-xl');
		const style = getComputedStyle(el);
		expect(toPxNumber(style.width)).toBe(48);
		expect(toPxNumber(style.height)).toBe(48);
	});

	it('applies literal background colors (white)', () => {
		render(
			<Tile label="Label" backgroundColor="white" testId="tile-bg">
				<div />
			</Tile>,
		);
		const el = screen.getByTestId('tile-bg');
		const style = getComputedStyle(el);
		expect(style.backgroundColor).toBe('rgb(255, 255, 255)');
	});

	it('shows border styles when hasBorder is true', () => {
		render(
			<Tile label="Label" hasBorder testId="tile-border">
				<div />
			</Tile>,
		);
		const el = screen.getByTestId('tile-border');
		const style = getComputedStyle(el);
		expect(style.borderTopStyle).toBe('solid');
		expect(style.borderTopWidth).not.toBe('0px');
	});

	it('inset sizing applies to children by default', () => {
		render(
			<Tile label="Label" testId="tile-inset">
				<div data-testid="child" />
			</Tile>,
		);
		const child = screen.getByTestId('child');
		// Default size is medium → inset child width and height should be 16px
		expect(toPxNumber(getComputedStyle(child).width)).toBe(16);
	});

	it('non-inset sizing makes child fill the tile', () => {
		render(
			<Tile label="Label" isInset={false} size="medium" testId="tile-non-inset">
				<div data-testid="child" />
			</Tile>,
		);
		const el = screen.getByTestId('tile-non-inset');
		const child = screen.getByTestId('child');
		// Child should fill the tile (100% of parent)
		const elWidth = getComputedStyle(el).width;
		const childWidth = getComputedStyle(child).width;
		const childHeight = getComputedStyle(child).height;
		expect(toPxNumber(elWidth)).toBe(32);
		expect(childWidth).toBe('100%');
		expect(childHeight).toBe('100%');
	});
});
