import { z } from "zod";

// ======================= LOGIN ESQUEMA ==================

export const signInSchema = z.object({
  username: z
    .string({ required_error: "Ingrese un usuario" })
    .min(1, "El usuario es necesario"),
  password: z
    .string({ required_error: "La contraseña es necesaria" })
    .min(1, "La contraseña es necesaria"),
});

// ======================= USUARIOS ESQUEMAS ==================

export const userSchema = z.object({
  name: z.string({ required_error: "El nombre es obligatorio" }),
  email: z
    .string()
    .email({ message: "Debe ser un correo electrónico válido" })
    .optional(),
  image: z
    .string()
    .url({ message: "Debe ser una URL válida" })
    .optional()
    .nullable(),
  user: z.string({ required_error: "El usuario es obligatorio" }),
  password: z
    .string({ required_error: "La contraseña es obligatoria" })
    .min(1, "La contraseña es obligatoria")
    .min(8, "La contraseñ debe tener al menos 8 caracteres"),
  roleId: z.string({ required_error: "El campo rol es obligatorio" }).min(1, {
    message: 'El campo "ID de rol" es obligatorio.',
  }),

  // Relaciones opcionales
  accounts: z.array(z.object({})).optional(), // Relación con Account (definir esquema si es necesario)
  sessions: z.array(z.object({})).optional(), // Relación con Session
  role: z.object({}).optional().nullable(), // Relación opcional con Role

  personaNaturals: z.array(z.object({})).optional(), // Relación con PersonaNatural
  personaJuridicas: z.array(z.object({})).optional(), // Relación con PersonaJuridica
  productos: z.array(z.object({})).optional(), // Relación con Producto
});

// Esquema para actualizar el usuario
export const updateUserSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    user: z.string({ required_error: "El nombre de usuario es obligatorio" }),
    email: z
      .string()
      .email({ message: "Debe ser un correo electrónico válido" })
      .optional(),
    password: z
      .string({ required_error: "Campo obligatorio" })
      .min(1, "Campo obligatorio"),
    newPassword: z
      .string({ required_error: "Campo obligatorio" })
      .min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
    confirmNewPassword: z.string({ required_error: "Campo obligatorio" }),
  })
  .refine(
    (data) => !data.newPassword || data.newPassword === data.confirmNewPassword,
    {
      message: "La nueva contraseña y la confirmación no coinciden",
      path: ["confirmNewPassword"],
    }
  );

// Esquema para una nueva obra
export const newObraSchema = z.object({
  cui: z
    .string({ required_error: "Campo obligatorio" })
    .length(7, "El CUI debe tener exactamente 7 caracteres")
    .regex(/^\d+$/, "El CUI solo puede contener números"),
  presupuesto: z
    .string({ required_error: "Campo obligatorio" })
    .min(1, "El presupuesto debe tener al menos 1 carácter")
    .regex(/^\d+$/, "El presupuesto solo puede contener números"),
  nombreObra: z
    .string({ required_error: "Campo obligatorio" })
    .min(1, "Campo obligatorio"),
  obraType: z.string({ required_error: "Campo obligatorio" }),
  fecha: z.date({ required_error: "Debe seleccionar una fecha válida" }),
});



// Esquema para actualizar al residente
export const updateUserResidentSchema = z.object({
  id: z.string().optional(),
  userNombre: z
    .string({ required_error: "El nombre del residente es obligatorio" })
    .min(1, "Campo obligatorio"),
  userApellido: z
    .string({ required_error: "El apellido del residente es obligatorio" })
    .min(1, "Campo obligatorio"),
  id_propietario: z
    .string({ required_error: "Campo obligatorio" })
    .min(8, "El ID debe tener al menos 8 caracteres")
    .regex(/^\d+$/, "El ID solo puede contener números"),
});
