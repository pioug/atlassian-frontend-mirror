/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Shared types file from UIKit 2
 *
 * @codegen <<SignedSource::65d194d117930d36350ecd1b5f0bab19>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/types.ts <<SignedSource::ead448842d74cb269e35940f951e298f>>
 */
export type SerialisableEvent = {
	bubbles: boolean;
	cancelable: boolean;
	defaultPrevented: boolean;
	eventPhase: number;
	isTrusted: boolean;
	target: {
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

export type EventHandlerProps = {
	onChange?: (event: SerialisableEvent) => void;
	onBlur?: (event: SerialisableEvent) => void;
	onFocus?: (event: SerialisableEvent) => void;
};
