import React from 'react';
import MockServiceProvider from './helpers/mock-provider';
import { Container } from './helpers/styles';
import { EmbeddedDocument, DocumentBody } from '../src';

export default function Example() {
  const mockProvider = new MockServiceProvider();
  return (
    <Container>
      <EmbeddedDocument
        provider={mockProvider}
        objectId="ari:cloud:demo::document/1"
        documentId="demo-doc"
      >
        <DocumentBody />
      </EmbeddedDocument>
    </Container>
  );
}
