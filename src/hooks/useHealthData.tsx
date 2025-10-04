"use client";

import { useState, useEffect } from "react";

interface InfectionType {
  id: string;
  description: string;
}

interface VaccinationData {
  inf_type: string;
  antigen: string;
  country: string;
  year: string;
  target_num: number;
  doses: number;
  coverage: number;
}

interface InfectionData {
  inf_type: string;
  country: string;
  year: string;
  cases: number;
}

interface Country {
  CountryID: string;
  name: string;
  region: string;
  economy: string;
}

export const useHealthData = () => {
  const [infections, setInfections] = useState<InfectionType[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [stats, setStats] = useState({
    totalDoses: 0,
    totalCases: 0,
    yearRange: "2000-2025",
    countriesCount: 0,
    diseasesCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load infection types
        const infectionResponse = await fetch("/data/Infection_Type.csv");
        const infectionText = await infectionResponse.text();
        const infectionLines = infectionText.trim().split("\n").slice(1);
        const parsedInfections = infectionLines
          .filter((line) => line.trim())
          .map((line) => {
            const [id, description] = line.split(",");
            return { id: id.trim(), description: description.trim() };
          });
        setInfections(parsedInfections);

        // Load countries
        const countryResponse = await fetch("/data/Country.csv");
        const countryText = await countryResponse.text();
        const countryLines = countryText.trim().split("\n").slice(1);
        const parsedCountries = countryLines
          .filter((line) => line.trim())
          .map((line) => {
            const [CountryID, name, region, economy] = line
              .split(",")
              .map((s) => s.replace(/"/g, "").trim());
            return { CountryID, name, region, economy };
          });
        setCountries(parsedCountries);

        // Calculate total doses from vaccination data (sample first 1000 rows for performance)
        const vaccinationResponse = await fetch("/data/Vaccination.csv");
        const vaccinationText = await vaccinationResponse.text();
        const vaccinationLines = vaccinationText
          .trim()
          .split("\n")
          .slice(1, 1001);
        let totalDoses = 0;
        vaccinationLines.forEach((line) => {
          if (line.trim()) {
            const parts = line.split(",");
            const doses = parseInt(parts[5]) || 0;
            totalDoses += doses;
          }
        });

        // Calculate total cases from infection data (sample first 1000 rows for performance)
        const infectionDataResponse = await fetch("/data/InfectionData.csv");
        const infectionDataText = await infectionDataResponse.text();
        const infectionDataLines = infectionDataText
          .trim()
          .split("\n")
          .slice(1, 1001);
        let totalCases = 0;
        infectionDataLines.forEach((line) => {
          if (line.trim()) {
            const parts = line.split(",");
            const cases = parseInt(parts[3]) || 0;
            totalCases += cases;
          }
        });

        setStats({
          totalDoses: totalDoses * 24, // Extrapolate from sample
          totalCases: totalCases * 15, // Extrapolate from sample
          yearRange: "2000-2024",
          countriesCount: parsedCountries.length,
          diseasesCount: parsedInfections.length,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error loading health data:", error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { infections, countries, stats, loading };
};
