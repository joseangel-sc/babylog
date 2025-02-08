import { db } from "./db";

interface EliminationData {
  babyId: number;
  type: string;
  timestamp: Date;
  weight?: number | null;
  location?: string | null;
  notes?: string | null;
}

interface FeedingData {
  babyId: number;
  type: string;
  startTime: Date;
  endTime?: Date | null;
  side?: string | null;
  amount?: number | null;
  food?: string | null;
  notes?: string | null;
}

interface SleepData {
  babyId: number;
  type: string;
  startTime: Date;
  endTime?: Date | null;
  how?: string | null;
  whereFellAsleep?: string | null;
  whereSlept?: string | null;
  quality?: number | null;
  notes?: string | null;
}

export async function trackElimination(data: EliminationData) {
  return db.elimination.create({
    data: {
      ...data,
      success: true, // Required by schema
    },
  });
}

export async function trackFeeding(data: FeedingData) {
  return db.feeding.create({
    data: data,
  });
}

export async function trackSleep(data: SleepData) {
  return db.sleep.create({
    data: data,
  });
}

export async function getRecentTrackingEvents(babyId: number, limit: number = 5) {
  const [eliminations, feedings, sleepSessions] = await Promise.all([
    db.elimination.findMany({
      where: { babyId },
      orderBy: { timestamp: 'desc' },
      take: limit,
    }),
    db.feeding.findMany({
      where: { babyId },
      orderBy: { startTime: 'desc' },
      take: limit,
    }),
    db.sleep.findMany({
      where: { babyId },
      orderBy: { startTime: 'desc' },
      take: limit,
    }),
  ]);

  return {
    eliminations,
    feedings,
    sleepSessions,
  };
} 
