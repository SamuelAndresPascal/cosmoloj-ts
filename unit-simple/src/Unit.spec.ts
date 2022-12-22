import { DerivedUnit, FundamentalUnit, Unit, UnitConverter } from './Unit'

describe('Unit tests', () => {
  it('transformed unit conversion', () => {
    const m: Unit = new FundamentalUnit()
    const km: Unit = m.scaleMultiply(1000)
    const cm: Unit = m.scaleDivide(100)
    const cmToKm: UnitConverter = cm.getConverterTo(km)

    expect(cmToKm.convert(3)).toBeCloseTo(0.00003, 1e-10)
    expect(cmToKm.inverse().convert(0.00003)).toBeCloseTo(3, 1e-10)
  })

  it('derived unit conversion', () => {
    const m: Unit = new FundamentalUnit()
    const km: Unit = m.scaleMultiply(1000)
    const km2: Unit = new DerivedUnit(km.factor(2))
    const cm: Unit = m.scaleDivide(100)
    const cm2: Unit = new DerivedUnit(cm.factor(2))
    const km2Tocm2: UnitConverter = km2.getConverterTo(cm2)

    expect(km2Tocm2.convert(3)).toBeCloseTo(30000000000, 1e-10)
    expect(km2Tocm2.inverse().convert(30000000000)).toBeCloseTo(3, 1e-10)
  })

  it('combined dimension derived unit conversion', () => {
    const m: Unit = new FundamentalUnit()
    const kg: Unit = new FundamentalUnit()
    const g: Unit = kg.scaleDivide(1000)
    const ton: Unit = kg.scaleMultiply(1000)
    const gPerM2: Unit = new DerivedUnit(g, m.factor(-2))
    const km: Unit = m.scaleMultiply(1000)
    const tonPerKm2: Unit = new DerivedUnit(ton, km.factor(-2))
    const cm: Unit = m.scaleDivide(100)
    const tonPerCm2: Unit = new DerivedUnit(ton, cm.factor(-2))
    const gPerM2ToTonPerKm2: UnitConverter = gPerM2.getConverterTo(tonPerKm2)
    const gPerM2ToTonPerCm2: UnitConverter = gPerM2.getConverterTo(tonPerCm2)

    expect(gPerM2ToTonPerKm2.convert(1)).toBeCloseTo(1, 1e-10)
    expect(gPerM2ToTonPerKm2.inverse().convert(3)).toBeCloseTo(3, 1e-10)
    expect(gPerM2ToTonPerCm2.convert(1)).toBeCloseTo(1e-10, 1e-20)
    expect(gPerM2ToTonPerCm2.convert(3)).toBeCloseTo(3e-10, 1e-20)
    expect(gPerM2ToTonPerCm2.offset()).toEqual(0.0)
    expect(gPerM2ToTonPerCm2.scale()).toEqual(1e-10)
    expect(gPerM2ToTonPerCm2.inverse().offset()).toEqual(-0.0)
    expect(gPerM2ToTonPerCm2.inverse().convert(3e-10)).toBeCloseTo(3, 1e-10)
  })

  it('temperatures', () => {
    const k: Unit = new FundamentalUnit()
    const c: Unit = k.shift(273.15)
    const kToC: UnitConverter = k.getConverterTo(c)

    expect(kToC.convert(0)).toBeCloseTo(-273.15, 1e-10)
    expect(kToC.inverse().convert(0)).toBeCloseTo(273.15, 1e-10)
    expect(kToC.convert(1)).toBeCloseTo(-272.15, 1e-10)
    expect(kToC.inverse().convert(1)).toBeCloseTo(274.15, 1e-10)
    expect(kToC.convert(2)).toBeCloseTo(-271.15, 1e-10)
    expect(kToC.inverse().convert(2)).toBeCloseTo(275.15, 1e-10)

    // en combinaison avec d'autres unités, les conversions d'unités de températures doivent devenir linéaires
    const m: Unit = new FundamentalUnit()
    const cPerM: Unit = new DerivedUnit(c, m.factor(-1))
    const kPerM: Unit = new DerivedUnit(k, m.factor(-1))
    const kPerMToCPerM: UnitConverter = kPerM.getConverterTo(cPerM)
    expect(kPerMToCPerM.convert(3)).toBeCloseTo(3, 1e-10)
    expect(kPerMToCPerM.inverse().convert(3)).toBeCloseTo(3, 1e-10)
  })

  it('speed', () => {
    const m: Unit = new FundamentalUnit()
    const km: Unit = m.scaleMultiply(1000.0)

    const s: Unit = new FundamentalUnit()
    const h: Unit = s.scaleMultiply(3600.0)

    const ms: Unit = new DerivedUnit(m, s.factor(-1))
    const kmh: Unit = new DerivedUnit(km, h.factor(-1))

    const msToKmh: UnitConverter = ms.getConverterTo(kmh)

    expect(msToKmh.convert(100.0)).toBeCloseTo(360.0, 1e-10)
    expect(msToKmh.inverse().convert(18.0)).toBeCloseTo(5.0, 1e-10)
  })
})
