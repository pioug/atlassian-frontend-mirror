import type React from 'react';

import { type ButtonProps as AKButtonProps } from '@atlaskit/button';

export type VideoMeta = {
	duration?: number;
	sharedUrl: string;
	title: string;
};

type LoomClient = {
	attachToButton: (options: {
		button: HTMLElement;
		onInsert: (videoMeta: VideoMeta) => void;
	}) => void;
};

export type PositionType = 'start' | 'end' | 'current';

export type LoomPluginErrorMessages =
	| 'is-supported-failure'
	| 'failed-to-initialise'
	| 'api-key-not-provided';
export type LoomSDKErrorMessages =
	| 'incompatible-browser'
	| 'third-party-cookies-disabled'
	| 'no-media-streams-support';

export type GetClientResult =
	| {
			client: LoomClient;
			status: 'loaded';
	  }
	| {
			message: LoomPluginErrorMessages | LoomSDKErrorMessages;
			status: 'error';
	  };

export type GetClient = Promise<GetClientResult>;

export type LoomProviderOptions = {
	getClient: () => GetClient;
};

export interface ButtonComponentProps extends Pick<
	AKButtonProps,
	| 'selected'
	| 'isDisabled'
	| 'onBlur'
	| 'onFocus'
	| 'onKeyDown'
	| 'onMouseEnter'
	| 'onMouseLeave'
	| 'aria-controls'
	| 'aria-expanded'
	| 'aria-haspopup'
	| 'href'
	| 'target'
	| 'rel'
> {
	'data-ds--level'?: string;
	/**
	 * on click handler that will only be called before the Loom SDK is initialised.
	 * Once the SDK is initialised, onClick will be handled by editor to start recording.
	 */
	onClickBeforeInit?: (event: React.MouseEvent<HTMLElement>) => void;
}

export type ButtonComponent = React.ForwardRefExoticComponent<
	ButtonComponentProps & React.RefAttributes<HTMLElement>
>;

export type RenderButton = (ButtonComponent: ButtonComponent) => JSX.Element | null;

export type LoomPluginOptionsWithProvider = {
	loomProvider: LoomProviderOptions;
	/**
	 * Customize the button component, e.g. adding pulse, a11y.
	 * @note When this is provided, `shouldShowToolbarButton` can be skipped and the button will still show. \
	 * If `shouldShowToolbarButton` is false, the button will not show regardless of this prop.
	 * @param ButtonComponent Loom toolbar button component (mainly UI)
	 */
	renderButton?: RenderButton;
	/**
	 * Due to contrainsts with the toolbar model the menu needs to know if any menu items will truely render. Right now
	 * it's not possible to inspect the output of renderButton to detemine this so we need to pass it in as a prop.
	 */
	shouldRenderButton?: () => boolean;
	shouldShowToolbarButton?: boolean;
};

export type LoomPluginOptionsWithoutProvider = {
	loomProvider?: LoomProviderOptions;
	/**
	 * Customize the button component, e.g. adding pulse, a11y.
	 * @note When this is provided, `shouldShowToolbarButton` can be skipped and the button will still show. \
	 * If `shouldShowToolbarButton` is false, the button will not show regardless of this prop.
	 * @param ButtonComponent Loom toolbar button component (mainly UI)
	 */
	renderButton: RenderButton;
	/**
	 * Due to contrainsts with the toolbar model the menu needs to know if any menu items will truely render. Right now
	 * it's not possible to inspect the output of renderButton to detemine this so we need to pass it in as a prop.
	 */
	shouldRenderButton?: () => boolean;
	shouldShowToolbarButton?: boolean;
};

export type LoomPluginOptions = LoomPluginOptionsWithProvider | LoomPluginOptionsWithoutProvider;
