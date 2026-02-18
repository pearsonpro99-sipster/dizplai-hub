// app/page.tsx — Root redirect to login
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
}