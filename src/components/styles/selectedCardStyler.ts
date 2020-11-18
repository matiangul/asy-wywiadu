export function getUniqueSelectedCardStyle(): string {
  return `rotate-${generateRandomInteger(1, 3)}`
}

function generateRandomInteger(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max + 1 - min))
}
