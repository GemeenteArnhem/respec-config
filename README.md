# respec-config, Gemeente Arnhem

Centrale ReSpec configuratie voor documenten van Gemeente Arnhem.

Deze repository bevat de organisatiebrede configuratie voor ReSpec publicaties van Gemeente Arnhem.  
De configuratie is bedoeld om hergebruikt te worden door meerdere documentrepositories, zoals standaarden, architectuurkaders, werkafspraken en richtlijnen.

## Doel

Met deze repository houden we organisatiebrede instellingen op een centrale plek, zodat ze niet in iedere documentrepository opnieuw beheerd hoeven te worden.

Denk daarbij aan:

- organisatienaam
- logo's
- publicatie-URL's
- standaard licentie
- labels voor documentstatus
- labels voor documenttypen, `specType`
- eventuele organisatiebrede stijl- en configuratiekeuzes

## Waarom een aparte repository

De ReSpec aanpak maakt onderscheid tussen:

- **organisation-config**, voor organisatiebrede instellingen
- **config.js**, voor document-specifieke instellingen

Door deze organisatieconfig centraal te hosten:

- blijven documentrepositories lichter en eenvoudiger
- hoeven logo's en labels niet telkens gekopieerd te worden
- kunnen aanpassingen in een keer voor meerdere documenten worden doorgevoerd
- ontstaat een duidelijke scheiding tussen organisatiebeleid en documentinhoud

## Inhoud van deze repository

Voorbeeldstructuur:

```text
respec-config/
├─ organisation-config.mjs
├─ style/
│  └─ ...
├─ logos/
│  └─ arnhem-logo.webp
└─ README.md
```

## Belangrijkste bestand

### `organisation-config.mjs`

Dit bestand exporteert de Arnhem organisatieconfig en biedt een functie `loadRespecWithConfiguration()` die document-specifieke configuratie combineert met Arnhem defaults.

In deze file staan onder andere:

- `nl_organisationName`
- `logos`
- `localizationStrings`
- `labelColor`
- `licenses`
- standaard publicatie-instellingen

## Hoe gebruik je deze repository

In een Arnhem documentrepository, bijvoorbeeld `arnhem-api-standaard`, importeer je in `js/config.js` de centrale configuratie:

```js
import { loadRespecWithConfiguration } from "https://gemeentearnhem.github.io/respec-config/organisation-config.mjs";

loadRespecWithConfiguration({
  title: "Arnhem API-standaard",
  specStatus: "WV",
  specType: "API",
  pubDomain: "arnhem",
  shortName: "api-standaard",
  publishDate: "2026-06-10",
  publishVersion: "0.1.0",
  latestVersion: "https://gemeentearnhem.github.io/api-standaard/",
  prevVersion: [],
  editors: [
    {
      name: "Naam van persoon hier",
      company: "Gemeente Arnhem",
      companyURL: "https://www.arnhem.nl"
    }
  ],
  authors: [
    {
      name: "Naam van persoon hier",
      company: "Gemeente Arnhem",
      companyURL: "https://www.arnhem.nl"
    }
  ],
  github: "https://github.com/GemeenteArnhem/api-standaard"
});
```

## Arnhem documentstatussen

De volgende documentstatussen worden ondersteund:

- `WV`, Werkversie
- `CV`, Consultatieversie
- `VV`, Versie ter vaststelling
- `DEF`, Vastgestelde versie
- `BASIS`, Document zonder officiele status

## Arnhem documenttypen, `specType`

Gemeente Arnhem gebruikt een beperkte en beheersbare set documenttypen.

### Huidige set

- `ST`, Standaard
- `AK`, Architectuurkader
- `API`, API-standaard
- `GS`, Gegevensstandaard
- `AR`, Arnhemrichtlijn
- `WA`, Werkafspraak Arnhem
- `BD`, Beheerdocumentatie
- `BP`, Best practice
- `AL`, Algemeen document

## Richtlijnen voor gebruik

### Gebruik `specType` bewust

Kies alleen een documenttype uit de vastgestelde Arnhem lijst.  
Voeg niet ad hoc nieuwe types toe in losse documentrepositories.

### Houd organisatiebreed in `respec-config`

Alles wat voor meerdere documenten gelijk is, hoort in deze repository thuis.

Voorbeelden:

- organisatienaam
- standaard logo
- type-labels
- standaard statuslabels
- licentie-instellingen

### Houd document-specifiek in de documentrepo

Alles wat uniek is voor een document hoort in de documentrepository thuis.

Voorbeelden:

- titel
- auteurs
- redacteuren
- publicatiedatum
- versie
- `shortName`
- GitHub repository
- inhoud van het document

## Publicatie

Deze repository is bedoeld om via GitHub Pages beschikbaar te zijn, zodat documentrepositories de organisatieconfig rechtstreeks kunnen importeren.

Voorbeeld publicatie-URL:

```text
https://gemeentearnhem.github.io/respec-config/organisation-config.mjs
```

## Wijzigingsbeheer

Wijzigingen in deze repository hebben effect op meerdere ReSpec documenten.  
Pas deze repository daarom zorgvuldig aan.

### Aanbevolen werkwijze

1. maak een branch
2. voer de wijziging door
3. test in een of meer documentrepositories
4. maak een pull request
5. review op:
   - correctheid van labels
   - impact op bestaande documenten
   - consistentie met Arnhem huisstijl en governance

## Governance

De centrale configuratie wordt beheerd namens Gemeente Arnhem.

Nieuwe documenttypen, statuswijzigingen of organisatiebrede aanpassingen worden alleen toegevoegd na afstemming met de beheerder van de ReSpec publicatievoorziening en de inhoudelijk verantwoordelijke standaard- of architectuurfunctie.

## Ontwerpkeuzes

Deze repository volgt het patroon waarbij:

- de organisatieconfig centraal wordt beheerd
- documentconfig per document apart blijft
- ReSpec zelf de kop, labels en metadata opbouwt
- maatwerk zoveel mogelijk in de configuratielaag wordt opgelost

Daarmee voorkomen we handmatige injecties of losse HTML trucs in documentrepositories.

## Contact

Voor vragen of wijzigingen:

- open een issue in deze repository
- of neem contact op met de beheerder van de Arnhem ReSpec publicatievoorziening

## Licentie

Tenzij anders aangegeven geldt voor deze configuratie:

**CC-BY 4.0**