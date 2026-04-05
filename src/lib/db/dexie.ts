import Dexie, { Table } from "dexie"

export interface DetectionLog {
  id?: number
  label: string
  confidence: number
  timestamp: number
  location?: { lat: number; lng: number } // Future-proofing for Thrissur GPS mapping
}

export class AkashaDatabase extends Dexie {
  logs!: Table<DetectionLog>

  constructor() {
    super("AkashaDB")
    this.version(1).stores({
      logs: "++id, label, timestamp", // Indexing for fast search
    })
  }
}

export const db = new AkashaDatabase()
