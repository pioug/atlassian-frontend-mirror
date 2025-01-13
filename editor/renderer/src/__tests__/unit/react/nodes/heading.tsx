const mockCopyTextToClipboard = jest.fn();
jest.mock('../../../../react/utils/clipboard', () => {
	const module = jest.requireActual('../../../../react/utils/clipboard');
	return {
		...module,
		copyTextToClipboard: (text: string) => mockCopyTextToClipboard(text),
	};
});

import React from 'react';
import type { HeadingLevels } from '../../../../react/nodes/heading';
import Heading from '../../../../react/nodes/heading';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import AnalyticsContext from '../../../../analytics/analyticsContext';
import HeadingAnchor from '../../../../react/nodes/heading-anchor';
import ReactSerializer from '../../../../react';

describe('<Heading />', () => {
	let heading: any;
	const serialiser = new ReactSerializer({});
	const fireAnalyticsEvent = jest.fn();

	test.each([1, 2, 3, 4, 5, 6])('should wrap content with <h%s>-tag', (headingLevel) => {
		heading = mountWithIntl(
			<Heading
				level={headingLevel as HeadingLevels}
				headingId={`This-is-a-Heading-${headingLevel}`}
				showAnchorLink={true}
				dataAttributes={{
					'data-renderer-start-pos': 0,
				}}
				nodeType="heading"
				marks={[]}
				serializer={serialiser}
			>
				This is a Heading {headingLevel}
			</Heading>,
		);

		expect(heading.find(`h${headingLevel}`).exists()).toBe(true);
		expect(heading.find(`h${headingLevel}`).prop('id')).toEqual(
			`This-is-a-Heading-${headingLevel}`,
		);
	});

	describe('When showAnchorLink is set to false', () => {
		beforeEach(() => {
			heading = mountWithIntl(
				<Heading
					level={1}
					headingId={'This-is-a-Heading-1'}
					showAnchorLink={false}
					dataAttributes={{
						'data-renderer-start-pos': 0,
					}}
					nodeType="heading"
					marks={[]}
					serializer={serialiser}
				>
					This is a Heading 1
				</Heading>,
			);
		});

		it('does not render heading anchor', () => {
			expect(heading.find(HeadingAnchor).exists()).toBe(false);
		});
	});

	const renderHeadingWithAnchor = () => {
		return mountWithIntl(
			<AnalyticsContext.Provider
				value={{
					fireAnalyticsEvent: fireAnalyticsEvent,
				}}
			>
				<Heading
					level={1}
					headingId="This-is-a-Heading-1"
					showAnchorLink={true}
					dataAttributes={{
						'data-renderer-start-pos': 0,
					}}
					nodeType="heading"
					marks={[]}
					serializer={serialiser}
				>
					This is a Heading 1
				</Heading>
			</AnalyticsContext.Provider>,
		);
	};

	describe('When click on copy anchor link button', () => {
		afterEach(() => {
			mockCopyTextToClipboard.mockClear();
			heading.unmount();
		});

		it('should call "fireAnalyticsEvent" with correct event data', () => {
			heading = renderHeadingWithAnchor();
			heading.find('button').simulate('click');
			expect(fireAnalyticsEvent).toHaveBeenCalledWith({
				action: 'clicked',
				actionSubject: 'button',
				actionSubjectId: 'headingAnchorLink',
				eventType: 'ui',
			});
		});

		it('Should call "copyTextToClipboard" with correct param', () => {
			heading = renderHeadingWithAnchor();
			heading.find('button').simulate('click');
			expect(mockCopyTextToClipboard).toHaveBeenCalledWith('http://localhost/#This-is-a-Heading-1');
		});

		it('Should call "copyTextToClipboard" with correct hash replaced and query params cleared', () => {
			jsdom.reconfigure({
				url: 'http://localhost/some-path?focusedCommentId=123#some-other-link',
			});
			heading = renderHeadingWithAnchor();
			heading.find('button').simulate('click');
			expect(mockCopyTextToClipboard).toHaveBeenCalledWith(
				'http://localhost/some-path#This-is-a-Heading-1',
			);
		});
	});

	ffTest.on('platform_editor_accessible_heading_copy_link', 'Accessible heading link', () => {
		it('renders an aria hidden and visually hidden heading anchor when showAnchorLink is true and headingId is provided', () => {
			const reactSerializer = new ReactSerializer({});
			const screen = renderWithIntl(
				<Heading
					level={1}
					headingId="heading-id"
					showAnchorLink
					dataAttributes={{ 'data-renderer-start-pos': 1 }}
					marks={[]}
					nodeType=""
					serializer={reactSerializer}
				/>,
			);

			const headingAnchors = screen.getAllByTestId('anchor-button');
			expect(headingAnchors.length).toBe(2);
			expect(headingAnchors[0]).toHaveAttribute('aria-hidden', 'true');
			expect(screen.getByTestId('visually-hidden-heading-anchor')).toBeInTheDocument();
		});
	});

	ffTest.off('platform_editor_accessible_heading_copy_link', 'Accessible heading link', () => {
		it('renders one heading anchor when showAnchorLink is true and headingId is provided', () => {
			const reactSerializer = new ReactSerializer({});
			const screen = renderWithIntl(
				<Heading
					level={1}
					headingId="heading-id"
					showAnchorLink
					dataAttributes={{ 'data-renderer-start-pos': 1 }}
					marks={[]}
					nodeType=""
					serializer={reactSerializer}
				/>,
			);
			const headingAnchors = screen.getAllByTestId('anchor-button');
			expect(headingAnchors.length).toBe(1);
		});
	});
});
