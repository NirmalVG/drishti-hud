type OverlayBox = {
  height: number
  left: number
  top: number
  width: number
}

export type VideoOverlayMetrics = OverlayBox & {
  videoHeight: number
  videoWidth: number
}

type SourceBox = {
  height: number
  width: number
  x: number
  y: number
}

export function getVideoOverlayMetrics(
  video: HTMLVideoElement | null,
): VideoOverlayMetrics | null {
  if (!video || video.videoWidth <= 0 || video.videoHeight <= 0) {
    return null
  }

  const rect = video.getBoundingClientRect()
  const scale = Math.max(
    rect.width / video.videoWidth,
    rect.height / video.videoHeight,
  )
  const renderedWidth = video.videoWidth * scale
  const renderedHeight = video.videoHeight * scale

  return {
    left: rect.left + (rect.width - renderedWidth) / 2,
    top: rect.top + (rect.height - renderedHeight) / 2,
    width: renderedWidth,
    height: renderedHeight,
    videoWidth: video.videoWidth,
    videoHeight: video.videoHeight,
  }
}

function projectBox(
  metrics: VideoOverlayMetrics,
  box: SourceBox,
  isMirrored: boolean,
): OverlayBox | null {
  const scale = metrics.width / metrics.videoWidth
  const sourceX = isMirrored
    ? metrics.videoWidth - box.x - box.width
    : box.x

  return {
    left: metrics.left + sourceX * scale,
    top: metrics.top + box.y * scale,
    width: box.width * scale,
    height: box.height * scale,
  }
}

export function projectPixelBoxToViewport(
  metrics: VideoOverlayMetrics,
  box: SourceBox,
  isMirrored: boolean,
) {
  return projectBox(metrics, box, isMirrored)
}

export function projectNormalizedBoxToViewport(
  metrics: VideoOverlayMetrics,
  box: SourceBox,
  isMirrored: boolean,
) {
  return projectBox(
    metrics,
    {
      x: box.x * metrics.videoWidth,
      y: box.y * metrics.videoHeight,
      width: box.width * metrics.videoWidth,
      height: box.height * metrics.videoHeight,
    },
    isMirrored,
  )
}
