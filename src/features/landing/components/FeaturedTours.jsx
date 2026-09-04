import { MapPin, Star, Clock, Users, Heart, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "@/shared/components/figma/ImageWithFallback";
import { mockReservas } from "@/features/admin/reservas/bookingServices";
import { getTourImageUrl, getTourReviewStats, mockSalidasTour, mockTours } from "@/features/admin/tours/tourServices";

function formatDuration(hours) {
    if (hours == null || hours === "")
        return "Duración por confirmar";
    return `${hours} hora${Number(hours) === 1 ? "" : "s"}`;
}

function formatCapacity(capacity) {
    if (capacity == null || capacity === "")
        return "Capacidad por confirmar";
    return `${capacity} personas`;
}

function buildFeaturedTours() {
    const salidaTourMap = new Map((mockSalidasTour ?? []).map((salida) => [Number(salida.id_salida), Number(salida.id_tour)]));
    const bookingsByTour = (mockReservas ?? []).reduce((acc, reserva) => {
        const tourId = salidaTourMap.get(Number(reserva.id_salida));
        if (!tourId)
            return acc;
        acc[tourId] = (acc[tourId] ?? 0) + 1;
        return acc;
    }, {});
    const topBookings = Math.max(0, ...Object.values(bookingsByTour));
    return (mockTours ?? [])
        .filter((tour) => (tour.estado ?? tour.status) === "ACTIVO")
        .map((tour) => {
        const stats = getTourReviewStats(tour.id_tour ?? tour.id);
        const imageUrl = getTourImageUrl(tour);
        return {
            id: tour.id_tour ?? tour.id,
            name: tour.nombre ?? tour.name,
            img: imageUrl,
            duration: formatDuration(tour.duracion_horas ?? tour.duration),
            capacity: formatCapacity(tour.capacidad_maxima ?? tour.capacity),
            price: `$${Number(tour.precio_base ?? tour.price ?? 0).toLocaleString("es-CO")}`,
            rating: stats.rating,
            reviews: stats.reviews,
            badge: (bookingsByTour[tour.id_tour ?? tour.id] ?? 0) === topBookings && topBookings > 0 ? "Más vendido" : null,
            location: tour.destino ?? "Medellín",
            bookings: bookingsByTour[tour.id_tour ?? tour.id] ?? 0,
        };
    })
        .filter((tour) => Boolean(tour.img))
        .sort((a, b) => b.bookings - a.bookings)
        .slice(0, 4);
}

export function FeaturedTours({ liked, onToggleLike }) {
    const tours = buildFeaturedTours();
    return (<section id="tours" className="py-20" style={{ background: "#f0faf0" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#2E7D32" }}>Destacados</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">Tours más populares</h2>
          <p className="text-gray-500 mt-3 text-lg">Los favoritos de nuestros viajeros este mes</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tours.map((tour) => (<div key={tour.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="relative overflow-hidden" style={{ height: "200px" }}>
                <ImageWithFallback
                  src={tour.img}
                  alt={tour.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {tour.badge && (<span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: "#2E7D32" }}>
                    {tour.badge}
                  </span>)}
                <button onClick={() => onToggleLike(tour.id)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center transition-transform hover:scale-110">
                  <Heart className="w-4 h-4 transition-colors" style={{ color: liked[tour.id] ? "#FF7A00" : "#9ca3af", fill: liked[tour.id] ? "#FF7A00" : "none" }}/>
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1 mb-1">
                  <MapPin className="w-3 h-3 text-gray-400"/>
                  <span className="text-xs text-gray-400 truncate">{tour.location}</span>
                  <span className="ml-auto flex items-center gap-1">
                    <Star
                      className="w-3.5 h-3.5"
                      style={{ color: "#FF7A00", fill: tour.rating ? "#FF7A00" : "none" }}
                    />
                    <span className="text-xs font-bold text-gray-700">
                      {tour.rating ? tour.rating : "Sin reseñas"}
                    </span>
                    {tour.reviews > 0 && <span className="text-xs text-gray-400">({tour.reviews})</span>}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-3">{tour.name}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{tour.duration}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3"/>{tour.capacity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400">Desde</span>
                    <p className="font-bold text-lg text-gray-900">{tour.price}</p>
                  </div>
                  <a
                    href={`/login?redirect=${encodeURIComponent(`/dashboard/bookings?create=1&tourId=${tour.id}`)}`}
                    className="inline-flex items-center justify-center px-4 py-2 text-white text-sm font-semibold rounded-xl transition-opacity duration-200 hover:opacity-90"
                    style={{ background: "#FF7A00" }}
                  >
                    Reservar
                  </a>
                </div>
              </div>
            </div>))}
        </div>
        <div className="text-center mt-10">
          <a href="#" className="inline-flex items-center gap-2 px-8 py-3 border-2 font-semibold rounded-full transition-all duration-200 hover:text-white hover:bg-[#2E7D32]" style={{ borderColor: "#2E7D32", color: "#2E7D32" }}>
            Ver todos los tours <ArrowRight className="w-4 h-4"/>
          </a>
        </div>
      </div>
    </section>);
}
