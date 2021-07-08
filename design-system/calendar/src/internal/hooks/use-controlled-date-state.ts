import useControlled from '@atlaskit/ds-lib/use-controlled';
import useLazyRef from '@atlaskit/ds-lib/use-lazy-ref';

import pad from '../utils/pad';

export default function useControlledDateState({
  day,
  defaultDay,
  month,
  defaultMonth,
  year,
  defaultYear,
  today,
  selected,
  defaultSelected,
  previouslySelected,
  defaultPreviouslySelected,
}: {
  day?: number;
  defaultDay: number;
  month?: number;
  defaultMonth: number;
  year?: number;
  defaultYear: number;
  today?: string;
  selected?: Array<string>;
  defaultSelected: Array<string>;
  previouslySelected?: Array<string>;
  defaultPreviouslySelected: Array<string>;
}) {
  const {
    current: { thisDay, thisMonth, thisYear },
  } = useLazyRef(() => {
    const now = new Date();
    const thisDay = now.getDate();
    const thisMonth = now.getMonth() + 1;
    const thisYear = now.getFullYear();

    return {
      thisDay,
      thisMonth,
      thisYear,
    };
  });

  const [dayValue, setDayValue] = useControlled(
    day,
    () => defaultDay || thisDay,
  );

  const [monthValue, setMonthValue] = useControlled(
    month,
    () => defaultMonth || thisMonth,
  );

  const [yearValue, setYearValue] = useControlled(
    year,
    () => defaultYear || thisYear,
  );

  const [todayValue] = useControlled(
    today,
    () => today || `${thisYear}-${pad(thisMonth)}-${pad(thisDay)}`,
  );

  const [selectedValue, setSelectedValue] = useControlled(
    selected,
    () => defaultSelected,
  );

  const [previouslySelectedValue, setPreviouslySelectedValue] = useControlled(
    previouslySelected,
    () => defaultPreviouslySelected,
  );

  return {
    day: [dayValue, setDayValue],
    month: [monthValue, setMonthValue],
    year: [yearValue, setYearValue],
    today: [todayValue],
    selected: [selectedValue, setSelectedValue],
    previous: [previouslySelectedValue, setPreviouslySelectedValue],
  } as const;
}
