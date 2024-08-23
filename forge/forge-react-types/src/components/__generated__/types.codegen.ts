/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Shared types file from UIKit 2
 *
 * @codegen <<SignedSource::634fdc59c731fd94bdd55b0d31077d48>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/types.ts <<SignedSource::01eebd8c9c7c64bb9ed0b194e2475ed4>>
 */
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
