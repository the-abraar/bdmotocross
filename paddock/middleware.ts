import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Legacy Route 301 Permanent Redirects (/exec/* and /rider/* -> /u/*)
  if (pathname.startsWith("/exec/") || pathname.startsWith("/rider/")) {
    const username = pathname.split("/")[2];
    const url = request.nextUrl.clone();
    url.pathname = `/u/${username.toLowerCase()}`;
    return NextResponse.redirect(url, 301);
  }

  // 2. Auth Session Check for Protected Routes
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Guard /admin/* and /settings
  if (!user && (pathname.startsWith("/admin") || pathname.startsWith("/settings"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/exec/:path*", "/rider/:path*", "/admin/:path*", "/settings/:path*"],
};
