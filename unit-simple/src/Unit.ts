import { Factor } from './Factor'

export class UnitConverter {

    private mScale: number;
    private mOffset: number;
    private mInverse: UnitConverter;

    private constructor (scale: number, offset: number);
    private constructor (scale: number, offset: number, inverse: UnitConverter);
    private constructor (scale: number, offset: number, inverse?: UnitConverter) {
      this.mScale = scale
      this.mOffset = offset

      if (inverse) {
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

    public static of (scale: number, offset?: number): UnitConverter {
      if (offset != null) {
        return new UnitConverter(scale, offset)
      } else {
        return UnitConverter.of(scale, 0.0)
      }
    }

    private static IDENTITY: UnitConverter = UnitConverter.of(1.0)

    public static identity (): UnitConverter {
      return this.IDENTITY
    }

}

export abstract class Unit implements Factor {

  public static affine (source: Unit, target: Unit): UnitConverter {
    return target.toBase().inverse().concatenate(source.toBase())
  }

  getConverterTo​ (target: Unit): UnitConverter {
    return Unit.affine(this, target)
  }

  abstract toBase(): UnitConverter

  shift (value: number) {
    return new TransformedUnit(UnitConverter.of(1.0, value), this)
  }

  scaleMultiply (value: number) {
    return new TransformedUnit(UnitConverter.of(value), this)
  }

  scaleDivide (value: number) {
    return this.scaleMultiply(1.0 / value)
  }

  factor (numerator: number, denominator?: number) {
    return new DefaultFactor(this, numerator, denominator)
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

class DefaultFactor implements Factor {

    private mUnit: Unit
    private mNumerator: number
    private mDenominator: number

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

  private mDefinition: Factor[]

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

    private mReferenceUnit: Unit
    private mConverter: UnitConverter

    public constructor (converter: UnitConverter, referenceUnit: Unit) {
      super()
      this.mConverter = converter
      this.mReferenceUnit = referenceUnit
    }

    reference (): Unit {
      return this.mReferenceUnit
    }

    toReference (): UnitConverter {
      return this.mConverter
    }

    toBase (): UnitConverter {
      return this.reference().toBase().concatenate(this.toReference())
    }

}
