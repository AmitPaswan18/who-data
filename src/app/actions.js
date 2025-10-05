"use server";

import { db } from "@/lib/db";

export async function getVaccinationData(filters) {
  const { year, antigen, country, region } = filters;

  // Build the WHERE clauses dynamically
  let countryFilter = country ? `AND C.CountryID = '${country}'` : "";
  let regionFilter = region ? `AND C.region = '${region}'` : "";

  // Query for Table 1
  const highCoverageCountries = db
    .prepare(
      `
    SELECT V.antigen, V.year, C.name AS countryName, C.region, V.coverage AS percentage
    FROM Vaccination V
    JOIN Country C ON V.country = C.CountryID
    WHERE V.coverage >= 90
      AND V.year = ?
      AND V.antigen = ?
      ${countryFilter}
      ${regionFilter}
    ORDER BY C.region, percentage DESC
  `
    )
    .all(year, antigen);

  // Query for Table 2
  const regionSummary = db
    .prepare(
      `
    SELECT V.antigen, V.year, C.region, COUNT(V.country) AS countriesMeetingTarget
    FROM Vaccination V
    JOIN Country C ON V.country = C.CountryID
    WHERE V.coverage >= 90
      AND V.year = ?
      AND V.antigen = ?
      ${countryFilter}
      ${regionFilter}
    GROUP BY C.region
    ORDER BY C.region
  `
    )
    .all(year, antigen);

  return { highCoverageCountries, regionSummary };
}

export async function getInfectionData(filters) {
  const { economicPhaseId, infectionType, year } = filters;

  const casesPerCapita = db
    .prepare(
      `
    SELECT
      IT.description AS disease,
      C.name AS countryName,
      E.phase AS economicPhase,
      ID.year,
      CASE
        WHEN CP.population IS NULL OR CP.population = 0 THEN 0
        ELSE (CAST(ID.cases AS REAL) * 100000 / CP.population)
      END AS casesPer100k
    FROM InfectionData ID
    JOIN Country C ON ID.country = C.CountryID
    JOIN Economy E ON C.economy = E.ROWID  -- 1. FIX: Changed E.id to E.ROWID
    JOIN Infection_Type IT ON ID.inf_type = IT.id
    LEFT JOIN CountryPopulation CP ON ID.country = CP.country AND ID.year = CP.year
    WHERE E.ROWID = ? -- 1. FIX: Changed E.id to E.ROWID
      AND IT.id = ?
      AND ID.year = ?
    ORDER BY casesPer100k DESC
  `
    )
    .all(economicPhaseId, infectionType, year);

  const casesByEconomicPhase = db
    .prepare(
      `
    SELECT
      IT.description as disease,
      E.phase as economicPhase,
      ID.year,
      SUM(ID.cases) as totalCases
    FROM InfectionData ID
    JOIN Country C ON ID.country = C.CountryID
    JOIN Economy E ON C.economy = E.ROWID -- 1. FIX: Changed E.id to E.ROWID
    JOIN Infection_Type IT ON ID.inf_type = IT.id
    WHERE IT.id = ? AND ID.year = ?
    GROUP BY E.phase
    ORDER BY E.phase
  `
    )
    .all(infectionType, year);

  return { casesPerCapita, casesByEconomicPhase };
}

export async function getFilterOptions() {
  const years = db
    .prepare("SELECT DISTINCT year FROM Vaccination ORDER BY year DESC")
    .all();
  const antigens = db
    .prepare("SELECT DISTINCT AntigenID, name FROM Antigen")
    .all();
  const regions = db
    .prepare("SELECT DISTINCT region FROM Country ORDER BY region")
    .all();
  const countries = db
    .prepare("SELECT DISTINCT CountryID, name FROM Country ORDER BY name")
    .all();

  // 2. FIX: Select the ROWID and name it 'id' so the component still works
  const economicPhases = db
    .prepare("SELECT ROWID as id, phase FROM Economy")
    .all();

  const infectionTypes = db
    .prepare("SELECT id, description FROM Infection_Type")
    .all();

  return {
    years,
    antigens,
    regions,
    countries,
    economicPhases,
    infectionTypes,
  };
}

// --- NEW FUNCTIONS FOR LEVEL 3 ---

export async function getVaccinationImprovement(filters) {
  const { startYear, endYear, antigen, limit } = filters;

  // This query uses Common Table Expressions (CTEs) to get vaccination rates
  // for the start and end years, then joins them to find the improvement.
  const query = `
    WITH StartYearRates AS (
      SELECT
          V.country,
          (CAST(V.doses AS REAL) * 100.0 / CP.population) AS start_rate
      FROM Vaccination V
      JOIN CountryPopulation CP ON V.country = CP.country AND V.year = CP.year
      WHERE V.year = ? AND V.antigen = ? AND CP.population > 0
    ),
    EndYearRates AS (
      SELECT
          V.country,
          (CAST(V.doses AS REAL) * 100.0 / CP.population) AS end_rate
      FROM Vaccination V
      JOIN CountryPopulation CP ON V.country = CP.country AND V.year = CP.year
      WHERE V.year = ? AND V.antigen = ? AND CP.population > 0
    )
    SELECT
        C.name AS countryName,
        (EYR.end_rate - SYR.start_rate) AS rateIncrease
    FROM StartYearRates SYR
    JOIN EndYearRates EYR ON SYR.country = EYR.country
    JOIN Country C ON SYR.country = C.CountryID
    WHERE (EYR.end_rate - SYR.start_rate) > 0
    ORDER BY rateIncrease DESC
    LIMIT ?
  `;

  try {
    const topImprovingCountries = db
      .prepare(query)
      .all(startYear, antigen, endYear, antigen, limit);
    return topImprovingCountries;
  } catch (error) {
    console.error("Error fetching vaccination improvement:", error);
    return [];
  }
}

export async function getAboveAverageInfections(filters) {
  const { year, infectionType } = filters;

  // Query 1: Calculate the global average infection rate
  const globalAvgQuery = `
    SELECT (SUM(CAST(ID.cases AS REAL)) * 100000.0 / SUM(CAST(CP.population AS REAL))) AS globalAverage
    FROM InfectionData ID
    JOIN CountryPopulation CP ON ID.country = CP.country AND ID.year = CP.year
    WHERE ID.year = ? AND ID.inf_type = ?
  `;
  const globalData = db.prepare(globalAvgQuery).get(year, infectionType);
  const globalAverage = globalData ? globalData.globalAverage : 0;

  // Query 2: Find all countries with an infection rate above the global average
  const countriesAboveAvgQuery = `
    SELECT
        C.name as countryName,
        IT.description as infection,
        (CAST(ID.cases AS REAL) * 100000.0 / CP.population) as infectionRate
    FROM InfectionData ID
    JOIN Country C ON ID.country = C.CountryID
    JOIN Infection_Type IT ON ID.inf_type = IT.id
    JOIN CountryPopulation CP ON ID.country = CP.country AND ID.year = CP.year
    WHERE ID.year = ?
      AND ID.inf_type = ?
      AND CP.population > 0
      AND (CAST(ID.cases AS REAL) * 100000.0 / CP.population) > ?
    ORDER BY infectionRate DESC
  `;
  const countriesData = db
    .prepare(countriesAboveAvgQuery)
    .all(year, infectionType, globalAverage);

  return { globalAverage, countries: countriesData };
}
