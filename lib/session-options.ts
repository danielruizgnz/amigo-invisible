export const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "amigo-invisible-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 30,
  },
};
