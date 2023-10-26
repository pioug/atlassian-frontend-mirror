import React from 'react';
import { IntlProvider } from 'react-intl-next';
import CollapsedEditor from './../src/CollapsedEditor';

export interface State {
  isExpanded: boolean;
}
export default class Example extends React.Component<{}, State> {
  state = { isExpanded: false };

  toggleExpanded = () => {
    this.setState((prevState) => ({ isExpanded: !prevState.isExpanded }));
  };

  render() {
    return (
      <IntlProvider locale="en">
        <CollapsedEditor
          placeholder="What would you like to say?"
          isExpanded={this.state.isExpanded}
          onClickToExpand={this.toggleExpanded}
          renderEditor={(Editor) => (
            <Editor
              appearance="comment"
              quickInsert={true}
              onSave={() => alert('Saved!')}
              onCancel={this.toggleExpanded}
            />
          )}
        />
      </IntlProvider>
    );
  }
}
