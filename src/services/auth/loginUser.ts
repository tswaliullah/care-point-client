/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { cookies } from "next/headers";
import { parse } from "cookie"
import z from "zod";

const loginValidationZodSchema = z.object({
    email: z.email({
        message: "Email is required",
    }),
    password: z.string("Password is required").min(6, {
        error: "Password is required and must be at least 6 characters long",
    }).max(100, {
        error: "Password must be at most 100 characters long",
    }),
});

export const loginUser = async (_currentState: any, formData: any): Promise<any> => {
    try {
        let accessTokenObj : null | any = null;
        let refreshTokenObj : null | any = null;

        const loginData = {
            email: formData.get('email'),
            password: formData.get('password'),
        }

        const validatedFields = loginValidationZodSchema.safeParse(loginData);

        if (!validatedFields.success) {
            return {
                success: false,
                errors: validatedFields.error.issues.map(issue => {
                    return {
                        field: issue.path[0],
                        message: issue.message,
                    }
                })
            }
        }

        const res = await fetch("http://localhost:5000/api/v1/auth/login", {
            method: "POST",
            body: JSON.stringify(loginData),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await res.json();

        const setCookieHeader = res.headers.getSetCookie();
        
        if(setCookieHeader && setCookieHeader.length > 0) {
            setCookieHeader.forEach((cookie: string) => {
                const parsedCookied = parse(cookie);

                if (parsedCookied['accessToken']) {
                    accessTokenObj = parsedCookied;
                }

                if (parsedCookied['refreshToken']) {
                    refreshTokenObj = parsedCookied;   
                }
            
            })
        } else {
            throw new Error("No set cookie header here");
        }

        if (!accessTokenObj ) {
            throw new Error("No access token");
        }

        if (!refreshTokenObj) {
            throw new Error("No refresh token");
        }

        const cookieStore = await cookies();

        cookieStore.set("accessToken", accessTokenObj['accessToken'],{
            secure: true,
            httpOnly: true,
            maxAge: parseInt(accessTokenObj.maxAge),
            path: accessTokenObj.path || "/",
        })

        cookieStore.set("refreshToken", refreshTokenObj['refreshToken'],{   
            secure: true,
            httpOnly: true,
            maxAge: parseInt(refreshTokenObj.maxAge),
            path: refreshTokenObj.path || "/",
        })

        return result;

    } catch (error) {
        console.log(error);
        return { error: "Login failed" };
    }
}