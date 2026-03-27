import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

async function getGeoInfo(): Promise<{ ip: string; location: string }> {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    return {
      ip: data.ip ?? "unknown",
      location: [data.city, data.region, data.country_name]
        .filter(Boolean)
        .join(", ") || "unknown",
    };
  } catch {
    return { ip: "unknown", location: "unknown" };
  }
}

export async function notifyVisit(name: string, page: string) {
  try {
    const { ip, location } = await getGeoInfo();

    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        name,
        timestamp: new Date().toLocaleString(),
        page,
        ip,
        location,
      },
      PUBLIC_KEY,
    );
  } catch (err) {
    console.error("notifyVisit failed:", err);
  }
}
