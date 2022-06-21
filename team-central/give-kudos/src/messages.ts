import { defineMessages } from 'react-intl-next';

const messages = defineMessages({
  giveKudosButton: {
    id: 'team-central.give-kudos.button',
    defaultMessage: 'Give kudos',
    description: 'Title for the button to give a kudos',
  },
  kudosCreatedFlag: {
    id: 'team-central.give-kudos.created.title.flag',
    defaultMessage: 'Kudos created',
    description: 'Title text for kudos creation flag.',
  },
  kudosCreatedDescriptionFlag: {
    id: 'team-central.give-kudos.created.description.flag',
    defaultMessage: 'Your kudos has been sent. <a>View kudos</a>',
    description:
      'Description text for the kudos created flag. This includes a link to view the newly created kudos.',
  },
  unsavedKudosWarning: {
    id: 'team-central.give-kudos.unsaved.warning',
    defaultMessage: 'Changes that you made will not be saved.',
    description:
      'Shown when the user tries to navigate away from the kudos creation screen with unsaved changes.',
  },
  unsavedKudosWarningCancelButton: {
    id: 'team-central.give-kudos.unsaved.warning.cancel',
    defaultMessage: 'Cancel',
    description: 'Button that cancels closing the create kudos drawer.',
  },
  unsavedKudosWarningCloseButton: {
    id: 'team-central.give-kudos.unsaved.warning.close',
    defaultMessage: 'Close',
    description: 'Button that closes the warning modal and closes the drawer.',
  },
});

export default messages;
