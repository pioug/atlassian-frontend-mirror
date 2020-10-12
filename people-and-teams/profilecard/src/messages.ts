import { defineMessages } from 'react-intl';

const messages = defineMessages({
  inactiveAccountMsg: {
    id: 'pt.profile-card.inactive.account',
    defaultMessage: 'Account deactivated',
    description: 'A text in a grey lozenge shows that this user is inactive',
  },

  generalDescMsgForDisabledUser: {
    id: 'pt.profile-card.general.msg.disabled.user',
    defaultMessage: 'You can no longer collaborate with this person.',
    description:
      'A first sentence of a long text explains this user is inactive/closed',
  },

  inactiveAccountDescMsgNoDate: {
    id: 'pt.profile-card.inactive.account.no.date',
    defaultMessage: 'Their account has been deactivated.',
    description:
      'A long text explains this user is inactive when we do not know the date of starting to deactivate',
  },

  inactiveAccountDescMsgHasDateThisWeek: {
    id: 'pt.profile-card.inactive.account.has.date.this.week',
    defaultMessage: 'Their account was deactivated this week.',
    description:
      'A long text explains this user is inactive when we know the date of starting to deactivate',
  },

  inactiveAccountDescMsgHasDateThisMonth: {
    id: 'pt.profile-card.inactive.account.has.date.this.month',
    defaultMessage: 'Their account was deactivated this month.',
    description:
      'A long text explains this user is inactive when we know the date of starting to deactivate',
  },

  inactiveAccountDescMsgHasDateLastMonth: {
    id: 'pt.profile-card.inactive.account.has.date.last.month',
    defaultMessage: 'Their account was deactivated last month.',
    description:
      'A long text explains this user is inactive when we know the date of starting to deactivate',
  },

  inactiveAccountDescMsgHasDateAFewMonths: {
    id: 'pt.profile-card.inactive.account.has.date.a.few.months',
    defaultMessage: 'Their account has been deactivated for a few months.',
    description:
      'A long text explains this user is inactive when we know the date of starting to deactivate',
  },

  inactiveAccountDescMsgHasDateSeveralMonths: {
    id: 'pt.profile-card.inactive.account.has.date.several.months',
    defaultMessage: 'Their account has been deactivated for several months.',
    description:
      'A long text explains this user is inactive when we know the date of starting to deactivate',
  },

  inactiveAccountDescMsgHasDateMoreThanAYear: {
    id: 'pt.profile-card.inactive.account.has.date.more.than.a.year',
    defaultMessage: 'Their account has been deactivated for more than a year.',
    description:
      'A long text explains this user is inactive when we know the date of starting to deactivate',
  },

  closedAccountMsg: {
    id: 'pt.profile-card.closed.account',
    defaultMessage: 'Account deleted',
    description:
      'A text in a grey lozenge shows that this user is closed/deleted',
  },

  closedAccountDescMsgNoDate: {
    id: 'pt.profile-card.closed.account.no.date',
    defaultMessage: 'Their account has been deleted.',
    description:
      'A long text explains this user is closed when we do not know the date of starting to close',
  },

  closedAccountDescMsgHasDateThisWeek: {
    id: 'pt.profile-card.closed.account.has.date.this.week',
    defaultMessage: 'Their account was deleted this week.',
    description:
      'A long text explains this user is closed when we know the date of starting to close',
  },

  closedAccountDescMsgHasDateThisMonth: {
    id: 'pt.profile-card.closed.account.has.date.this.month',
    defaultMessage: 'Their account was deleted this month.',
    description:
      'A long text explains this user is closed when we know the date of starting to close',
  },

  closedAccountDescMsgHasDateLastMonth: {
    id: 'pt.profile-card.closed.account.has.date.last.month',
    defaultMessage: 'Their account was deleted last month.',
    description:
      'A long text explains this user is closed when we know the date of starting to close',
  },

  closedAccountDescMsgHasDateAFewMonths: {
    id: 'pt.profile-card.closed.account.has.date.a.few.months',
    defaultMessage: 'Their account has been deleted for a few months.',
    description:
      'A long text explains this user is closed when we know the date of starting to close',
  },

  closedAccountDescMsgHasDateSeveralMonths: {
    id: 'pt.profile-card.closed.account.has.date.several.months',
    defaultMessage: 'Their account has been deleted for several months.',
    description:
      'A long text explains this user is closed when we know the date of starting to close',
  },

  closedAccountDescMsgHasDateMoreThanAYear: {
    id: 'pt.profile-card.closed.account.has.date.more.than.a.year',
    defaultMessage: 'Their account has been deleted for more than a year.',
    description:
      'A long text explains this user is closed when we know the date of starting to close',
  },

  disabledAccountDefaultName: {
    id: 'pt.profile-card.disabled.account.default.name',
    defaultMessage: 'Former user',
    description:
      'A default name when we cannot get name of an inactive or closed user',
  },
});

export default messages;
