import { AuthCard } from "../components/AuthCard";
import { PasswordInput } from "../components/PasswordInput";
import { SubmitButton } from "../components/SubmitButton";
import { Check, X, Building2 } from "lucide-react";
import { useLoading } from "../hooks/useAuthForm";
import { authServices } from "../authServices";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validations/authValidation";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  TIPO_DOCUMENTO_OPTIONS,
  GENERO_OPTIONS,
  NATIONALITY_OPTIONS,
} from "@/shared/constants/dbEnums";

function PasswordHint({ ok, children }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {ok ? (
        <Check className="h-3 w-3 text-success" />
      ) : (
        <X className="h-3 w-3 text-destructive" />
      )}
      <span className={ok ? "text-success" : "text-destructive"}>
        {children}
      </span>
    </div>
  );
}

export function RegisterPage() {
  const form = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      tipoDocumento: "",
      numeroDocumento: "",
      nacionalidad: "",
      fechaNacimiento: "",
      genero: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { loading, runWithLoading } = useLoading();

  const passwordValue = form.watch("password");
  const confirmPasswordValue = form.watch("confirmPassword");
  const passwordStrong = authServices.validatePasswordStrength(passwordValue);
  const passwordsMatch = authServices.validatePasswordsMatch(
    passwordValue,
    confirmPasswordValue
  );

  const handleRegister = (data) => {
    const payload = {
      usuario: {
        nombre: data.firstName,
        apellido: data.lastName,
        correo: data.email.toLowerCase(),
        telefono: data.phone,
        password: data.password,
        rol: "TURISTA",
      },
      turista: {
        tipo_documento: data.tipoDocumento,
        numero_documento: data.numeroDocumento,
        nacionalidad: data.nacionalidad,
        fecha_nacimiento: data.fechaNacimiento,
        genero: data.genero,
      },
    };
    void runWithLoading(() => authServices.register(payload));
  };

  const content = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
        <CardContent className="space-y-4 px-8 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido</FormLabel>
                  <FormControl>
                    <Input placeholder="Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="usuario@ejemplo.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+57 300 123 4567"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="tipoDocumento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo Documento</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione tipo de documento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TIPO_DOCUMENTO_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numeroDocumento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número Documento</FormLabel>
                  <FormControl>
                    <Input placeholder="123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fechaNacimiento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha Nacimiento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="genero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Género</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione género" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GENERO_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="nacionalidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nacionalidad (opcional)</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value === "__empty__" ? "" : value)}
                  defaultValue={field.value || "__empty__"}
                  value={field.value || "__empty__"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una nacionalidad" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="__empty__">Sin seleccionar</SelectItem>
                    {NATIONALITY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
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
                  <PasswordInput {...field} />
                </FormControl>
                {passwordValue ? (
                  <PasswordHint ok={passwordStrong}>
                    Mínimo 8 caracteres, mayúscula, minúscula y número
                  </PasswordHint>
                ) : undefined}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Contraseña</FormLabel>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                {confirmPasswordValue ? (
                  <PasswordHint ok={passwordsMatch}>
                    Las contraseñas {passwordsMatch ? "coinciden" : "no coinciden"}
                  </PasswordHint>
                ) : undefined}
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 px-8 pb-8">
          <SubmitButton
            loading={loading}
            disabled={!form.formState.isValid}
            loadingText="Creando cuenta..."
          >
            Crear Cuenta
          </SubmitButton>
          <div className="text-sm text-center text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <a
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Inicia sesión aquí
            </a>
          </div>
        </CardFooter>
      </form>
    </Form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-3xl">Crear Cuenta</CardTitle>
            <CardDescription className="text-base mt-2">
              Regístrate en Arte Tours
            </CardDescription>
          </div>
        </CardHeader>
        {content}
      </Card>
    </div>
  );
}
