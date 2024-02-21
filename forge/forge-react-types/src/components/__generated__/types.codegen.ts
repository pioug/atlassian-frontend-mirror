/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Shared types file from UIKit 2
 *
 * @codegen <<SignedSource::876fcb93a6505f3c3d8febc6657b1016>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/types.ts <<SignedSource::4c43233e6c4a02225fbb326afeddd9f7>>
 */
export type SerialisableEvent = {
  bubbles: boolean;
  cancelable: boolean;
  defaultPrevented: boolean;
  eventPhase: number;
  isTrusted: boolean;
  nativeEvent: any;
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
