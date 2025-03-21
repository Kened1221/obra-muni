"use client";

import { useState, useEffect } from "react";
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
  setWorkData: React.Dispatch<React.SetStateAction<WorkData>>;
  workData: WorkData;
  setFormResetFn?: React.Dispatch<React.SetStateAction<(() => void) | null>>;
}

export default function FormularioRegisterObra({
  setWorkData,
  workData,
  setFormResetFn,
}: FormularioRegisterObraProps) {
  const [obraType, setObraType] = useState<string>(workData.obraType || "");

  const form = useForm({
    resolver: zodResolver(newObraSchema),
    defaultValues: workData,
  });

  // Set up the reset function
  useEffect(() => {
    if (setFormResetFn) {
      setFormResetFn(() => () => form.reset());
    }
  }, [form, setFormResetFn]);

  // Sincronizar el formulario con workData cuando cambie
  useEffect(() => {
    form.reset(workData);
    setObraType(workData.obraType || "");
  }, [workData, form]);

  const optionIcon = [
    { value: "Acueducto", label: "Acueducto" },
    { value: "Aeropuerto", label: "Aeropuerto" },
    { value: "Almacen", label: "Almacén" },
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
                        setWorkData((prev) => ({ ...prev, cui: value }));
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
                        setWorkData((prev) => ({
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
                  setWorkData((prev) => ({ ...prev, fecha: date }));
                }
              }}
              type="posterior"
            />

            <Combobox
              placeholder="Tipo de obra"
              options={optionIcon}
              onChange={(value) => {
                setObraType(value || "");
                setWorkData((prev) => ({ ...prev, obraType: value || "" }));
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
                        setWorkData((prev) => ({ ...prev, nombreObra: value }));
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