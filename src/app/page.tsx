"use client";

import { useState } from "react";
import VideoCard from "@/components/VideoCard";
import Navbar from "@/components/Navbar";
import { videos } from "@/data/videos";

export default function Home() {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <main className="h-screen overflow-y-scroll snap-y snap-mandatory">
      <Navbar />
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          videoUrl={video.videoUrl}
          authorName={video.authorName}
          description={video.description}
          likesCount={video.likesCount}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted((prev) => !prev)}
        />
      ))}
    </main>
  );
}