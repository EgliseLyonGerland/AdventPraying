import { Draw, Person, PersonId } from '../../types';

type Players = Person[];
type Draws = Record<number, Draw>;

function sample<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function getTwoPastDraws(draws: Draws, currentYear: number): Draw[] {
  const years = Object.keys(draws).map(Number);

  return years.reduce<Draw[]>((acc, year) => {
    if (year < currentYear) {
      return acc.concat(draws[year]).slice(-2);
    }

    return acc;
  }, []);
}

export function getFamilyMembers(players: Players, current: Person) {
  return players.filter(
    (player) => player.id !== current.id && player.lastname === current.lastname,
  );
}

export function resolveExclude(players: Players, draws: Draws, currentYear: number): Players {
  const lastDraws = getTwoPastDraws(draws, currentYear);

  return players.map((player) => {
    // It excludes persons of the same family
    player.exclude = player.exclude.concat(
      getFamilyMembers(players, player).map((member) => member.id),
    );

    // It excludes persons with a different age
    // player.exclude = player.exclude.concat(
    //   players.filter((item) => item.age !== player.age).map((item) => item.id),
    // );

    // It excludes persons already prayed during the two past events
    lastDraws.forEach((draw) => {
      if (draw[player.id]) {
        player.exclude.push(draw[player.id]);
      }
    });

    player.exclude = [...new Set(player.exclude)];

    return player;
  });
}

export function getCandidates(
  currentPlayer: Person,
  players: Players,
  currentDraw: Draw,
): PersonId[] {
  return players
    .filter(
      (player) =>
        // The current player cannot pray for himself
        currentPlayer.id !== player.id &&
        // The current player cannot pray for someone with a different age
        currentPlayer.age === player.age &&
        // The current player cannot pray for a player praying for him
        currentDraw[player.id] !== currentPlayer.id &&
        // The current player cannot pray for someone already selected
        !Object.values(currentDraw).includes(player.id) &&
        // The current player cannot pray for someone he excluded
        !currentPlayer.exclude.includes(player.id),
    )
    .map((player) => player.id);
}

export function letsDraw(players: Players, draws: Draws, currentYear: number): Draw {
  const draw: Draw = {};

  resolveExclude(players, draws, currentYear)
    .sort((a, b) => b.exclude.length - a.exclude.length)
    .forEach((player) => {
      const candidates = getCandidates(player, players, draw);
      const candidate = sample<PersonId>(candidates);

      draw[player.id] = candidate || '';
    });

  return draw;
}
