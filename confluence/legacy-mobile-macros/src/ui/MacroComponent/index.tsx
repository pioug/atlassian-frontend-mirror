import React, { type FC } from 'react';

import { injectIntl, type WrappedComponentProps } from 'react-intl-next';

import { macroExtensionHandlerKey } from './constants';
// import { ExtensionLinkComponent } from './ExtensionLinkComponent';
import { hasInlineImplementation, InlineMacroComponent } from './InlineMacroComponent';
import { InlineSSRMacroComponent } from './InlineSSRMacroComponent';
import { MacroFallbackCard, MacroFallbackComponent } from './MacroFallbackComponent';
import { PlaceholderComponent } from './PlaceholderComponent';
import { type MacroComponentProps } from './types';

const BaseMacroComponent: FC<MacroComponentProps & WrappedComponentProps> = (props) => {
	const { extension, renderingStrategy, defaultRenderingStrategy } = props;

	const renderDefault = () => (
		<BaseMacroComponent {...props} renderingStrategy={defaultRenderingStrategy} />
	);

	const renderFallback = () => <MacroFallbackComponent openInBrowser={false} {...props} />;

	const renderOpenInBrowser = () => <MacroFallbackComponent openInBrowser={true} {...props} />;

	const renderInline = () => <InlineMacroComponent {...props} />;

	const renderInlineStatic = () => (
		<InlineSSRMacroComponent outputDeviceType="MOBILE" renderFallback={renderDefault} {...props} />
	);

	const renderInlineDynamic = () => (
		<InlineSSRMacroComponent outputDeviceType="DESKTOP" renderFallback={renderDefault} {...props} />
	);

	switch (renderingStrategy) {
		// NOTE: Rendering as link disabled until we can fix setContent overriding
		//       nested renderer content
		// case 'link':
		//   return (<ExtensionLinkComponent extension={extension} render={nestedRender} />)

		case 'fallback':
			return renderFallback();

		case 'inline':
			return hasInlineImplementation(extension.extensionKey) ? renderInline() : renderDefault();

		case 'inlineStatic':
			return renderInlineStatic();

		case 'inlineDynamic':
			return renderInlineDynamic();

		case 'placeholderUrlImplementation':
			return <PlaceholderComponent renderFallback={renderDefault} {...props} />;

		case 'openInBrowser':
			return renderOpenInBrowser();

		default:
			if (renderingStrategy !== defaultRenderingStrategy) {
				return renderDefault();
			} else {
				return renderFallback();
			}
	}
};

export {
	InlineMacroComponent,
	InlineSSRMacroComponent,
	macroExtensionHandlerKey,
	MacroFallbackCard,
	MacroFallbackComponent,
};

export const MacroComponent = injectIntl(BaseMacroComponent);
