/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Shared types file for UI Kit components. Add shared types to `packages/forge/forge-ui/src/components/UIKit/types.ts` for it to be code generated here and imported correctly into prop type files
 *
 * @codegen <<SignedSource::b2b7a10e65886f5c4faaa035f364ca67>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/types.ts <<SignedSource::176a0f595b09d6501c2d9b64e6784672>>
 */
// ---- Types for Form components
export type SerialisableEvent = {
	bubbles: boolean;
	cancelable: boolean;
	defaultPrevented: boolean;
	eventPhase: number;
	isTrusted: boolean;
	target: {
		selectionStart?: number | null;
		selectionEnd?: number | null;
		value?: any;
		checked?: boolean;
		name?: string;
		id?: string;
		tagName?: string;
		type?: string;
	};
	timeStamp: number;
	type: string;
};

export type InputEvent = SerialisableEvent;

export type EventHandlerProps = {
	onChange?: (event: InputEvent) => void;
	onBlur?: (event: InputEvent) => void;
	onFocus?: (event: InputEvent) => void;
};
