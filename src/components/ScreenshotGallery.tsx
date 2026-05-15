"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

  if (images.length === 0) return null;

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {images.map((src, i) => (
          <CarouselItem key={i}>
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border/50 bg-muted">
              <Image
                src={src}
                alt={`${name} screenshot ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 && (
        <>
          <CarouselPrevious className="left-2 border-border/50 bg-background/80 backdrop-blur-sm hover:bg-background" />
          <CarouselNext className="right-2 border-border/50 bg-background/80 backdrop-blur-sm hover:bg-background" />
        </>
      )}
    </Carousel>
  );
}
