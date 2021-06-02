import { InternalFile, MediaCollectionFile } from '.';

export const fileUri =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAsCAYAAAAXb/p7AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAB3RJTUUH4gMGFh4MMM+ZEwAABIJJREFUWMPN2FuM3VMUx/HPmU4702lnOtoStDFuVdek0UGnF0pvtCqMqrvwQL0oDxJJ40lISIoHIRJKNa5pDEEVkUi8IBpRCRppBKFBqduUVi/jYe3j/DsznTn//zkP3cnkzH9f1v7t776ttUvqlbo3wTQ8h/exUk/nnlrNNtRRXBPuwKlYhs6UfwgIjDQX3en/ibgFI2sVWS+BzUlQaybvEpxdq+HaBQahM3FBv5LxSfSoWijWg2AJl6J9kLKlOKcW4/UQOB7zDlJ2mBop1kPgKZgyRPnF6CpqvDaBlbNv7BC12gXFpiIUayVYwunpd6i0BDOLdFCrwFHoqKLeOAUp1iqwWRzK1aTFmJ23g3oQbKmybhtWoDkPxVoFNmBEjvqLMCdvB9Wn7k2Vv0j7kMdjKVMcXS3F6gVWDJYy37vRm2uQLMS51VbOO8Wz8JTKzbELP+W00SoHxeoEhqExWIUb8Tg6xfR+nVMgLBDuWZ0ERpqfMXoiHhD38GbszylwrKDYMhzF4QWGgbG41YFHytzUyafYkVNgecDn14vgQpw3SNsVwtXfXEDgmNR+zFAUhxYYDSuLemDqEJ7zRvQVEDnPQEc3N8FFhj4WLhMEvysgsMUwFA8uMBpUrqeDpyniPl5fQCCxDucfrHA4ghca/oIfKQivww8FBJYpjh2M4uACo+K4KuiV03QxxS8WEEicCAsGKxiK4EXi5qgmTRbTvAbfFxA4Whxjrf0pDhQYFdpVjpBqUhuOxBa8UEAgsUwWVktwsXyBTpNYEn1Yq9iObhYU27IUDxRYjB7h4YzU06lGirPFxhyS4FLMyGl4v3C9yv+vxbcFKa7AuDLFisDIqATa+dI/yvdxUPwKzyt2u8wSG3RQgkUffH7Btn5EnylIsSlLMStwQkF68Dl+/v+rQvHZghS7RCx9gMBFij309OFt/DtI/jp8U5DiTWhtzGT2iuOhJeeot+D1Abk9nXRv2opHxcvryCrtllK9bejLCtyAz8ROyiNwB7anaR2M7iN4NafA/SLW6c1GaIdkKiVxo4Rj+mdS367yILQ75ZX0dPZmBtQqgvY/MmQmJlu/iaOnEYen9r+m3zaxnPb263dP+m7DX6l8XHmTXIX3cKXwkp/Hu3gTK8W2vyszsDbhGKzHpJR3rZjKl3FvGuR96MEruCKJXYPTUpvrU7/L0/ec9H03TsL6BrEputPoluF33C920ga8hKNwTIbedJwhvJhyrLJcxMkP4i1xbC3HB1iNL5LNqanP5ky/l4s12o6jcbVwHk5uEA+QJ+Ax4R134KM0dV9iazKyL7NWl4ho7h1xNTbi6fR7pzjHtuNJ8S54O45PbcNWUOxI/U5NffeJ8OET3IzGBvEAPjlN0SRxHo5Ia7AhszuPEK/5x4pAZ1oaZVfqYC8exoe4IQ16q4if9+IalYemknAKJmX6Lbtau8TRNAkTGkVMsB5vJBpdicbOZBj+Fg7EQ3giTdXqtNhXiVeGs0QAVcJrqf1tOC7ZuSdthJ3CQZ0hPPCNCdJM/Cg25cdp3V73H5C3AqXr3FVlAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTAzLTA2VDIyOjMwOjEyLTA1OjAwkZ+D/QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOC0wMy0wNlQyMjozMDoxMi0wNTowMODCO0EAAAAASUVORK5CYII=';

export const files: Array<InternalFile> = [
  {
    id: 'bc25fcde-01ae-449a-80a2-0a32a91c9225',
    name: 'Atlassian-vertical-blue-onecolor@2x-rgb.png',
    size: 1427,
    occurrenceKey: 'b66f15b4-c354-4a73-874e-64323c2fe28a',
    dataUri: fileUri,
  },
  {
    id: 'bc25fcde-01ae-449a-80a2-0a32a91c9226',
    name: 'Atlassian-vertical-blue-onecolor@2x-rgb.png',
    size: 1427,
    occurrenceKey: 'b66f15b4-c354-4a73-874e-64323c2fe28b',
    dataUri: fileUri,
  },
];

export const userCollection: Array<MediaCollectionFile> = files.map((file) => ({
  id: file.id,
  occurrenceKey: file.occurrenceKey,
  type: 'file',
  details: {
    size: file.size,
    name: file.name,
  },
  author: {
    id: '655362:b9e0e0b5-c639-4fcb-96f2-06fe6ae794be',
    userName: 'vvlasov@atlassian.com',
    displayName: 'Vladimir Vlasov',
    active: true,
  },
  insertedAt: 1516747839493,
}));
