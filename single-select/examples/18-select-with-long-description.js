import React from 'react';
import Select from '../src';

const selectItems = [
  {
    items: [
      {
        content: 'ADMIRAL ACKBAR',
        value: 'role1',
        description:
          'A veteran commander, Ackbar led the defense of his homeworld, Mon Cala, during the Clone Wars and then masterminded the rebel attack on the second Death Star at the Battle of Endor.',
      },
      {
        content: 'ANAKIN SKYWALKER',
        value: 'role2',
        description:
          'Discovered as a slave on Tatooine by Qui-Gon Jinn and Obi-Wan Kenobi, Anakin Skywalker had the potential to become one of the most powerful Jedi ever, and was believed by some to be the prophesied Chosen One who would bring balance to the Force',
      },
      {
        content: 'BOBA FETT',
        value: 'role3',
        description:
          'With his customized Mandalorian armor, deadly weaponry, and silent demeanor, Boba Fett was one of the most feared bounty hunters in the galaxy. ',
      },
      {
        content: 'DARTH MAUL',
        value: 'role4',
        description:
          'A deadly, agile Sith Lord trained by the evil Darth Sidious, Darth Maul was a formidable warrior and scheming mastermind. He wielded an intimidating double-bladed lightsaber and fought with a menacing ferocity.',
      },
      {
        content: 'EMPEROR PALPATINE',
        value: 'role5',
        description:
          'Scheming, powerful, and evil to the core, Darth Sidious restored the Sith and destroyed the Jedi Order. Living a double life, Sidious was in fact Palpatine, a Naboo Senator and phantom menace.',
      },
    ],
  },
];

const SelectWithLongDescription = () => (
  <Select
    items={selectItems}
    label="Who do you trust?"
    placeholder="Choose them!"
    maxHeight={300}
    shouldFitContainer
  />
);

export default SelectWithLongDescription;
