"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Gamepad2 } from "lucide-react";

export default function ScreenshotGallery({
  screenshots,
  headerImage,
  name,
}: {
  screenshots: string[];
  headerImage?: string;
  name: string;
}) {
  const images = screenshots.length > 0 ? screenshots : headerImage ? [headerImage] : [];
  const [failed, setFailed] = useState<Set<number>>(new Set());

  if (images.length === 0) return null;

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {images.map((src, i) => (
          <CarouselItem key={i}>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
              {failed.has(i) ? (
                <div className="flex h-full items-center justify-center text-muted-foreground/30">
                  <Gamepad2 className="h-12 w-12" />
                </div>
              ) : (
                <Image
                  src={src}
                  alt={`${name} screenshot ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onError={() => setFailed((prev) => new Set(prev).add(i))}
                />
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 && (
        <>
          <CarouselPrevious className="left-2 border-white/[0.08] bg-background/80 backdrop-blur-sm hover:bg-background text-foreground/60" />
          <CarouselNext className="right-2 border-white/[0.08] bg-background/80 backdrop-blur-sm hover:bg-background text-foreground/60" />
        </>
      )}
    </Carousel>
  );
}
