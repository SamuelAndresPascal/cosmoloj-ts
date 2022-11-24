import { Unit } from './Unit'

export interface Factor {
  dim: () => Unit

  numerator: () => number

  denominator: () => number

  power: () => number
}
