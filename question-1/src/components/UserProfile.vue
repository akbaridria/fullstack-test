<script setup lang="ts">
// imports
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardTitle, CardContent, CardHeader } from "./ui/card";
import DefaultAvatar from "@/assets/vue.svg";
import { PencilIcon } from "lucide-vue-next";
import { ref, useTemplateRef } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { toast } from "vue-sonner";

// interfaces
interface FormProfile {
  avatar: string;
  name: string;
  email: string;
}

// variables
// get inner dom ref since we are using input component not html input.
const fileInputRef = useTemplateRef<{ inputRef: HTMLInputElement | null }>(
  "fileInputRef"
);
const avatar = ref(DefaultAvatar);
const name = ref("");
const email = ref("");
const isLoading = ref(false);

const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    avatar.value = URL.createObjectURL(file);
  }
};

// debounce for 2 seconds
const debounceFn = useDebounceFn(() => {
  const data: FormProfile = {
    avatar: avatar.value,
    email: email.value,
    name: name.value,
  };
  isLoading.value = true;
  toast.promise(saveProfile(data), {
    loading: "Saving...",
    success: "Saved!",
    error: "Failed to save data!",
    finally: () => {
      isLoading.value = false;
    },
  });
}, 2000);

// function to handle change image
const handleChangeImage = () => {
  fileInputRef.value?.inputRef?.click();
  // save after avatar change
  debounceFn();
};

// function to handle change name
const handleInputName = () => {
  debounceFn();
};

// function to handle change email
const handleChangeEmail = () => {
  debounceFn();
};

const saveProfile = (data: FormProfile) => {
  console.log(data, "<<<< data payload to send to the api");
  // api call simulation wait 2 seconds before resolved.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Saved");
    }, 2000);
  });
};
</script>

<template>
  <div
    class="container flex flex-col items-center justify-center h-screen mx-auto"
  >
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div
          class="group relative rounded-full border w-24 h-24 overflow-hidden"
        >
          <img v-bind:src="avatar" alt="" class="w-24 h-24 object-cover" />
          <div
            role="buton"
            class="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/50 transition-all"
            @click="handleChangeImage"
          >
            <div class="flex items-center justify-center gap-1 h-full">
              <div class="text-sm">Edit</div>
              <div>
                <PencilIcon :size="14" />
              </div>
            </div>
          </div>
          <Input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onFileSelected"
          />
        </div>
        <div class="grid w-full max-w-sm gap-1.5">
          <Label for="name">Your name</Label>
          <Input
            id="name"
            type="text"
            v-model="name"
            @update:model-value="handleInputName"
            :class="{ 'opacity-50': isLoading }"
            :readonly="isLoading"
          />
        </div>
        <div class="grid w-full max-w-sm gap-1.5">
          <Label for="name">Your email</Label>
          <Input
            id="name"
            type="email"
            v-model="email"
            @update:model-value="handleChangeEmail"
            :class="{ 'opacity-50': isLoading }"
            :readonly="isLoading"
          />
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped></style>
