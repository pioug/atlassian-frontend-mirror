import getWeeks from '../get-weeks';

describe('#getWeeks', () => {
  const setup = (options: Partial<Parameters<typeof getWeeks>[0]> = {}) =>
    getWeeks({
      day: 14,
      month: 12,
      year: 2019,
      today: '14-12-2019',
      disabled: ['2019-12-04'],
      selected: ['2019-12-06'],
      previouslySelected: ['2019-12-08'],
      weekStartDay: 0,
      ...options,
    });

  it('should return 6 weeks', () => {
    expect(setup().length).toBe(6);
  });

  it('should return day object for any week', () => {
    const weeks = setup();

    const secondWeek = weeks.find(({ id }) => id === '2019-12-08');
    const day = secondWeek?.values.find(({ id }) => id === '2019-12-12');

    expect(day).toStrictEqual({
      day: 12,
      id: '2019-12-12',
      isDisabled: false,
      isFocused: false,
      isPreviouslySelected: false,
      isSelected: false,
      isSiblingMonth: false,
      isToday: false,
      month: 12,
      year: 2019,
    });
  });

  it('should highlight current day of 2nd week', () => {
    const weeks = setup();

    const secondWeek = weeks[1];
    const currentDay = secondWeek?.values.find(({ id }) => id === '2019-12-14');

    expect(currentDay?.isFocused).toBe(true);
  });

  it('should mark a day of 1st week as disabled', () => {
    const weeks = setup();

    const firstWeek = weeks[0];
    const disabledDay = firstWeek?.values.find(({ id }) => id === '2019-12-04');

    expect(disabledDay?.isDisabled).toBe(true);
  });

  it('should mark a day of 1st week as selected', () => {
    const weeks = setup();

    const firstWeek = weeks[0];
    const selectedDay = firstWeek?.values.find(({ id }) => id === '2019-12-06');

    expect(selectedDay?.isSelected).toBe(true);
  });

  it('should mark a day of 2nd week as previously selected', () => {
    const weeks = setup();

    const secondWeek = weeks[1];
    const selectedDay = secondWeek?.values.find(
      ({ id }) => id === '2019-12-08',
    );

    expect(selectedDay?.isPreviouslySelected).toBe(true);
  });

  it('should start first week from different day based on #weekStartDay', () => {
    expect(setup()[0]?.id).toBe('2019-12-01');

    expect(setup({ weekStartDay: 1 })[0]?.id).toBe('2019-11-25');

    expect(setup({ weekStartDay: 2 })[0]?.id).toBe('2019-11-26');
  });
});
