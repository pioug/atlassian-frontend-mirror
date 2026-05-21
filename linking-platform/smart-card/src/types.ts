import { type JsonLd } from '@atlaskit/json-ld-types';
/** @deprecated Use @atlaskit/link-provider */
export { type CardContext } from '@atlaskit/link-provider';
import { type LozengeProps as AtlaskitLozengeProps } from '@atlaskit/lozenge';

/** @deprecated Use @atlaskit/json-ld-types */
export type ResolveResponse = JsonLd.Response;

export {
	/** @deprecated Use @atlaskit/link-provider */
	type ProviderProps,
	/** @deprecated Use @atlaskit/linking-common */
	type CardType
} from './state';

/** @deprecated Use @atlaskit/smart-card/card/types */
export { type CardProps, type CardAppearance, type CardPlatform } from './view/Card/types';

/** @deprecated Use @atlaskit/smart-card/card/types CardProps['inlinePreloaderStyle'] */
export type InlinePreloaderStyle = 'on-left-with-skeleton' | 'on-right-without-skeleton';

/** @deprecated Use internally, no external support */
export type LozengeColor = 'default' | 'success' | 'removed' | 'inprogress' | 'new' | 'moved';

/** @deprecated Use internally, no external support */
export interface LozengeProps {
	appearance?: LozengeColor; // defaults to 'default'
	isBold?: boolean; // defaults to false
	style?: AtlaskitLozengeProps['style'];
	text: string;
}

/** @deprecated Use @atlaskit/smart-card/flexible/title-block React.ComponentProps<typeof TitleBlock> */
export type { TitleBlockProps } from './view/FlexibleCard/components/blocks/title-block/types';
