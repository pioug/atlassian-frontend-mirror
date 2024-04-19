import { SelectOption } from '../../../common/modal/popup-select/types';
import {
  AggJqlBuilderFieldNode,
  Appearance,
  appearanceMap,
  ColorName,
  FieldValuesResponse,
  HydrateResponse,
  SelectedOptionsMap,
} from '../types';
import { availableBasicFilterTypes } from '../ui';

function isNonNullSelectOption(
  edge: SelectOption | null,
): edge is SelectOption {
  return edge !== null;
}

function isColorName(colorName: string): colorName is ColorName {
  return Object.keys(appearanceMap).includes(colorName);
}

const getLozengeAppearance = (colorName: string): Appearance | undefined => {
  if (isColorName(colorName)) {
    return appearanceMap[colorName];
  }
};

const checkAndConvertToAbsoluteUrl = (
  url: string,
  siteUrl?: string,
): string => {
  if (!url) {
    return '';
  }

  if (/^data:(.*)/.test(url) || /^http(.*)/.test(url) || !siteUrl) {
    return url;
  }

  return `${siteUrl}${url}`;
};

function mapNodeToOption({
  displayName,
  jqlTerm,
  group,
  issueTypes,
  project,
  statusCategory,
  user,
  siteUrl,
}: AggJqlBuilderFieldNode & { siteUrl?: string }): SelectOption | null {
  try {
    const baseProps = {
      label: displayName,
      // this ensures that the returned value is not wrapped in single and double quotes
      // e.g. '"value"' -> 'value'
      value: decodeURIComponent(jqlTerm).replace(/^"|"$/g, ''),
    };

    if (user) {
      return {
        ...baseProps,
        optionType: 'avatarLabel',
        avatar: user.picture,
        isSquare: false,
      };
    }

    if (group) {
      return {
        ...baseProps,
        optionType: 'avatarLabel',
        isGroup: true,
      };
    }

    if (project) {
      return {
        ...baseProps,
        optionType: 'iconLabel',
        icon: checkAndConvertToAbsoluteUrl(project.avatar?.small, siteUrl),
      };
    }

    if (issueTypes) {
      return {
        ...baseProps,
        optionType: 'iconLabel',
        icon: checkAndConvertToAbsoluteUrl(
          issueTypes[0]?.avatar.small,
          siteUrl,
        ),
      };
    }

    if (statusCategory) {
      return {
        ...baseProps,
        optionType: 'lozengeLabel',
        appearance: getLozengeAppearance(statusCategory.colorName),
      };
    }

    return null;
  } catch (error) {
    return null;
  }
}

export function mapHydrateResponseData({ data }: HydrateResponse) {
  const transformedHydrateResponseData: SelectedOptionsMap = {};

  data?.jira?.jqlBuilder?.hydrateJqlQuery?.fields?.forEach(
    ({ jqlTerm, values = [] }) => {
      /**
       * Currently, we expect to hydrate only the 4 filter fields that we use.
       * Hence we check if jqlTerm is one of the values in availableBasicFilterTypes
       */
      if (!availableBasicFilterTypes.includes(jqlTerm)) {
        return;
      }

      const options =
        values
          .map(({ values }) =>
            values && values[0] ? mapNodeToOption(values[0]) : null,
          )
          .filter(isNonNullSelectOption) || [];

      transformedHydrateResponseData[jqlTerm] = options;
    },
  );

  return transformedHydrateResponseData;
}

export function mapFieldValuesToFilterOptions({
  data,
  siteUrl,
}: FieldValuesResponse & { siteUrl?: string }): SelectOption[] {
  return (
    data?.jira?.jqlBuilder?.fieldValues?.edges
      ?.map(edge =>
        edge.node ? mapNodeToOption({ ...edge.node, siteUrl }) : null,
      )
      .filter(isNonNullSelectOption) || []
  );
}

export function mapFieldValuesToTotalCount({
  data,
}: FieldValuesResponse): number {
  return data?.jira?.jqlBuilder?.fieldValues?.totalCount || 0;
}

export function mapFieldValuesToPageCursor({
  data,
}: FieldValuesResponse): string | undefined {
  return data?.jira?.jqlBuilder?.fieldValues?.pageInfo?.endCursor;
}
