import React from 'react';
import {
	RawIntlProvider,
	createIntl,
	type WrappedComponentProps,
	IntlProvider,
} from 'react-intl-next';
// eslint-disable-next-line import/no-extraneous-dependencies
import { mount, type ReactWrapper, shallow, type ShallowWrapper } from 'enzyme';
import { type Component, type ReactElement } from 'react';

const mockIntl = createIntl({ locale: 'en' });

/**
 * When using React-Intl `injectIntl` on components, props.intl is required.
 */
function nodeWithIntlProp(node: ReactElement<any>) {
	const intl = !!node.props.intl ? node.props.intl : mockIntl;

	return <RawIntlProvider value={intl}>{React.cloneElement(node, { intl })}</RawIntlProvider>;
}

/* TODO: We are explicitly using the third arg of ReactWrapper to work around the following TS issue which prevents a d.ts from being generated
 * and therefore fails the build:
 * error TS2742: The inferred type of 'mountWithIntlContext' cannot be named without a reference to 'react-transition-group/node_modules/@types/react'. This is likely not portable. A type annotation is necessary.
 * TS is resolving enzyme's usage of react to react-transition-group???
 */
export const mountWithIntlContext = <P, S, C extends Component<P, S> = Component<P, S>>(
	node: ReactElement<P & WrappedComponentProps>,
	{ context = {}, childContextTypes = {}, ...additionalOptions } = {},
): ReactWrapper<P & WrappedComponentProps, S, C> => {
	const intl = !!node.props.intl ? node.props.intl : mockIntl;

	return mount(nodeWithIntlProp(node) as ReactElement<P & WrappedComponentProps>, {
		context: { intl, ...context },
		...additionalOptions,
	});
};

export const shallowWithIntlContext = <P, S, C extends Component<P, S> = Component<P, S>>(
	node: ReactElement<P & WrappedComponentProps>,
	{ context = {}, ...additionalOptions } = {},
): ShallowWrapper<P & WrappedComponentProps, S, C> => {
	const intl = !!node.props.intl ? node.props.intl : mockIntl;

	return shallow(nodeWithIntlProp(node) as ReactElement<P & WrappedComponentProps>, {
		context: { intl, ...context },
		...additionalOptions,
	});
};

export const mountWithIntlWrapper = (node: React.ReactElement): ReactWrapper => {
	return mount(
		React.createElement((props) => (
			<IntlProvider locale="en">{React.cloneElement(node, { ...props })}</IntlProvider>
		)),
	);
};
