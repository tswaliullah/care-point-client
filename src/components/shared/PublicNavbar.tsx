import { Button } from "../ui/button";
import Link from "next/link";

const PublicNavbar = () => {
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Consaltation", href: "/consaltation" },
    { name: "Health Plan", href: "/health-plan" },
    { name: "Diagnostics", href: "/diagnostics" },
    { name: "NGOs", href: "/ngos" },
  ]
  return (
    <>
      <header className="sticky top-0 z-50 flex h-16 border-b w-full items-center justify-around bg-background/95 px-4 shadow-md">
          <div>

            <Link className="flex items-center justify-center text-xl font-bold text-primary" href={"/"}>Care Point</Link>
          </div>

          <nav>
              <ul className="flex gap-6">
                  {
                    navItems.map(item => (
                      <li key={item.name}>
                        <link href={item.href} className="text-sm font-medium text-muted-foreground hover:text-primary">
                          {
                            item.name
                          }
                        </link>
                      </li>
                    ))
                  }
              </ul>
          </nav>

          <div>
              <Link href={"/login"}>
                <Button>Login</Button>
              </Link>
          </div>

      </header>
    </>
  );
};

export default PublicNavbar;