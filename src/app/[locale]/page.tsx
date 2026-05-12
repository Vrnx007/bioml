import { getTranslations } from "next-intl/server";
import { CategoryCarousel } from "@/components/category-carousel";
import { Preloader } from "@/components/landing/Preloader";
import { Hero3D } from "@/components/landing/Hero3D";
import { ScrollFeatures } from "@/components/landing/ScrollFeatures";

export default async function HomePage() {
  const t = await getTranslations("Home");

  return (
    <div>
      <Preloader />
      <Hero3D t={t} />
      <ScrollFeatures />
      <div className="bg-surface-muted/30">
        <CategoryCarousel />
      </div>
    </div>
  );
}
