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
import { updateUser } from "@/actions/user-actions";
import { updateUserSchema } from "@/utils/zod/schemas";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { signOut } from "next-auth/react";
import { ConfirmDialog } from "@/components/dialog/dialog-confirm";

type Session = {
  user: {
    name: string;
    email: string;
    id: string;
    user: string;
    cui: string;
  };
  expires: string;
};

type CuentaContainerProps = {
  session: Session;
};

export function CuentaContainer({ session }: CuentaContainerProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const toggleShowConfirmNewPassword = () =>
    setShowConfirmNewPassword(!showConfirmNewPassword);

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      id: session.user.id,
      name: session.user.name,
      user: session.user.user,
      email: session.user.email,
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof updateUserSchema>) {
    const data = await updateUser(values, session.user.cui);

    if (!data) {
      toasterCustom(500, "Ocurrió un error inesperado");
      return;
    }

    if (data.status === 200) {
      toast.dismiss();
      toasterCustom(data.status, data.message);
      setIsSubmitting(false);
      router.refresh();
      setTimeout(() => {
        signOut({ callbackUrl: "/" });
      }, 0);
    } else {
      toast.dismiss();
      toasterCustom(data.status, data.message);
      if (data.field) {
        form.setError(data.field === 1 ? "password" : "confirmNewPassword", {
          type: "error",
          message: data.message,
        });
        form.setFocus(data.field === 1 ? "password" : "confirmNewPassword");
      }
      setIsSubmitting(false);
    }
  }

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

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleOpenConfirmationModal)}
          className="space-y-4 max-w-md mx-auto p-4 w-full"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Mi Cuenta</h2>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre:</FormLabel>
                <FormControl>
                  <Input placeholder="Administrador" {...field} disabled />
                </FormControl>
                <FormMessage className="text-end" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="user"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuario:</FormLabel>
                <FormControl>
                  <Input placeholder="Admin" {...field} disabled />
                </FormControl>
                <FormMessage className="text-end" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico:</FormLabel>
                <FormControl>
                  <Input placeholder="admin@admin.com" {...field} />
                </FormControl>
                <FormMessage className="text-end" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="****************"
                      {...field}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-end" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nueva Contraseña</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="****************"
                      {...field}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={toggleShowNewPassword}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showNewPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-end" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmNewPassword ? "text" : "password"}
                      placeholder="****************"
                      {...field}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={toggleShowConfirmNewPassword}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmNewPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-end" />
              </FormItem>
            )}
          />

          <div className="flex justify-center py-3">
            <Button
              className="w-full bg-blue-900 hover:bg-blue-600"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Actualizando..." : "Actualizar Datos"}
            </Button>
          </div>
        </form>
      </Form>

      <ConfirmDialog
        isOpen={showConfirmationModal}
        onClose={handleCloseConfirmationModal}
        onConfirm={handleConfirmSave}
        title="¿Estás seguro que deseas actualizar su contraseña?"
        description="Al actualizar su contraseña, se cerrará la sesión y deberá iniciar sesión nuevamente."
        styleButton="bg-blue-500 hover:bg-emerald-500"
      />
    </div>
  );
}

export default CuentaContainer;
