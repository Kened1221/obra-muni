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
import { useState } from "react";
import { Combobox } from "../select/combobox";
import { createUsuario } from "@/actions/formulario-actions";

interface ResidentUpdateProps {
  id: string;
  name: string;
  setModalU: (value: boolean) => void;
}

export default function RegisterUsuario({
  id,
  name,
  setModalU,
}: ResidentUpdateProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typeUser, setTypeUser] = useState("");

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

  const closeModal = () => {
    setModalU(false);
  };

  async function onSubmit(values: z.infer<typeof updateUserResidentSchema>) {
    setIsSubmitting(true);
    toasterCustom(0);

    const { userApellido, userNombre, id_propietario } = values;
    const user = `${userApellido} ${userNombre}`;

    if (!typeUser) {
      toasterCustom(400, "Seleccione un tipo de usuario.");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await createUsuario(id, user, id_propietario, typeUser);

      if (result.status === 200) {
        toasterCustom(result.status, "Usuario registrado correctamente");
        setTimeout(() => {
          closeModal();
          window.location.reload();
        }, 500);
      } else {
        toasterCustom(
          result.status,
          result.message || "Error en la actualización"
        );
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      toasterCustom(500, "Error al registrar el usuario");
    } finally {
      setIsSubmitting(false);
    }
  }

  const optionIcon = [
    { value: "residente", label: "Residente" },
    { value: "supervisor", label: "Supervisor" },
    { value: "cargos municipales", label: "Cargos municipales" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg w-full sm:w-3/4 lg:w-1/2 max-w-sm sm:max-w-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Registrar Usuario
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <div className="space-y-2">
              <FormLabel>Obra</FormLabel>
              <Input
                value={name}
                disabled
                className="bg-gray-800 cursor-not-allowed"
              />
            </div>

            <Combobox
              placeholder="Seleccionar tipo de usuario"
              options={optionIcon}
              onChange={(value) => setTypeUser(value || "")}
              value={typeUser}
            />

            <FormField
              control={form.control}
              name="id_propietario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID del Residente</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingrese el ID del residente"
                      {...field}
                      aria-required="true"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="userApellido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Apellido del residente"
                        {...field}
                        onChange={(e) => handleUpperCase(e, "userApellido")}
                        aria-required="true"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userNombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nombre del residente"
                        {...field}
                        onChange={(e) => handleUpperCase(e, "userNombre")}
                        aria-required="true"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button onClick={closeModal} type="button" variant="outline">
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-500 hover:bg-green-600"
              >
                {isSubmitting ? "Registrando..." : "Registrar"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
