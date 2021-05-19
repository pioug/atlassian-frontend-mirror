import React from 'react';
import Button from '@atlaskit/button/standard-button';

import HelpArticle, { BODY_FORMAT_TYPES } from '../src';
import type { AdfDoc } from '../src';

import { AdfDocument, AdfDocumentComplex } from './utils/mockData';

const dataExamples = [
  {
    bodyFormat: BODY_FORMAT_TYPES.adf,
    body: AdfDocument,
  },
  {
    bodyFormat: BODY_FORMAT_TYPES.adf,
    body: AdfDocumentComplex,
  },
  {
    bodyFormat: BODY_FORMAT_TYPES.html,
    body:
      '<p>before image</p> <img src="https://via.placeholder.com/600x600.png/" class="page-list__image" alt="LoremFlickr placeholder image"/> <p>after image</p>',
  },
];

interface Props {}

interface State {
  // Article Content
  body?: string | AdfDoc;
  bodyFormat: BODY_FORMAT_TYPES;
}
// eslint-disable-next-line import/no-anonymous-default-export
export default class extends React.Component<Props, State> {
  currentExample = 0;

  constructor(props: any) {
    super(props);
    this.state = dataExamples[this.currentExample];
  }

  changeContent() {
    this.currentExample =
      this.currentExample + 1 < dataExamples.length
        ? this.currentExample + 1
        : 0;
    this.setState(dataExamples[this.currentExample]);
  }

  render() {
    return (
      <div style={{ padding: '10px' }}>
        <HelpArticle
          title="Article Title"
          body={this.state.body}
          bodyFormat={this.state.bodyFormat}
        />
        <Button type="button" onClick={() => this.changeContent()}>
          Change content
        </Button>
      </div>
    );
  }
}
