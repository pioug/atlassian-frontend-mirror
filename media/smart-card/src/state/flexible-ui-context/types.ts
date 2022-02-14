import { LinkLozenge } from '../../extractors/common/lozenge/types';
import { LinkPerson } from '../../extractors/common/person/types';
import { IconType } from '../../constants';

export type FlexibleUiDataContext = {
  commentCount?: number;
  createdBy?: string;
  createdOn?: string;
  linkIcon?: Icon;
  modifiedBy?: string;
  modifiedOn?: string;
  priority?: Icon;
  programmingLanguage?: string;
  subscriberCount?: number;
  state?: LinkLozenge;
  title?: string;
  url?: string;
  authorGroup?: LinkPerson[];
  collaboratorGroup?: LinkPerson[];
};

export type Icon = {
  icon?: IconType;
  label?: string;
  url?: string;
};
