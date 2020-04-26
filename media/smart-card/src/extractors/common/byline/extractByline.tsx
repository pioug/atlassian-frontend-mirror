import React from 'react';
import { JsonLd } from 'json-ld-types';
import { FormattedRelative } from 'react-intl';

import {
  extractPersonUpdatedBy,
  LinkTypeUpdatedBy,
} from '../person/extractPersonUpdatedBy';
import { extractPersonCreatedBy } from '../person/extractPersonCreatedBy';
import {
  extractDateCreated,
  LinkTypeCreated,
} from '../date/extractDateCreated';
import { extractDateUpdated } from '../date/extractDateUpdated';
import { LinkPerson } from '../person';

export const extractByline = (
  jsonLd: JsonLd.Data.BaseData,
): React.ReactNode | undefined => {
  const updatedAt = extractDateUpdated(jsonLd);
  const createdAt = extractDateCreated(jsonLd as LinkTypeCreated);
  if (updatedAt) {
    const updatedBy = extractPersonUpdatedBy(jsonLd as LinkTypeUpdatedBy);
    return (
      <span>
        Updated {updatedBy && `by ${updatedBy.name}`}{' '}
        <FormattedRelative value={updatedAt} />
      </span>
    );
  } else if (createdAt) {
    const createdBy = extractPersonCreatedBy(jsonLd);
    const createdByPerson = extractFirstPerson(createdBy);
    return (
      <span>
        Created {createdByPerson && `by ${createdByPerson.name}`}{' '}
        <FormattedRelative value={createdAt} />
      </span>
    );
  }
};

const extractFirstPerson = (persons?: LinkPerson[]): LinkPerson | undefined => {
  if (persons && persons.length > 0) {
    return persons.shift()!;
  }
};
