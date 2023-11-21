import {
  AggJqlBuilderFieldNode,
  Appearance,
  appearanceMap,
  ColorName,
  FieldValuesResponse,
  HydrateResponse,
  SelectedOptionsMap,
  SelectOption,
} from '../types';

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

function mapNodeToOption({
  displayName,
  jqlTerm,
  group,
  issueTypes,
  project,
  statusCategory,
  user,
}: AggJqlBuilderFieldNode): SelectOption | null {
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
        icon: project.avatar?.small,
      };
    }

    if (issueTypes) {
      return {
        ...baseProps,
        optionType: 'iconLabel',
        icon: issueTypes[0]?.avatar.small,
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
}: FieldValuesResponse): SelectOption[] {
  return (
    data?.jira?.jqlBuilder?.fieldValues?.edges
      ?.map(edge => (edge.node ? mapNodeToOption(edge.node) : null))
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
