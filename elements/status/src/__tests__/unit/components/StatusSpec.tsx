/* eslint-disable @atlaskit/design-system/ensure-design-token-usage, @atlaskit/design-system/ensure-design-token-usage/preview */
import { AnalyticsListener as AnalyticsListenerNext } from '@atlaskit/analytics-next';
import { fireEvent, screen } from '@testing-library/react';
import { token } from '@atlaskit/tokens';
import { renderWithIntl } from '../helpers/_testing-library';
import React from 'react';
import { ELEMENTS_CHANNEL } from '../../../components/analytics';
import { ANALYTICS_HOVER_DELAY } from '../../../components/constants';
import { type Color, Status } from '../../..';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

const createPayload = (actionSubject: string, action: string, localId: string) => ({
	payload: {
		action,
		actionSubject,
		attributes: {
			packageName,
			packageVersion,
			componentName: 'status',
			localId,
		},
		eventType: 'ui',
	},
});

const formatColorToken = (color: string) => color.replace(' ', '').toLowerCase();

describe('Status', () => {
	it('should render', () => {
		renderWithIntl(<Status text="In progress" color="blue" />);
		expect(screen.getByText('In progress')).toBeInTheDocument();
	});

	it('should have max-width 200px', () => {
		renderWithIntl(<Status text="In progress" color="blue" />);
		expect(screen.getByText('In progress')).toHaveStyle(
			'max-width: calc(200px - var(--ds-space-100, 8px))',
		);
	});

	describe('should map colors to lozenge appearances', () => {
		const colorToLozengeAppearanceMap: { [key in Color]: string } = {
			neutral: token('color.text.subtle', '#42526E'),
			purple: token('color.text.discovery', '#403294'),
			blue: token('color.text.information', '#0052CC'),
			red: token('color.text.danger', '#DE350B'),
			yellow: token('color.text.warning', '#974F0C'),
			green: token('color.text.success', '#064'),
		};

		Object.entries(colorToLozengeAppearanceMap).forEach(([color, appearance]) => {
			it(`should map ${color} to correct text color`, () => {
				renderWithIntl(<Status text="In progress" color={color as Color} />);
				expect(screen.getByText('In progress')).toHaveCompiledCss(
					'color',
					formatColorToken(appearance),
				);
			});
		});
	});

	it('should not use the title={text} attribute in parent span', () => {
		// Parent <span> should not use title={text} attribute.
		// This may lead to the screen reader will announce the status twice
		// for the screen reader users.
		const { container } = renderWithIntl(<Status text="In progress" color="blue" />);
		const span = container.getElementsByClassName('status-lozenge-span')[0];

		expect(span.getAttribute('title')).toBeNull();
	});

	it('should use default color if color is unknown', () => {
		renderWithIntl(
			// @ts-ignore: passing an invalid color
			<Status text="In progress" color="unknown" />,
		);
		expect(screen.getByText('In progress')).toHaveCompiledCss(
			'color',
			formatColorToken(token('color.text.subtle', '#42526E')),
		);
	});

	it('should not render it if text is empty', () => {
		renderWithIntl(<Status text=" " color="blue" />);
		expect(screen.queryByText(' ')).not.toBeInTheDocument();
	});

	it('should use render data attributes for copy/paste', () => {
		const { container } = renderWithIntl(<Status text="TODO" color="blue" style="subtle" />);

		const span = container.getElementsByClassName('status-lozenge-span')[0];
		expect(span.getAttribute('data-node-type')).toBe('status');
		expect(span.getAttribute('data-style')).toBe('subtle');
		expect(span.getAttribute('data-color')).toBe('blue');
		expect(span.getAttribute('data-local-id')).toBeNull();
	});

	describe('Status onHover', () => {
		let realDateNow: () => number;
		let dateNowStub: jest.Mock;
		let analyticsNextHandler: jest.Mock;

		beforeEach(() => {
			realDateNow = Date.now;
			dateNowStub = jest.fn();
			Date.now = dateNowStub;
			analyticsNextHandler = jest.fn();
		});

		afterEach(() => {
			Date.now = realDateNow;
		});

		const createStatus = (localId: string, onClick: any, onHover: any) =>
			renderWithIntl(
				<AnalyticsListenerNext onEvent={analyticsNextHandler} channel={ELEMENTS_CHANNEL}>
					<Status localId={localId} text="boo" color="green" onClick={onClick} onHover={onHover} />
				</AnalyticsListenerNext>,
			);

		it('should fire analytics Status onHover', () => {
			const now = realDateNow();
			const onHover = jest.fn();
			createStatus('123', jest.fn(), onHover);

			const lozenge = screen.getByText('boo');
			expect(lozenge).toBeInTheDocument();

			dateNowStub.mockReturnValue(now);
			fireEvent.mouseEnter(lozenge);

			dateNowStub.mockReturnValue(now + ANALYTICS_HOVER_DELAY + 10);
			fireEvent.mouseLeave(lozenge);

			expect(onHover).toHaveBeenCalled();
			expect(analyticsNextHandler).toHaveBeenCalledWith(
				expect.objectContaining(createPayload('statusLozenge', 'hovered', '123')),
				ELEMENTS_CHANNEL,
			);
		});

		it('should fire analytics Status onClick', () => {
			const onClick = jest.fn();
			createStatus('456', onClick, jest.fn());

			const lozenge = screen.getByText('boo');
			expect(lozenge).toBeInTheDocument();
			fireEvent.click(lozenge);

			expect(onClick).toHaveBeenCalled();
			expect(analyticsNextHandler).toHaveBeenCalledWith(
				expect.objectContaining(createPayload('statusLozenge', 'clicked', '456')),
				ELEMENTS_CHANNEL,
			);
		});
	});
});
