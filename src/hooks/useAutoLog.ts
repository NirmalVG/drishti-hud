"use client"

import { useEffect } from "react"
import { db } from "@/lib/db/dexie"

export function useAutoLog(detections: any[]) {
  useEffect(() => {
    const highConf = detections.filter((d) => d.categories[0].score > 0.85)

    if (highConf.length > 0) {
      highConf.forEach(async (det) => {
        const label = det.categories[0].categoryName

        // Check if we already logged this target in the last 30 seconds
        const recent = await db.logs
          .where("label")
          .equals(label)
          .and((item) => Date.now() - item.timestamp < 30000)
          .count()

        if (recent === 0) {
          await db.logs.add({
            label,
            confidence: det.categories[0].score,
            timestamp: Date.now(),
          })
          console.log(`AKASHA: Persistent Log Created for ${label}`)
        }
      })
    }
  }, [detections])
}
