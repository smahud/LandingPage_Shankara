import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * HTTPS-only enforcement (No HTTP).
 *
 * Arsitektur: Pengunjung → Cloudflare (tunnel) → proxy pusat HTTPS :3998
 * → app 127.0.0.1:4008. Proxy pusat SELALU menyetel x-forwarded-proto=https,
 * jadi satu-satunya sinyal otentik permintaan plaintext pengunjung adalah
 * header tepi Cloudflare `cf-visitor`. Jika visitor datang via http://,
 * redirect permanen (308) ke https:// di host yang sama (port dibuang).
 *
 * Loop-proof: cf-visitor hanya disetel Cloudflare sesuai skema visitor;
 * proxy memaksa x-forwarded-proto=https; akses loopback tanpa cf-visitor
 * tidak pernah di-redirect. Target redirect dibangun manual dari header
 * host (NextRequest.nextUrl tidak memakai Host header pada standalone).
 */
export function middleware(request: NextRequest) {
  const cfVisitor = request.headers.get("cf-visitor") ?? "";
  if (!cfVisitor.includes('"scheme":"http"')) {
    return NextResponse.next();
  }
  const rawHost =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    "shankarawell.yapsidarussalam.or.id";
  const host = rawHost.split(",")[0].trim().split(":")[0];
  const url = new URL(
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
    `https://${host}`
  );
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
