import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

type UserRole = 'ADMIN' | 'DOCTOR' | 'PATIENT';
 
type RouteConfig = {
  exact: string[],
  patterns: RegExp[],
}

const authRoutes = ["/","/login","/register", "/forgot-password", "/reset-password"];

const commonProtectedRoutes: RouteConfig = {
  exact: ["/my-profile", "/settings"],
  patterns: [], // [/password/*]
};


const docterProtectedRoutes: RouteConfig = {
  patterns: [/^\/doctors/],
  exact: [],
};

const adminProtectedRoutes: RouteConfig = {
  patterns: [/^\/admin/],
  exact: [],
};


const patientProtectedRoutes: RouteConfig = {
  patterns: [/^\/dashboard/],
  exact: [],
};


const isAuthRoute = (pathname: string) => {
  return authRoutes.some((route: string) => route === pathname);
}


const isRouteMatches = (pathname: string, routes: RouteConfig) : boolean => {
  if (routes.exact.includes(pathname)) {
    return true;
  }

  return routes.patterns.some((pattern: RegExp) => pattern.test(pathname));
}

export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}


const getRouteOwener = (pathname: string): 'ADMIN' | 'DOCTOR' | 'PATIENT' | 'COMMON' | null => {

    if (isRouteMatches(pathname, adminProtectedRoutes)) {
    return 'ADMIN';
  }

  if (isRouteMatches(pathname, docterProtectedRoutes)) {
    return 'DOCTOR';
  }

  if (isRouteMatches(pathname, patientProtectedRoutes)) {
    return 'PATIENT';
  }

  if (isRouteMatches(pathname, commonProtectedRoutes)) {
    return 'COMMON';
  }

  return null;
}


const getDefaultDasboardRoute = (role: UserRole) : string => {
  switch(role) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'DOCTOR':
      return '/doctor/dashboard';
    case 'PATIENT':
      return '/dashboard';
    default:
      return '/';
  }
}

// match the protected route
export const config = {
  matcher: '/about/:path*',
}


