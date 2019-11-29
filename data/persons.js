const persons = [
  {
    id: 'alexandre-sarran',
    firstname: 'Alexandre',
    lastname: 'Sarran',
    kids: false,
  },
  {
    id: 'suzanne-sarran',
    firstname: 'Suzanne',
    lastname: 'Sarran',
    kids: false,
  },
  {
    id: 'matthieu-sarran',
    firstname: 'Matthieu',
    lastname: 'Sarran',
    kids: false,
  },
  {
    id: 'timothee-sarran',
    firstname: 'Timothée',
    lastname: 'Sarran',
    kids: false,
  },
  {
    id: 'etienne-sarran',
    firstname: 'Étienne',
    lastname: 'Sarran',
    kids: true,
  },
  {
    id: 'vallouise-sarran',
    firstname: 'Vallouise',
    lastname: 'Sarran',
    kids: true,
  },
  {
    id: 'jonah-haddad',
    firstname: 'Jonah',
    lastname: 'Haddad',
    kids: false,
  },
  {
    id: 'amy-haddad',
    firstname: 'Amy',
    lastname: 'Haddad',
    kids: false,
  },
  {
    id: 'lenora-haddad',
    firstname: 'Lenora',
    lastname: 'Haddad',
    kids: false,
  },
  {
    id: 'caedmon-haddad',
    firstname: 'Caedmon',
    lastname: 'Haddad',
    kids: true,
  },
  {
    id: 'pascal-haddad',
    firstname: 'Pascal',
    lastname: 'Haddad',
    kids: true,
  },
  {
    id: 'margaret-haddad',
    firstname: 'Margaret',
    lastname: 'Haddad',
    kids: true,
  },
  {
    id: 'soohyun-vang',
    firstname: 'Soohyun',
    lastname: 'Vang',
    kids: false,
  },
  {
    id: 'kalhou-vang',
    firstname: 'Kalhou',
    lastname: 'Vang',
    kids: false,
  },
  {
    id: 'timothee-vang',
    firstname: 'Timothée',
    lastname: 'Vang',
    kids: true,
  },
  {
    id: 'stephane-hamelin',
    firstname: 'Stéphane',
    lastname: 'Hamelin',
    kids: false,
  },
  {
    id: 'ivan-hamelin',
    firstname: 'Ivan',
    lastname: 'Hamelin',
    kids: true,
  },
  {
    id: 'linda-hamelin',
    firstname: 'Linda',
    lastname: 'Hamelin',
    kids: false,
  },
  {
    id: 'fabrice-lingois',
    firstname: 'Fabrice',
    lastname: 'Lingois',
    kids: false,
  },
  {
    id: 'dimitri-cobb',
    firstname: 'Dimitri',
    lastname: 'Cobb',
    kids: false,
  },
  {
    id: 'etienne-gerber',
    firstname: 'Étienne',
    lastname: 'Gerber',
    kids: false,
  },
  {
    id: 'marie-gerber',
    firstname: 'Marie-Noëlle',
    lastname: 'Gerber',
    kids: false,
  },
  {
    id: 'karine-comte',
    firstname: 'Karine',
    lastname: 'Comte',
    kids: false,
  },
  {
    id: 'denis-blum',
    firstname: 'Denis',
    lastname: 'Blum',
    kids: false,
  },
  {
    id: 'mailys-blum',
    firstname: 'Mailys',
    lastname: 'Blum',
    kids: false,
  },
  {
    id: 'gilles-campoy',
    firstname: 'Gilles',
    lastname: 'Campoy',
    kids: false,
  },
  {
    id: 'yvettes-campoy',
    firstname: 'Yvettes',
    lastname: 'Campoy',
    kids: false,
  },
  {
    id: 'helene-bazille',
    firstname: 'Hélène',
    lastname: 'Bazille',
    kids: false,
  },
  {
    id: 'enora-corlay',
    firstname: 'Énora',
    lastname: 'Corlay',
    kids: false,
    exclude: ['david-bourgeois'],
  },
  {
    id: 'solange-de-melo',
    firstname: 'Solange',
    lastname: 'De Melo',
    kids: false,
  },
  {
    id: 'anne-julien',
    firstname: 'Anne',
    lastname: 'Julien',
    kids: false,
  },
  {
    id: 'marie-julien',
    firstname: 'Marie',
    lastname: 'Julien',
    kids: true,
  },
  {
    id: 'theotime-julien',
    firstname: 'Théotime',
    lastname: 'Julien',
    kids: true,
  },
  {
    id: 'david-bourgeois',
    firstname: 'David',
    lastname: 'Bourgeois',
    kids: false,
    exclude: ['enora-corlay'],
  },
];

module.exports = persons.map(person => ({
  ...person,
  fullname: `${person.firstname} ${person.lastname}`,
}));