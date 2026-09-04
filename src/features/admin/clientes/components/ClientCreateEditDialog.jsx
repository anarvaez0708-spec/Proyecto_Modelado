import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Crown } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { TIPO_DOCUMENTO_OPTIONS, GENERO_OPTIONS, ESTADO_USUARIO_OPTIONS, NATIONALITY_OPTIONS } from "@/shared/constants/dbEnums";
import { clientSchema } from "../validations/clientValidation";

function SectionTitle({ title, subtitle, icon }) {
  return (
    <div className="space-y-1 pt-2">
      <div className="flex items-center gap-2">
        {icon && <span className="text-primary">{icon}</span>}
        <h4 className="font-semibold text-base text-foreground">{title}</h4>
      </div>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function ClientCreateEditDialog({ open, onOpenChange, formData, setFormData, onSubmit, isEdit = false }) {
  const form = useForm({
    defaultValues: formData,
    resolver: zodResolver(clientSchema),
  });

  useEffect(() => {
    if (open) {
      form.reset(formData);
    }
  }, [open, formData, form]);

  const handleSubmit = (datosLimpios) => {
    const payload = {
      usuario: {
        nombre: datosLimpios.firstName?.trim(),
        apellido: datosLimpios.lastName?.trim(),
        correo: datosLimpios.correo,
        telefono: datosLimpios.telefono,
        estado: datosLimpios.estado,
      },
      turista: {
        tipo_documento: datosLimpios.tipo_documento,
        numero_documento: datosLimpios.numero_documento,
        fecha_nacimiento: datosLimpios.fecha_nacimiento || null,
        genero: datosLimpios.genero || null,
        nacionalidad: datosLimpios.nacionalidad || null,
        pais_residencia: datosLimpios.pais_residencia || null,
        ciudad_residencia: datosLimpios.ciudad_residencia || null,
        direccion: datosLimpios.direccion || null,
        contacto_emergencia_nombre: datosLimpios.contacto_emergencia_nombre || null,
        contacto_emergencia_telefono: datosLimpios.contacto_emergencia_telefono || null,
        contacto_emergencia_parentesco: datosLimpios.contacto_emergencia_parentesco || null,
        preferencias: datosLimpios.preferencias || null,
        observaciones: datosLimpios.observaciones || null,
        vip: Boolean(datosLimpios.vip),
      },
    };
    setFormData?.(payload);
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[820px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Turista / Cliente" : "Crear Nuevo Turista / Cliente"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Actualiza la información del turista (usuario + perfil turista)" : "Ingresa los datos del nuevo turista y su cuenta de usuario"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <SectionTitle title="1. Datos de usuario" subtitle="Información de acceso y contacto general" />
            <div className="grid grid-cols-2 gap-4 pl-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre (s)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Juan José" />
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
                    <FormLabel>Apellidos</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Pérez Rodríguez" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="correo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} placeholder="juan@email.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono (opcional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+57 300 123 4567" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado de la cuenta</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ESTADO_USUARIO_OPTIONS.map((opt) => (
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
                name="vip"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="flex items-center gap-2">
                        <Crown className="h-4 w-4 text-warning" />
                        Cliente VIP
                      </FormLabel>
                      <FormDescription>
                        Marque si este cliente pertenece al programa VIP
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={Boolean(field.value)}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Separator />
            <SectionTitle title="2. Datos de turista (obligatorios)" subtitle="Documentación de identidad" />
            <div className="grid grid-cols-2 gap-4 pl-2">
              <FormField
                control={form.control}
                name="tipo_documento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de documento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione tipo de doc." />
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
                name="numero_documento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de documento</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="1020304050" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />
            <SectionTitle title="3. Datos personales" subtitle="Información demográfica y residencia" />
            <div className="grid grid-cols-2 gap-4 pl-2">
              <FormField
                control={form.control}
                name="fecha_nacimiento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de nacimiento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ""} />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione (opcional)" />
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
                name="pais_residencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País de residencia</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} placeholder="Colombia" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ciudad_residencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciudad de residencia</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} placeholder="Medellín" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="direccion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} placeholder="Calle 10 # 20-30, El Poblado" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />
            <SectionTitle title="4. Contacto de emergencia" subtitle="Persona a contactar en caso de novedad" />
            <div className="grid grid-cols-3 gap-4 pl-2">
              <FormField
                control={form.control}
                name="contacto_emergencia_nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} placeholder="María Pérez" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contacto_emergencia_telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} placeholder="+57 300 987 6543" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contacto_emergencia_parentesco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parentesco</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} placeholder="Hermana, esposo, etc." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />
            <SectionTitle title="5. Preferencias y observaciones" subtitle="Notas internas y preferencias del cliente" />
            <div className="grid grid-cols-1 gap-4 pl-2">
              <FormField
                control={form.control}
                name="preferencias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferencias del cliente</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Ej: Prefiere horarios matutinos, alergias, necesidades especiales, facturación, etc."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="observaciones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observaciones internas (equipo)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Notas para el equipo interno: histórico, casos especiales, etc."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />
            <SectionTitle title="Métricas (solo lectura)" subtitle="Datos calculados automáticamente" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pl-2">
              <div className="space-y-1">
                <FormLabel className="text-xs text-muted-foreground">Reservas realizadas</FormLabel>
                <Badge variant="outline" className="h-9 w-full justify-center inline-flex">
                  {Number(form.watch("cantidad_reservas") ?? 0)} reservas
                </Badge>
              </div>
              <div className="space-y-1">
                <FormLabel className="text-xs text-muted-foreground">Gasto total</FormLabel>
                <Badge variant="outline" className="h-9 w-full justify-center inline-flex font-semibold">
                  ${Number(form.watch("gasto_total") ?? 0).toLocaleString("es-CO")} COP
                </Badge>
              </div>
              <div className="space-y-1">
                <FormLabel className="text-xs text-muted-foreground">Fecha de registro</FormLabel>
                <Badge variant="outline" className="h-9 w-full justify-center inline-flex">
                  {form.watch("fecha_registro") || new Date().toISOString().split("T")[0]}
                </Badge>
              </div>
              <div className="space-y-1">
                <FormLabel className="text-xs text-muted-foreground">Última reserva</FormLabel>
                <Badge variant="outline" className="h-9 w-full justify-center inline-flex">
                  {form.watch("ultima_reserva") || "—"}
                </Badge>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">{isEdit ? "Guardar Cambios" : "Crear Cliente"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
