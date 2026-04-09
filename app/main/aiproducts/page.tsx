"use client"

import { useCallback } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

const aiProducts = [
  {
    name: "Calorie Scan",
    image: "/images/caloriescan.png",
    link: "https://salesportal.watchyourhealth.com/aiproducts/dashboard",
  },
  {
    name: "Face Scan",
    image: "/images/facescan.png",
    link: "https://salesportal.watchyourhealth.com/demo/v2",
  },
  {
    name: "Hair Scan",
    image: "/images/hairscan.png",
    link: "",
  },
  {
    name: "Oral Scan",
    image: "/images/oralscan.png",
    link: "",
  },
  {
    name: "Skin Scan",
    image: "/images/skinscan.png",
    link: "",
  },
]

export default function AiProductsPage() {
  const handleProductClick = useCallback((link: string) => {
    if (!link) return
    window.open(link, "_blank", "noopener noreferrer")
  }, [])

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold">AI Products</h2>

      <Card className="mt-5 w-full max-w-[800px] p-0">
        <CardContent className="flex flex-row flex-wrap gap-6 p-6">
          {aiProducts.map((product, index) => (
            <Card
              className="h-auto w-[calc(33.33%-1rem)] cursor-pointer gap-0 overflow-hidden bg-cover bg-center bg-no-repeat p-0 transition-transform duration-200 ease-in-out hover:scale-107 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:hover:scale-100"
              key={index}
              data-disabled={!product.link}
              onClick={() => handleProductClick(product.link)}
            >
              <CardContent
                className="aspect-square h-auto w-full bg-cover bg-center bg-no-repeat p-0"
                style={{ backgroundImage: `url(${product.image})` }}
              ></CardContent>
              <CardFooter className="justify-center p-2 px-3">
                <h3 className="text-md font-semibold">{product.name}</h3>
              </CardFooter>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
