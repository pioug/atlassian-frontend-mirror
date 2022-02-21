import { LinkLozenge } from '../../extractors/common/lozenge/types';
import { LinkPerson } from '../../extractors/common/person/types';
import { IconType } from '../../constants';

export type FlexibleUiDataContext = {
  authorGroup?: LinkPerson[];
  collaboratorGroup?: LinkPerson[];
  commentCount?: number;
  createdBy?: string;
  createdOn?: string;
  linkIcon?: Icon;
  modifiedBy?: string;
  modifiedOn?: string;
  priority?: Icon;
  programmingLanguage?: string;
  snippet?: string;
  subscriberCount?: number;
  state?: LinkLozenge;
  title?: string;
  url?: string;
};

export type Icon = {
  icon?: IconType;
  label?: string;
  url?: string;
};
