/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect, useCallback } from "react";

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
  fecha: Date;
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
  const [obraType, setObraType] = useState<string>(workData.obraType);
  const [fecha, setFecha] = useState<Date>(new Date(workData.fecha));

  // 🔄 Sincronizar estados locales con `workData`
  useEffect(() => {
    setObraType(workData.obraType);
    setFecha(new Date(workData.fecha));
  }, [workData]);

  // ✅ Mantener `cui` y `nombreObra` sincronizados
  const form = useForm({
    resolver: zodResolver(newObraSchema),
    defaultValues: {
      cui: workData.cui,
      nombreObra: workData.nombreObra,
    },
  });

  useEffect(() => {
    form.reset({
      cui: workData.cui,
      nombreObra: workData.nombreObra,
    });
  }, [workData, form.reset]);

  // ✅ Usar `useCallback` para evitar renders innecesarios y tipar `prev` correctamente
  const actualizarWorkData = useCallback(() => {
    setworkData((prev: WorkData) => {
      if (
        prev.fecha.getTime() !== fecha.getTime() ||
        prev.obraType !== obraType ||
        prev.cui !== form.getValues("cui") ||
        prev.nombreObra !== form.getValues("nombreObra")
      ) {
        return {
          ...prev,
          fecha,
          obraType,
          cui: form.getValues("cui"),
          nombreObra: form.getValues("nombreObra"),
        };
      }
      return prev; // No actualizar si los valores no cambiaron
    });
  }, [fecha, obraType, form, setworkData]);

  // ✅ Solo ejecutar `actualizarWorkData` cuando realmente cambien los valores
  useEffect(() => {
    actualizarWorkData();
  }, [fecha, obraType, form.watch("cui"), form.watch("nombreObra")]);

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* 📌 Campo CUI */}
            <FormField
              control={form.control}
              name="cui"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CUI:</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="111111111"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-end" />
                </FormItem>
              )}
            />

            {/* 📌 Campo Fecha */}
            <CalendarForm
              fecha={(date: Date | undefined) => {
                if (date) {
                  setFecha(date);
                }
              }}
              type="posterior"
            />

            {/* 📌 Campo Tipo de Obra */}
            <Combobox
              placeholder="Tipo de obra"
              options={optionIcon}
              onChange={(value) => {
                setObraType(value || "");
              }}
              value={obraType}
            />
          </div>

          {/* 📌 Campo Nombre de la Obra */}
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
