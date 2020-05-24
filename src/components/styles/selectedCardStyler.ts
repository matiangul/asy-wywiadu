import { CSSProperties } from "react";

export function getUniqueSelectedCardStyle(): CSSProperties {
  return {
    transform: `rotate(${generateRandomInteger(-9, 9)}deg)`,
  };
}

export function getRotationForVotes(votesCount: number): CSSProperties {
  return {
    transform: `rotateX(${votesCount * 180}deg)`,
  };
}

function generateRandomInteger(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max + 1 - min));
}
