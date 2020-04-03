import React from 'react';
import { PureComponent } from 'react';
import { Actions } from '../context/context';
import { Consumer } from '../consumers/consumer';
import { Document as DocumentModel } from '../model';

export interface Props {
  render(actions: DocumentActions): React.ReactNode;
}

export interface DocumentActions {
  createDocument(value: any): Promise<DocumentModel>;
  editDocument(): void;
  cancelEdit(): void;
  updateDocument(value: any): Promise<DocumentModel>;
}

export default class WithDocumentActions extends PureComponent<Props> {
  private actionsMapper = (actions: Actions): DocumentActions => ({
    async createDocument(value: any) {
      return actions.createDocument(value);
    },

    async editDocument() {
      actions.setDocumentMode('edit');
    },

    async updateDocument(value: any) {
      return actions.updateDocument(value);
    },

    async cancelEdit() {
      actions.setDocumentMode('view');
    },
  });

  render() {
    return (
      <Consumer actionsMapper={this.actionsMapper}>
        {this.props.render}
      </Consumer>
    );
  }
}
