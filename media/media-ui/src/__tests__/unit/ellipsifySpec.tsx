import React from 'react';
import { render, screen } from '@atlassian/testing-library';
import Ellipsify from '../../ellipsify';

const ELLIPSIFY_TEST_ID = 'ellipsify';

const renderEllipsify = (text: string, lines: number, width = 1000) =>
	render(
		<div style={{ width: `${width}px` }}>
			<Ellipsify text={text} lines={lines} testId={ELLIPSIFY_TEST_ID} />
		</div>,
	);

describe('Ellipsify', () => {
	let lineHeight = 0;
	let lineHeightProbe: HTMLDivElement;

	beforeEach(() => {
		lineHeightProbe = document.createElement('div');
		lineHeightProbe.setAttribute('data-testid', 'lineheight-check');
		lineHeightProbe.textContent = 'a';
		document.body.appendChild(lineHeightProbe);
		lineHeight = screen.getByTestId('lineheight-check').getBoundingClientRect().height;
	});

	afterEach(() => {
		document.body.removeChild(lineHeightProbe);
	});

	it('should not cut short text where there are enough lines when 1 line allowed', () => {
		renderEllipsify('foo', 1);
		const el = screen.getByTestId(ELLIPSIFY_TEST_ID);
		expect(Math.ceil(el.getBoundingClientRect().height)).toBe(Math.ceil(lineHeight));
	});

	it('should not cut short text where there are enough lines when 2 lines allowed', () => {
		renderEllipsify('foo', 2);
		const el = screen.getByTestId(ELLIPSIFY_TEST_ID);
		expect(Math.ceil(el.getBoundingClientRect().height)).toBe(Math.ceil(lineHeight));
	});

	it('should cut long text when there is not enough lines', () => {
		renderEllipsify('This text should be bigger than two lines', 2, 50);
		const el = screen.getByTestId(ELLIPSIFY_TEST_ID);
		expect(Math.ceil(el.getBoundingClientRect().height)).toBe(Math.ceil(lineHeight * 2));
	});

	it('should not introduce any accessibility violations', async () => {
		renderEllipsify('foo', 1);
		await expect(document.body).toBeAccessible();
	});
});
