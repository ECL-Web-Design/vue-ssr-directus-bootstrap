<template>
    <div class="help-popup">
        <svg :class="{'help-popup__show--showing': show}"
             class="help-popup-show"
             viewBox="0 0 24 24"
             @click="toggleHelp">
            <g fill="none"
               fill-rule="evenodd">
                <g fill-rule="nonzero">
                    <path d="M12,2 C17.5228,2 22,6.47715 22,12 C22,17.5228 17.5228,22 12,22 C10.3817,22 8.81782,21.6146 7.41286,20.888 L3.58704,21.9553 C2.92212,22.141 2.23258,21.7525 2.04691,21.0876 C1.98546,20.8676 1.98549,20.6349 2.04695,20.4151 L3.11461,16.5922 C2.38637,15.186 2,13.6203 2,12 C2,6.47715 6.47715,2 12,2 Z M12,3.5 C7.30558,3.5 3.5,7.30558 3.5,12 C3.5,13.4696 3.87277,14.8834 4.57303,16.1375 L4.72368,16.4072 L3.61096,20.3914 L7.59755,19.2792 L7.86709,19.4295 C9.12006,20.1281 10.5322,20.5 12,20.5 C16.6944,20.5 20.5,16.6944 20.5,12 C20.5,7.30558 16.6944,3.5 12,3.5 Z M12,15.5 C12.5523,15.5 13,15.9477 13,16.5 C13,17.0523 12.5523,17.5 12,17.5 C11.4477,17.5 11,17.0523 11,16.5 C11,15.9477 11.4477,15.5 12,15.5 Z M12,6.75 C13.5188,6.75 14.75,7.98122 14.75,9.5 C14.75,10.5108 14.4525,11.074 13.6989,11.8586 L13.5303,12.0303 C12.9084,12.6522 12.75,12.9163 12.75,13.5 C12.75,13.9142 12.4142,14.25 12,14.25 C11.5858,14.25 11.25,13.9142 11.25,13.5 C11.25,12.4892 11.5475,11.926 12.3011,11.1414 L12.4697,10.9697 C13.0916,10.3478 13.25,10.0837 13.25,9.5 C13.25,8.80964 12.6904,8.25 12,8.25 C11.3528,8.25 10.8205,8.74187 10.7565,9.37219 L10.75,9.5 C10.75,9.91421 10.4142,10.25 10,10.25 C9.58579,10.25 9.25,9.91421 9.25,9.5 C9.25,7.98122 10.4812,6.75 12,6.75 Z"/>
                </g>
            </g>
        </svg>
        <transition name="help-show">
            <modal :show-modal="show"
                   header="Info"
                   @close-modal="show = false">
                <div class="popup-content">
                    <slot>default help</slot>
                </div>
            </modal>
        </transition>
    </div>
</template>

<script lang="ts" setup>

import {ref} from 'vue'
import Modal from "@/components/generic/Modal.vue"

const show = ref(false)

function toggleHelp() {
    show.value = !show.value
}

</script>

<style lang="scss" scoped>

.help-popup {

    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 6px;
    width: min-content;
}

.help-popup-show {
    width: 24px;
    height: 24px;
    stroke-width: 0.5;
    stroke: var(--global-text-lighter);
    transform: translateY(2px);
    cursor: help;
    position: relative;
    transition: stroke 0.4s;

    > g {
        transition: fill 0.4s;
        fill: var(--global-text-lighter);
    }

    &:hover {
        stroke: var(--global-highlight);

        > g {
            fill: var(--global-highlight);
        }
    }

    &--showing {
        stroke: var(--global-highlight);

        > g {
            fill: var(--global-highlight);
        }
    }
}

.popup-content {
    max-width: 280px;
    display: grid;
    padding: 0 12px;
    box-sizing: border-box;
    color: var(--global-text);
    row-gap: 8px;
}

$caretSize: 8px;

.caret {
    width: 0;
    height: 0;
    border-top: $caretSize solid transparent;
    border-bottom: $caretSize solid transparent;
    border-right: $caretSize solid var(--global-bg);
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%) translateX(-100%);
}

.help-show-enter-active, .help-show-leave-active {
    transition: opacity 0.4s;
}

.help-show-enter-from, .help-show-leave-to {
    opacity: 0;
}

</style>
