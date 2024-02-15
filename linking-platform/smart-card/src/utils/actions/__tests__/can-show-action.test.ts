import { CardAction } from '../../../view/Card/types';
import { canShowAction } from '../can-show-action';

describe('canShowAction', () => {
  it('returns true by default if no actionOptions are provided', () => {
    expect(canShowAction(CardAction.ViewAction)).toEqual(true);
  });

  it('returns false if actionOptions hide is true', () => {
    expect(canShowAction(CardAction.ViewAction, { hide: true })).toEqual(false);
  });

  it('returns true if actionOptions hide is false', () => {
    expect(canShowAction(CardAction.ViewAction, { hide: false })).toEqual(true);
  });

  it('returns true if actionOptions hide is false, and action is not included in exclude', () => {
    expect(
      canShowAction(CardAction.ViewAction, {
        hide: false,
        exclude: [CardAction.DownloadAction],
      }),
    ).toEqual(true);
  });

  it('returns false if actionOptions hide is false, and action is included in exclude', () => {
    expect(
      canShowAction(CardAction.ViewAction, {
        hide: false,
        exclude: [CardAction.ViewAction],
      }),
    ).toEqual(false);
  });
});
