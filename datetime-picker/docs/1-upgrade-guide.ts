import { code, md } from '@atlaskit/docs';

export default md`
  ## 3.x - 4.x

  ### No more stateful / stateless components

  See the docs section for [controlled / uncontrolled props](/docs/guides/controlled-uncontrolled-props).

  Instead of using the stateless component, you now just use the stateful component and supply the props you want to be stateless.

  ${code`
    - import { DatePickerStateless } from '@atlaskit/datetime-picker';
    + import { DatePicker } from '@atlaskit/datetime-picker';

    - <DatePickerStateless month={1} />
    + <DatePicker month={1} />
  `}

  This goes for all of the picker components. If you're using the \`TimePicker\` or \`DateTimePicker\`, then you follow the same pattern.

  ### DateTimePicker \`value\` is now a \`string\`

  The \`value\` prop for the \`DateTimePicker\` is now a \`string\`. This provides simpler usage through an ISO date string, and also allows a timezone to be specified.

  ${code`
    - <DateTimePicker value={['2000-01-01', '2:00pm']} />
    + <DateTimePicker value="2000-01-01T14:00+1000" />
  `}

  ### Removed the \`width\` prop from all pickers

  This is because the component has a fluid width and expands to the width of its container.

  ${code`
    - <DatePicker width={100} />
  `}

  ### DateTimePicker - remove \`disabled\` \`times\` props

  These existed as a way to specify the disabled dates to the calendar in the DatePicker, or the times for the TimePicker. While this may have proven useful, there was no use case for providing these. On top of that, if we are to provide one to each, we should probably be giving the ability to fully customise each. For this reason, we are removing these now in this breaking change to make room for full customisation in a future minor release.

  ${code`
    - <DateTimePicker disabled={['2000-01-01']} times={['1:00am', '1:30am', ...]} />
  `}
`;
