"use client"

import { useCallback, useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { httpGet } from "@/lib/https"
import { z } from "zod"
import { apiResponseSchema } from "@/lib/post-body-schema"
import { triggerToast } from "@/lib/utils"
import { Copy, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function MedicineDiscountsPage() {
  const [medicineDiscounts, setMedicineDiscounts] = useState<
    {
      id: string
      name: string
      logo: string
      redirectlink: string
      couponcode: string
    }[]
  >([])
  const [medicineDiscount, setMedicineDiscount] = useState<{
    id: string
    name: string
    logo: string
    redirectlink: string
    couponcode: string
  }>()
  const [openRedeemDialog, setOpenRedeemDialog] = useState<boolean>(false)

  useEffect(() => {
    setMedicineDiscounts([
      {
        couponcode: "WYHAPOLLOPHARMACY26",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFAXwZfrbhz8ycM4HLKWID-exuhpT048TXlg&s",
        name: "Apollo Pharmacy",
        redirectlink: "https://www.apollopharmacy.in/",
        id: "0Jt9TcTZlRBiPJ8jzxtD",
      },
      {
        couponcode: "WYHTATA1MG26",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3_frXdMmVlusae6XK7iZulk2hKRzPhutc2aZtZUaOKNXyLCs8Z5Wi8Q0&s",
        name: "Tata 1mg",
        redirectlink: "https://www.1mg.com/",
        id: "1zfvbZfNSed2mZQlu0e4",
      },
      {
        couponcode: "WYHNETMEDS26",
        logo: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTnfcBQDUIUdv0qB5GXqS25OOfLcgB-0RvG6OE42N8-lNT2SRvI",
        name: "Netmeds",
        redirectlink: "https://www.netmeds.com/",
        id: "St0njCkPUKUin8IgTubm",
      },
      {
        couponcode: "WYHPHARMEASY26",
        logo: "https://images.openai.com/static-rsc-4/bKCMi5o7F9yvVd5CCua_sHTyiNbmfxA2v1qm7ubOJZ3PMKfJukP6JjJqWuYB1wY6g0dja5ByIFi9g068t6A7HMCmCcqbQnfKTdHFtsyWuwrgqo2lWWnXi3ExVVD6KNRIF4q_W9qP3SP_POs0y6sToPyS5pgrcfh2bexgOyGDVSWGARsySZkOYxNocq7SwnBq?purpose=fullsize",
        name: "PharmEasy",
        redirectlink: "https://pharmeasy.in/",
        id: "St0njCkPUKUin8IgTubm2",
      },
    ])
    // httpGet("/api/medicinediscounts/list", {
    //   headers: {
    //     "client-key": "DFKtkoqZiSLznGe9KENc",
    //   },
    // })
    //   .then((res: z.infer<typeof apiResponseSchema>) => {
    //     console.log(res)
    //     if (res?.success) {
    //       setMedicineDiscounts(res?.data || [])
    //     } else triggerToast("error", res?.message)
    //   })
    //   .catch((err: z.infer<typeof apiResponseSchema>) => {
    //     triggerToast(
    //       "error",
    //       err?.message || "Failed to fetch medicine discounts"
    //     )
    //   })
  }, [])

  return (
    <>
      <div className="w-full">
        <h2 className="text-2xl font-semibold">Medicine Discounts</h2>

        <Card className="mt-5 w-full max-w-[800px] p-0">
          <CardContent className="flex flex-row flex-wrap gap-6 p-6">
            {medicineDiscounts.map((medDiscount) => (
              <Card
                className="h-auto w-[calc(33.33%-1rem)] cursor-pointer gap-0 overflow-hidden bg-cover bg-center bg-no-repeat p-0 transition-transform duration-200 ease-in-out hover:scale-107 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:hover:scale-100"
                key={medDiscount.id}
                data-disabled={
                  !medDiscount.redirectlink || !medDiscount.couponcode
                }
                onClick={() => {
                  setMedicineDiscount(medDiscount)
                  setOpenRedeemDialog(true)
                }}
              >
                <CardContent
                  className="aspect-square h-auto w-full bg-cover bg-center bg-no-repeat p-0"
                  style={{ backgroundImage: `url(${medDiscount.logo})` }}
                ></CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
      <Dialog open={openRedeemDialog} onOpenChange={setOpenRedeemDialog}>
        <DialogContent className="sm:max-w-sm" showCloseButton={false}>
          <Card className="w-full gap-0 p-0">
            <CardContent
              className="aspect-square h-auto w-full bg-cover bg-center bg-no-repeat p-0"
              style={{ backgroundImage: `url(${medicineDiscount?.logo})` }}
            ></CardContent>
            <CardFooter className="flex-col gap-4 bg-[#eee] p-4">
              <Button
                className="w-full cursor-pointer p-4 py-6 pb-6.5"
                onClick={() => {
                  navigator.clipboard.writeText(
                    medicineDiscount?.couponcode || ""
                  )
                  triggerToast("success", "Coupon code copied to clipboard")
                }}
              >
                {medicineDiscount?.couponcode}
                <Copy />
              </Button>
              <Button
                className="w-full cursor-pointer p-4 py-6 pb-6.5"
                onClick={() => {
                  window.open(
                    medicineDiscount?.redirectlink,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }}
              >
                Redeem
                <ExternalLink />
              </Button>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  )
}
