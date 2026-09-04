import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Calendar, Users, DollarSign, MapPin, Eye } from "lucide-react";
import { StatusBadge } from "@/features/admin/components/StatusBadge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { ImageWithFallback } from "@/shared/components/figma/ImageWithFallback";
import { getTourImageUrl, mockCategoriasTour } from "../tourServices";
import { ESTADO_TOUR_OPTIONS } from "@/shared/constants/dbEnums";

const tourStatusMap = ESTADO_TOUR_OPTIONS.reduce((acc, opt) => {
    acc[opt.value] = {
        label: opt.label,
        variant:
            opt.value === "ACTIVO"
                ? "success"
                : opt.value === "INACTIVO"
                ? "destructive"
                : "secondary",
    };
    return acc;
}, {});

function getCategoriaNombre(id_categoria) {
    if (!id_categoria) return "Sin categoría";
    const cat = mockCategoriasTour.find(
        (c) =>
            c.id_categoria === Number(id_categoria) ||
            c.id === Number(id_categoria)
    );
    return cat ? cat.nombre : "Sin categoría";
}

export function ToursGrid({ tours, onDetail }) {
    if (tours.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No se encontraron tours
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tours.map((tour) => {
                const id = tour.id_tour ?? tour.id;
                const nombre = tour.nombre ?? tour.name;
                const id_categoria = tour.id_categoria;
                const duracion = tour.duracion_horas ?? tour.duration;
                const capacidad = tour.capacidad_maxima ?? tour.capacity;
                const precio = tour.precio_base ?? tour.price;
                const descripcion = tour.descripcion ?? tour.description;
                const estado = tour.estado ?? tour.status;
                const dificultad = tour.dificultad;
                return (
                    <Card key={id} className="overflow-hidden">
                        <div className="h-40 w-full overflow-hidden bg-muted">
                            <ImageWithFallback
                                src={getTourImageUrl(tour)}
                                alt={nombre}
                                loading="lazy"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <Badge variant="secondary">
                                    {getCategoriaNombre(id_categoria)}
                                </Badge>
                                <StatusBadge
                                    status={estado}
                                    map={tourStatusMap}
                                />
                            </div>
                            <CardTitle className="mt-2">{nombre}</CardTitle>
                            <CardDescription className="line-clamp-2">
                                {descripcion ?? "Tour sin descripción."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        {duracion ? `${duracion} h` : "—"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span>{capacidad} pers.</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        $
                                        {Number(precio || 0).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="truncate">
                                        {dificultad ?? "—"}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t pt-4">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => onDetail(tour)}
                                style={{ color: "#ff9500" }}
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                Ver detalle
                            </Button>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}

export function TourDetailDialog({ open, onOpenChange, tour }) {
    if (!tour) return null;
    const nombre = tour.nombre ?? tour.name;
    const id_categoria = tour.id_categoria;
    const duracion = tour.duracion_horas ?? tour.duration;
    const capacidad = tour.capacidad_maxima ?? tour.capacity;
    const precio = tour.precio_base ?? tour.price;
    const descripcion = tour.descripcion ?? tour.description;
    const estado = tour.estado ?? tour.status;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[640px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Detalle del Tour</DialogTitle>
                    <DialogDescription>
                        Información completa del tour
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="col-span-2">
                        <Label className="text-xs text-muted-foreground">
                            Nombre
                        </Label>
                        <Input disabled value={nombre} />
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground">
                            Categoría
                        </Label>
                        <Input
                            disabled
                            value={getCategoriaNombre(id_categoria)}
                        />
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground">
                            Duración
                        </Label>
                        <Input
                            disabled
                            value={duracion ? `${duracion} horas` : "—"}
                        />
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground">
                            Capacidad
                        </Label>
                        <Input
                            disabled
                            value={`${capacidad} personas`}
                        />
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground">
                            Precio
                        </Label>
                        <Input
                            disabled
                            value={`$${Number(precio || 0).toLocaleString()}`}
                        />
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground">
                            Dificultad
                        </Label>
                        <Input disabled value={tour.dificultad ?? "—"} />
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground">
                            Estado
                        </Label>
                        <div className="pt-2">
                            <StatusBadge
                                status={estado}
                                map={tourStatusMap}
                            />
                        </div>
                    </div>
                    <div className="col-span-2">
                        <Label className="text-xs text-muted-foreground">
                            Punto de Encuentro
                        </Label>
                        <Input
                            disabled
                            value={tour.punto_encuentro ?? "—"}
                        />
                    </div>
                    <div className="col-span-2">
                        <Label className="text-xs text-muted-foreground">
                            Destino
                        </Label>
                        <Input disabled value={tour.destino ?? "—"} />
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground">
                            Edad Mínima
                        </Label>
                        <Input
                            disabled
                            value={tour.edad_minima ?? "—"}
                        />
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground">
                            Edad Máxima
                        </Label>
                        <Input
                            disabled
                            value={tour.edad_maxima ?? "—"}
                        />
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground">
                            Latitud
                        </Label>
                        <Input disabled value={tour.latitud ?? "—"} />
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground">
                            Longitud
                        </Label>
                        <Input disabled value={tour.longitud ?? "—"} />
                    </div>
                    <div className="col-span-2">
                        <Label className="text-xs text-muted-foreground">
                            Descripción
                        </Label>
                        <Textarea
                            disabled
                            className="mt-1"
                            rows={3}
                            value={descripcion ?? ""}
                        />
                    </div>
                    <div className="col-span-2">
                        <Label className="text-xs text-muted-foreground">
                            Incluye
                        </Label>
                        <Textarea
                            disabled
                            className="mt-1"
                            rows={2}
                            value={tour.incluye ?? ""}
                        />
                    </div>
                    <div className="col-span-2">
                        <Label className="text-xs text-muted-foreground">
                            No Incluye
                        </Label>
                        <Textarea
                            disabled
                            className="mt-1"
                            rows={2}
                            value={tour.no_incluye ?? ""}
                        />
                    </div>
                    <div className="col-span-2">
                        <Label className="text-xs text-muted-foreground">
                            Recomendaciones
                        </Label>
                        <Textarea
                            disabled
                            className="mt-1"
                            rows={2}
                            value={tour.recomendaciones ?? ""}
                        />
                    </div>
                    <div className="col-span-2">
                        <Label className="text-xs text-muted-foreground">
                            Política de Cancelación
                        </Label>
                        <Textarea
                            disabled
                            className="mt-1"
                            rows={2}
                            value={tour.politica_cancelacion ?? ""}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
