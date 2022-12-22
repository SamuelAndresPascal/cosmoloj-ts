# Simple Unit (implémentation Typescript)

## Utilisation

Utilisation des unités transformées :

```ts
const m: Unit = new FundamentalUnit()
const km: Unit = m.scaleMultiply(1000)
const cm: Unit = m.scaleDivide(100)
const cmToKm: UnitConverter = cm.getConverterTo​(km)

cmToKm.convert(3) // 0.00003
cmToKm.inverse().convert(0.00003) // 3
```

Utilisation des unités dérivées :

```ts
const m: Unit = new FundamentalUnit()
const km: Unit = m.scaleMultiply(1000)
const km2: Unit = new DerivedUnit(km.factor(2))
const cm: Unit = m.scaleDivide(100)
const cm2: Unit = new DerivedUnit(cm.factor(2))
const km2Tocm2: UnitConverter = km2.getConverterTo​(cm2)

km2Tocm2.convert(3) // 30000000000
km2Tocm2.inverse().convert(30000000000) // 3
```

Utilisation des unités dérivées en combinant les dimensions :

```ts
const m: Unit = new FundamentalUnit()
const kg: Unit = new FundamentalUnit()
const g: Unit = kg.scaleDivide(1000)
const ton: Unit = kg.scaleMultiply(1000)
const gPerM2: Unit = new DerivedUnit(g, m.factor(-2))
const km: Unit = m.scaleMultiply(1000)
const tonPerKm2: Unit = new DerivedUnit(ton, km.factor(-2))
const cm: Unit = m.scaleDivide(100)
const tonPerCm2: Unit = new DerivedUnit(ton, cm.factor(-2))
const gPerM2ToTonPerKm2: UnitConverter = gPerM2.getConverterTo​(tonPerKm2)
const gPerM2ToTonPerCm2: UnitConverter = gPerM2.getConverterTo​(tonPerCm2)


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
const c: Unit = k.shift(273.15)
const kToC: UnitConverter = k.getConverterTo​(c)

kToC.convert(0) // -273.15
kToC.inverse().convert(0) // 273.15

// en combinaison avec d'autres unités, les conversions d'unités de températures doivent devenir linéaires
const m: Unit = new FundamentalUnit()
const cPerM: Unit = new DerivedUnit(c, m.factor(-1))
const kPerM: Unit = new DerivedUnit(k, m.factor(-1))
const kPerMToCPerM: UnitConverter = kPerM.getConverterTo​(cPerM)

kPerMToCPerM.convert(3) // 3
kPerMToCPerM.inverse().convert(3) // 3
```

Utilisation des conversions non-décimales :

```ts
const m: Unit = new FundamentalUnit()
const km: Unit = m.scaleMultiply(1000.0)

const s: Unit = new FundamentalUnit()
const h: Unit = s.scaleMultiply(3600.0)

const ms: Unit = new DerivedUnit(m, s.factor(-1))
const kmh: Unit = new DerivedUnit(km, h.factor(-1))

const msToKmh: UnitConverter = ms.getConverterTo(kmh)

msToKmh.convert(100.0) // 360
msToKmh.inverse().convert(18) // 5
```

## Développement

Résolution des dépendances :

```shell
npm install
```

Compilation et tests :

```shell
npm run build
```

Test seuls :

```shell
npm run test
```
