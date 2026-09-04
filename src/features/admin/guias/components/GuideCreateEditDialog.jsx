import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Switch } from "@/shared/components/ui/switch";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/shared/components/ui/form";
import { FormStepIndicator } from "@/shared/components/ui/form-step-indicator";
import { guideSchema } from "../validations/guideValidation";
import { IDIOMA_OPTIONS, CERTIFICACION_OPTIONS } from "../guideServices";
import {
    TIPO_DOCUMENTO_OPTIONS,
    GENERO_OPTIONS,
    NIVEL_IDIOMA_OPTIONS,
    ESTADO_USUARIO_OPTIONS,
} from "@/shared/constants/dbEnums";
import { X, Plus } from "lucide-react";

const GUIDE_STEPS = [
    "Datos de Usuario",
    "Identificación",
    "Profesionales",
    "Idiomas",
    "Certificaciones",
];

export function GuideCreateEditDialog({
    open,
    onOpenChange,
    formData,
    setFormData,
    onSubmit,
    isEdit = false,
}) {
    const form = useForm({
        resolver: zodResolver(guideSchema),
        defaultValues: formData,
        mode: "onSubmit",
    });

    const {
        fields: idiomaFields,
        append: appendIdioma,
        remove: removeIdioma,
    } = useFieldArray({
        control: form.control,
        name: "idiomas",
    });

    const {
        fields: certFields,
        append: appendCert,
        remove: removeCert,
    } = useFieldArray({
        control: form.control,
        name: "certificaciones_puente",
    });

    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (open) {
            form.reset(formData);
            setCurrentStep(0);
        }
    }, [open, formData, form]);

    const nextStep = () => setCurrentStep((s) => Math.min(s + 1, GUIDE_STEPS.length - 1));
    const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));
    const isLastStep = currentStep === GUIDE_STEPS.length - 1;
    const isFirstStep = currentStep === 0;

    const handleSubmit = form.handleSubmit((datos) => {
        const idiomasLimpios = (datos.idiomas ?? []).filter(
            (i) => i && Number(i.id_idioma) > 0 && i.nivel
        );
        const certificacionesLimpias = (datos.certificaciones_puente ?? []).filter(
            (c) => c && Number(c.id_certificacion) > 0
        );
        const payload = {
            ...datos,
            idiomas: idiomasLimpios,
            certificaciones_puente: certificacionesLimpias,
        };
        onSubmit(payload);
    });

    const onSyncChange = (name, value) => {
        setFormData?.((prev) => ({ ...prev, [name]: value }));
    };

    const renderStepUser = () => (
        <div className="space-y-1 pt-2">
            <h3 className="font-semibold text-base mb-3">
                Paso 1 · {GUIDE_STEPS[0]}
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre *</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Juan"
                                    onChange={(e) => {
                                        field.onChange(e);
                                        onSyncChange("firstName", e.target.value);
                                    }}
                                />
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
                            <FormLabel>Apellido *</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Pérez"
                                    onChange={(e) => {
                                        field.onChange(e);
                                        onSyncChange("lastName", e.target.value);
                                    }}
                                />
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
                            <FormLabel>Correo Electrónico *</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    {...field}
                                    placeholder="juan@artetours.com"
                                    onChange={(e) => {
                                        field.onChange(e);
                                        onSyncChange("correo", e.target.value);
                                    }}
                                />
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
                            <FormLabel>Teléfono</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="+57 300 123 4567"
                                    onChange={(e) => {
                                        field.onChange(e);
                                        onSyncChange("telefono", e.target.value);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="estado"
                    render={({ field }) => (
                        <FormItem className="col-span-2">
                            <FormLabel>Estado de Usuario *</FormLabel>
                            <Select
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    onSyncChange("estado", value);
                                }}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue />
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
            </div>
        </div>
    );

    const renderStepIdentificacion = () => (
        <div className="space-y-1 pt-2">
            <h3 className="font-semibold text-base mb-3">
                Paso 2 · {GUIDE_STEPS[1]}
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="tipo_documento"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipo de Documento *</FormLabel>
                            <Select
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    onSyncChange("tipo_documento", value);
                                }}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue />
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
                            <FormLabel>Número de Documento *</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="123456789"
                                    onChange={(e) => {
                                        field.onChange(e);
                                        onSyncChange("numero_documento", e.target.value);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="fecha_nacimiento"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Fecha de Nacimiento</FormLabel>
                            <FormControl>
                                <Input
                                    type="date"
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        onSyncChange("fecha_nacimiento", e.target.value);
                                    }}
                                />
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
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    onSyncChange("genero", value);
                                }}
                                value={field.value || undefined}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar..." />
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
                            <FormLabel>Nacionalidad</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Colombiano/a"
                                    maxLength={100}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        onSyncChange("nacionalidad", e.target.value);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="pais_residencia"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>País de Residencia</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Colombia"
                                    maxLength={100}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        onSyncChange("pais_residencia", e.target.value);
                                    }}
                                />
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
                            <FormLabel>Ciudad de Residencia</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Medellín"
                                    maxLength={100}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        onSyncChange("ciudad_residencia", e.target.value);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="direccion"
                    render={({ field }) => (
                        <FormItem className="col-span-2">
                            <FormLabel>Dirección</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Carrera 70 #1-100, El Poblado"
                                    maxLength={255}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        onSyncChange("direccion", e.target.value);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );

    const renderStepProfesional = () => (
        <div className="space-y-1 pt-2">
            <h3 className="font-semibold text-base mb-3">
                Paso 3 · {GUIDE_STEPS[2]}
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="especialidad"
                    render={({ field }) => (
                        <FormItem className="col-span-2">
                            <FormLabel>Especialidad Principal</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Ej: Historia urbana y cultural de Medellín"
                                    maxLength={150}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        onSyncChange("especialidad", e.target.value);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="experiencia_anios"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Años de Experiencia</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={0}
                                    {...field}
                                    value={field.value ?? ""}
                                    placeholder="0"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        field.onChange(val);
                                        onSyncChange("experiencia_anios", val);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="foto_url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL Foto (perfil)</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="https://..."
                                    maxLength={500}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        onSyncChange("foto_url", e.target.value);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="certificaciones"
                    render={({ field }) => (
                        <FormItem className="col-span-2">
                            <FormLabel>Certificaciones (texto libre)</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Ej: Guía Oficial, First Aid"
                                    onChange={(e) => {
                                        field.onChange(e);
                                        onSyncChange("certificaciones", e.target.value);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="biografia"
                    render={({ field }) => (
                        <FormItem className="col-span-2">
                            <FormLabel>Biografía</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder="Breve descripción profesional, experiencia y áreas de interés..."
                                    rows={4}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        onSyncChange("biografia", e.target.value);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="disponibilidad"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Disponibilidad</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    Indica si el guía está disponible para tours.
                                </p>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={!!field.value}
                                    onCheckedChange={(val) => {
                                        field.onChange(val);
                                        onSyncChange("disponibilidad", val);
                                    }}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="activo"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Activo</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    Guía habilitado en el sistema.
                                </p>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={!!field.value}
                                    onCheckedChange={(val) => {
                                        field.onChange(val);
                                        onSyncChange("activo", val);
                                    }}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );

    const renderStepIdiomas = () => (
        <div className="space-y-1 pt-2">
            <h3 className="font-semibold text-base mb-3">
                Paso 4 · {GUIDE_STEPS[3]}
            </h3>
            <div className="space-y-3">
                {idiomaFields.map((fieldItem, index) => (
                    <div
                        key={fieldItem.id}
                        className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end p-3 border rounded-lg bg-muted/20"
                    >
                        <FormField
                            control={form.control}
                            name={`idiomas.${index}.id_idioma`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Idioma *</FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(Number(value));
                                        }}
                                        value={
                                            field.value
                                                ? String(field.value)
                                                : undefined
                                        }
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar idioma" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {IDIOMA_OPTIONS.map((opt) => (
                                                <SelectItem
                                                    key={opt.value}
                                                    value={String(opt.value)}
                                                >
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
                            name={`idiomas.${index}.nivel`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nivel *</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value || undefined}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar nivel" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {NIVEL_IDIOMA_OPTIONS.map((opt) => (
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
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeIdioma(index)}
                            className="h-10 w-10 text-destructive hover:text-destructive"
                            aria-label="Quitar idioma"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                        appendIdioma({ id_idioma: "", nivel: "" })
                    }
                    className="w-full"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Idioma
                </Button>
            </div>
        </div>
    );

    const renderStepCertificaciones = () => (
        <div className="space-y-1 pt-2">
            <h3 className="font-semibold text-base mb-3">
                Paso 5 · {GUIDE_STEPS[4]}
            </h3>
            <div className="space-y-3">
                {certFields.map((fieldItem, index) => (
                    <div
                        key={fieldItem.id}
                        className="space-y-3 p-3 border rounded-lg bg-muted/20"
                    >
                        <div className="grid grid-cols-2 gap-3">
                            <FormField
                                control={form.control}
                                name={`certificaciones_puente.${index}.id_certificacion`}
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Certificación *</FormLabel>
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(Number(value));
                                            }}
                                            value={
                                                field.value
                                                    ? String(field.value)
                                                    : undefined
                                            }
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar certificación" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {CERTIFICACION_OPTIONS.map((opt) => (
                                                    <SelectItem
                                                        key={opt.value}
                                                        value={String(opt.value)}
                                                    >
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
                                name={`certificaciones_puente.${index}.fecha_obtencion`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha Obtención</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`certificaciones_puente.${index}.fecha_vencimiento`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha Vencimiento</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`certificaciones_puente.${index}.numero_certificado`}
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Número de Certificado</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="GT-001-2025"
                                                maxLength={50}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeCert(index)}
                                className="text-destructive hover:text-destructive"
                            >
                                <X className="h-4 w-4 mr-1" />
                                Quitar certificación
                            </Button>
                        </div>
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                        appendCert({
                            id_certificacion: "",
                            fecha_obtencion: "",
                            fecha_vencimiento: "",
                            numero_certificado: "",
                        })
                    }
                    className="w-full"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Certificación
                </Button>
            </div>
        </div>
    );

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 0: return renderStepUser();
            case 1: return renderStepIdentificacion();
            case 2: return renderStepProfesional();
            case 3: return renderStepIdiomas();
            case 4: return renderStepCertificaciones();
            default: return null;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[820px] max-h-[92vh] flex flex-col p-0 gap-0">
                <div className="px-6 py-4 border-b">
                    <DialogHeader className="text-left mb-4">
                        <DialogTitle>{isEdit ? "Editar Guía" : "Crear Nuevo Guía"}</DialogTitle>
                        <DialogDescription>
                            {isEdit
                                ? "Actualiza la información del guía paso a paso"
                                : "Ingresa los datos del nuevo guía en 5 pasos"}
                        </DialogDescription>
                    </DialogHeader>
                    <FormStepIndicator steps={GUIDE_STEPS} currentStep={currentStep} />
                </div>

                <Form {...form}>
                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                        <div className="flex-1 overflow-y-auto px-6 py-5">
                            {renderCurrentStep()}
                        </div>

                        <DialogFooter className="px-6 py-4 border-t bg-background justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancelar
                            </Button>
                            <div className="flex items-center gap-2">
                                {!isFirstStep && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={prevStep}
                                    >
                                        Anterior
                                    </Button>
                                )}
                                {!isLastStep ? (
                                    <Button type="button" onClick={nextStep}>
                                        Siguiente
                                    </Button>
                                ) : (
                                    <Button type="submit">
                                        {isEdit ? "Guardar Cambios" : "Crear Guía"}
                                    </Button>
                                )}
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
