/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - CalendarProps
 *
 * @codegen <<SignedSource::87bad6f2a27e493eeba6d969450d3a3d>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/calendar/__generated__/index.partial.tsx <<SignedSource::3fb4c1249481ec420be5118220ebcd82>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformCalendar from '@atlaskit/calendar';

type PlatformCalendarProps = React.ComponentProps<typeof PlatformCalendar>;

export type CalendarProps = Pick<
  PlatformCalendarProps,
  'day' | 'defaultDay' | 'defaultMonth' | 'defaultYear' | 'defaultPreviouslySelected' | 'defaultSelected' | 'disabled' | 'maxDate' | 'minDate' | 'nextMonthLabel' | 'onBlur' | 'onChange' | 'onFocus' | 'onSelect' | 'previouslySelected' | 'previousMonthLabel' | 'selected' | 'today' | 'year' | 'locale' | 'testId' | 'weekStartDay' | 'tabIndex'
>;

/**
 * An interactive calendar for date selection experiences.
 */
export type TCalendar<T> = (props: CalendarProps) => T;