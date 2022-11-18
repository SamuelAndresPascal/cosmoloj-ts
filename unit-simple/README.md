# Simple Unit (implémentation Typescript)

Utilisation des unités transformées :

```ts
const m: Unit = new FundamentalUnit()
const km: Unit = m.multiply(1000)
const cm: Unit = m.divide(100)
const cmToKm: UnitConverter = cm.converter(km)

cmToKm.convert(3) // 0.00003
cmToKm.inverse().convert(0.00003) // 3
```

Utilisation des unités dérivées :

```ts
const m: Unit = new FundamentalUnit()
const km: Unit = m.multiply(1000)
const km2: Unit = new DerivedUnit(km.factor(2))
const cm: Unit = m.divide(100)
const cm2: Unit = new DerivedUnit(cm.factor(2))
const km2Tocm2: UnitConverter = km2.converter(cm2)

km2Tocm2.convert(3) // 30000000000
km2Tocm2.inverse().convert(30000000000) // 3
```

Utilisation des unités dérivées en combinant les dimensions :

```ts
const m: Unit = new FundamentalUnit()
const kg: Unit = new FundamentalUnit()
const g: Unit = kg.divide(1000)
const ton: Unit = kg.multiply(1000)
const gPerM2: Unit = new DerivedUnit(g, m.factor(-2))
const km: Unit = m.multiply(1000)
const tonPerKm2: Unit = new DerivedUnit(ton, km.factor(-2))
const cm: Unit = m.divide(100)
const tonPerCm2: Unit = new DerivedUnit(ton, cm.factor(-2))
const gPerM2ToTonPerKm2: UnitConverter = gPerM2.converter(tonPerKm2)
const gPerM2ToTonPerCm2: UnitConverter = gPerM2.converter(tonPerCm2)


gPerM2ToTonPerKm2.convert(1) // 1
gPerM2ToTonPerKm2.inverse().convert(3) // 3
gPerM2ToTonPerCm2.convert(1) // 1e-4
gPerM2ToTonPerCm2.convert(3) // 3e-10
gPerM2ToTonPerCm2.offset() // 0.0
gPerM2ToTonPerCm2.scale() // 1e-10
gPerM2ToTonPerCm2.inverse().offset() // -0.0
gPerM2ToTonPerCm2.inverse().convert(3e-10) // 3
```

Utilisation des températures (conversions affines et linéaires) :

```ts
const k: Unit = new FundamentalUnit()
const c: Unit = k.plus(273.15)
const kToC: UnitConverter = k.converter(c)

kToC.convert(0) // -273.15
kToC.inverse().convert(0) // 273.15

// en combinaison avec d'autres unités, les conversions d'unités de températures doivent devenir linéaires
const m: Unit = new FundamentalUnit()
const cPerM: Unit = new DerivedUnit(c, m.factor(-1))
const kPerM: Unit = new DerivedUnit(k, m.factor(-1))
const kPerMToCPerM: UnitConverter = kPerM.converter(cPerM)
    
kPerMToCPerM.convert(3) // 3
kPerMToCPerM.inverse().convert(3) // 3
```
