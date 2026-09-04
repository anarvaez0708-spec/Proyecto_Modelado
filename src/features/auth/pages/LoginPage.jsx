import { AuthCard } from "../components/AuthCard";
import { PasswordInput } from "../components/PasswordInput";
import { SubmitButton } from "../components/SubmitButton";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { useLoading } from "../hooks/useAuthForm";
import { authServices } from "../authServices";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validations/authValidation";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Building2 } from "lucide-react";

export function LoginPage() {
  const redirectTo =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("redirect") || "/dashboard"
      : "/dashboard";

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const { loading, runWithLoading } = useLoading();

  const handleLogin = (data) => {
    void runWithLoading(() =>
      authServices.login({
        correo: data.email.toLowerCase(),
        password: data.password,
        redirectTo,
      })
    );
  };

  const content = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
        <CardContent className="space-y-4 px-8 pb-4">
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm text-muted-foreground cursor-pointer font-normal">
                    Recordarme
                  </FormLabel>
                </FormItem>
              )}
            />
            <a
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 px-8 pb-8">
          <SubmitButton loading={loading} loadingText="Iniciando sesión...">
            Iniciar Sesión
          </SubmitButton>
          <div className="text-sm text-center text-muted-foreground">
            ¿No tienes una cuenta?{" "}
            <a
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              Regístrate aquí
            </a>
          </div>
        </CardFooter>
      </form>
    </Form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-3xl">Bienvenido</CardTitle>
            <CardDescription className="text-base mt-2">
              Inicia sesión en Arte Tours
            </CardDescription>
          </div>
        </CardHeader>
        {content}
      </Card>
    </div>
  );
}
