import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import pieceRoutes from "./routes/piece.routes";
import scoreRoutes from "./routes/score.routes";
import recordingRoutes from "./routes/recording.routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

// Populates req.auth on every request (reading the session token Clerk's
// axios interceptor attaches client-side). Routes that need to require
// sign-in add Clerk's own `requireAuth` middleware individually — this
// alone just makes getAuth(req) available everywhere, including on public
// routes like getPiece that want to know the user WITHOUT requiring one.
app.use(clerkMiddleware());

app.use("/api/pieces", pieceRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/recordings", recordingRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use(errorMiddleware);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Nota server listening on :${port}`));
