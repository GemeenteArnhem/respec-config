import {
  loadRespecWithConfiguration as loadLogiusRespecWithConfiguration,
} from "https://logius-standaarden.github.io/publicatie/respec/organisation-config.mjs";

const FALLBACK_GITHUB = "https://github.com/GemeenteArnhem/respec-config";
const FALLBACK_LICENSE = "cc-by";

const arnhemOrganisationConfig = {
  nl_organisationName: "Gemeente Arnhem",

  logos: [
    {
      src: "https://gemeentearnhem.github.io/respec-config/style/logos/arnhem-logo.png",
      alt: "Gemeente Arnhem",
      id: "Arnhem",
      height: 40,
      width: 140,
      url: "https://www.arnhem.nl",
    },
  ],

  useLogo: true,
  useLabel: true,

  labelColor: {
    def: "#12636B",
    wv: "#12636B",
    cv: "#12636B",
    vv: "#12636B",
    basis: "#12636B",
    eo: "#12636B",
    tg: "#12636B",
  },

  localizationStrings: {
    nl: {
      wv: "Werkversie",
      cv: "Consultatieversie",
      vv: "Versie ter vaststelling",
      def: "Vastgestelde versie",
      basis: "Document",
      eo: "Verouderde versie",
      tg: "Teruggetrokken versie",

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
      wv: "Draft",
      cv: "Consultation version",
      vv: "Proposed version",
      def: "Definitive version",
      basis: "Document",
      eo: "Outdated version",
      tg: "Rescinded version",

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

  sotdText: {
    nl: {
      sotd: "Status van dit document",
      def: "Dit is de definitieve versie van dit document. Wijzigingen naar aanleiding van consultaties zijn doorgevoerd.",
      wv: "Dit is een werkversie die op elk moment kan worden gewijzigd, verwijderd of vervangen door andere documenten.",
      cv: "Dit is een consultatieversie. Reacties kunnen worden ingediend via de aangegeven beheerroute.",
      vv: "Dit is een versie ter vaststelling. Wijzigingen naar aanleiding van consultaties zijn doorgevoerd.",
      basis: "Dit is een document zonder officiele status.",
    },
    en: {
      sotd: "Status of This Document",
      def: "This is the definitive version of this document. Edits resulting from consultations have been applied.",
      wv: "This is a draft that may be changed, removed or replaced by other documents.",
      cv: "This is a consultation version. Comments may be submitted through the indicated governance route.",
      vv: "This is a version proposed for approval. Edits resulting from consultations have been applied.",
      basis: "This document has no official standing.",
    },
  },
};

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

function removeDtDdByLabel(doc, labels = []) {
  const dts = [...doc.querySelectorAll(".head dt")];

  for (const dt of dts) {
    const text = (dt.textContent || "").trim().toLowerCase();

    if (labels.some(label => text.includes(label.toLowerCase()))) {
      const dd = dt.nextElementSibling;
      dt.remove();
      if (dd && dd.tagName.toLowerCase() === "dd") {
        dd.remove();
      }
    }
  }
}

function removeBlocksByText(doc, snippets = []) {
  const elements = [...doc.querySelectorAll(".head p, .head div, .head dd, section p, section div")];

  for (const el of elements) {
    const text = (el.textContent || "").trim().toLowerCase();

    if (snippets.some(snippet => text.includes(snippet.toLowerCase()))) {
      el.remove();
    }
  }
}

function removeLinksByHref(doc, patterns = []) {
  const links = [...doc.querySelectorAll("a[href]")];

  for (const link of links) {
    const href = link.getAttribute("href") || "";

    if (patterns.some(pattern => href.includes(pattern))) {
      const parent = link.closest("dd, p, div, li");
      if (parent) {
        parent.remove();
      } else {
        link.remove();
      }
    }
  }
}

function cleanupOptionalOutput(doc, options = {}) {
  const {
    hideGitHub = false,
    hideLicense = false,
    hideAlternateFormats = false,
  } = options;

  if (hideGitHub) {
    removeDtDdByLabel(doc, ["Doe mee", "Participate"]);
    removeLinksByHref(doc, ["/issues", "/pull", "/commits", "github.com"]);
  }

  if (hideLicense) {
    removeDtDdByLabel(doc, ["Dit document valt onder de volgende licentie", "This document is licensed under"]);
    removeBlocksByText(doc, [
      "Dit document valt onder de volgende licentie",
      "This document is licensed under",
      "Creative Commons Attribution 4.0 International Public License",
      "CC-BY",
    ]);
  }

  if (hideAlternateFormats) {
    removeDtDdByLabel(doc, [
      "Dit document is ook beschikbaar in dit niet-normatieve formaat",
      "This document is also available in these non-normative format",
    ]);
    removeLinksByHref(doc, [".pdf"]);
    removeBlocksByText(doc, [
      "Dit document is ook beschikbaar in dit niet-normatieve formaat",
      "This document is also available in these non-normative format",
    ]);
  }
}

function normalizeArnhemConfig(config) {
  const normalized = { ...config };

  const hideGitHub = normalized.github === false;
  const hideLicense = normalized.license === false;
  const hideAlternateFormats = normalized.alternateFormats === false;

  /*
    pubDomain "arnhem" accepteren als invoer,
    maar intern mappen naar "st" om door de Logius validatie te komen.
  */
  if (typeof normalized.pubDomain === "string" && normalized.pubDomain.toLowerCase() === "arnhem") {
    normalized._arnhemPubDomain = "arnhem";
    normalized.pubDomain = "st";
  }

  /*
    Github is in de huidige Logius laag verplicht.
    Daarom geven we tijdelijk een fallback mee,
    en halen we het blok daarna weer weg in postProcess.
  */
  if (hideGitHub || !normalized.github) {
    normalized.github = FALLBACK_GITHUB;
  }

  /*
    Licentie optioneel maken.
    Bij false tijdelijke fallback,
    daarna verwijderen we het zichtbare blok.
  */
  if (hideLicense || !normalized.license) {
    normalized.license = FALLBACK_LICENSE;
  }

  /*
    Alternate formats optioneel maken.
    Bij false gewoon lege lijst.
  */
  if (hideAlternateFormats) {
    normalized.alternateFormats = [];
  }

  const existingPostProcess = Array.isArray(normalized.postProcess)
    ? normalized.postProcess
    : [];

  normalized.postProcess = [
    ...existingPostProcess,
    async doc => {
      cleanupOptionalOutput(doc, {
        hideGitHub,
        hideLicense,
        hideAlternateFormats,
      });
    },
  ];

  return normalized;
}

export function loadRespecWithConfiguration(documentConfig = {}) {
  let mergedConfig = mergeDeep(arnhemOrganisationConfig, documentConfig);

  if (!mergedConfig.publishers) {
    mergedConfig.publishers = [
      {
        name: "Gemeente Arnhem",
        url: "https://www.arnhem.nl",
      },
    ];
  }

  mergedConfig = normalizeArnhemConfig(mergedConfig);

  return loadLogiusRespecWithConfiguration(mergedConfig);
}

export { arnhemOrganisationConfig };