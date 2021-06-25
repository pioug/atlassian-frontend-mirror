import { EditorState } from 'prosemirror-state';
import React from 'react';
import mentionsPlugin from '../../../../../plugins/mentions';
import { PluginKey } from 'prosemirror-state';
import { TeamMentionHighlight } from '@atlaskit/mention/spotlight';
import { mount } from 'enzyme';

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

  it('should render TeamMentionHighlight', () => {
    jest.spyOn(PluginKey.prototype, 'getState').mockImplementation(() => ({
      mentionProvider: {
        mentionTypeaheadHighlightEnabled: () => true,
        mentionTypeaheadCreateTeamPath: () => 'link',
      },
    }));
    const { pluginsOptions } = mentionsPlugin();
    const getHighlight = pluginsOptions?.typeAhead?.getHighlight;

    const TeamHighlight = mount(
      getHighlight!({} as EditorState) as JSX.Element,
    );

    expect(TeamHighlight.find(TeamMentionHighlight)).toHaveLength(1);
  });
});
