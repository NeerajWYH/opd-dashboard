"use client"

import { useCallback } from "react"
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
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
import { multiSpecialistSchema } from "@/lib/post-body-schema"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const formSchema = multiSpecialistSchema

const items = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
]

const specialities = [
  { label: "Anesthesiology", value: "Anesthesiology" },
  { label: "Cardiology", value: "Cardiology" },
  { label: "Dermatology", value: "Dermatology" },
  { label: "Emergency Medicine", value: "EmergencyMedicine" },
  { label: "Endocrinology", value: "Endocrinology" },
  { label: "Family Medicine", value: "FamilyMedicine" },
  { label: "Gastroenterology", value: "Gastroenterology" },
  { label: "General Surgery", value: "GeneralSurgery" },
  { label: "Geriatrics", value: "Geriatrics" },
  { label: "Internal Medicine", value: "InternalMedicine" },
  { label: "Nephrology", value: "Nephrology" },
  { label: "Neurology", value: "Neurology" },
  { label: "Obstetrics & Gynecology", value: "OBGYN" },
  { label: "Oncology", value: "Oncology" },
  { label: "Ophthalmology", value: "Ophthalmology" },
  { label: "Orthopedic Surgery", value: "OrthopedicSurgery" },
  { label: "Otolaryngology (ENT)", value: "ENT" },
  { label: "Pediatrics", value: "Pediatrics" },
  { label: "Psychiatry", value: "Psychiatry" },
  { label: "Pulmonology", value: "Pulmonology" },
  { label: "Radiology", value: "Radiology" },
  { label: "Rheumatology", value: "Rheumatology" },
  { label: "Urology", value: "Urology" },
  { label: "Other", value: "Other" },
]

export default function MultiSpecialistPage() {
  const { toggleLoader } = useLoader()
  const form = useForm({
    defaultValues: {
      fullname: "",
      dob: new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
      gender: "",
      mobile: "",
      address: "",
      currentIllness: "",
      specialist: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
      try {
        toggleLoader(true)
        value.dob = new Date(
          new Date(value.dob).getTime() + 5.5 * 60 * 60 * 1000
        )
        const res = await httpPost("/api/multispecialist/add", value)
        if (res.ok) {
          triggerToast("success", "Data submitted successfully")
          form.reset()
        } else {
          triggerToast("error", "Failed to submit data")
        }
      } catch (error) {
        console.log(error)
        triggerToast("error", "Failed to submit data")
      } finally {
        toggleLoader(false)
      }
    },
  })

  const formatSchema = useCallback((schemaShape: any) => {
    const refinedSchema = JSON.parse(JSON.stringify(schemaShape, null, 2))
    const updatedSchema: Record<string, string> = {}
    Object.keys(refinedSchema).forEach((key) => {
      updatedSchema[key] = refinedSchema[key].type
    })
    return JSON.stringify(updatedSchema, null, 2)
  }, [])

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold">Add Multi Specialist</h2>

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
                      POST /api/multispecialist/add
                    </code>
                  </div>
                  <div>
                    <h3 className="font-semibold">Request Body Schema</h3>
                    <pre className="overflow-x-auto rounded bg-[#aaaaaa] p-4 text-sm">
                      {formatSchema(multiSpecialistSchema.shape)}
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
                          if (!/[0-9]/.test(e.key)) {
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
                name="specialist"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field
                      data-invalid={isInvalid}
                      className="w-[calc(50%-0.5rem)] gap-0.5"
                    >
                      <FieldLabel htmlFor={field.name}>Specialist</FieldLabel>
                      <Select
                        items={specialities}
                        name={field.name}
                        value={field.state.value}
                        onValueChange={(val) => field.handleChange(val ?? "")}
                      >
                        <SelectTrigger
                          className="w-[180px] py-4.5"
                          aria-invalid={isInvalid}
                        >
                          <SelectValue placeholder="Select Specialist" />
                        </SelectTrigger>
                        <SelectContent alignItemWithTrigger={false}>
                          <SelectGroup>
                            {specialities.map((item) => (
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
              <div className="w-[calc(50%-0.5rem)]"></div>
              <form.Field
                name="address"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field
                      data-invalid={isInvalid}
                      className="w-[calc(50%-0.5rem)] gap-0.5"
                    >
                      <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Enter Your Address"
                          rows={6}
                          className="min-h-24 resize-none"
                          aria-invalid={isInvalid}
                          maxLength={200}
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText className="tabular-nums">
                            {field.state.value.length}/200 characters
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      {/* <FieldDescription>
                        Include steps to reproduce, expected behavior, and what
                        actually happened.
                      </FieldDescription> */}
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
                name="currentIllness"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field
                      data-invalid={isInvalid}
                      className="w-[calc(50%-0.5rem)] gap-0.5"
                    >
                      <FieldLabel htmlFor={field.name}>
                        Current Illness
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Explain current illness"
                          rows={6}
                          className="min-h-24 resize-none"
                          aria-invalid={isInvalid}
                          maxLength={500}
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText className="tabular-nums">
                            {field.state.value.length}/500 characters
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      {/* <FieldDescription>
                        Include steps to reproduce, expected behavior, and what
                        actually happened.
                      </FieldDescription> */}
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
