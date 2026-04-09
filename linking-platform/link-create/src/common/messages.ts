import { defineMessages } from 'react-intl-next';

const _default_1: {
    genericErrorMessage: {
        id: string;
        defaultMessage: string;
        description: string;
    };
    requiredFieldInstruction: {
        id: string;
        defaultMessage: string;
        description: string;
    };
} = defineMessages({
    genericErrorMessage: {
        id: 'link-create.unknown-error.heading',
        defaultMessage: 'Something went wrong.',
        description: 'Message when an unknown error occurs',
    },
    requiredFieldInstruction: {
        id: 'linkCreate.form.requiredField.instruction',
        defaultMessage: 'Required fields are marked with an asterisk',
        description: 'Instruction for the required fields in the Link Create form',
    },
});
export default _default_1;
