import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import React from 'react';

import mentionsPlugin from '../../../../../plugins/mentions';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

const CustomHighlightComponent = () => <div>HighlightComponent</div>;

describe('Highlight component', () => {
  it('should render custom component', () => {
    const { pluginsOptions } = mentionsPlugin({
      HighlightComponent: CustomHighlightComponent,
    });
    const getHighlight = pluginsOptions?.typeAhead?.getHighlight;
    expect(getHighlight!({} as EditorState)).toEqual(
      <CustomHighlightComponent />,
    );
  });

  it('should not render custom component', () => {
    jest.spyOn(PluginKey.prototype, 'getState').mockImplementation(() => ({}));
    const { pluginsOptions } = mentionsPlugin();
    const getHighlight = pluginsOptions?.typeAhead?.getHighlight;

    expect(getHighlight!({} as EditorState)).toEqual(null);
  });
});
