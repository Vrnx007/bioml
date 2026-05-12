import { redirect } from "next/navigation";

/** `/vendor` → default vendor surface (onboarding). */
export default async function VendorIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/vendor/onboarding`);
}
