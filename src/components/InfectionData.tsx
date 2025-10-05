"use client";

import { useState, useEffect } from "react";
import { getInfectionData, getFilterOptions } from "@/app/actions";
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

// Define the types for our data
interface CasesPerCapita {
  disease: string;
  countryName: string;
  economicPhase: string;
  year: number;
  casesPer100k: number;
}

interface CasesByPhase {
  disease: string;
  economicPhase: string;
  year: number;
  totalCases: number;
}

export default function InfectionData() {
  const [perCapitaData, setPerCapitaData] = useState<CasesPerCapita[]>([]);
  const [byPhaseData, setByPhaseData] = useState<CasesByPhase[]>([]);

  const [year, setYear] = useState("2024");
  // This state now correctly stores the ID (e.g., '4')
  const [economicPhaseId, setEconomicPhaseId] = useState("4");
  const [infectionType, setInfectionType] = useState("MEA");

  // This state now expects an object with id and phase
  const [phaseOptions, setPhaseOptions] = useState<
    { id: string; phase: string }[]
  >([]);
  const [yearOptions, setYearOptions] = useState<{ year: number }[]>([]);
  const [infectionOptions, setInfectionOptions] = useState<
    { id: string; description: string }[]
  >([]);

  useEffect(() => {
    async function fetchOptions() {
      const { years, economicPhases, infectionTypes } =
        await getFilterOptions();
      setYearOptions(years);
      setPhaseOptions(economicPhases);
      setInfectionOptions(infectionTypes);
    }
    fetchOptions();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const { casesPerCapita, casesByEconomicPhase } = await getInfectionData({
        year,
        economicPhaseId, // Pass the ID to the server action
        infectionType,
      });
      setPerCapitaData(casesPerCapita);
      setByPhaseData(casesByEconomicPhase);
    }
    fetchData();
  }, [year, economicPhaseId, infectionType]);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((y) => (
              <SelectItem key={y.year} value={String(y.year)}>
                {y.year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Economic Phase Select (Corrected) */}
        <Select value={economicPhaseId} onValueChange={setEconomicPhaseId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Economic Phase" />
          </SelectTrigger>
          <SelectContent>
            {phaseOptions.map((p) => (
              <SelectItem key={p.id} value={String(p.id)}>
                {p.phase}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Infection Type Select */}
        <Select value={infectionType} onValueChange={setInfectionType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Infection" />
          </SelectTrigger>
          <SelectContent>
            {infectionOptions.map((i) => (
              <SelectItem key={i.id} value={i.id}>
                {i.description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">
          Infection Cases per 100,000 People
        </h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Country</TableHead>
                <TableHead>Cases per 100k people</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {perCapitaData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.countryName}</TableCell>
                  <TableCell>{row.casesPer100k.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">
          Total Infection Cases by Economic Phase
        </h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Economic Phase</TableHead>
                <TableHead className="text-right">Total Cases</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {byPhaseData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.economicPhase}</TableCell>
                  <TableCell className="text-right">{row.totalCases}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
