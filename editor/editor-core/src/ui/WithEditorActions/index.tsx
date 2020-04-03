import React from 'react';
import PropTypes from 'prop-types';
import EditorActions from '../../actions';

export interface WithEditorActionsProps {
  render(actions: EditorActions): React.ReactElement<any> | null;
}

export default class WithEditorActions extends React.Component<
  WithEditorActionsProps,
  any
> {
  static contextTypes = {
    editorActions: PropTypes.object.isRequired,
  };

  context!: {
    editorActions: EditorActions;
  };

  componentDidMount() {
    this.context.editorActions._privateSubscribe(this.onContextUpdate);
  }

  componentWillUnmount() {
    this.context.editorActions._privateUnsubscribe(this.onContextUpdate);
  }

  private onContextUpdate = () => {
    // Re-render actions when editorActions changes...
    this.forceUpdate();
  };

  render() {
    return this.props.render(this.context.editorActions);
  }
}
