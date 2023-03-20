import { IntlProviderIfMissingWrapper } from '@atlaskit/editor-common/ui';
import React from 'react';
import Editor from '../../editor';
import EditorNext from '../../editor-next';
import EditorMigrationComponent from '../../editor-next/editor-migration-component';
import EditorWithActions from '../../labs/EditorWithActions';
import ChromeCollapsed from '../ChromeCollapsed';

export interface Props {
  placeholder?: string;
  children?: any;
  isExpanded?: boolean;

  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onExpand?: () => void;
}

export interface State {}

export default class CollapsedEditor extends React.Component<Props, State> {
  editorComponent?: Editor | EditorNext | EditorMigrationComponent;
  previouslyExpanded?: boolean;

  componentDidUpdate() {
    if (
      this.props.isExpanded &&
      this.editorComponent &&
      (!this.previouslyExpanded || this.previouslyExpanded === undefined)
    ) {
      this.props.onExpand?.();
    }
    this.previouslyExpanded = this.props.isExpanded;
  }

  handleEditorRef = (editorRef?: Editor, editorRefCallback?: any) => {
    if (editorRefCallback && typeof editorRefCallback === 'function') {
      editorRefCallback(editorRef);
    }
    this.editorComponent = editorRef;
  };

  render() {
    const child = React.Children.only(this.props.children);
    if (
      child.type !== Editor &&
      child.type !== EditorWithActions &&
      child.type !== EditorNext &&
      child.type !== EditorMigrationComponent
    ) {
      throw new Error('Expected child to be of type `Editor`');
    }

    if (!this.props.isExpanded) {
      return (
        <IntlProviderIfMissingWrapper>
          <ChromeCollapsed
            onFocus={this.props.onFocus}
            text={this.props.placeholder}
          />
        </IntlProviderIfMissingWrapper>
      );
    }

    return React.cloneElement(child, {
      ref: (editorComponent: Editor) =>
        this.handleEditorRef(editorComponent, (child as any).ref),
    });
  }
}
