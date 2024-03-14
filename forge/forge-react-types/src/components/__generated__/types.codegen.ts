/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Shared types file from UIKit 2
 *
 * @codegen <<SignedSource::c561f6f4e9b302f67dba090188fadfd4>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/types.ts <<SignedSource::673c66c74d1dcb5e919b6232d69247f9>>
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
