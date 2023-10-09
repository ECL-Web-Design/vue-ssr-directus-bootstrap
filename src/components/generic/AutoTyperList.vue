<template>
    <div class="landing-professions">
        <slot class="prefix" name="prefix">></slot>
        <ClientOnly>
            <span class="word">{{ professionString }}</span>
        </ClientOnly>
        <span class="cursor">|</span>
    </div>
</template>

<script lang="ts" setup>

import type {Ref} from "vue"
import {computed, onMounted, onUnmounted, ref} from "vue"
import {sleep} from "@/helpers/helpers"

const props = defineProps<{
    wordList: string[],
}>()

const currentWord = computed(() => {
    if (props.wordList?.length > 0) {
        return props.wordList[currentProfessionIndex.value]
    }

    return null
})

const professionString = ref('')
const currentProfessionIndex = ref(0)

function nextWord() {

    currentProfessionIndex.value++

    if (currentProfessionIndex.value >= props.wordList.length) {
        currentProfessionIndex.value = 0
    }
}

async function typeWord(wordRef: Ref<string>, wordToType: string, delay: number) {
    for (const c of wordToType) {
        wordRef.value += c

        await sleep(typeDelay)
    }
}

async function untypeWord(wordRef: Ref<string>, delay: number) {
    while (wordRef.value.length > 0) {
        wordRef.value = wordRef.value.slice(0, -1)

        await sleep(delay)
    }
}

const typeDelay = 90
const holdTime = 500
const deleteDelay = 40
const betweenTime = 150

const enableLoop = ref(false)

async function typeLoop() {

    if (enableLoop.value) {
        await typeWord(professionString, currentWord.value ?? '', typeDelay)
        await sleep(holdTime)
        await untypeWord(professionString, deleteDelay)
        await sleep(betweenTime)
        nextWord()

        typeLoop()
    }
}

onMounted(() => {
    enableLoop.value = true
    typeLoop()
})

onUnmounted(() => {
    enableLoop.value = false
})

</script>

<style lang="scss" scoped>

.landing-professions {
  display: flex;
}

.prefix {
  margin-right: 0.3rem;
}

.cursor {
  font-weight: 400;
}

</style>
