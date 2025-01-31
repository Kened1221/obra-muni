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
import { toast } from "sonner";
import toasterCustom from "@/components/toaster-custom";
import { newObraSchema } from "@/utils/zod/schemas";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { crearProyecto } from "@/actions/formulario-actions";
import { ConfirmDialog } from "@/components/dialog/dialog-confirm";
import { CalendarForm } from "@/components/ui/calendarForm";

type FormFieldName =
  | "cui"
  | "nombreObra"
  | "apellidoPaterno"
  | "apellidoMaterno"
  | "nombreResidente"
  | "propietarioId";

export function FormularioContainer() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [fecha, setFecha] = useState<Date | undefined>(undefined);

  const form = useForm<z.infer<typeof newObraSchema>>({
    resolver: zodResolver(newObraSchema),
    defaultValues: {
      cui: "",
      nombreObra: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      nombreResidente: "",
      propietarioId: "",
    },
  });

  const handleUpperCase = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: FormFieldName
  ) => {
    const value = e.target.value.toUpperCase();
    form.setValue(fieldName, value);
  };

  const handleOpenConfirmationModal = () => {
    setShowConfirmationModal(true);
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const handleConfirmSave = async () => {
    setIsSubmitting(true);
    await onSubmit(form.getValues());
    setShowConfirmationModal(false);
  };

  async function onSubmit(values: z.infer<typeof newObraSchema>) {
    if (!fecha) {
      toasterCustom(
        400,
        "Por favor complete todos los campos antes de guardar."
      );
      return;
    }

    toasterCustom(0);

    const resident = `${values.apellidoPaterno} ${values.apellidoMaterno} ${values.nombreResidente}`;

    const proyecto = {
      cui: values.cui,
      nombreObra: values.nombreObra,
      resident: resident,
      propietarioId: values.propietarioId,
      fecha: fecha.toISOString(),
    };

    const data = await crearProyecto(proyecto);

    if (!data) {
      toasterCustom(500, "Ocurrió un error inesperado");
      return;
    }

    if (data.status === 200) {
      toast.dismiss();
      toasterCustom(data.status, data.message);
      setIsSubmitting(false);
      window.location.reload();
    } else {
      toast.dismiss();
      toasterCustom(data.status, data.message);
    }
  }

  return (
    <div className="flex w-full max-w-2xl h-full mx-auto items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleOpenConfirmationModal)}
          className="space-y-6 max-w-3xl mx-auto p-6 w-full"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Datos de la obra
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <FormField
              control={form.control}
              name="cui"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CUI:</FormLabel>
                  <FormControl>
                    <Input placeholder="111111111" {...field} />
                  </FormControl>
                  <FormMessage className="text-end" />
                </FormItem>
              )}
            />
            <CalendarForm fecha={setFecha} type="posterior" />
          </div>

          <div className="w-full">
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
                      onChange={(e) => handleUpperCase(e, "nombreObra")}
                    />
                  </FormControl>
                  <FormMessage className="text-end" />
                </FormItem>
              )}
            />
          </div>

          <h2 className="text-2xl font-bold mb-6 text-center border-t-2 pt-4">
            Datos del residente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField
                control={form.control}
                name="apellidoPaterno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido Paterno:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Apellido Paterno"
                        {...field}
                        onChange={(e) => handleUpperCase(e, "apellidoPaterno")}
                      />
                    </FormControl>
                    <FormMessage className="text-end" />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="apellidoMaterno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido Materno:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Apellido Materno"
                        {...field}
                        onChange={(e) => handleUpperCase(e, "apellidoMaterno")}
                      />
                    </FormControl>
                    <FormMessage className="text-end" />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField
                control={form.control}
                name="nombreResidente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre/s:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nombre"
                        {...field}
                        onChange={(e) => handleUpperCase(e, "nombreResidente")}
                      />
                    </FormControl>
                    <FormMessage className="text-end" />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="propietarioId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Propietario ID:</FormLabel>
                    <FormControl>
                      <Input placeholder="ID del propietario" {...field} />
                    </FormControl>
                    <FormMessage className="text-end" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-center py-5">
            <Button
              className="w-full"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registrando..." : "Registrar"}
            </Button>
          </div>
        </form>
      </Form>

      <ConfirmDialog
        isOpen={showConfirmationModal}
        onClose={handleCloseConfirmationModal}
        onConfirm={handleConfirmSave}
        title="¿Estás seguro de guardar esta inforamción?"
        description="La información no podrá ser modificada"
        styleButton="bg-blue-900 hover:bg-blue-600"
      />
    </div>
  );
}

export default FormularioContainer;
