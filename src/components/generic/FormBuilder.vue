<template>
    <form class="form-builder" @submit.prevent="onSubmit">
        <transition-slide>
            <div v-if="showFormContent" class="form-content">
                <multi-step-form v-if="formData.grouped"
                                 v-model="mappedValues"
                                 :structure="(formData?.group_list ?? []) as MultiStepFormDataStructure"
                                 @validate="onValidate"></multi-step-form>
                <!-- TODO -- add single step form support <single-step-form v-else v-model="formData.field_list" @validate="onValidate"></single-step-form>-->
            </div>
            <div v-else-if="showLoading" class="form-load">
                <slot name="loading">
                    Loading
                </slot>
            </div>
            <div v-else-if="showAfterSubmit" class="form-after-submit">
                <slot v-if="formSubmitOk" name="submit-success" v-bind="{content: formData.on_submit_success}">
                    <material-icon-symbol :icon-name="formData.submit_success_icon ?? ''"
                                          class="success-icon"
                                          filled>
                    </material-icon-symbol>
                    <editorjs-renderer :content="formData.on_submit_success as OutputData"
                                       class="form-submit-success"></editorjs-renderer>
                </slot>
                <slot v-else name="submit-error" v-bind="{content: formData.on_submit_error}">
                    <material-icon-symbol :icon-name="formData.submit_error_icon ?? ''" class="error-icon">
                    </material-icon-symbol>
                    <editorjs-renderer :content="formData.on_submit_error as OutputData"
                                       class="form-submit-error"></editorjs-renderer>
                </slot>
            </div>
            <div v-else></div>
        </transition-slide>
    </form>
</template>

<script lang="ts" setup>

import MultiStepForm from "@/components/generic/MultiStepForm.vue"
import type {FormBuilderData, FormBuilderField, MultiStepFormDataStructure, NameMappedValues} from "@/types/Form.types"
import {computed, ref, watch} from "vue"
import EditorjsRenderer from "@/components/generic/EditorjsRenderer.vue"
import TransitionSlide from "@/components/generic/TransitionSlide.vue"
import {sleep} from "@/helpers/helpers"
import MaterialIconSymbol from "@/components/generic/MaterialIconSymbol.vue"
import {OutputData} from "@editorjs/editorjs"

const props = defineProps<{
    formData: FormBuilderData
}>()

const postUrl = computed(() => {
    return props.formData.post_url
})

const mappedValues = ref<NameMappedValues>({})

function updateMappedValues() {

    function addFields(fields: FormBuilderField[] | undefined | null) {
        fields?.forEach(field => {
            if (field && (field.name in mappedValues.value)) {
                mappedValues.value[field.name] = null
            }
        })
    }

    if (props.formData.grouped) {
        props.formData.group_list?.forEach(group => {
            addFields(group?.fields as FormBuilderField[])
        })
    } else {
        addFields(props.formData.field_list as FormBuilderField[])
    }
}

watch(() => props.formData, updateMappedValues, {deep: true})

const isValid = ref(false)

function onValidate(valid: boolean) {
    isValid.value = valid
}

const formSubmitLoading = ref(false)

const formSubmitted = ref(false)
const formSubmitOk = ref(true)


const showFormContent = computed(() => {
    return !formSubmitted.value && !formSubmitLoading.value
})

const showLoading = computed(() => {
    return formSubmitLoading.value && !formSubmitted.value
})

const showAfterSubmit = computed(() => {
    return formSubmitted.value
})

async function onSubmit(e: Event) {
    e.preventDefault()
    e.stopImmediatePropagation()

    if (postUrl.value) {
        formSubmitLoading.value = true

        const resp = (await fetch(postUrl.value, {
            method:  'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body:    JSON.stringify(mappedValues.value)
        })).status

        await sleep(500)

        if (resp !== 200) {
            formSubmitOk.value = false
        }

        formSubmitted.value = true
    }

    formSubmitLoading.value = true
}

function onNext() {

}

</script>

<style lang="scss" scoped>

.form-builder {
  backdrop-filter: blur(15px) brightness(0.7);
  -webkit-backdrop-filter: blur(15px) brightness(0.7);
  border: 1px solid var(--text-more-subtle);
  max-width: 45rem;
  margin: 0 auto;
  border-radius: 4px;
  padding: 2rem;
  min-height: 30rem;
  display: grid;
}

:deep(.form-after-submit) {
  padding: 0 2rem;

  * {
    text-align: center;
  }

  h1, h2, h3 {
    font-size: var(--font-large);
  }

  p {
    font-size: var(--font-normal);
  }
}

.success-icon, .error-icon {
  font-size: 2rem;
  margin: 0 auto 2rem auto;
}

.success-icon {
  color: var(--fg-color);
  display: block;
  border: 2px solid var(--fg-color);
  width: min-content;
  border-radius: 999px;
  padding: 0.8rem;
}

.error-icon {
  color: var(--text-error);
}

</style>
