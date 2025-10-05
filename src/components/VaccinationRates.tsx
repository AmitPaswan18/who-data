"use client";

import { useState, useEffect } from "react";
import { getVaccinationData, getFilterOptions } from "@/app/actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// --- Type Definitions ---
interface CountryData {
  antigen: string;
  year: number;
  countryName: string;
  region: string;
  percentage: number;
}
interface RegionSummary {
  antigen: string;
  year: number;
  region: string;
  countriesMeetingTarget: number;
}
interface FilterOptions {
  years: { year: number }[];
  antigens: { AntigenID: string; name: string }[];
  regions: { region: string }[];
  countries: { CountryID: string; name: string }[];
}

export default function VaccinationRates() {
  // State for data
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [regions, setRegions] = useState<RegionSummary[]>([]);

  // State for filters
  const [year, setYear] = useState("2024");
  const [antigen, setAntigen] = useState("DTPCV3");
  const [country, setCountry] = useState(""); // Default to all countries
  const [region, setRegion] = useState(""); // Default to all regions

  // State for filter options
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    years: [],
    antigens: [],
    regions: [],
    countries: [],
  });

  // Fetch filter options when the component mounts
  useEffect(() => {
    async function fetchOptions() {
      const { years, antigens, regions, countries } = await getFilterOptions();
      setFilterOptions({ years, antigens, regions, countries });
    }
    fetchOptions();
  }, []);

  // Fetch data whenever a filter changes
  useEffect(() => {
    async function fetchData() {
      const { highCoverageCountries, regionSummary } = await getVaccinationData(
        {
          year,
          antigen,
          country,
          region,
        }
      );
      setCountries(highCoverageCountries);
      setRegions(regionSummary);
    }
    fetchData();
  }, [year, antigen, country, region]);

  const handleResetFilters = () => {
    setCountry("");
    setRegion("");
  };

  return (
    <div>
      {/* --- Filter Controls --- */}
      <h2 className="text-2xl font-bold mb-4">
        Table 1: Countries with ≥90% Vaccination Coverage
      </h2>
      <div className="flex flex-wrap justify-between gap-4 p-4 border rounded-t-lg bg-slate-50">
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="bg-white ">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.years.map((y) => (
              <SelectItem key={y.year} value={String(y.year)}>
                {y.year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={antigen} onValueChange={setAntigen}>
          <SelectTrigger className=" bg-white">
            <SelectValue placeholder="Select Antigen" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.antigens.map((a) => (
              <SelectItem key={a.AntigenID} value={a.AntigenID}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="All Countries" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.countries.map((c) => (
              <SelectItem key={c.CountryID} value={c.CountryID}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="All Regions" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.regions.map((r) => (
              <SelectItem key={r.region} value={r.region}>
                {r.region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          className="bg-red-400"
          onClick={handleResetFilters}
          variant="outline">
          Reset Country/Region
        </Button>
      </div>

      {/* --- Data Tables --- */}
      <div>
        <div className=" border rounded-b-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Antigen</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Region</TableHead>
                <TableHead className="text-right">Coverage (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {countries.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.antigen}</TableCell>
                  <TableCell>{row.countryName}</TableCell>
                  <TableCell>{row.region}</TableCell>
                  <TableCell className="text-right">
                    {row.percentage &&
                    !isNaN(parseFloat(row.percentage.toString()))
                      ? parseFloat(row.percentage.toString()).toFixed(2)
                      : "0.00"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Table 2: Regional Summary</h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Antigen</TableHead>
                <TableHead>Region</TableHead>
                <TableHead className="text-right">
                  Countries Meeting Target
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regions.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.antigen}</TableCell>
                  <TableCell>{row.region}</TableCell>
                  <TableCell className="text-right">
                    {row.countriesMeetingTarget}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
