"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/buttons/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toasterCustom from "@/components/toaster-custom";
import { updateUserResidentSchema } from "@/utils/zod/schemas";
import { Label } from "../ui/label";
import { useState } from "react";
import { ActualizarResidenteO } from "@/actions/details-action";

interface Obra {
  id: string;
  state: string;
  propietario_id: string;
  resident: string;
  projectType: string;
  cui: string;
  name: string;
  areaOrLength: string;
}

interface ResidentUpdateProps {
  obra: Obra;
  setModalU: (value: boolean) => void;
}

export default function UpdateResidentContainer({
  obra,
  setModalU,
}: ResidentUpdateProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof updateUserResidentSchema>>({
    resolver: zodResolver(updateUserResidentSchema),
    defaultValues: {
      userApellido: "",
      userNombre: "",
      id_propietario: "",
    },
  });

  const handleUpperCase = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "userApellido" | "userNombre" | "id_propietario"
  ) => {
    const value = e.target.value.toUpperCase();
    form.setValue(fieldName, value);
  };

  const CloseModal = () => {
    setModalU(false);
  };

  async function onSubmit(values: z.infer<typeof updateUserResidentSchema>) {
    setIsSubmitting(true);
    toasterCustom(0);

    const { userApellido, userNombre, id_propietario } = values;

    // Concatenar los apellidos y nombres
    const user = `${userApellido} ${userNombre}`;

    try {
      const result = await ActualizarResidenteO(
        obra.id,
        obra.cui,
        id_propietario,
        user // pasar la concatenación aquí
      );

      if (result.status === 200) {
        toasterCustom(result.status, result.message);
        setTimeout(() => {
          window.location.reload();
        }, 0);
      } else {
        toasterCustom(result.status, result.message);
      }
    } catch {
      toasterCustom(500, "Error al actualizar el residente");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-background rounded-lg w-full sm:w-3/4 lg:w-1/2 max-w-sm sm:max-w-lg px-4 z-20">
      <div className="w-full text-center p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Residente Actual
        </h2>
        <div className="grid gap-4 text-start">
          <div className="space-y-2">
            <Label>ID del Residente Actual</Label>
            <Input
              value={obra.propietario_id}
              disabled
              readOnly
              className="cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <Label>Nombre del Residente Actual</Label>
            <Input
              value={obra.resident}
              disabled
              readOnly
              className="cursor-not-allowed"
            />
          </div>
        </div>
      </div>
      <div className="border-t-2 pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full px-6">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Nuevo Residente
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="id_propietario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID del Propietario:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ID del propietario"
                        {...field}
                        aria-required="true"
                      />
                    </FormControl>
                    <FormMessage className="text-end" />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="userApellido"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellidos del Residente:</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Apellido del residente"
                          {...field}
                          onChange={(e) => handleUpperCase(e, "userApellido")}
                          aria-required="true"
                        />
                      </FormControl>
                      <FormMessage className="text-end" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="userNombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Residente:</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nombre del residente"
                          {...field}
                          onChange={(e) => handleUpperCase(e, "userNombre")}
                          aria-required="true"
                        />
                      </FormControl>
                      <FormMessage className="text-end" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-center gap-10 m-4">
              <Button onClick={CloseModal}>Cancelar</Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-500 hover:bg-green-600"
              >
                {isSubmitting ? "Actualizando..." : "Actualizar"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
