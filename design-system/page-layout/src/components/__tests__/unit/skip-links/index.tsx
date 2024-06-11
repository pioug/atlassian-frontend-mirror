import React from 'react';

import { render } from '@testing-library/react';

import noop from '@atlaskit/ds-lib/noop';

import { DEFAULT_I18N_PROPS_SKIP_LINKS } from '../../../../common/constants';
import { SkipLinksContext } from '../../../../controllers/skip-link-context';
import { SkipLinkWrapper, useCustomSkipLink } from '../../../skip-links';
import Banner from '../../../slots/banner-slot';
import PageLayout from '../../../slots/page-layout';

describe('skip links', () => {
	describe('SkipLinkWrapper', () => {
		const label = '跳转到';
		const emptyLabel = '';
		const spaceLabel = ' ';
		const context = {
			skipLinksData: [
				{ id: 'left', skipLinkTitle: 'Left panel' },
				{ id: 'right', skipLinkTitle: 'Right panel' },
			],
			registerSkipLink: noop,
			unregisterSkipLink: noop,
		};
		const skipLinksWithLabel = (
			<SkipLinksContext.Provider value={context}>
				<SkipLinkWrapper skipLinksLabel={label}></SkipLinkWrapper>
			</SkipLinksContext.Provider>
		);
		const skipLinksNoLabel = (
			<SkipLinksContext.Provider value={context}>
				<SkipLinkWrapper />
			</SkipLinksContext.Provider>
		);
		const skipLinksEmptyLabel = (
			<SkipLinksContext.Provider value={context}>
				<SkipLinkWrapper skipLinksLabel={emptyLabel} />
			</SkipLinksContext.Provider>
		);
		const skipLinksSpacesLabel = (
			<SkipLinksContext.Provider value={context}>
				<SkipLinkWrapper skipLinksLabel={spaceLabel} />
			</SkipLinksContext.Provider>
		);

		it('generate 3 links', () => {
			const component = render(skipLinksWithLabel);
			expect(component.getByText(label)).toBeInTheDocument();
			expect(component.getAllByRole('link')).toHaveLength(2);
		});

		it('uses default label in the heading if skipLinksLabel is undefined', () => {
			const component = render(skipLinksNoLabel);
			expect(component.getByText(DEFAULT_I18N_PROPS_SKIP_LINKS)).toBeInTheDocument();
		});

		it('uses default label in the heading if skipLinksLabel is empty', () => {
			const component = render(skipLinksEmptyLabel);
			expect(component.getByText(DEFAULT_I18N_PROPS_SKIP_LINKS)).toBeInTheDocument();
			expect(() => component.getByText(emptyLabel)).toThrow();
		});

		it('forces no heading if a skipLinksLabel comprising only of spaces is provided', () => {
			const component = render(skipLinksSpacesLabel);
			expect(() => component.getByText(DEFAULT_I18N_PROPS_SKIP_LINKS)).toThrow();
			expect(() => component.getByText(spaceLabel)).toThrow();
		});
	});

	describe('Custom skip links', () => {
		it('generates 3 links - 1 through standard slot method, 2 custom, in the correct order', () => {
			const IntroSection = () => {
				useCustomSkipLink('intro-section', 'Intro Section', 0);

				return <div id="intro-section">intro</div>;
			};
			const ExternalFooter = () => {
				useCustomSkipLink('external-footer', 'External Footer', 7);

				return <div id="external-footer">external footer</div>;
			};
			const component = render(
				<PageLayout>
					<IntroSection />
					<ExternalFooter />
					{
						<Banner testId="banner" id="banner" skipLinkTitle="Banner" height={60} isFixed={false}>
							<p>Child</p>
						</Banner>
					}
				</PageLayout>,
			);
			const allLinksInSkipLinks = component.getAllByRole('link');

			expect(allLinksInSkipLinks).toHaveLength(3);
			expect(allLinksInSkipLinks[0]).toHaveTextContent('Intro Section');
			expect(allLinksInSkipLinks[1]).toHaveTextContent('Banner');
			expect(allLinksInSkipLinks[2]).toHaveTextContent('External Footer');
		});
	});
});
