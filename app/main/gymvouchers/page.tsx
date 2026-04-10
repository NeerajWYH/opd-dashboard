"use client"

import { useForm } from "@tanstack/react-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { AppDatePicker } from "@/components/app-date-picker"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { httpGet, httpPost } from "@/lib/https"
import { triggerToast } from "@/lib/utils"
import { useLoader } from "@/hooks/use-loader"
import {
  gymvoucherSchema,
  exposeFormattedStringifyAPISchema,
  exposeFormattedStringifyAPIResponseSchema,
} from "@/lib/post-body-schema"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const formSchema = gymvoucherSchema

const items = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
]

const gyms = [
  {
    label: "Avengers Fitness Club",
    value: {
      gymname: "Avengers Fitness Club",
      gymaddress:
        "Shop No. 2, Bhukendra Bus Stop, Pokharan Rd, near Yeoor Hills Road, Upvan, Thane West, Thane, Maharashtra 400606",
    },
  },
  {
    label: "Krunch Fitness",
    value: {
      gymname: "Krunch Fitness",
      gymaddress:
        "2nd floor, Oswal Business Center, Kolshet Rd, opp. Blossom High School, Dhokali, Thane West, Thane, Maharashtra 400607",
    },
  },
  {
    label: "The Crossone Fitness",
    value: {
      gymname: "The Crossone Fitness",
      gymaddress:
        "Basement 1, Laxmi Niwas Building, BPD Road, opp. Bedekar School, Naupada, Thane West, Thane, Maharashtra 400602",
    },
  },
  {
    label: "Cult Gym Ghodbunder Road",
    value: {
      gymname: "Cult Gym Ghodbunder Road",
      gymaddress:
        "2nd Floor, Dosti Imperia, S2-16, Ghodbunder Rd, Manpada, Thane West, Thane, Maharashtra 400610",
    },
  },
  {
    label: "NS FITZONE",
    value: {
      gymname: "NS FITZONE",
      gymaddress:
        "3 Basement, Taskar House, Ram Maruti Rd, opp. Bank of Baroda, Naupada, Thane West, Thane, Maharashtra 400602",
    },
  },
  {
    label: "Body Muscle Gym",
    value: {
      gymname: "Body Muscle Gym",
      gymaddress:
        "Unit 206, 2nd Floor, Vardhman Industrial Complex, LBS Marg, Gokul Nagar, Thane West, Thane, Maharashtra 400601",
    },
  },
  {
    label: "Universal Fitness Hub",
    value: {
      gymname: "Universal Fitness Hub",
      gymaddress:
        "Bungalow No. 6, Old MHADA, Swami Vivekanand Nagar, Vasant Vihar, Thane West, Thane, Maharashtra 400610",
    },
  },
  {
    label: "Fun And Fit Gym",
    value: {
      gymname: "Fun And Fit Gym",
      gymaddress:
        "B/1, Agrasen Tower, Opp. Fishland Hotel, Kolbad Rd, Khopat, Thane, Maharashtra 400601",
    },
  },
  {
    label: "Energyia Fitness Centre",
    value: {
      gymname: "Energyia Fitness Centre",
      gymaddress:
        "Eden Super Market, opp. TMC Garden, Vihang Valley Phase 1, Kasarvadavali, Thane West, Thane, Maharashtra 400615",
    },
  },
  {
    label: "Fitness League Gym & Cross Training Studio",
    value: {
      gymname: "Fitness League Gym & Cross Training Studio",
      gymaddress:
        "Ground Floor, Madhumilind Society, Vrindavan Society Phase II, Thane West, Thane, Maharashtra 400601",
    },
  },
]

export default function BloodTestPage() {
  const { toggleLoader } = useLoader()
  const form = useForm({
    defaultValues: {
      fullname: "",
      dob: new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
      gender: "",
      mobile: "",
      gymname: "",
      gymaddress: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        toggleLoader(true)
        const res = await httpPost(
          "/api/gymvoucher/add",
          {
            ...value,
            dob: new Date(
              new Date(value.dob).getTime() + 5.5 * 60 * 60 * 1000
            ).toISOString(),
            createdAt: new Date(
              new Date().getTime() + 5.5 * 60 * 60 * 1000
            ).toISOString(),
          },
          {
            headers: {
              "client-key": "DFKtkoqZiSLznGe9KENc",
            },
          }
        )
        if (res.success) {
          triggerToast("success", "Data submitted successfully")
          form.reset()
        } else {
          triggerToast("error", res.message || "Failed to submit data")
        }
      } catch (error) {
        console.log(error)
        triggerToast("error", "Failed to submit data")
      } finally {
        toggleLoader(false)
      }
    },
  })

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold">Book Blood Test</h2>

      <Card className="mt-5 w-full max-w-[800px] py-1">
        <CardContent className="">
          <Accordion>
            <AccordionItem value="item-1">
              <AccordionTrigger>API Schema</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-1 font-semibold">Endpoint</h3>
                    <code className="rounded bg-[#aaaaaa] px-2 py-1 text-sm">
                      POST /api/gymvoucher/add
                    </code>
                  </div>
                  <div>
                    <h3 className="font-semibold">Request Body Schema</h3>
                    <pre className="overflow-x-auto rounded bg-[#aaaaaa] p-4 text-sm">
                      {exposeFormattedStringifyAPISchema(
                        gymvoucherSchema.shape
                      )}
                    </pre>
                  </div>
                  <div>
                    <h3 className="font-semibold">Response Body Schema</h3>
                    <pre className="overflow-x-auto rounded bg-[#aaaaaa] p-4 text-sm">
                      {exposeFormattedStringifyAPIResponseSchema()}
                    </pre>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card className="mt-5 w-full max-w-[800px]">
        <CardContent>
          <form
            id="bug-report-form"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup className="flex flex-row flex-wrap gap-4">
              <form.Field
                name="fullname"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field
                      data-invalid={isInvalid}
                      className="w-[calc(50%-0.5rem)] gap-0.5"
                    >
                      <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Enter Full Name"
                        autoComplete="off"
                        className="py-4.5"
                      />
                      {isInvalid && (
                        <FieldError
                          errors={field.state.meta.errors}
                          className="text-xs"
                        />
                      )}
                    </Field>
                  )
                }}
              />
              <form.Field
                name="dob"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field
                      data-invalid={isInvalid}
                      className="w-[calc(50%-0.5rem)] gap-0.5"
                    >
                      <FieldLabel htmlFor={field.name}>
                        Date of Birth
                      </FieldLabel>
                      <AppDatePicker
                        mode="single"
                        value={field.state.value}
                        onChange={(date) => {
                          console.log(date)
                          if (date) {
                            field.handleChange(date)
                          }
                        }}
                        onBlur={field.handleBlur}
                        isInvalid={isInvalid}
                        placeholder="Select Date of Birth"
                        buttonId={field.name}
                        className="w-full py-4.5"
                      />
                      {isInvalid && (
                        <FieldError
                          errors={field.state.meta.errors}
                          className="text-xs"
                        />
                      )}
                    </Field>
                  )
                }}
              />
              <form.Field
                name="gender"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field
                      data-invalid={isInvalid}
                      className="w-[calc(50%-0.5rem)] gap-0.5"
                    >
                      <FieldLabel htmlFor={field.name}>Gender</FieldLabel>
                      <Select
                        items={items}
                        name={field.name}
                        value={field.state.value}
                        onValueChange={(val) => field.handleChange(val ?? "")}
                      >
                        <SelectTrigger
                          className="w-[180px] py-4.5"
                          aria-invalid={isInvalid}
                        >
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent alignItemWithTrigger={false}>
                          <SelectGroup>
                            {items.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {isInvalid && (
                        <FieldError
                          errors={field.state.meta.errors}
                          className="text-xs"
                        />
                      )}
                    </Field>
                  )
                }}
              />
              <form.Field
                name="mobile"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field
                      data-invalid={isInvalid}
                      className="w-[calc(50%-0.5rem)] gap-0.5"
                    >
                      <FieldLabel htmlFor={field.name}>Mobile</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Enter Mobile Number"
                        autoComplete="off"
                        maxLength={10}
                        minLength={10}
                        className="py-4.5"
                        onKeyDown={(e) => {
                          if (
                            !/[0-9]/.test(e.key) &&
                            e.key !== "Backspace" &&
                            e.key !== "ArrowLeft" &&
                            e.key !== "ArrowRight"
                          ) {
                            e.preventDefault()
                          }
                        }}
                      />
                      {isInvalid && (
                        <FieldError
                          errors={field.state.meta.errors}
                          className="text-xs"
                        />
                      )}
                    </Field>
                  )
                }}
              />
              <form.Field
                name="gymname"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field
                      data-invalid={isInvalid}
                      className="w-[calc(50%-0.5rem)] gap-0.5"
                    >
                      <FieldLabel htmlFor={field.name}>Gym</FieldLabel>
                      <Select
                        items={gyms}
                        name={field.name}
                        value={field.state.value}
                        onValueChange={(val: any) => {
                          field.handleChange(val.gymname ?? "")
                          form.setFieldValue("gymaddress", val.gymaddress ?? "")
                        }}
                      >
                        <SelectTrigger
                          className="w-[180px] py-4.5"
                          aria-invalid={isInvalid}
                        >
                          <SelectValue placeholder="Select Gym" />
                        </SelectTrigger>
                        <SelectContent alignItemWithTrigger={false}>
                          <SelectGroup>
                            {gyms.map((item, index) => (
                              <SelectItem key={index} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {isInvalid && (
                        <FieldError
                          errors={field.state.meta.errors}
                          className="text-xs"
                        />
                      )}
                    </Field>
                  )
                }}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal" className="justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              className="cursor-pointer"
            >
              Reset
            </Button>
            <Button
              type="submit"
              form="bug-report-form"
              className="cursor-pointer"
            >
              Submit
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  )
}
