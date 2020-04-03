import { TextFormattingState } from '@atlaskit/editor-core';

export interface MarkState {
  name: string;
  active: boolean;
  enabled: boolean;
}

export function valueOf(state: TextFormattingState): MarkState[] {
  let states: MarkState[] = [
    {
      name: 'strong',
      active: state.strongActive || false,
      enabled: !state.strongDisabled,
    },
    {
      name: 'em',
      active: state.emActive || false,
      enabled: !state.emDisabled,
    },
    {
      name: 'code',
      active: state.codeActive || false,
      enabled: !state.codeDisabled,
    },
    {
      name: 'underline',
      active: state.underlineActive || false,
      enabled: !state.underlineDisabled,
    },
    {
      name: 'strike',
      active: state.strikeActive || false,
      enabled: !state.strongDisabled,
    },
    {
      name: 'sup',
      active: state.superscriptActive || false,
      enabled: !state.superscriptDisabled,
    },
    {
      name: 'sub',
      active: state.subscriptActive || false,
      enabled: !state.subscriptDisabled,
    },
  ];
  return states;
}
