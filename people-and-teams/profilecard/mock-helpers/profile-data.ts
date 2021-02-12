import sample from 'lodash/sample';

import { getTimeString, getWeekday } from './util';

const avatarImages = [
  'data:image/gif;base64,R0lGODdhgACAAPIHAABRzMHT8l6O3o2w6env+zh22P///xRe0CwAAAAAgACAAAAD/wi63P4wykmrvTjrzbv/YCiOZGmeaKqubOu+cCzPdG3feK7vfO//wKBwSCwaj8ikcslsOp/QqHRKrVqv2Kx2y+16v+CweEwum8/otHrNbrvf8Lh8Tq83CwGDgTA4RA4DBHoBAnADeoh7BQ8HgokGA24Cj4gED3mUBoVsmJmbC5OZe22iepEMh6V+a6UGAQ2poouspacLsZmrap2UswsFpa9sjZnCsLJuBY6IAbrHiQSfbQcCAQED0g8FA9YCznbg4eLj5OVO2zMDvlXKrt8qB3kE61LEg/Qo8ZX4TvrQ2SbaQXvHxB+lPicAiWomBdejaCUEFiPIxOGjAPw04GnFkIiKxYveOFRrBQlLKJKEKDagFohkySwSSRK4NgBbAQE1uS2TCdCKQZdAUaq0ImBn0KN6IIppiTQon6FbqBlt+hBhmm1Tj/LpebVaVkoz1YUrQDZnTbIZzaldy7at27dw48qdS7eu3bt48+rdy7ev37+AAwseTLiw4cOIEytezLix48eQI0uenDcBADs=',
  'data:image/gif;base64,R0lGODdhgACAAPIHAACjv2fE1sXp70S2zR+qxJbV4////+r3+SwAAAAAgACAAAAD/wi63P4wykmrvTjrzbv/YCiOZGmeaKqubOu+cCzPdG3feK7vfO//wKBwSCwaj8ikcslsOp/QqHRKrVqv2Kx2y+16v+CweEwum8/otHrNbrvf8Lh8Tq83BwKD4VAgRAgFB3oCAXAFeoh7Aw8EgokGBW4Bj4gHD3mUBoVsmJmbC5OZe22iepEMh6V+a6UGAg2poouspacLsZmrap2UswsDpa9sjZnCsLJuA46IArrHiQefbQQBAgIF0g8DBdYBznbg4eLj5OVO2zMFvlXKrt8qBHkH61LEg/Qo8ZX4TvrQ2SbaQXvHxB+lPicAiWomBdejaCUEFiPIxOEjAfw04GnFkIiKxYveOFRrBQlLKJKEKDagFohkySwSSR64VgDbgAA1uS2TCdCKQZdAUaq0EmBn0KN6IIppiTQon6FbqBlt+hBhmm1Tj/LpebVaVkoz1YUbQDZnTbIZzaldy7at27dw48qdS7eu3bt48+rdy7ev37+AAwseTLiw4cOIEytezLix48eQI0uenDcBADs=',
  'data:image/gif;base64,R0lGODdhgACAAPIHAACHWur18arVxYjDrlarjMnk2v///yeUbSwAAAAAgACAAAAD/wi63P4wykmrvTjrzbv/YCiOZGmeaKqubOu+cCzPdG3feK7vfO//wKBwSCwaj8ikcslsOp/QqHRKrVqv2Kx2y+16v+CweEwum8/otHrNbrvf8Lh8Tq83CQKDISA4RA4DAXoFBHADeoh7fg4HgokGAm4Ej4gBDwWUeoVsmJkGmwuTnpZsnnqRDIemi2qmBgUNqp6gaa4Dsa6saXmzDQemsGyNmai4mbpqw4kFyAu8lbTCAwUFAtEOeNQDzXbd3t/g4eJMgDPbWMPMLwd5AdxPyq/vJQedilT1jwHXJQSOlfOS5Mt0zgQgT+qiPKO0r98/SgkVuiIUgoC9TBGlLMRIIIagBIuuIGERFdKaRwUH8Dz0dCuLv5CVqg0YQKDmzGkrTTXcwg6mz58Zt7z8SVQfPy6BihINUHAMoJxKEzE96UVl1ErW4AASAJWhgKZ1UhK4ObMm1XFo06pdy7at27dw48qdS7eu3bt48+rdy7ev37+AAwseTLiw4cOIEytezLix48eQI8tNAAA7',
  'data:image/gif;base64,R0lGODdhgACAAPIHAFJCqfDu+LGp2XlqvJGFyGBRsP///9TQ6iwAAAAAgACAAAAD/wi63P4wykmrvTjrzbv/YCiOZGmeaKqubOu+cCzPdG3feK7vfO//wKBwSCwaj8ikcslsOp/QqHRKrVqv2Kx2y+16v+CweEwum8/otHrNbrvf8Lh8Tq83BweDISAoRAoCAXoHBHACeoh7Aw8FgokGAm4Ej4gBD3mUBoVsmJmbC5OZe22iepEMh6V+a6UGBw2poouspacLsZmrap2UswsDpa9sjZnCsLJuA46IB7rHiQGfbQUEBwcC0g8DAtYEznbg4eLj5OVO2zMCvlXKrt8qBXkB61LEg/Qo8ZX4TvrQ2SbaQXvHxB+lPicAiWomBdejaCUEFiPIxOGjA/w04GnFkIiKxYveOFRrBQlLKJKEKDagFohkySwSSQa4JgDbAAI1uS2TCdCKQZdAUaq0QmBn0KN6IIppiTQon6FbqBlt+hBhmm1Tj/LpebVaVkoz1YUbQDZnTbIZzaldy7at27dw48qdS7eu3bt48+rdy7ev37+AAwseTLiw4cOIEytezLix48eQI0uenDcBADs=',
  'data:image/gif;base64,R0lGODdhgACAAPIHAN41Cvzs6vfMxPGgkeRTNeBAG////+lvVywAAAAAgACAAEAD/wi63P4wykmrvTjrzbv/YCiOZGmeaKqubOu+62DMdEA8REDTA+x7uZ1BUIDIdoHDbzkh9H6DG5N1EFpngoO0eRjorrvndOwgHLqD9OC8Jbvf8Lh8Tq/b7/i8fs/v+/+AgYKDhIUrYFgNR2BKho6GBQJgA0UmBYtCRI8RXoienwYBlJukpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vRySjA1VYAG9wFeNCwSIAr7OzzAFX0NtKQTHNqWYVlkhB8dXmqeRoOXmAtWwXdPmSGvQ8PHy8/T19vf4+fr7/P3+/wADChxIsKDBgwgTKlzIsKHDhxAjSpxI4tsMUZUeXPrSzYfXMCvFHIDbkUyXJzEKtglJZ+ukIk8ZcwXh9kDlDJa4LgkQ8E5Cl51RKAodGieIuBbkspEih6TkiQPsQsUsZPOiUxBQmU2l+inLVgsWXaLKWi4AzzRn0AwQEBVREldk28m1SmvjXE8YezlhW5YnTqKAAwseTLiw4cOIEytezLix48eQI0smkQAAOw==',
  'data:image/gif;base64,R0lGODdhgACAAPIHAP+ZH/+vUv/Rnf+gMv+9cf/26//////mySwAAAAAgACAAAAD/wi63P4wykmrvTjrzbv/YCiOZGmeaKqubOu+cCzPdG3feK7vfO//wKBwSCwaj8ikcslsOp/QqHRKrVqv2Kx2y+16v+CweEwum8/otHrNbrvf8Lh8Tq83AweDoSAYRAYCBXoHBHACeoh7AQ8DgokGAm4Ej4gFD3mUBoVsmJmbC5OZe22iepEMh6V+a6UGBw2poouspacLsZmrap2UswsBpa9sjZnCsLJuAY6IB7rHiQWfbQMEBwcC0g8BAtYEznbg4eLj5OVO2zMCvlXKrt8qA3kF61LEg/Qo8ZX4TvrQ2SbaQXvHxB+lPicAiWomBdejaCUEFiPIxOGjA/w04GnFkIiKxYveOFRrBQlLKJKEKDagFohkySwSSRa4JgBbAAI1uS2TCdCKQZdAUaq0QmBn0KN6IIppiTQon6FbqBlt+hBhmm1Tj/LpebVaVkoz1YULQDZnTbIZzaldy7at27dw48qdS7eu3bt48+rdy7ev37+AAwseTLiw4cOIEytezLix48eQI0uenDcBADs=',
  '', // to test invalid img src
];

const getAvatar = () => sample(avatarImages) as string;

const profiles = [
  {
    User: {
      avatarUrl: getAvatar(),
      fullName: 'Kramer Hatfield',
      nickname: 'khatfield',
      email: 'khatfield@gluid.com',
      location: 'Vienna, Austria',
      meta: 'Manager',
      remoteTimeString: getTimeString(),
      remoteWeekdayIndex: getWeekday().index,
      remoteWeekdayString: getWeekday().string,
    },
  },
  {
    User: {
      avatarUrl: getAvatar(),
      fullName: 'Schwartz Mclaughlin',
      nickname: 'smclaughlin',
      email: 'smclaughlin@corecom.com',
      location: 'Perth, Australia',
      meta: 'Senior Developer',
      remoteTimeString: getTimeString(),
      remoteWeekdayIndex: getWeekday().index,
      remoteWeekdayString: getWeekday().string,
    },
  },
  {
    User: {
      avatarUrl: getAvatar(),
      fullName: 'Nichole Walter',
      nickname: 'nwalter',
      email: 'nwalter@limage.com',
      location: 'Sydney, Australia',
      meta: 'Senior Developer',
      status: 'inactive',
      remoteTimeString: getTimeString(),
      remoteWeekdayIndex: getWeekday().index,
      remoteWeekdayString: getWeekday().string,
    },
  },
  {
    User: {
      avatarUrl: getAvatar(),
      fullName: 'Cleveland Rodriquez',
      nickname: 'crodriquez',
      email: 'crodriquez@slofast.com',
      meta: 'Manager',
    },
  },
  {
    User: {
      avatarUrl: getAvatar(),
      fullName: 'Rosalyn Franklin',
      nickname: 'rfranklin',
      email: 'rfranklin@assurity.com',
      location: 'London, England',
      meta: 'Manager',
      remoteTimeString: getTimeString(),
      remoteWeekdayIndex: getWeekday().index,
      remoteWeekdayString: getWeekday().string,
    },
  },
  {
    User: {
      avatarUrl: getAvatar(),
      fullName: 'Hess Stone',
      nickname: 'hstone',
      email: 'hstone@hawkster.com',
      location: 'Sydney, Australia',
      meta: 'Designer',
      remoteTimeString: getTimeString(),
      remoteWeekdayIndex: getWeekday().index,
      remoteWeekdayString: getWeekday().string,
    },
  },
  {
    User: {
      avatarUrl: getAvatar(),
      fullName: 'Lewis Cervantes',
      nickname: 'lcervantes',
      email: 'lcervantes@apextri.com',
      location: 'Perth, Australia',
      meta: 'Senior Developer',
      remoteTimeString: getTimeString(),
      remoteWeekdayIndex: getWeekday().index,
      remoteWeekdayString: getWeekday().string,
    },
  },
  {
    User: {
      avatarUrl: getAvatar(),
      fullName: 'Abbott Lamb',
      nickname: 'alamb',
      email: 'alamb@xeronk.com',
      location: 'Sydney, Australia',
      meta: 'Senior Developer',
      remoteTimeString: getTimeString(),
      remoteWeekdayIndex: getWeekday().index,
      remoteWeekdayString: getWeekday().string,
    },
  },
  {
    User: {
      avatarUrl: getAvatar(),
      fullName: 'Conner Duncan',
      nickname: 'cduncan',
      email: 'cduncan@magmina.com',
      location: 'Hanover, Germany',
      meta: 'Head of Something',
      remoteTimeString: getTimeString(),
      remoteWeekdayIndex: getWeekday().index,
      remoteWeekdayString: getWeekday().string,
    },
  },
  {
    User: {
      avatarUrl: getAvatar(),
      fullName: 'Bauer Burch',
      nickname: 'bburch',
      email: 'bburch@xleen.com',
      location: 'Austin, TX',
      meta: 'Senior Designer',
      remoteTimeString: getTimeString(),
      remoteWeekdayIndex: getWeekday().index,
      remoteWeekdayString: getWeekday().string,
    },
  },
  {
    User: {
      avatarUrl: getAvatar(),
      fullName: 'Mcbride Haynes',
      nickname: 'mhaynes',
      email: 'mhaynes@geeky.com',
      location: 'London, England',
      meta: 'Senior Designer',
      remoteTimeString: getTimeString(),
      remoteWeekdayIndex: getWeekday().index,
      remoteWeekdayString: getWeekday().string,
    },
  },
];

export default profiles;
