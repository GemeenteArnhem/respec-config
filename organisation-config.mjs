import {
  loadRespecWithConfiguration as loadLogiusRespecWithConfiguration,
} from "https://logius-standaarden.github.io/publicatie/respec/organisation-config.mjs";

/**
 * Arnhem organisatiebrede ReSpec configuratie.
 *
 * Doel:
 * - Logius ReSpec infrastructuur hergebruiken
 * - Arnhem organisatiegegevens centraal beheren
 * - Arnhem eigen specType labels gebruiken
 * - Geen losse injecties of handmatige HTML aanpassingen nodig
 */

const arnhemOrganisationConfig = {
  /* Organisatie-identiteit */
  nl_organisationName: "Gemeente Arnhem",
  nl_organisationStylesURL: "https://gemeentearnhem.github.io/respec-config/style/",
  nl_organisationPublishURL: "https://gemeentearnhem.github.io/publicatie/",

  /* Logo */
  logos: [
    {
      src: "https://gemeentearnhem.github.io/respec-config/style/logos/arnhem-logo.webp",
      alt: "Gemeente Arnhem",
      id: "Arnhem",
      height: 77,
      width: 180,
      url: "https://www.arnhem.nl",
    },
  ],

  useLogo: true,
  useLabel: true,

  /**
   * Teksten voor documentstatus en documenttype.
   * Let op:
   * ReSpec/Logius gebruikt in de bestaande config lowercase keys,
   * terwijl je in documentconfig meestal uppercase zoals "WV" of "ST" gebruikt.
   * Daarom definieren we hier de keys lowercase.
   */
  localizationStrings: {
    nl: {
      /* statussen */
      wv: "Werkversie",
      cv: "Consultatieversie",
      vv: "Versie ter vaststelling",
      def: "Vastgestelde versie",
      basis: "Document",
      eo: "Verouderde versie",
      tg: "Teruggetrokken versie",

      /* Arnhem specTypes */
      st: "Standaard",
      ak: "Architectuurkader",
      api: "API-standaard",
      gs: "Gegevensstandaard",
      ar: "Arnhemrichtlijn",
      wa: "Werkafspraak Arnhem",
      bd: "Beheerdocumentatie",
      bp: "Best practice",
      al: "Algemeen document",
    },
    en: {
      /* statuses */
      wv: "Draft",
      cv: "Consultation version",
      vv: "Proposed version",
      def: "Definitive version",
      basis: "Document",
      eo: "Outdated version",
      tg: "Rescinded version",

      /* Arnhem specTypes */
      st: "Standard",
      ak: "Architecture framework",
      api: "API standard",
      gs: "Data standard",
      ar: "Arnhem guideline",
      wa: "Arnhem working agreement",
      bd: "Governance documentation",
      bp: "Best practice",
      al: "General document",
    },
  },

  /**
   * Standaard teksten voor Status van dit document.
   * Je kunt deze later nog Arnhem-specifieker maken.
   */
  sotdText: {
    nl: {
      sotd: "Status van dit document",
      def: "Dit is de definitieve versie van dit document. Wijzigingen naar aanleiding van consultaties zijn doorgevoerd.",
      wv: "Dit is een werkversie die op elk moment kan worden gewijzigd, verwijderd of vervangen door andere documenten.",
      cv: "Dit is een consultatieversie. Reacties kunnen worden ingediend via de aangegeven beheer- of projectroute.",
      vv: "Dit is een versie ter vaststelling. Wijzigingen naar aanleiding van consultaties zijn doorgevoerd.",
      basis: "Dit is een document zonder officiele status.",
    },
    en: {
      sotd: "Status of This Document",
      def: "This is the definitive version of this document. Edits resulting from consultations have been applied.",
      wv: "This is a draft that may be changed, removed or replaced by other documents.",
      cv: "This is a consultation version. Comments may be submitted through the indicated governance or project route.",
      vv: "This is a version proposed for approval. Edits resulting from consultations have been applied.",
      basis: "This document has no official standing.",
    },
  },

  /**
   * Kleur van het label links in beeld, per documentstatus.
   * Deze kun je desgewenst nog op Arnhem huisstijl finetunen.
   */
  labelColor: {
    def: "#002469",
    wv: "#12636B",
    cv: "#A10082",
    vv: "#275582",
  },

  /* Licenties */
  licenses: {
    "cc-by": {
      name: "Creative Commons Attribution 4.0 International Public License",
      short: "CC-BY",
      url: "https://creativecommons.org/licenses/by/4.0/legalcode",
      image: "https://gitdocumentatie.logius.nl/publicatie/respec/media/logos/cc-by.svg",
    },
  },

  license: "cc-by",
};

/**
 * Simpele deep merge voor objecten.
 * Arrays worden overschreven door de documentconfig.
 */
function mergeDeep(base = {}, override = {}) {
  const result = { ...base };

  for (const key of Object.keys(override)) {
    const baseValue = result[key];
    const overrideValue = override[key];

    const bothObjects =
      baseValue &&
      overrideValue &&
      typeof baseValue === "object" &&
      typeof overrideValue === "object" &&
      !Array.isArray(baseValue) &&
      !Array.isArray(overrideValue);

    result[key] = bothObjects
      ? mergeDeep(baseValue, overrideValue)
      : overrideValue;
  }

  return result;
}

/**
 * Publieke loader die je vanuit documentconfig aanroept.
 * Hiermee hou je dezelfde aanroepstijl als in de Logius template,
 * maar nu met Arnhem defaults.
 */
export function loadRespecWithConfiguration(documentConfig = {}) {
  const mergedConfig = mergeDeep(arnhemOrganisationConfig, documentConfig);

  /* Fallback publisher als documentrepo dit niet expliciet zet */
  if (!mergedConfig.publishers) {
    mergedConfig.publishers = [
      {
        name: "Gemeente Arnhem",
        url: "https://www.arnhem.nl",
      },
    ];
  }

  return loadLogiusRespecWithConfiguration(mergedConfig);
}

export { arnhemOrganisationConfig };