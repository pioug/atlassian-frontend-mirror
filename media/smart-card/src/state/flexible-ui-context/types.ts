import { LinkLozenge } from '../../extractors/common/lozenge/types';
import { LinkPerson } from '../../extractors/common/person/types';
import { IconType, MediaType } from '../../constants';

export type FlexibleUiDataContext = {
  authorGroup?: LinkPerson[];
  collaboratorGroup?: LinkPerson[];
  commentCount?: number;
  viewCount?: number;
  reactCount?: number;
  voteCount?: number;
  createdBy?: string;
  createdOn?: string;
  linkIcon?: Icon;
  modifiedBy?: string;
  modifiedOn?: string;
  preview?: Media;
  priority?: Icon;
  programmingLanguage?: string;
  snippet?: string;
  subscriberCount?: number;
  state?: LinkLozenge;
  title?: string;
  url?: string;
  provider?: Icon;
};

export type Icon = {
  icon?: IconType;
  label?: string;
  url?: string;
};

export type Media = {
  type: MediaType;
  url: string;
};
