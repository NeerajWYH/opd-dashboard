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
  physioSchema,
  exposeFormattedStringifyAPISchema,
  exposeFormattedStringifyAPIResponseSchema,
} from "@/lib/post-body-schema"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const formSchema = physioSchema

const items = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
]

const therapygoals = [
  { label: "Pain Relief", value: "PAIN_RELIEF" },
  { label: "Improve Mobility", value: "IMPROVE_MOBILITY" },
  { label: "Post-Surgery Recovery", value: "POST_SURGERY_RECOVERY" },
  { label: "Injury Rehabilitation", value: "INJURY_REHABILITATION" },
  { label: "Posture Correction", value: "POSTURE_CORRECTION" },
  { label: "Sports Recovery", value: "SPORTS_RECOVERY" },
]

const primaryconcerns = [
  {
    category: "Pain-Based",
    types: [
      { label: "Back Pain", value: "BACK_PAIN" },
      { label: "Neck Pain", value: "NECK_PAIN" },
      { label: "Shoulder Pain", value: "SHOULDER_PAIN" },
      { label: "Knee Pain", value: "KNEE_PAIN" },
      { label: "Hip Pain", value: "HIP_PAIN" },
      { label: "Elbow Pain", value: "ELBOW_PAIN" },
      { label: "Wrist Pain", value: "WRIST_PAIN" },
      { label: "Ankle Pain", value: "ANKLE_PAIN" },
      { label: "Heel Pain", value: "HEEL_PAIN" },
      { label: "Foot Pain", value: "FOOT_PAIN" },
    ],
  },
  {
    category: "Injury-Related",
    types: [
      { label: "Sports Injury", value: "SPORTS_INJURY" },
      { label: "Muscle Strain", value: "MUSCLE_STRAIN" },
      { label: "Ligament Injury / Sprain", value: "LIGAMENT_INJURY" },
      { label: "Tendon Injury", value: "TENDON_INJURY" },
      { label: "Fracture Recovery", value: "FRACTURE_RECOVERY" },
      { label: "Dislocation", value: "DISLOCATION" },
      { label: "ACL Injury", value: "ACL_INJURY" },
      { label: "Meniscus Injury", value: "MENISCUS_INJURY" },
    ],
  },
  {
    category: "Spine & Nerve",
    types: [
      { label: "Slip Disc", value: "SLIP_DISC" },
      { label: "Sciatica", value: "SCIATICA" },
      { label: "Spondylosis", value: "SPONDYLOSIS" },
      { label: "Cervical Pain", value: "CERVICAL_PAIN" },
      { label: "Nerve Compression", value: "NERVE_COMPRESSION" },
    ],
  },
  {
    category: "Joint & Bone",
    types: [
      { label: "Arthritis", value: "ARTHRITIS" },
      { label: "Osteoarthritis", value: "OSTEOARTHRITIS" },
      { label: "Rheumatoid Arthritis", value: "RHEUMATOID_ARTHRITIS" },
      { label: "Frozen Shoulder", value: "FROZEN_SHOULDER" },
      { label: "Tennis Elbow", value: "TENNIS_ELBOW" },
      { label: "Plantar Fasciitis", value: "PLANTAR_FASCIITIS" },
    ],
  },
  {
    category: "Post-Surgery / Recovery",
    types: [
      { label: "Post-Surgery Rehabilitation", value: "POST_SURGERY_REHAB" },
      { label: "Joint Replacement Recovery", value: "JOINT_REPLACEMENT" },
      { label: "Spine Surgery Recovery", value: "SPINE_SURGERY_RECOVERY" },
      { label: "Fracture Rehabilitation", value: "FRACTURE_REHAB" },
    ],
  },
  {
    category: "Mobility & Functional",
    types: [
      { label: "Difficulty Walking", value: "DIFFICULTY_WALKING" },
      { label: "Difficulty Standing", value: "DIFFICULTY_STANDING" },
      { label: "Difficulty Sitting", value: "DIFFICULTY_SITTING" },
      { label: "Balance Issues", value: "BALANCE_ISSUES" },
      { label: "Reduced Range of Motion", value: "REDUCED_ROM" },
      { label: "Stiffness", value: "STIFFNESS" },
    ],
  },
  {
    category: "Lifestyle / Posture",
    types: [
      { label: "Posture Correction", value: "POSTURE_CORRECTION" },
      { label: "Work-from-home Pain", value: "WFH_PAIN" },
      { label: "Desk Job Pain", value: "DESK_JOB_PAIN" },
      { label: "Repetitive Strain Injury", value: "RSI" },
    ],
  },
  {
    category: "Special Cases",
    types: [
      { label: "Pediatric Physiotherapy", value: "PEDIATRIC_PHYSIO" },
      { label: "Geriatric Mobility Issues", value: "GERIATRIC_MOBILITY" },
      { label: "Neurological Rehabilitation", value: "NEURO_REHAB" },
    ],
  },
]

const modprimaryconcerns = primaryconcerns.map((item) => item.types).flat()

export default function DietitianPage() {
  const { toggleLoader } = useLoader()
  const form = useForm({
    defaultValues: {
      fullname: "",
      dob: new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
      gender: "",
      mobile: "",
      // height: "",
      // weight: "",
      // therapygoal: "",
      // primaryconcern: "",
      // medicalhistory: "",
      notes: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
      try {
        toggleLoader(true)
        const res = await httpPost(
          "/api/physio/add",
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
      <h2 className="text-2xl font-semibold">Book Physio Appointment</h2>

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
                      POST /api/physio/add
                    </code>
                  </div>
                  <div>
                    <h3 className="font-semibold">Request Body Schema</h3>
                    <pre className="overflow-x-auto rounded bg-[#aaaaaa] p-4 text-sm">
                      {exposeFormattedStringifyAPISchema(physioSchema.shape)}
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
              {/* <form.Field
                name="height"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field
                      data-invalid={isInvalid}
                      className="w-[calc(50%-0.5rem)] gap-0.5"
                    >
                      <FieldLabel htmlFor={field.name}>Height (cm)</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Enter Height (cm)"
                        autoComplete="off"
                        maxLength={3}
                        minLength={3}
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
                name="weight"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field
                      data-invalid={isInvalid}
                      className="w-[calc(50%-0.5rem)] gap-0.5"
                    >
                      <FieldLabel htmlFor={field.name}>Weight (kg)</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Enter Weight (kg)"
                        autoComplete="off"
                        maxLength={3}
                        minLength={2}
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
                name="therapygoal"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field
                      data-invalid={isInvalid}
                      className="w-[calc(50%-0.5rem)] gap-0.5"
                    >
                      <FieldLabel htmlFor={field.name}>Therapy Goal</FieldLabel>
                      <Select
                        items={therapygoals}
                        name={field.name}
                        value={field.state.value}
                        onValueChange={(val) => field.handleChange(val ?? "")}
                      >
                        <SelectTrigger
                          className="w-[180px] py-4.5"
                          aria-invalid={isInvalid}
                        >
                          <SelectValue placeholder="Select Therapy Goal" />
                        </SelectTrigger>
                        <SelectContent alignItemWithTrigger={false}>
                          <SelectGroup>
                            {therapygoals.map((item) => (
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
                name="primaryconcern"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field
                      data-invalid={isInvalid}
                      className="w-[calc(50%-0.5rem)] gap-0.5"
                    >
                      <FieldLabel htmlFor={field.name}>
                        Primary Concern
                      </FieldLabel>
                      <Select
                        items={modprimaryconcerns}
                        name={field.name}
                        value={field.state.value}
                        onValueChange={(val) => field.handleChange(val ?? "")}
                      >
                        <SelectTrigger
                          className="w-[180px] py-4.5"
                          aria-invalid={isInvalid}
                        >
                          <SelectValue placeholder="Select Primary Concern" />
                        </SelectTrigger>
                        <SelectContent alignItemWithTrigger={false}>
                          {primaryconcerns.map((item) => (
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
              <form.Field
                name="medicalhistory"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field
                      data-invalid={isInvalid}
                      className="w-[calc(50%-0.5rem)] gap-0.5"
                    >
                      <FieldLabel htmlFor={field.name}>
                        Medical History
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Enter Your Notes"
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
                      {isInvalid && (
                        <FieldError
                          errors={field.state.meta.errors}
                          className="text-xs"
                        />
                      )}
                    </Field>
                  )
                }}
              /> */}
              <form.Field
                name="notes"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field
                      data-invalid={isInvalid}
                      className="w-[calc(50%-0.5rem)] gap-0.5"
                    >
                      <FieldLabel htmlFor={field.name}>Notes</FieldLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Enter Your Notes"
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
