import React from 'react';
import { md, Example, code } from '@atlaskit/docs';

export default md`
  Use \`LocaleProvider\` to format dates and times, get days of the week/months
  of the year, and parse dates. Under the hood it uses the browser built in
  \`Intl.DateTimeFormat\` API.

  \`createLocalizationProvider\` the main entry point for the package, takes a
  BCP 47 language tag (e.g. \`ja-JP\`) that ensures that dates/times are in the
  official format for the locale.

  ## Usage

  ${code`
import {
  createLocalizationProvider,
  LocalizationProvider,
} from '@atlaskit/locale';

const localizationProvider: LocalizationProvider = createLocalizationProvider(
  'ja-JP',
);

localizationProvider.parseDate('1993/2/18');
// output: Thu Feb 18 1993 00:00:00 GMT+1100 (Australian Eastern Daylight Time)

localizationProvider.formatDate(new Date(1993, 1, 18));
// output: 1993/2/18

localizationProvider.formatTime(new Date(1993, 1, 18, 13, 30));
// output: 13:30

localizationProvider.getDaysShort();
// output: ['日', '月', '火', '水', '木', '金', '土']

localizationProvider.getLongMonths();
// output: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', ...]
`}

  ${(
    <Example
      packageName="@atlaskit/locale"
      Component={require('../examples/0-overview').default}
      title="Overview"
      source={require('!!raw-loader!../examples/0-overview')}
    />
  )}
`;
