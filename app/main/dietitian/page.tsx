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
  dietitianSchema,
  exposeFormattedStringifyAPISchema,
  exposeFormattedStringifyAPIResponseSchema,
} from "@/lib/post-body-schema"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const formSchema = dietitianSchema

const items = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
]

const goals = [
  {
    category: "Core Health",
    types: [
      { label: "Weight Loss", value: "WEIGHT_LOSS" },
      { label: "Weight Gain", value: "WEIGHT_GAIN" },
      { label: "Maintain Current Weight", value: "MAINTAIN_WEIGHT" },
      { label: "Fat Loss", value: "FAT_LOSS" },
      { label: "Muscle Gain", value: "MUSCLE_GAIN" },
    ],
  },
  {
    category: "Fitness & Performance",
    types: [
      { label: "Improve Fitness Level", value: "IMPROVE_FITNESS" },
      { label: "Increase Energy Levels", value: "INCREASE_ENERGY" },
      { label: "Sports Nutrition Support", value: "SPORTS_NUTRITION" },
      { label: "Body Toning", value: "BODY_TONING" },
      { label: "Improve Stamina", value: "IMPROVE_STAMINA" },
    ],
  },
  {
    category: "Medical / Condition-Based",
    types: [
      { label: "Manage Diabetes", value: "MANAGE_DIABETES" },
      { label: "Manage Thyroid Disorder", value: "MANAGE_THYROID" },
      { label: "Manage PCOS", value: "MANAGE_PCOS" },
      { label: "Manage Hypertension", value: "MANAGE_HYPERTENSION" },
      { label: "Manage Cholesterol", value: "MANAGE_CHOLESTEROL" },
      { label: "Manage Digestive Issues", value: "DIGESTIVE_ISSUES" },
      { label: "Manage Food Allergies", value: "FOOD_ALLERGIES" },
    ],
  },
  {
    category: "Lifestyle & Wellness",
    types: [
      { label: "Healthy Eating Habits", value: "HEALTHY_EATING" },
      { label: "Balanced Diet Planning", value: "BALANCED_DIET" },
      { label: "Detox / Clean Eating", value: "DETOX" },
      { label: "Improve Immunity", value: "IMMUNITY" },
      { label: "Better Sleep Through Diet", value: "BETTER_SLEEP" },
      {
        label: "Stress Management Through Nutrition",
        value: "STRESS_MANAGEMENT",
      },
    ],
  },
  {
    category: "Life-Stage Specific",
    types: [
      { label: "Pregnancy Nutrition", value: "PREGNANCY_NUTRITION" },
      { label: "Postnatal Nutrition", value: "POSTNATAL_NUTRITION" },
      { label: "Child Nutrition", value: "CHILD_NUTRITION" },
      { label: "Teen Nutrition", value: "TEEN_NUTRITION" },
      { label: "Senior Citizen Nutrition", value: "SENIOR_NUTRITION" },
    ],
  },
  {
    category: "Diet-Specific",
    types: [
      { label: "Vegetarian Diet Planning", value: "VEG_DIET" },
      { label: "Vegan Diet Planning", value: "VEGAN_DIET" },
      { label: "Keto Diet Guidance", value: "KETO_DIET" },
      { label: "Intermittent Fasting Guidance", value: "INTERMITTENT_FASTING" },
      { label: "Customized Diet Plan", value: "CUSTOM_DIET" },
    ],
  },
  {
    category: "Aesthetic & Specific",
    types: [
      { label: "Inch Loss", value: "INCH_LOSS" },
      { label: "Belly Fat Reduction", value: "BELLY_FAT" },
      { label: "Skin & Hair Health", value: "SKIN_HAIR" },
    ],
  },
]

const modgoals = goals.map((item) => item.types).flat()

const dietarypreferences = [
  {
    category: "Common Dietary",
    types: [
      { label: "Vegetarian", value: "VEGETARIAN" },
      { label: "Non-Vegetarian", value: "NON_VEGETARIAN" },
      { label: "Eggetarian", value: "EGGETARIAN" },
      { label: "Vegan", value: "VEGAN" },
      { label: "Pescatarian", value: "PESCATARIAN" },
    ],
  },
  {
    category: "Cultural / Religious",
    types: [
      { label: "Jain Diet", value: "JAIN_DIET" },
      { label: "Satvik Diet", value: "SATVIK_DIET" },
      { label: "Halal Diet", value: "HALAL_DIET" },
      { label: "Kosher Diet", value: "KOSHER_DIET" },
    ],
  },
  {
    category: "Medical / Restriction-Based",
    types: [
      { label: "Lactose-Free", value: "LACTOSE_FREE" },
      { label: "Gluten-Free", value: "GLUTEN_FREE" },
      { label: "Low-Carb Diet", value: "LOW_CARB" },
      { label: "Low-Fat Diet", value: "LOW_FAT" },
      { label: "Low-Sodium Diet", value: "LOW_SODIUM" },
      { label: "Sugar-Free / Diabetic-Friendly", value: "SUGAR_FREE" },
      { label: "High-Protein Diet", value: "HIGH_PROTEIN" },
    ],
  },
  {
    category: "Lifestyle / Trend-Based Diets",
    types: [
      { label: "Keto Diet", value: "KETO" },
      { label: "Paleo Diet", value: "PALEO" },
      { label: "Intermittent Fasting", value: "INTERMITTENT_FASTING" },
      { label: "Mediterranean Diet", value: "MEDITERRANEAN" },
      { label: "Plant-Based Diet", value: "PLANT_BASED" },
    ],
  },
]

const moddietarypreferences = dietarypreferences
  .map((item) => item.types)
  .flat()

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
      // goal: "",
      // dietarypreference: "",
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
          "/api/dietitian/add",
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
      <h2 className="text-2xl font-semibold">Book Dietitian Appointment</h2>

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
                      POST /api/dietitian/add
                    </code>
                  </div>
                  <div>
                    <h3 className="font-semibold">Request Body Schema</h3>
                    <pre className="overflow-x-auto rounded bg-[#aaaaaa] p-4 text-sm">
                      {exposeFormattedStringifyAPISchema(dietitianSchema.shape)}
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
                name="goal"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field
                      data-invalid={isInvalid}
                      className="w-[calc(50%-0.5rem)] gap-0.5"
                    >
                      <FieldLabel htmlFor={field.name}>Goal</FieldLabel>
                      <Select
                        items={modgoals}
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
                          {goals.map((item) => (
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
                name="dietarypreference"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field
                      data-invalid={isInvalid}
                      className="w-[calc(50%-0.5rem)] gap-0.5"
                    >
                      <FieldLabel htmlFor={field.name}>
                        Dietary Preference
                      </FieldLabel>
                      <Select
                        items={moddietarypreferences}
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
                          {dietarypreferences.map((item) => (
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
                          placeholder="Enter notes"
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
