jest.autoMockOff();

import transformer from '../not-yet-migrate-aria-labelledby';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Rename `aria-labelledby` prop to `labelId`', () => {
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import React from 'react';
      import { Foo } from 'foo';

      const SimpleRadio = () => {
        return <Foo aria-labelledby="large" />;
      }
    `,
		`
      import React from 'react';
      import { Foo } from 'foo';

      const SimpleRadio = () => {
        return <Foo aria-labelledby="large" />;
      }
    `,
		'should do nothing with wrong import and wrong package',
	);
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import React from 'react';
      import { Radio } from 'foo';

      const SimpleRadio = () => {
        return <Radio aria-labelledby="large" />;
      }
    `,
		`
      import React from 'react';
      import { Radio } from 'foo';

      const SimpleRadio = () => {
        return <Radio aria-labelledby="large" />;
      }
    `,
		'should do nothing with wrong package',
	);
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import React from 'react';
      import { Foo } from '@atlaskit/radio';

      const SimpleRadio = () => {
        return <Foo aria-labelledby="large" />;
      }
    `,
		`
      import React from 'react';
      import { Foo } from '@atlaskit/radio';

      const SimpleRadio = () => {
        return <Foo aria-labelledby="large" />;
      }
    `,
		'should do nothing with wrong import',
	);
	['Radio', 'RadioGroup'].forEach((Component) => {
		defineInlineTest(
			{ default: transformer, parser: 'tsx' },
			{},
			`
      import React from 'react';
      import { ${Component} } from '@atlaskit/radio';

      const SimpleRadio = () => {
        return <${Component} aria-labelledby="large" />;
      }
    `,
			`
      import React from 'react';
      import { ${Component} } from '@atlaskit/radio';

      const SimpleRadio = () => {
        return <${Component} labelId="large" />;
      }
    `,
			'should rename prop',
		);
		defineInlineTest(
			{ default: transformer, parser: 'tsx' },
			{},
			`
      import React from 'react';
      import { ${Component} } from '@atlaskit/radio';

      const SimpleRadio = () => {
        return <${Component} baz="qux" aria-labelledby="large" foo="bar" />;
      }
    `,
			`
      import React from 'react';
      import { ${Component} } from '@atlaskit/radio';

      const SimpleRadio = () => {
        return <${Component} baz="qux" labelId="large" foo="bar" />;
      }
    `,
			'should not mess up the other props',
		);
	});
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
/** @jsx jsx */
import React from 'react';
import { Radio } from '@atlaskit/radio';
import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { FormattedMessage } from '@atlassian/jira-intl';
import { isDefined } from '@atlassian/jira-portfolio-3-portfolio/src/common/ramda/index.tsx';
import {
  AUTO_SCHEDULE_OVERWRITE,
  ISSUE_VALUES,
  type AutoScheduleOverwriteOptions,
  type IssueValues,
} from '@atlassian/jira-portfolio-3-portfolio/src/common/view/constant.tsx';
import commonMessages from '@atlassian/jira-portfolio-3-portfolio/src/common/view/messages.tsx';
import messages from './messages.tsx';
import type { Props } from './types.tsx';

const DETAILED_OVERWRITE_OPTIONS = [
  {
    value: AUTO_SCHEDULE_OVERWRITE.ALL_VALUES,
    label: <FormattedMessage {...messages.overwriteAllValuesDesc} />,
  },
  {
    value: AUTO_SCHEDULE_OVERWRITE.EMPTY_VALUES_ONLY,
    label: <FormattedMessage {...messages.overwriteEmptyValuesOnlyDesc} />,
  },
];

const OVERWRITE_OPTIONS = [
  {
    value: AUTO_SCHEDULE_OVERWRITE.ALL_VALUES,
    label: <FormattedMessage {...messages.overwriteAllValues} />,
  },
  {
    value: AUTO_SCHEDULE_OVERWRITE.EMPTY_VALUES_ONLY,
    label: <FormattedMessage {...messages.overwriteEmptyValuesOnly} />,
  },
];

const OVERWRITE_ISSUE_VALUES = [
  {
    value: ISSUE_VALUES.SPRINT,
    label: <FormattedMessage {...commonMessages.sprints} />,
  },
  {
    value: ISSUE_VALUES.RELEASE,
    label: <FormattedMessage {...commonMessages.releases} />,
  },
  {
    value: ISSUE_VALUES.TEAM,
    label: <FormattedMessage {...commonMessages.teams} />,
  },
];

const API_KEYS_FOR_OVERWRITE_ISSUE_VALUES = {
  [ISSUE_VALUES.SPRINT]: 'ignoreSprints',
  [ISSUE_VALUES.RELEASE]: 'ignoreReleases',
  [ISSUE_VALUES.TEAM]: 'ignoreTeams',
} as const;

const ConfigurationTable = ({
  autoScheduleConfiguration,
  isReadOnly,
  updateAutoScheduleConfiguration,
  withDetailedHeader,
  isReleasesEnabled,
}: Props) => {
  const getOverwriteHeader = () => {
    return withDetailedHeader ? DETAILED_OVERWRITE_OPTIONS : OVERWRITE_OPTIONS;
  };

  const isOptionSelected = (
    issueValue: IssueValues,
    overwriteOption: AutoScheduleOverwriteOptions,
  ) => {
    const apiKey = API_KEYS_FOR_OVERWRITE_ISSUE_VALUES[issueValue];

    return (
      isDefined(autoScheduleConfiguration) &&
      ((autoScheduleConfiguration[apiKey] &&
        overwriteOption === AUTO_SCHEDULE_OVERWRITE.ALL_VALUES) ||
        (!autoScheduleConfiguration[apiKey] &&
          overwriteOption === AUTO_SCHEDULE_OVERWRITE.EMPTY_VALUES_ONLY))
    );
  };

  const onConfigurationChange = (
    issueValue: IssueValues,
    overwriteOption: AutoScheduleOverwriteOptions,
  ): void => {
    updateAutoScheduleConfiguration({
      [API_KEYS_FOR_OVERWRITE_ISSUE_VALUES[issueValue]]:
        overwriteOption === AUTO_SCHEDULE_OVERWRITE.ALL_VALUES,
    });
  };

  const filterOutReleasesOptionWhenReleasesIsDisabled = ({
    value,
  }: {
    value: IssueValues;
    label: JSX.Element;
  }) => isReleasesEnabled || value !== ISSUE_VALUES.RELEASE;

  return (
    <div
      role="grid"
      aria-labelledby="overwrite-issue-values-title"
      aria-describedby="overwrite-issue-values-desc"
      aria-busy="true"
    >
      <div role="rowgroup">
        <div role="row" css={localStyles.header}>
          <div css={[localStyles.optionHeader, localStyles.firstColumn]} />
          <div
            css={[
              localStyles.optionValueHeader,
              !withDetailedHeader && localStyles.optionValueBorder,
            ]}
          >
            {OVERWRITE_ISSUE_VALUES.filter(filterOutReleasesOptionWhenReleasesIsDisabled).map(
              ({ label, value }, colIndex) => (
                <div
                  css={localStyles.optionValueContent}
                  id={\`column-\${colIndex}\`}
                  role="columnheader"
                  key={value}
                >
                  <div css={localStyles.optionHeader}>{label}</div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
      <div role="rowgroup" css={localStyles.radioContent}>
        {getOverwriteHeader().map(({ label, value: optionValue }, rowIndex) => (
          <div role="row" key={optionValue} css={localStyles.radioRow}>
            <div
              id={\`row-\${rowIndex}\`}
              role="rowheader"
              css={[localStyles.rowHeader, localStyles.firstColumn]}
            >
              {label}
            </div>
            <div css={localStyles.radioSelection}>
              {OVERWRITE_ISSUE_VALUES.filter(filterOutReleasesOptionWhenReleasesIsDisabled).map(
                ({ value: issueValue }, colIndex) => (
                  <div role="gridcell" key={issueValue}>
                    <Radio
                      isChecked={isOptionSelected(issueValue, optionValue)}
                      labelId={\`column-\${colIndex} row-\${rowIndex}\`}
                      name={issueValue}
                      isDisabled={isReadOnly}
                      value={optionValue}
                      onChange={() => onConfigurationChange(issueValue, optionValue)}
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const localStyles = cssMap({
  header: {
    display: 'flex',
  },
  firstColumn: {
    minWidth: '220px',
  },
  optionHeader: {
    flex: '1 1 0',
    font: token('font.heading.xxsmall'),
    color: token('color.text.subtlest'),
    marginBottom: token('space.100'),
  },
  optionValueHeader: {
    display: 'flex',
    flex: '1.5 1 0',
    marginTop: token('space.250'),
  },
  optionValueBorder: {
    borderBottomStyle: 'solid',
    borderBottomColor: token('color.border'),
    borderBottomWidth: token('border.width.selected'),
  },
  optionValueContent: {
    flex: '1 1 0',
    textAlign: 'center',
  },
  rowHeader: {
    flex: '1 1 0',
    marginTop: token('space.100'),
    color: token('color.text'),
  },
  radioContent: {
    marginTop: token('space.050'),
    marginBottom: token('space.150'),
  },
  radioRow: {
    display: 'flex',
  },
  radioSelection: {
    display: 'flex',
    flex: '1.5 1 0',
    marginTop: token('space.050'),
    marginBottom: token('space.050'),
    justifyContent: 'space-around',
  },
  button: {
    textAlign: 'end',
  },
  section: {
    paddingTop: token('space.150'),
    paddingRight: token('space.150'),
    paddingBottom: token('space.150'),
    paddingLeft: token('space.150'),
  },
});

export default ConfigurationTable;
    `,
		`
/** @jsx jsx */
import React from 'react';
import { Radio } from '@atlaskit/radio';
import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { FormattedMessage } from '@atlassian/jira-intl';
import { isDefined } from '@atlassian/jira-portfolio-3-portfolio/src/common/ramda/index.tsx';
import {
  AUTO_SCHEDULE_OVERWRITE,
  ISSUE_VALUES,
  type AutoScheduleOverwriteOptions,
  type IssueValues,
} from '@atlassian/jira-portfolio-3-portfolio/src/common/view/constant.tsx';
import commonMessages from '@atlassian/jira-portfolio-3-portfolio/src/common/view/messages.tsx';
import messages from './messages.tsx';
import type { Props } from './types.tsx';

const DETAILED_OVERWRITE_OPTIONS = [
  {
    value: AUTO_SCHEDULE_OVERWRITE.ALL_VALUES,
    label: <FormattedMessage {...messages.overwriteAllValuesDesc} />,
  },
  {
    value: AUTO_SCHEDULE_OVERWRITE.EMPTY_VALUES_ONLY,
    label: <FormattedMessage {...messages.overwriteEmptyValuesOnlyDesc} />,
  },
];

const OVERWRITE_OPTIONS = [
  {
    value: AUTO_SCHEDULE_OVERWRITE.ALL_VALUES,
    label: <FormattedMessage {...messages.overwriteAllValues} />,
  },
  {
    value: AUTO_SCHEDULE_OVERWRITE.EMPTY_VALUES_ONLY,
    label: <FormattedMessage {...messages.overwriteEmptyValuesOnly} />,
  },
];

const OVERWRITE_ISSUE_VALUES = [
  {
    value: ISSUE_VALUES.SPRINT,
    label: <FormattedMessage {...commonMessages.sprints} />,
  },
  {
    value: ISSUE_VALUES.RELEASE,
    label: <FormattedMessage {...commonMessages.releases} />,
  },
  {
    value: ISSUE_VALUES.TEAM,
    label: <FormattedMessage {...commonMessages.teams} />,
  },
];

const API_KEYS_FOR_OVERWRITE_ISSUE_VALUES = {
  [ISSUE_VALUES.SPRINT]: 'ignoreSprints',
  [ISSUE_VALUES.RELEASE]: 'ignoreReleases',
  [ISSUE_VALUES.TEAM]: 'ignoreTeams',
} as const;

const ConfigurationTable = ({
  autoScheduleConfiguration,
  isReadOnly,
  updateAutoScheduleConfiguration,
  withDetailedHeader,
  isReleasesEnabled,
}: Props) => {
  const getOverwriteHeader = () => {
    return withDetailedHeader ? DETAILED_OVERWRITE_OPTIONS : OVERWRITE_OPTIONS;
  };

  const isOptionSelected = (
    issueValue: IssueValues,
    overwriteOption: AutoScheduleOverwriteOptions,
  ) => {
    const apiKey = API_KEYS_FOR_OVERWRITE_ISSUE_VALUES[issueValue];

    return (
      isDefined(autoScheduleConfiguration) &&
      ((autoScheduleConfiguration[apiKey] &&
        overwriteOption === AUTO_SCHEDULE_OVERWRITE.ALL_VALUES) ||
        (!autoScheduleConfiguration[apiKey] &&
          overwriteOption === AUTO_SCHEDULE_OVERWRITE.EMPTY_VALUES_ONLY))
    );
  };

  const onConfigurationChange = (
    issueValue: IssueValues,
    overwriteOption: AutoScheduleOverwriteOptions,
  ): void => {
    updateAutoScheduleConfiguration({
      [API_KEYS_FOR_OVERWRITE_ISSUE_VALUES[issueValue]]:
        overwriteOption === AUTO_SCHEDULE_OVERWRITE.ALL_VALUES,
    });
  };

  const filterOutReleasesOptionWhenReleasesIsDisabled = ({
    value,
  }: {
    value: IssueValues;
    label: JSX.Element;
  }) => isReleasesEnabled || value !== ISSUE_VALUES.RELEASE;

  return (
    <div
      role="grid"
      aria-labelledby="overwrite-issue-values-title"
      aria-describedby="overwrite-issue-values-desc"
      aria-busy="true"
    >
      <div role="rowgroup">
        <div role="row" css={localStyles.header}>
          <div css={[localStyles.optionHeader, localStyles.firstColumn]} />
          <div
            css={[
              localStyles.optionValueHeader,
              !withDetailedHeader && localStyles.optionValueBorder,
            ]}
          >
            {OVERWRITE_ISSUE_VALUES.filter(filterOutReleasesOptionWhenReleasesIsDisabled).map(
              ({ label, value }, colIndex) => (
                <div
                  css={localStyles.optionValueContent}
                  id={\`column-\${colIndex}\`}
                  role="columnheader"
                  key={value}
                >
                  <div css={localStyles.optionHeader}>{label}</div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
      <div role="rowgroup" css={localStyles.radioContent}>
        {getOverwriteHeader().map(({ label, value: optionValue }, rowIndex) => (
          <div role="row" key={optionValue} css={localStyles.radioRow}>
            <div
              id={\`row-\${rowIndex}\`}
              role="rowheader"
              css={[localStyles.rowHeader, localStyles.firstColumn]}
            >
              {label}
            </div>
            <div css={localStyles.radioSelection}>
              {OVERWRITE_ISSUE_VALUES.filter(filterOutReleasesOptionWhenReleasesIsDisabled).map(
                ({ value: issueValue }, colIndex) => (
                  <div role="gridcell" key={issueValue}>
                    <Radio
                      isChecked={isOptionSelected(issueValue, optionValue)}
                      labelId={\`column-\${colIndex} row-\${rowIndex}\`}
                      name={issueValue}
                      isDisabled={isReadOnly}
                      value={optionValue}
                      onChange={() => onConfigurationChange(issueValue, optionValue)}
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const localStyles = cssMap({
  header: {
    display: 'flex',
  },
  firstColumn: {
    minWidth: '220px',
  },
  optionHeader: {
    flex: '1 1 0',
    font: token('font.heading.xxsmall'),
    color: token('color.text.subtlest'),
    marginBottom: token('space.100'),
  },
  optionValueHeader: {
    display: 'flex',
    flex: '1.5 1 0',
    marginTop: token('space.250'),
  },
  optionValueBorder: {
    borderBottomStyle: 'solid',
    borderBottomColor: token('color.border'),
    borderBottomWidth: token('border.width.selected'),
  },
  optionValueContent: {
    flex: '1 1 0',
    textAlign: 'center',
  },
  rowHeader: {
    flex: '1 1 0',
    marginTop: token('space.100'),
    color: token('color.text'),
  },
  radioContent: {
    marginTop: token('space.050'),
    marginBottom: token('space.150'),
  },
  radioRow: {
    display: 'flex',
  },
  radioSelection: {
    display: 'flex',
    flex: '1.5 1 0',
    marginTop: token('space.050'),
    marginBottom: token('space.050'),
    justifyContent: 'space-around',
  },
  button: {
    textAlign: 'end',
  },
  section: {
    paddingTop: token('space.150'),
    paddingRight: token('space.150'),
    paddingBottom: token('space.150'),
    paddingLeft: token('space.150'),
  },
});

export default ConfigurationTable;
    `,
		'should do nothing with wrong import and wrong package',
	);
});
