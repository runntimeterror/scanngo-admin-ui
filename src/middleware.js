import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

export function middleware(request) {
  const response = NextResponse.next();
  //check for user session, if one doesn't exist, create it.
  if (!request.cookies.has("sessionId")) {
    const newSession = uuidv4();
    response.cookies.set({ name: "sessionId", value: newSession, path: "/" });
    console.log("sending session id cookie");
  }
  return response;
}
