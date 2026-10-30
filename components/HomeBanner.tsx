
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { banner_1 } from "@/images";
import Container from "./Container";

const HomeBanner = () => {
  return (
    <Container className="pt-6">
      <section className="relative overflow-hidden rounded-2xl bg-[#F6F0E7] px-6 py-12 sm:px-10 md:px-14 md:py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="relative z-10 space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B65230]">
              The everyday edit
            </p>

            <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight text-[#292720] sm:text-5xl lg:text-6xl">
              Good design.
              <br />
              Better finds.
            </h1>

            <p className="max-w-md text-base leading-7 text-[#6D665D]">
              Discover thoughtful tech and everyday essentials,
              carefully chosen to make life a little better.
            </p>

            <Link
              href="/shop"
              className="inline-flex items-center gap-3 rounded-full bg-[#B65230] px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#934024] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B65230]"
            >
              Explore the collection
              <span aria-hidden="true">↗</span>
            </Link>

            <p className="text-xs tracking-wide text-[#81776B]">
              THOUGHTFULLY CHOSEN. MADE FOR EVERYDAY.
            </p>
          </div>

          <div className="relative flex min-h-56 items-center justify-center sm:min-h-72">
            <div className="absolute h-56 w-56 rounded-full bg-[#E8D9C6] sm:h-72 sm:w-72" />

            <Image
              src={banner_1}
              alt="Featured NovaCart tech collection"
              priority
              className="relative z-10 h-auto max-h-80 w-full max-w-md object-contain transition-transform duration-500 ease-out hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>
    </Container>
  );
};

export default HomeBanner;
