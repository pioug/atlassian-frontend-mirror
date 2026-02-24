import React, { forwardRef, type Ref } from 'react';

import { render, screen } from '@testing-library/react';

import AppProvider, { type RouterLinkComponentProps } from '@atlaskit/app-provider';
import SettingsIcon from '@atlaskit/icon/core/settings';

import LinkIconButton from '../../../new-button/variants/icon/link';
import { linkButtonVariants } from '../../../utils/variants';

type MyRouterLinkConfig = {
	to: string;
	customProp?: string;
};

const MyRouterLinkComponent: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<RouterLinkComponentProps<MyRouterLinkConfig>> &
		React.RefAttributes<HTMLAnchorElement>
> = forwardRef(
	(
		{ href, children, ...rest }: RouterLinkComponentProps<MyRouterLinkConfig>,
		ref: Ref<HTMLAnchorElement>,
	) => {
		const label = <>{children} (Router link)</>;

		if (typeof href === 'string') {
			return (
				// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
				<a ref={ref} data-test-link-type="simple" href={href} {...rest}>
					{label}
				</a>
			);
		}

		return (
			// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
			<a
				ref={ref}
				data-test-link-type="advanced"
				data-custom-attribute={href.customProp}
				href={href.to}
				{...rest}
			>
				{label}
			</a>
		);
	},
);

const testCases: Array<{
	value: string;
	type: string;
	id: string;
	shouldRouterLinkComponentBeUsed: {
		whenUndefined: boolean;
		whenDefined: boolean;
	};
}> = [
	{
		value: '/home',
		type: 'Internal link',
		id: 'internal-link',
		shouldRouterLinkComponentBeUsed: {
			whenUndefined: false,
			whenDefined: true,
		},
	},
	{
		value: 'http://atlassian.com',
		type: 'External link (http)',
		id: 'external-link-http',
		shouldRouterLinkComponentBeUsed: {
			whenUndefined: false,
			whenDefined: false,
		},
	},
	{
		value: 'https://atlassian.com',
		type: 'External link (https)',
		id: 'external-link-https',
		shouldRouterLinkComponentBeUsed: {
			whenUndefined: false,
			whenDefined: false,
		},
	},
	{
		value: 'mailto:test@example.com',
		type: 'Email',
		id: 'mailto-link',
		shouldRouterLinkComponentBeUsed: {
			whenUndefined: false,
			whenDefined: false,
		},
	},
	{
		value: 'tel:0400-000-000',
		type: 'Telephone',
		id: 'tel-link',
		shouldRouterLinkComponentBeUsed: {
			whenUndefined: false,
			whenDefined: false,
		},
	},
	{
		value: 'sms:0400-000-000?&body=foo',
		type: 'SMS',
		id: 'sms',
		shouldRouterLinkComponentBeUsed: {
			whenUndefined: false,
			whenDefined: false,
		},
	},
	{
		value: '#hash',
		type: 'Hash link (on current page)',
		id: 'hash-link-current-page',
		shouldRouterLinkComponentBeUsed: {
			whenUndefined: false,
			whenDefined: false,
		},
	},
	{
		value: '/home#hash',
		type: 'Hash link (on internal page)',
		id: 'hash-link-internal',
		shouldRouterLinkComponentBeUsed: {
			whenUndefined: false,
			whenDefined: true,
		},
	},
];

linkButtonVariants.forEach(({ name, Component }) => {
	describe(name, () => {
		describe('should conditionally render router links or standard <a> anchors', () => {
			describe('when links are used outside an AppProvider', () => {
				testCases.forEach(({ id, type, value, shouldRouterLinkComponentBeUsed }) => {
					it(type, () => {
						render(
							<Component href={value} testId={id}>
								Hello world
							</Component>,
						);

						expect(screen.getByTestId(id)).toHaveAttribute(
							'data-is-router-link',
							`${shouldRouterLinkComponentBeUsed.whenUndefined}`,
						);
					});
				});
			});
			describe('when links are used inside an AppProvider, without a routerLinkComponent defined', () => {
				testCases.forEach(({ id, type, value, shouldRouterLinkComponentBeUsed }) => {
					it(type, () => {
						render(
							<AppProvider>
								<Component href={value} testId={id}>
									Hello world
								</Component>
							</AppProvider>,
						);

						expect(screen.getByTestId(id)).toHaveAttribute(
							'data-is-router-link',
							`${shouldRouterLinkComponentBeUsed.whenUndefined}`,
						);
					});
				});
			});
			describe('when links are used outside an AppProvider, with a routerLinkComponent defined', () => {
				testCases.forEach(({ id, type, value, shouldRouterLinkComponentBeUsed }) => {
					it(type, () => {
						render(
							<AppProvider routerLinkComponent={MyRouterLinkComponent}>
								<Component href={value} testId={id}>
									Hello world
								</Component>
							</AppProvider>,
						);

						expect(screen.getByTestId(id)).toHaveAttribute(
							'data-is-router-link',
							`${shouldRouterLinkComponentBeUsed.whenDefined}`,
						);
					});
				});
			});
		});
	});
});

describe('LinkIconButton: compact spacing regression', () => {
	it('applies compact dimensions (1.5rem) to trigger when href, icon, label, spacing="compact", and isTooltipDisabled={false}', () => {
		render(
			<LinkIconButton
				href="/settings"
				icon={SettingsIcon}
				label="Settings"
				spacing="compact"
				isTooltipDisabled={false}
				testId="link-icon-button-compact"
			/>,
		);

		const trigger = screen.getByTestId('link-icon-button-compact');
		expect(trigger).toHaveCompiledCss('height', '1.5rem');
		expect(trigger).toHaveCompiledCss('width', '1.5rem');
	});
});
