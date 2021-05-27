import { MockMentionResource as MentionResource } from './mock-mention-resource';
import { createMockMentionNameResolver } from './create-mock-mention-name-resolver';
import { MockMentionResourceWithInfoHints as MentionResourceWithInfoHints } from './mock-mention-resource-with-info-hints';
import { enableLogger } from '../logger';

enableLogger(true);

export const mentionSampleAvatarUrl =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/2wCEAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRQBAwQEBQQFCQUFCRQNCw0UFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFP/AABEIACAAIAMBIgACEQEDEQH/xAB1AAEAAwEAAAAAAAAAAAAAAAAHAgUGCBAAAQMCBQMDAgcAAAAAAAAAAQIDBAURAAYSIUEHEzEUImEVcSMyQlGBweEBAAMBAAAAAAAAAAAAAAAAAAMEBwURAAICAgMBAQEAAAAAAAAAAAECAxEABBIhIkExgf/aAAwDAQACEQMRAD8AxWVci1ipwmJdT7seKFbIMgLKrGxTYkkH4NsMH1D0UFwsqsAACom1zbxvje9QMoU6BVnnFPswkqBX71JQkj7nnBFmwNx6JJmw5zUtkKUlCmFhaCAkG+21/IxCZ2keQ2KA6/uWzyF5X2cs1T1To62n3jYoWUuDfyLf3gUzhl/MuUI06fDLjdMBGh5EtCyQogBOm2q9+L+MJ1Ep0p1SFd5lptwqSe6sJCRpBvvySQP4xoqZlFt6QluQ4iSUL1eQQP8AcG1pHieqsHFHcVyv8xB6l0hnNOUrzGPUKlsBBXYa0FJ/MkkEbEA253GB/I/SeH0wy1PocFtoU6pOeqbbUjthp3TY8nyPngbADHT1ejCi02LGaShx6GlJKFH2rPlV/ub4H85yI+bSqPGdRSZjThdbYeSUNlRFlAnwQfixGNTZn4zSRq3hjdYprRK0cbyD2ABeBHULpiOo8ymrluBNMpai4lgoU5+MFg6zpULWtbkEXww5Ey/EpFOhoYQtllsDVqPudI5V9/OI0ZNMyahuI4tqsy/euykak90nlXgC9hsNv3xd0xuTMImylLaSE3S3+kE8cYHJslwsQbyvzADXRHaSuz9z/9k=';

export const mentions = [
  {
    id: '666',
    avatarUrl: mentionSampleAvatarUrl,
    name: 'Craig Petchell',
    mentionName: 'petch',
    lozenge: 'teammate',
    accessLevel: 'CONTAINER',
    presence: {
      status: 'online',
      time: '11:57am',
    },
  },
  {
    id: '2234',
    avatarUrl: 'https://api.adorable.io/avatars/1',
    name: 'Jack Sparrow',
    mentionName: 'captainjack',
    lozenge: 'teammate',
    accessLevel: 'SITE',
    presence: {
      status: 'offline',
    },
  },
  {
    id: '55',
    avatarUrl: 'https://api.adorable.io/avatars/2',
    name: 'Captain Mal',
    mentionName: 'captaintightpants',
    presence: {
      status: 'offline',
      time: '12:57pm',
    },
  },
  {
    id: '11',
    avatarUrl: 'https://api.adorable.io/avatars/3',
    name: 'Doctor Who',
    mentionName: 'thedoctor',
    nickname: 'doctor',
    lozenge: 'teammate',
    accessLevel: 'CONTAINER',
    presence: {
      status: 'busy',
    },
  },
  {
    id: '27',
    avatarUrl: 'https://api.adorable.io/avatars/4',
    name: 'Jean Luc Picard',
    mentionName: 'makeitso',
    lozenge: 'teammate',
    accessLevel: 'APPLICATION',
    presence: {
      status: 'none',
      time: '1:57am',
    },
  },
  {
    id: '1701',
    avatarUrl: 'https://api.adorable.io/avatars/5',
    name: 'James T. Kirk',
    mentionName: 'wheresmyshirt',
    nickname: 'jim',
    accessLevel: 'NONE',
    presence: {
      status: 'focus',
    },
  },
  {
    id: '12312312',
    avatarUrl: 'https://api.adorable.io/avatars/6',
    name: "Dude with long name that doesn't seem to stop and should overflow",
    mentionName: "Dudewithlongnamethatdoesn'tseemtostopandshouldoverflow",
    nickname: 'Dude',
  },
  {
    id: '12312412',
    name:
      "Dude with long name and time that doesn't seem to stop and should overflow",
    mentionName:
      "Dudewithlongnamethatdoesn'tseemtostopandshouldoverflowwithtime",
    presence: {
      time: '1:57pm',
    },
  },
  {
    id: '12312428',
    avatarUrl: 'https://api.adorable.io/avatars/7',
    name: 'Monkey Trousers',
    lozenge: 'TEAM',
    mentionName: 'Monkey Trousers',
  },
  {
    id: '12312594',
    avatarUrl:
      'https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/teams/avatars/0.svg',
    name: 'The Cool Cats',
    userType: 'TEAM',
    context: {
      members: [],
      includesYou: false,
      memberCount: 10,
      teamLink: 'someLink',
    },
  },
  {
    id: '12312595',
    avatarUrl:
      'https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/teams/avatars/1.svg',
    name: 'Your Team',
    userType: 'TEAM',
    context: {
      members: [],
      includesYou: true,
      memberCount: 8,
      teamLink: 'someLink',
    },
  },
  {
    id: '12312596',
    avatarUrl:
      'https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/teams/avatars/2.svg',
    name: 'A very big team',
    userType: 'TEAM',
    context: {
      members: [],
      includesYou: false,
      memberCount: 60,
      teamLink: 'someLink',
    },
  },
  {
    id: '12312597',
    avatarUrl:
      'https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/teams/avatars/3.svg',
    name: 'The whole company',
    userType: 'TEAM',
    context: {
      members: [],
      includesYou: true,
      memberCount: 80,
      teamLink: 'someLink',
    },
  },
  {
    id: '12312598',
    avatarUrl:
      'https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/teams/avatars/4.svg',
    name: 'Your private team',
    userType: 'TEAM',
    context: {
      members: [],
      includesYou: true,
      memberCount: 1,
      teamLink: 'someLink',
    },
  },
];

export const mentionSlowResourceProvider = new MentionResource({
  minWait: 10,
  maxWait: 100,
});

export const mentionResourceProvider = new MentionResource({
  minWait: 10,
  maxWait: 25,
});

export const mentionResourceProviderWithResolver = new MentionResource({
  minWait: 10,
  maxWait: 25,
  mentionNameResolver: createMockMentionNameResolver(),
});

export const mentionResourceProviderWithResolver2 = new MentionResource({
  minWait: 10,
  maxWait: 25,
  mentionNameResolver: createMockMentionNameResolver(),
});

export const mentionResourceProviderWithInfoHints = new MentionResourceWithInfoHints(
  {
    minWait: 10,
    maxWait: 25,
  },
);

export const mentionResourceProviderWithTeamMentionHighlight = new MentionResource(
  {
    minWait: 10,
    maxWait: 25,
    enableTeamMentionHighlight: true,
  },
);

export const mentionResourceProviderWithInviteFromMentionExperiment = new MentionResource(
  {
    minWait: 10,
    maxWait: 25,
    enableTeamMentionHighlight: true,
    inviteExperimentCohort: 'variation',
    productName: 'confluence',
    shouldEnableInvite: true,
    userRole: 'admin',
  },
);
