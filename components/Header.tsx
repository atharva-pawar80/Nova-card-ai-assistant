
import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import FavoriteButton from "./FavoriteButton";
import SignIn from "./SignIn";
import MobileMenu from "./MobileMenu";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ClerkLoaded, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Logs } from "lucide-react";
import { getMyOrders } from "@/sanity/queries";

const Header = async () => {
  const user = await currentUser();
  const { userId } = await auth();

  let orders = null;

  if (userId) {
    orders = await getMyOrders(userId);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#292720]/10 bg-[#F6F0E7]/95 backdrop-blur-md">
      <Container className="flex items-center justify-between gap-3 py-4 text-[#292720]">
        <div className="flex w-auto items-center justify-start gap-2.5 md:w-1/3 md:gap-0">
          <MobileMenu />
          <Logo />
        </div>

        <div className="hidden md:block">
          <HeaderMenu />
        </div>

        <div className="flex w-auto items-center justify-end gap-3 md:w-1/3 md:gap-5">
          <SearchBar />

          <div className="transition-transform duration-200 hover:scale-105">
            <CartIcon />
          </div>

          <div className="transition-colors duration-200 hover:text-[#B65230]">
            <FavoriteButton />
          </div>

          {user && (
            <Link
              href="/orders"
              aria-label="My orders"
              className="group relative transition-colors duration-200 hover:text-[#B65230]"
            >
              <Logs className="h-5 w-5" />

              <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#B65230] px-1 text-[10px] font-semibold text-white">
                {orders?.length ?? 0}
              </span>
            </Link>
          )}

          <ClerkLoaded>
            <SignedIn>
              <UserButton />
            </SignedIn>

            {!user && <SignIn />}
          </ClerkLoaded>
        </div>
      </Container>
    </header>
  );
};

export default Header;
