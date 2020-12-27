import { TeamColor } from "./color";

export type Role = "guesser" | "leader";

export interface Player {
  nick: string;
  color: TeamColor;
  role: Role;
  active: boolean;
}

export function arePlayersSame(player1: Player, player2: Player): boolean {
  return player1.nick === player2.nick;
}

export function fellowGuessers(players: Player[], player: Player): Player[] {
  return players.filter(
    (teammate) => arePlayersInSameTeam(teammate, player) && isGuesser(teammate)
  );
}

export function fellowLeaders(players: Player[], player: Player): Player[] {
  return players.filter(
    (teammate) => arePlayersInSameTeam(teammate, player) && isLeader(teammate)
  );
}

export function isGuesser(player: Player): boolean {
  return player.role === "guesser";
}

export function isLeader(player: Player): boolean {
  return player.role === "leader";
}

export function arePlayersInSameTeam(
  player1: Player,
  player2: Player
): boolean {
  return player1.color === player2.color;
}

export function filterActivePlayers(players: Player[]): Player[] {
  return players.filter(isPlayerActive);
}

export function isPlayerActive(player?: Player): boolean {
  return player?.active ?? false;
}
