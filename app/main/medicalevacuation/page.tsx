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
  SelectLabel,
} from "@/components/ui/select"
import { httpGet, httpPost } from "@/lib/https"
import { triggerToast } from "@/lib/utils"
import { useLoader } from "@/hooks/use-loader"
import {
  medicalEvacuationSchema,
  exposeFormattedStringifyAPISchema,
  exposeFormattedStringifyAPIResponseSchema,
} from "@/lib/post-body-schema"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const formSchema = medicalEvacuationSchema

const items = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
]

const emergencytypes = [
  {
    category: "Medical Emergencies",
    types: [
      {
        label: "Chest pain / suspected heart attack",
        value: "CHEST_PAIN_HEART_ATTACK",
      },
      {
        label: "Breathing difficulty / shortness of breath",
        value: "BREATHING_DIFFICULTY",
      },
      { label: "Unconscious / not responding", value: "UNCONSCIOUS" },
      {
        label: "Stroke symptoms (slurred speech, weakness on one side)",
        value: "STROKE_SYMPTOMS",
      },
      { label: "Seizure / fits", value: "SEIZURE" },
      { label: "Severe allergic reaction", value: "ALLERGIC_REACTION" },
      { label: "High fever with complications", value: "HIGH_FEVER" },
      { label: "Severe pain (unknown cause)", value: "SEVERE_PAIN" },
    ],
  },
  {
    category: "Trauma / Injury Emergencies",
    types: [
      { label: "Road accident", value: "ROAD_ACCIDENT" },
      { label: "Fall from height", value: "FALL_FROM_HEIGHT" },
      { label: "Head injury", value: "HEAD_INJURY" },
      { label: "Fracture / broken bone", value: "FRACTURE" },
      { label: "Heavy bleeding", value: "HEAVY_BLEEDING" },
      { label: "Burn injury (fire, chemical, electric)", value: "BURN_INJURY" },
    ],
  },
  {
    category: "Special Condition Emergencies",
    types: [
      { label: "Pregnancy-related emergency", value: "PREGNANCY_EMERGENCY" },
      { label: "Child / infant emergency", value: "CHILD_EMERGENCY" },
      { label: "Elderly critical condition", value: "ELDERLY_CRITICAL" },
    ],
  },
  {
    category: "Critical Health Conditions",
    types: [
      {
        label: "Oxygen required / breathing support needed",
        value: "OXYGEN_REQUIRED",
      },
      { label: "ICU transfer required", value: "ICU_TRANSFER" },
      { label: "Ventilator support needed", value: "VENTILATOR_REQUIRED" },
      {
        label: "Organ-related emergency (kidney, liver, etc.)",
        value: "ORGAN_EMERGENCY",
      },
    ],
  },
  {
    category: "Environmental / Situational Emergencies",
    types: [
      { label: "Drowning / near drowning", value: "DROWNING" },
      { label: "Electric shock", value: "ELECTRIC_SHOCK" },
      { label: "Poisoning / overdose", value: "POISONING" },
      { label: "Snake bite / animal bite", value: "ANIMAL_BITE" },
      { label: "Heat stroke / severe dehydration", value: "HEAT_STROKE" },
    ],
  },
  {
    category: "Transport-Specific Situations",
    types: [
      { label: "Inter-hospital transfer", value: "INTER_HOSPITAL_TRANSFER" },
      { label: "Remote area evacuation", value: "REMOTE_EVACUATION" },
      { label: "Need for air ambulance", value: "AIR_AMBULANCE" },
      { label: "Not sure (need guidance)", value: "NOT_SURE" },
    ],
  },
  {
    category: "Other",
    types: [{ label: "Other", value: "OTHER" }],
  },
]

const modEmergencytypes = emergencytypes.map((item) => item.types).flat()

export default function MultiSpecialistPage() {
  const { toggleLoader } = useLoader()
  const form = useForm({
    defaultValues: {
      fullname: "",
      dob: new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
      gender: "",
      mobile: "",
      address: "",
      explainemergency: "",
      emergencytype: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        toggleLoader(true)
        const res = await httpPost(
          "/api/medicalevacuation/add",
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

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold">Book Medical Evacuation</h2>

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
                      POST /api/medicalevacuation/add
                    </code>
                  </div>
                  <div>
                    <h3 className="font-semibold">Request Body Schema</h3>
                    <pre className="overflow-x-auto rounded bg-[#aaaaaa] p-4 text-sm">
                      {exposeFormattedStringifyAPISchema(
                        medicalEvacuationSchema.shape
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
                name="emergencytype"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field
                      data-invalid={isInvalid}
                      className="w-[calc(50%-0.5rem)] gap-0.5"
                    >
                      <FieldLabel htmlFor={field.name}>
                        Emergency Type
                      </FieldLabel>
                      <Select
                        items={modEmergencytypes}
                        name={field.name}
                        value={field.state.value}
                        onValueChange={(val) => field.handleChange(val ?? "")}
                      >
                        <SelectTrigger
                          className="w-[180px] py-4.5"
                          aria-invalid={isInvalid}
                        >
                          <SelectValue placeholder="Select Emergency Type" />
                        </SelectTrigger>
                        <SelectContent alignItemWithTrigger={false}>
                          {emergencytypes.map((item) => (
                            <SelectGroup key={item.category}>
                              <SelectLabel className="rounded-sm bg-[#ccc] font-semibold text-black">
                                {item.category}
                              </SelectLabel>
                              {item.types.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          ))}
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
                name="explainemergency"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field
                      data-invalid={isInvalid}
                      className="w-[calc(50%-0.5rem)] gap-0.5"
                    >
                      <FieldLabel htmlFor={field.name}>
                        Explain Emergency
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Explain emergency"
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
