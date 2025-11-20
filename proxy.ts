import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers';
import { is } from 'zod/locales';
import jwt, { JwtPayload } from 'jsonwebtoken';

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



export async function proxy(request: NextRequest) {
  
  const cookieStore = await cookies();
  const pathname = request.nextUrl.pathname;

  const accessToken = request.cookies.get('accessToken')?.value || null;

  let userRole: UserRole | null = null;

  if (accessToken) {
    const verifyToken: JwtPayload | string = jwt.verify(accessToken, process.env.JWT_SECRET as string);

    if (typeof verifyToken === 'string') {
      cookieStore.delete('accessToken');
      cookieStore.delete('refreshToken');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    userRole = verifyToken?.role;

  }

  const routeOwner = getRouteOwener(pathname);
  
  const isAuth = isAuthRoute(pathname);

  // rule-1: user lgged in and trying to access auth route redirect to defult dashboard
  if(accessToken && isAuth) {
    const dashboardRoute = getDefaultDasboardRoute(userRole as UserRole);
    return NextResponse.redirect(new URL(dashboardRoute, request.url));
  }


  // rule-2: user is trying to acess open public route
  if (routeOwner === null) {
    return NextResponse.next();
  } 

  // rule - 1 & 2 for open public route and auth route
  if (!accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // rule-3: user is trying to access common protected route
  if (routeOwner === "COMMON") {
    return NextResponse.next();
  }


  // rule - 4: user is trying to access role based protected route
  if (routeOwner === "ADMIN" || routeOwner === "DOCTOR" || routeOwner === "PATIENT" ) {
    if (userRole !== routeOwner) {
      return NextResponse.redirect(new URL(getDefaultDasboardRoute(userRole as UserRole), request.url));
    }
  }

  
  return NextResponse.next();
}



// match the protected route
export const config = {
  matcher: '/about/:path*',
}


