export const userSampleAvatarUrl =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/2wCEAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRQBAwQEBQQFCQUFCRQNCw0UFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFP/AABEIACAAIAMBIgACEQEDEQH/xAB1AAEAAwEAAAAAAAAAAAAAAAAHAgUGCBAAAQMCBQMDAgcAAAAAAAAAAQIDBAURAAYSIUEHEzEUImEVcSMyQlGBweEBAAMBAAAAAAAAAAAAAAAAAAMEBwURAAICAgMBAQEAAAAAAAAAAAECAxEABBIhIkExgf/aAAwDAQACEQMRAD8AxWVci1ipwmJdT7seKFbIMgLKrGxTYkkH4NsMH1D0UFwsqsAACom1zbxvje9QMoU6BVnnFPswkqBX71JQkj7nnBFmwNx6JJmw5zUtkKUlCmFhaCAkG+21/IxCZ2keQ2KA6/uWzyF5X2cs1T1To62n3jYoWUuDfyLf3gUzhl/MuUI06fDLjdMBGh5EtCyQogBOm2q9+L+MJ1Ep0p1SFd5lptwqSe6sJCRpBvvySQP4xoqZlFt6QluQ4iSUL1eQQP8AcG1pHieqsHFHcVyv8xB6l0hnNOUrzGPUKlsBBXYa0FJ/MkkEbEA253GB/I/SeH0wy1PocFtoU6pOeqbbUjthp3TY8nyPngbADHT1ejCi02LGaShx6GlJKFH2rPlV/ub4H85yI+bSqPGdRSZjThdbYeSUNlRFlAnwQfixGNTZn4zSRq3hjdYprRK0cbyD2ABeBHULpiOo8ymrluBNMpai4lgoU5+MFg6zpULWtbkEXww5Ey/EpFOhoYQtllsDVqPudI5V9/OI0ZNMyahuI4tqsy/euykak90nlXgC9hsNv3xd0xuTMImylLaSE3S3+kE8cYHJslwsQbyvzADXRHaSuz9z/9k=';

export const mockUserSearchData = [
  {
    id: '2234',
    avatarUrl: userSampleAvatarUrl,
    name: 'Jack Sparrow',
    mentionName: 'captainjack',
    lozenge: 'teammate',
    accessLevel: 'SITE',
    presence: {
      status: 'offline',
    },
  },
  {
    id: '27',
    avatarUrl: userSampleAvatarUrl,
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
    avatarUrl: userSampleAvatarUrl,
    name: 'James T. Kirk',
    mentionName: 'wheresmyshirt',
    nickname: 'jim',
    accessLevel: 'NONE',
    presence: {
      status: 'focus',
    },
  },
  {
    id: '12312412',
    name: "Dude with long name and time that doesn't seem to stop and should overflow",
    mentionName:
      "Dudewithlongnamethatdoesn'tseemtostopandshouldoverflowwithtime",
    presence: {
      time: '1:57pm',
    },
  },
  {
    id: '12312428',
    avatarUrl: userSampleAvatarUrl,
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
];
