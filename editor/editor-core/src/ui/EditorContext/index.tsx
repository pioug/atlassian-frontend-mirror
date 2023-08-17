import React from 'react';
import PropTypes from 'prop-types';
import EditorActions from '../../actions';
import { PresetContextProvider } from '../../presets/context';

export type EditorContextProps = { editorActions?: EditorActions };

const EditorContext = React.createContext({});

export const useEditorContext = () =>
  React.useContext<EditorContextProps>(EditorContext);
export default class LegacyEditorContext extends React.Component<
  EditorContextProps,
  {}
> {
  static childContextTypes = {
    editorActions: PropTypes.object,
  };

  private editorActions: EditorActions;

  constructor(props: EditorContextProps) {
    super(props);
    this.editorActions = props.editorActions || new EditorActions();
  }

  getChildContext() {
    return {
      editorActions: this.editorActions,
    };
  }

  render() {
    return (
      <EditorContext.Provider value={this.getChildContext()}>
        <PresetContextProvider>{this.props.children}</PresetContextProvider>
      </EditorContext.Provider>
    );
  }
}
