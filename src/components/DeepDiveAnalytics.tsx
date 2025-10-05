"use client";

import { useState, useEffect } from "react";
import {
  getVaccinationImprovement,
  getAboveAverageInfections,
  getFilterOptions,
} from "@/app/actions";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// --- Type Definitions ---
interface ImprovementData {
  countryName: string;
  rateIncrease: number;
}
interface AboveAverageData {
  countryName: string;
  infection: string;
  infectionRate: number;
}
interface FilterOptions {
  years: { year: number }[];
  antigens: { AntigenID: string; name: string }[];
  infectionTypes: { id: string; description: string }[];
}

export default function DeepDiveAnalytics() {
  // --- State for Filters ---
  const [filters, setFilters] = useState<FilterOptions>({
    years: [],
    antigens: [],
    infectionTypes: [],
  });

  // Sub-Task A: Improvement Filters & Data
  const [startYear, setStartYear] = useState("2000");
  const [endYear, setEndYear] = useState("2024");
  const [antigen, setAntigen] = useState("MCV2");
  const [limit, setLimit] = useState(10);
  const [improvementData, setImprovementData] = useState<ImprovementData[]>([]);

  // Sub-Task B: Above Average Filters & Data
  const [infectionYear, setInfectionYear] = useState("2024");
  const [infectionType, setInfectionType] = useState("MEA");
  const [globalAverage, setGlobalAverage] = useState<number | null>(null);
  const [aboveAverageData, setAboveAverageData] = useState<AboveAverageData[]>(
    []
  );

  // --- Data Fetching Effects ---
  useEffect(() => {
    async function fetchOptions() {
      const { years, antigens, infectionTypes } = await getFilterOptions();
      setFilters({ years, antigens, infectionTypes });
    }
    fetchOptions();
  }, []);

  const handleFetchImprovement = async () => {
    const data = await getVaccinationImprovement({
      startYear,
      endYear,
      antigen,
      limit,
    });
    setImprovementData(data);
  };

  const handleFetchAboveAverage = async () => {
    const { globalAverage, countries } = await getAboveAverageInfections({
      year: infectionYear,
      infectionType,
    });
    setGlobalAverage(globalAverage);
    setAboveAverageData(countries);
  };

  // Fetch data on initial load
  useEffect(() => {
    handleFetchImprovement();
    handleFetchAboveAverage();
  }, []);

  return (
    <div className="space-y-16">
      {/* --- Section for Sub-Task A: Vaccination Improvement --- */}
      <section>
        <h2 className=" text-lg text-[#6d6d6d] lg:text-3xl font-bold mb-4">
          A: Identify Biggest Vaccination Rate Improvements
        </h2>
        <div className="flex flex-wrap gap-4 p-4 border rounded-lg mb-6 bg-slate-50">
          <Select value={startYear} onValueChange={setStartYear}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Start Year" />
            </SelectTrigger>
            <SelectContent>
              {filters.years.map((y) => (
                <SelectItem key={`start-${y.year}`} value={String(y.year)}>
                  {y.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={endYear} onValueChange={setEndYear}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="End Year" />
            </SelectTrigger>
            <SelectContent>
              {filters.years.map((y) => (
                <SelectItem key={`end-${y.year}`} value={String(y.year)}>
                  {y.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={antigen} onValueChange={setAntigen}>
            <SelectTrigger className="w-full sm:w-[300px]">
              <SelectValue placeholder="Antigen" />
            </SelectTrigger>
            <SelectContent>
              {filters.antigens.map((a) => (
                <SelectItem key={a.AntigenID} value={a.AntigenID}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-full sm:w-[120px]"
            placeholder="Top #"
          />
          <Button onClick={handleFetchImprovement}>Find Countries</Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Country</TableHead>
                <TableHead>Start Year</TableHead>
                <TableHead>End Year</TableHead>
                <TableHead className="text-right">
                  Vaccination Rate Increase
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {improvementData.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">
                    {row.countryName}
                  </TableCell>
                  <TableCell>{startYear}</TableCell>
                  <TableCell>{endYear}</TableCell>
                  <TableCell className="text-right text-green-600 font-bold">
                    {row.rateIncrease.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* --- Section for Sub-Task B: Above Average Infections --- */}
      <section>
        <h2 className="text-lg text-[#6d6d6d] lg:text-3xl font-bold mb-4">
          B: Identify Countries with Above Average Infection Rates
        </h2>
        <div className="flex flex-wrap gap-4 p-4 border rounded-lg mb-6 bg-slate-50">
          <Select value={infectionYear} onValueChange={setInfectionYear}>
            <SelectTrigger className="w-full bg-white sm:w-[180px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {filters.years.map((y) => (
                <SelectItem key={`inf-${y.year}`} value={String(y.year)}>
                  {y.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={infectionType} onValueChange={setInfectionType}>
            <SelectTrigger className="w-full bg-white sm:w-[250px]">
              <SelectValue placeholder="Select Infection" />
            </SelectTrigger>
            <SelectContent>
              {filters.infectionTypes.map((i) => (
                <SelectItem key={i.id} value={i.id}>
                  {i.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleFetchAboveAverage}>Find Countries</Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Country</TableHead>
                <TableHead>Infection Type</TableHead>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">
                  Infection per 100,000 people
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {globalAverage !== null && (
                <TableRow className="bg-blue-50 font-bold">
                  <TableCell>Global</TableCell>
                  <TableCell>
                    {
                      filters.infectionTypes.find((i) => i.id === infectionType)
                        ?.description
                    }
                  </TableCell>
                  <TableCell>{infectionYear}</TableCell>
                  <TableCell className="text-right">
                    {globalAverage.toFixed(2)}
                  </TableCell>
                </TableRow>
              )}
              {aboveAverageData.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">
                    {row.countryName}
                  </TableCell>
                  <TableCell>{row.infection}</TableCell>
                  <TableCell>{infectionYear}</TableCell>
                  <TableCell className="text-right text-red-600 font-semibold">
                    {row.infectionRate.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
