## Auto Play Logic

The application uses the Intersection Observer API to detect
whether a video is currently visible in the viewport.

When the video enters the viewport:
- video.play()

When the video leaves the viewport:
- video.pause()

This improves performance and simulates modern short-video apps
such as TikTok or Instagram Reels.
