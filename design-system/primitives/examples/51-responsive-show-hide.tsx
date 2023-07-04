/** @jsx jsx */
import { Fragment } from 'react';

import { jsx } from '@emotion/react';

import { UNSAFE_BREAKPOINTS_ORDERED_LIST } from '../src/responsive/constants';
import { Hide } from '../src/responsive/hide';
import { Show } from '../src/responsive/show';

export default () => {
  return (
    <div>
      <h4>
        <code>{'<Show>'}</code>:
      </h4>
      {UNSAFE_BREAKPOINTS_ORDERED_LIST.map(breakpoint => {
        if (breakpoint === 'xxs') {
          return null;
        }
        return (
          <Fragment key={`${breakpoint}-hidden`}>
            <Show above={breakpoint}>
              shown <u>above</u> {breakpoint}
            </Show>

            <Show below={breakpoint}>shown below {breakpoint}</Show>
          </Fragment>
        );
      })}
      <hr />
      <h4>
        <code>{'<Hide>'}</code>:
      </h4>
      {UNSAFE_BREAKPOINTS_ORDERED_LIST.map(breakpoint => {
        if (breakpoint === 'xxs') {
          return null;
        }
        return (
          <Fragment key={`${breakpoint}-hidden`}>
            <Hide above={breakpoint}>
              hidden <u>above</u> {breakpoint}
            </Hide>

            <Hide below={breakpoint}>hidden below {breakpoint}</Hide>
          </Fragment>
        );
      })}
    </div>
  );
};
