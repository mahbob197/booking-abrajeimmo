import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookingForm from "./BookingForm";
import Image from "next/image";

type Props = {
  params: { id: string };
};

export default async function ProductShowPage({ params }: Props) {
  const id = Number(params.id);

  if (isNaN(id)) notFound();

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true, // ✅ OK avec ton schema ProductImage[]
      },
    });

    if (!product) notFound();

    /* ------------------------- GOOGLE MAPS ------------------------- */
    const hasCoords = product.latitude && product.longitude;
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

    const mapSrc = hasCoords
      ? `https://www.google.com/maps/embed/v1/view?key=${key}&center=${product.latitude},${product.longitude}&zoom=15`
      : `https://www.google.com/maps/embed/v1/place?key=${key}&q=${encodeURIComponent(
          product.city
        )}`;

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* RETOUR */}
          <nav className="mb-6">
            <Link href="/" className="text-blue-600 hover:underline text-sm">
              ← Retour à l'accueil
            </Link>
          </nav>

          <div className="grid gap-8 lg:grid-cols-3">

            {/* =================== COLONNE PRINCIPALE =================== */}
            <div className="lg:col-span-2 space-y-8">

              {/* HEADER */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h1 className="text-3xl font-bold">{product.title}</h1>

                <div className="mt-2 text-gray-600 flex items-center gap-3">
                  <span className="font-semibold text-green-600 text-xl">
                    {product.price} MAD
                  </span>
                  <span className="text-sm">/ nuit</span>
                </div>

                <p className="text-gray-700 mt-4 whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* GALERIE */}
              <ImageGallery product={product} />

              {/* GOOGLE MAPS */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Localisation</h2>
                <div className="h-72 rounded-xl overflow-hidden border">
                  <iframe
                    src={mapSrc}
                    className="w-full h-full"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* =================== SIDEBAR =================== */}
            <BookingSidebar product={product} />

          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("❌ ERROR FETCH PRODUCT", error);
    return <ErrorState />;
  }
}

/* ======================================================================= */
/*                               GALERIE IMAGES                            */
/* ======================================================================= */

function ImageGallery({ product }: { product: any }) {
  const mainImage = product.image || "/placeholder.png";
  const gallery = product.images || [];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Galerie</h2>

      <div className={`grid gap-4 ${gallery.length > 0 ? "sm:grid-cols-2" : ""}`}>

        {/* IMAGE PRINCIPALE */}
        <div className="relative h-80 w-full rounded-xl overflow-hidden sm:col-span-2">
          <Image src={mainImage} alt={product.title} fill className="object-cover" />
        </div>

        {/* AUTRES IMAGES */}
        {gallery.map((img: any, i: number) => (
          <div key={img.id} className="relative h-48 rounded-xl overflow-hidden">
            <Image
              src={img.url}
              alt={`${product.title} - ${i + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ======================================================================= */
/*                              SIDEBAR (réservation)                      */
/* ======================================================================= */

function BookingSidebar({ product }: { product: any }) {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-8 bg-white rounded-2xl shadow-lg p-6 space-y-6 border">
        <div className="flex flex-col items-center text-center">
          <div className="text-3xl font-bold text-gray-900">{product.price} MAD</div>
          <div className="text-gray-600 text-sm">par nuit</div>
        </div>

        <BookingForm productId={product.id} price={product.price} />
      </div>
    </div>
  );
}

/* ======================================================================= */
/*                                ERREUR                                    */
/* ======================================================================= */

function ErrorState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Erreur de chargement
        </h2>
        <Link href="/" className="text-blue-600 hover:underline">
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
