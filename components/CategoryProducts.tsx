
import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { StarIcon } from "@sanity/icons";
import { Flame } from "lucide-react";
import PriceView from "./PriceView";
import Title from "./Title";
import ProductSideMenu from "./ProductSideMenu";
import AddToCartButton from "./AddToCartButton";

const ProductCard = ({ product }: { product: Product }) => {
  const inStock = (product?.stock ?? 0) > 0;

  return (
    <article className="group overflow-hidden rounded-xl border border-[#292720]/10 bg-white text-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#B65230]/30 hover:shadow-[0_12px_32px_rgba(41,39,32,0.08)]">
      <div className="relative overflow-hidden bg-[#F6F0E7]">
        {product?.images?.[0] && (
          <Link
            href={`/product/${product?.slug?.current}`}
            aria-label={`View ${product?.name}`}
            className="block"
          >
            <Image
              src={urlFor(product.images[0]).url()}
              alt={product?.name || "Product image"}
              width={500}
              height={500}
              className={`h-52 w-full object-contain p-4 transition-transform duration-500 ease-out sm:h-60 ${
                inStock ? "group-hover:scale-[1.04]" : "opacity-50"
              }`}
            />
          </Link>
        )}

        <ProductSideMenu product={product} />

        {product?.status === "sale" ? (
          <span className="absolute left-3 top-3 rounded-full bg-[#B65230] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
            On sale
          </span>
        ) : (
          <Link
            href="/deal"
            aria-label="Explore deals"
            className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-[#292720]/10 bg-white/90 text-[#B65230] transition-colors duration-200 hover:bg-[#B65230] hover:text-white"
          >
            <Flame size={16} />
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-2.5 p-3.5 sm:p-4">
        {product?.categories && (
          <p className="line-clamp-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#B65230]">
            {product.categories.join(", ")}
          </p>
        )}

        <Link
          href={`/product/${product?.slug?.current}`}
          className="text-[#292720] transition-colors duration-200 hover:text-[#B65230]"
        >
          <Title className="line-clamp-2 text-sm font-semibold leading-5">
            {product?.name}
          </Title>
        </Link>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                className={`h-3.5 w-3.5 ${
                  index < 4 ? "text-[#B65230]" : "text-[#D7CFC5]"
                }`}
              />
            ))}
          </div>
          <p className="text-[11px] text-[#81776B]">5 Reviews</p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              inStock ? "bg-emerald-600" : "bg-red-500"
            }`}
          />
          <span className="text-[#6D665D]">
            {inStock ? `${product?.stock} in stock` : "Currently unavailable"}
          </span>
        </div>

        <div className="mt-1 border-t border-[#292720]/10 pt-3">
          <PriceView
            price={product?.price}
            discount={product?.discount}
            className="text-sm"
          />

          <div className="mt-3">
            <AddToCartButton
              product={product}
              className="w-full rounded-full"
            />
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
