import { Factor } from './Factor'

export class UnitConverter {

  private readonly mScale: number
  private readonly mOffset: number
  private readonly mInverse: UnitConverter

  private constructor (scale: number, offset: number, inverse?: UnitConverter) {
    this.mScale = scale
    this.mOffset = offset

    if (inverse !== null && inverse !== undefined) {
      this.mInverse = inverse
    } else {
      this.mInverse = new UnitConverter(1 / this.mScale, -this.mOffset / this.mScale, this)
    }
  }

  scale (): number {
    return this.mScale
  }

  offset (): number {
    return this.mOffset
  }

  inverse (): UnitConverter {
    return this.mInverse
  }

  linear (): UnitConverter {
    // on fait volontairement ici une égalité exacte sur un double
    if (this.mOffset === 0.0) {
      return this
    } else {
      return UnitConverter.of(this.mScale)
    }
  }

  linearPow (pow: number): UnitConverter {
    // on fait volontairement ici une égalité exacte sur un double
    if (this.mOffset === 0.0 && pow === 1.0) {
      return this
    } else {
      return UnitConverter.of(Math.pow(this.mScale, pow))
    }
  }

  convert (value: number): number {
    return value * this.mScale + this.mOffset
  }

  concatenate (converter: UnitConverter): UnitConverter {
    return new UnitConverter(converter.scale() * this.mScale, this.convert(converter.offset()))
  }

  public static of (scale: number, offset: number = 0.0): UnitConverter {
    return new UnitConverter(scale, offset)
  }

  private static readonly IDENTITY: UnitConverter = UnitConverter.of(1.0)

  public static identity (): UnitConverter {
    return this.IDENTITY
  }

}

export abstract class Unit implements Factor {

  public static affine (source: Unit, target: Unit): UnitConverter {
    return target.toBase().inverse().concatenate(source.toBase())
  }

  getConverterTo (target: Unit): UnitConverter {
    return Unit.affine(this, target)
  }

  abstract toBase (): UnitConverter

  shift (value: number): TransformedUnit {
    return new TransformedUnit(UnitConverter.of(1.0, value), this)
  }

  scaleMultiply (value: number): TransformedUnit {
    return new TransformedUnit(UnitConverter.of(value), this)
  }

  scaleDivide (value: number): TransformedUnit {
    return this.scaleMultiply(1.0 / value)
  }

  factor (numerator: number, denominator?: number): Factor {
    return new SimpleFactor(this, numerator, denominator)
  }

  dim (): Unit {
    return this
  }

  numerator (): number {
    return 1
  }

  denominator (): number {
    return 1
  }

  power (): number {
    return 1
  }

}

class SimpleFactor implements Factor {

  private readonly mUnit: Unit
  private readonly mNumerator: number
  private readonly mDenominator: number

  public constructor (unit: Unit, numerator?: number, denominator?: number) {
    this.mUnit = unit
    this.mNumerator = numerator ?? 1
    this.mDenominator = denominator ?? 1
  }

  dim (): Unit {
    return this.mUnit
  }

  numerator (): number {
    return this.mNumerator
  }

  denominator (): number {
    return this.mDenominator
  }

  power (): number {
    return this.mDenominator === 1 ? this.mNumerator : this.mNumerator / this.mDenominator
  }

}

export class FundamentalUnit extends Unit {

  toBase (): UnitConverter {
    return UnitConverter.identity()
  }

}

export class DerivedUnit extends Unit {

  private readonly mDefinition: Factor[]

  public constructor (...definition: Factor[]) {
    super()
    this.mDefinition = definition
  }

  definition (): Factor[] {
    return this.mDefinition
  }

  toBase (): UnitConverter {
    /*
    En combinaison avec d'autres unités, il ne faut plus appliquer de décalage d'origine d'échelle (température)
    mais uniquement appliquer le facteur d'échelle.
    */
    let transform: UnitConverter = UnitConverter.identity()
    for (const factor of this.mDefinition) {
      transform = factor.dim().toBase().linearPow(factor.power()).concatenate(transform)
    }
    return transform
  }

}

export class TransformedUnit extends Unit {

  private readonly mReference: Unit
  private readonly mToReference: UnitConverter

  public constructor (toReference: UnitConverter, reference: Unit) {
    super()
    this.mToReference = toReference
    this.mReference = reference
  }

  reference (): Unit {
    return this.mReference
  }

  toReference (): UnitConverter {
    return this.mToReference
  }

  toBase (): UnitConverter {
    return this.reference().toBase().concatenate(this.toReference())
  }

}
