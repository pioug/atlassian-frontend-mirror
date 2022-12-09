import React from 'react';
import { ElementName, MetadataBlock } from '../../src';
import ExampleContainer from './example-container';

export default () => (
  <ExampleContainer>
    <MetadataBlock
      primary={[
        { name: ElementName.AttachmentCount },
        { name: ElementName.AuthorGroup },
        { name: ElementName.ChecklistProgress },
        { name: ElementName.CreatedBy },
        { name: ElementName.CreatedOn },
        { name: ElementName.CollaboratorGroup },
        { name: ElementName.ModifiedBy },
        { name: ElementName.ModifiedOn },
        { name: ElementName.State },
        { name: ElementName.SubscriberCount },
        { name: ElementName.CommentCount },
        { name: ElementName.Priority },
        { name: ElementName.ViewCount },
        { name: ElementName.VoteCount },
        { name: ElementName.ReactCount },
        // Repeat
        { name: ElementName.AttachmentCount },
        { name: ElementName.AuthorGroup },
        { name: ElementName.ChecklistProgress },
        { name: ElementName.CreatedBy },
        { name: ElementName.CreatedOn },
        { name: ElementName.CollaboratorGroup },
        { name: ElementName.ModifiedBy },
        { name: ElementName.ModifiedOn },
        { name: ElementName.State },
        { name: ElementName.SubscriberCount },
        { name: ElementName.CommentCount },
        { name: ElementName.Priority },
        { name: ElementName.ViewCount },
        { name: ElementName.VoteCount },
        { name: ElementName.ReactCount },
      ]}
    />
  </ExampleContainer>
);
