"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Combobox } from "@/components/select/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { newObraSchema } from "@/utils/zod/schemas";
import { Textarea } from "@/components/ui/textarea";
import { CalendarForm } from "@/components/ui/calendarForm";

interface WorkData {
  cui: string;
  nombreObra: string;
  fecha: Date | null;
  presupuesto: string;
  obraType: string;
}

interface FormularioRegisterObraProps {
  setworkData: React.Dispatch<React.SetStateAction<WorkData>>;
  workData: WorkData;
}

export default function FormularioRegisterObra({
  setworkData,
  workData,
}: FormularioRegisterObraProps) {
  const [obraType, setObraType] = useState<string>(workData.obraType || "");

  const form = useForm({
    resolver: zodResolver(newObraSchema),
    defaultValues: workData,
  });

  const optionIcon = [
    { value: "Acueducto", label: "Acueducto" },
    { value: "Aeropuerto", label: "Aeropuerto" },
    { value: "Almacen", label: "Almacén" },
    { value: "Canal", label: "Canal" },
    { value: "Carretera", label: "Carretera" },
    { value: "Clinica", label: "Clínica" },
    { value: "Cultural", label: "Cultural" },
    { value: "Deposito", label: "Depósito" },
    { value: "Edificio", label: "Edificio" },
    { value: "Embalse", label: "Embalse" },
    { value: "Escuela", label: "Escuela" },
    { value: "Estadio", label: "Estadio" },
    { value: "Fabrica", label: "Fábrica" },
    { value: "Ferrocarril", label: "Ferrocarril" },
    { value: "Hospital", label: "Hospital" },
    { value: "Infraestructura sanitaria", label: "Infraestructura sanitaria" },
    { value: "Mercado", label: "Mercado" },
    { value: "Parque", label: "Parque" },
    { value: "Planta", label: "Planta" },
    { value: "Puente", label: "Puente" },
    { value: "Puerto", label: "Puerto" },
    { value: "Represa", label: "Represa" },
    { value: "Terminal de transporte", label: "Terminal de transporte" },
    { value: "Tunel", label: "Túnel" },
    { value: "Universidad", label: "Universidad" },
  ];

  return (
    <div className="flex w-full h-full mx-auto items-center">
      <Form {...form}>
        <div className="space-y-6 w-full mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <FormField
              control={form.control}
              name="cui"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CUI:</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1234567"
                      {...field}
                      maxLength={7}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 7);
                        field.onChange(value);
                        setworkData((prev) => ({ ...prev, cui: value }));
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-end" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="presupuesto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Presupuesto:</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="S/......"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        field.onChange(value);
                        setworkData((prev) => ({
                          ...prev,
                          presupuesto: value,
                        }));
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-end" />
                </FormItem>
              )}
            />

            <CalendarForm
              fecha={(date: Date | undefined) => {
                if (date) {
                  setworkData((prev) => ({ ...prev, fecha: date }));
                }
              }}
              type="posterior"
            />

            <Combobox
              placeholder="Tipo de obra"
              options={optionIcon}
              onChange={(value) => {
                setObraType(value || "");
                setworkData((prev) => ({ ...prev, obraType: value || "" }));
              }}
              value={obraType}
            />
          </div>

          <div className="w-full col-span-3">
            <FormField
              control={form.control}
              name="nombreObra"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la obra:</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nombre completo de la obra"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        field.onChange(value);
                        setworkData((prev) => ({ ...prev, nombreObra: value }));
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-end" />
                </FormItem>
              )}
            />
          </div>
        </div>
      </Form>
    </div>
  );
}
