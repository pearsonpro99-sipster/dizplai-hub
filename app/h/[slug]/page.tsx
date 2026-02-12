// app/h/[slug]/page.tsx — Fan-facing hub, reads config dynamically
import { notFound } from "next/navigation";
import { getHubBySlug } from "@/lib/hub-store";
import HubClient from "./hub-client";

// Force dynamic rendering (reads from file system)
export const dynamic = "force-dynamic";

export default async function HubPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const hub = await getHubBySlug(slug);

    if (!hub) {
        notFound();
    }

    return <HubClient hub={hub} />;
}